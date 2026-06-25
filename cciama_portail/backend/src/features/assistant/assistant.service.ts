import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatMessageDto } from './assistant.dto';

// API Groq, compatible OpenAI (chat completions)
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
const TIMEOUT_MS = 25_000;

const SYSTEM_PROMPT = `Tu es l'assistant virtuel officiel du portail de la CCIAMA (Chambre de Commerce, d'Industrie, d'Agriculture, des Mines et de l'Artisanat du Tchad).

Ton rôle : aider les entreprises, commerçants, artisans et usagers dans leurs démarches auprès de la CCIAMA, et les orienter dans les rubriques du portail.

Règles :
- Réponds toujours dans la langue de l'utilisateur (français par défaut).
- Sois concis, clair et professionnel ; va droit au but.
- Utilise le Markdown : **gras** pour les points clés, listes numérotées pour les étapes, et des liens vers les rubriques du portail quand c'est pertinent : [Services aux entreprises](/services), [Documentation officielle](/documentation), [Missions](/institution/missions), [Suivi de dossier](/tracker), [Contact](/contact).
- N'invente jamais une procédure, un tarif, un délai ou un texte de loi précis dont tu n'es pas certain. Dans le doute, invite l'utilisateur à consulter la rubrique concernée ou à contacter la CCIAMA via la page [Contact](/contact).
- Reste strictement dans le périmètre de la CCIAMA et des démarches d'entreprise au Tchad ; décline poliment les sujets hors de ce cadre.`;

@Injectable()
export class AssistantService {
  private readonly logger = new Logger('AssistantService');

  constructor(private readonly config: ConfigService) {}

  async chat(messages: ChatMessageDto[]): Promise<string> {
    const apiKey = this.config.get<string>('GROQ_API_SECRET');
    if (!apiKey) {
      throw new ServiceUnavailableException(
        "L'assistant IA n'est pas configuré (clé Groq manquante).",
      );
    }
    const model = this.config.get<string>('GROQ_MODEL_NAME') || DEFAULT_MODEL;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          max_tokens: 800,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        this.logger.error(`Groq ${res.status}: ${detail.slice(0, 500)}`);
        throw new BadGatewayException(
          "L'assistant IA est momentanément indisponible.",
        );
      }

      const data: any = await res.json();
      const reply: string | undefined = data?.choices?.[0]?.message?.content?.trim();
      if (!reply) {
        throw new BadGatewayException("Réponse vide de l'assistant IA.");
      }
      return reply;
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        throw new BadGatewayException(
          "L'assistant IA met trop de temps à répondre. Réessayez.",
        );
      }
      if (
        err instanceof BadGatewayException ||
        err instanceof ServiceUnavailableException
      ) {
        throw err;
      }
      this.logger.error(`Appel Groq échoué : ${err?.message}`);
      throw new BadGatewayException("Impossible de contacter l'assistant IA.");
    } finally {
      clearTimeout(timer);
    }
  }
}
