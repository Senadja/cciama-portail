import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

interface SeedFamily {
  code: string;
  name: string;
  description: string;
  orderIndex: number;
}

interface SeedService {
  code: string;
  title: string;
  tagline: string;
  familyCode: string;
  beneficiaries: string;
  channels: string;
  targetDelay: string;
  phase: string;
  description: string;
  processSteps: string[];
  screens: { name: string; description: string }[];
  dataFields: { name: string; type: string; source: string }[];
  integrations: { name: string; description: string }[];
  kpis: string[];
  businessRules: string[];
}

interface SeedData {
  families: SeedFamily[];
  services: SeedService[];
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set in the environment');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const file = path.join(__dirname, 'seed-data', 'services.json');
  const data: SeedData = JSON.parse(fs.readFileSync(file, 'utf8'));

  // 1. Families (upsert by code)
  const familyIdByCode: Record<string, string> = {};
  for (const f of data.families) {
    const fam = await prisma.serviceFamily.upsert({
      where: { code: f.code },
      update: { name: f.name, description: f.description, orderIndex: f.orderIndex, updatedBy: 'seed' },
      create: { code: f.code, name: f.name, description: f.description, orderIndex: f.orderIndex, updatedBy: 'seed' },
    });
    familyIdByCode[f.code] = fam.id;
  }

  // 2. Services (upsert by code, preserving document order)
  for (let i = 0; i < data.services.length; i++) {
    const s = data.services[i];
    const familyId = familyIdByCode[s.familyCode];
    if (!familyId) {
      throw new Error(`Service ${s.code} references unknown familyCode "${s.familyCode}"`);
    }

    const payload = {
      title: s.title,
      tagline: s.tagline,
      familyId,
      beneficiaries: s.beneficiaries,
      channels: s.channels,
      targetDelay: s.targetDelay,
      phase: s.phase,
      description: s.description,
      processSteps: s.processSteps,
      screens: s.screens,
      dataFields: s.dataFields,
      integrations: s.integrations,
      kpis: s.kpis,
      businessRules: s.businessRules,
      orderIndex: i,
      published: true,
      updatedBy: 'seed',
    };

    await prisma.service.upsert({
      where: { code: s.code },
      update: payload,
      create: { code: s.code, ...payload },
    });
  }

  // 3. Contenus éditoriaux (Phase 2) — insérés uniquement si la table est vide
  const NEWS_BODY = [
    "Dans le cadre de la mise en œuvre des engagements pris par la Chambre de Commerce, cette mesure traduit la volonté de l'institution de placer l'entreprise au cœur de son action. Elle s'inscrit dans la continuité des réformes engagées et participe à la consolidation de la confiance entre la CCIAMA et les opérateurs économiques.",
    "Les services techniques compétents ont conduit, durant plusieurs mois, un travail approfondi de concertation avec les partenaires institutionnels, la société civile, les autorités traditionnelles et les représentants du secteur privé. Cette démarche participative a permis de garantir la pertinence des dispositions retenues ainsi que leur adéquation avec les réalités du terrain.",
    "Le dispositif prévoit plusieurs axes prioritaires : la dématérialisation progressive des formalités, le renforcement des capacités d'accompagnement, la simplification des procédures et l'évaluation systématique de la qualité du service rendu. Les opérateurs économiques seront tenus informés à chaque étape via les canaux officiels de la CCIAMA.",
  ].join('\n\n');

  const ed = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-data', 'editorial.json'), 'utf8'));

  const seedIfEmpty = async (label: string, delegate: any, rows: any[]) => {
    const count = await delegate.count();
    if (count > 0) {
      console.log(`  • ${label} : ${count} entrées déjà présentes, ignoré`);
      return;
    }
    await delegate.createMany({ data: rows.map((r) => ({ ...r, updatedBy: 'seed' })) });
    console.log(`  • ${label} : ${rows.length} insérés`);
  };

  await seedIfEmpty('actualités', prisma.newsArticle, ed.news.map((n: any) => ({ ...n, body: NEWS_BODY })));
  await seedIfEmpty('documents', prisma.officialDocument, ed.documents);
  await seedIfEmpty('projets', prisma.project, ed.projects);
  await seedIfEmpty('organismes/partenaires', prisma.organism, ed.organisms);
  await seedIfEmpty('flash infos', prisma.flashInfo, ed.flash);
  await seedIfEmpty('accès rapides', prisma.quickAction, ed.quickActions);

  console.log(`✓ Seed terminé : ${data.families.length} familles, ${data.services.length} services + contenus éditoriaux.`);
}

main()
  .catch((e) => {
    console.error('Seed échoué :', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
