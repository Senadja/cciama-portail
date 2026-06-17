_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **E B E N Y X   •   C o n s e i l  &  T r a n s f o r m a t i o n  D i g i t a l e** 

## **RÉPUBLIQUE DU TCHAD** 

_Unité — Travail — Progrès_ 

————————————————— 

## **CATALOGUE DÉTAILLÉ** 

## **DES SERVICES** 

## Fiches techniques détaillées 

_Processus, écrans, données, intégrations_ 

Programme de digitalisation de la CCIAMA du Tchad 

_Annexe technique au document de cadrage  •  Mai 2026_ 

Page 1 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **Sommaire** 

Le  présent  document  détaille  les  18  services  qui  constituent  le  cœur  opérationnel  du programme de digitalisation de la CCIAMA. Chaque service fait l'objet d'une fiche technique présentant son périmètre, ses processus, ses écrans, ses données, ses intégrations, ses indicateurs et ses règles métier. 

## **Famille 1 — Formalités d'entreprise** 

- S01 — Immatriculation en ligne au Registre du Commerce 

- S02 — Modifications statutaires et radiations en ligne 

- S03 — Délivrance d'attestations et extraits dématérialisés 

- S04 — Annuaire géolocalisé des entreprises tchadiennes 

## **Famille 2 — Commerce extérieur** 

- S05 — Certificats d'origine numériques 

- S06 — Carnets ATA numériques 

- S07 — Visa de factures et légalisations 

## **Famille 3 — Services aux membres** 

- S08 — Espace adhérent et compte unifié entreprise 

- S09 — Gestion des cotisations consulaires 

- S10 — Demande de rendez-vous et services présentiels 

## **Famille 4 — Formation et accompagnement** 

- S11 — Catalogue de formations et inscriptions en ligne 

- S12 — Plateforme e-learning et bibliothèque numérique 

- S13 — Accompagnement individuel et coaching 

## **Famille 5 — SI interne et gestion** 

- S14 — Workflow interne d'instruction des dossiers 

- S15 — Gestion électronique des documents (GED) 

- S16 — Observatoire économique et tableaux de bord 

- S17 — Module financier et comptable intégré 

- S18 — Système d'information ressources humaines (SIRH) 

Page 2 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **Introduction et conventions de lecture** 

## **Objet du document** 

Ce catalogue détaille les 18 services qui composent le programme de digitalisation de la CCIAMA. Il complète le document de cadrage stratégique en fournissant pour chaque service les éléments nécessaires à sa conception fonctionnelle, à sa spécification technique et à son cahier des charges en vue des appels d'offres. 

## **Structure des fiches services** 

Chaque fiche service est structurée selon les sept rubriques suivantes : 

1. Tableau récapitulatif : famille, bénéficiaires, canaux d'accès, délai cible, phase de déploiement. 

2. Description du service : objectifs, périmètre fonctionnel, valeur ajoutée. 

3. Processus utilisateur : parcours type étape par étape. 

4. Écrans et interfaces : principaux écrans avec leur fonction. 

5. Données métier manipulées : champs, types, sources et contrôles. 

6. Intégrations  et  systèmes  connexes  :  interfaces  avec  les  autres  briques  et  les partenaires. 

7. Indicateurs de performance : KPIs avec cibles à 24 mois. 

Une rubrique complémentaire, « Règles métier et contrôles », est ajoutée lorsque le service comporte des contraintes spécifiques de validation, de sécurité ou de conformité. 

## **Familles de services** 

Les 18 services sont regroupés en cinq familles fonctionnelles : 

- **Formalités d'entreprise (S01-S04) :** tous les actes liés à la vie réglementaire de l'entreprise. 

- **Commerce extérieur (S05-S07) :** outils d'accompagnement des exportateurs et importateurs. 

- **Services aux membres (S08-S10) :** espace personnel, cotisations, rendez-vous. 

- **Formation et accompagnement (S11-S13) :** montée en compétences et conseil personnalisé. 

- **SI interne et gestion (S14-S18) :** briques transverses (workflow, GED, BI, finance, RH). 

## **Statut des informations** 

Les délais, indicateurs et règles présentés dans ce document sont les cibles retenues lors de la phase de cadrage. Ils seront affinés lors de la conception détaillée et de la rédaction des cahiers des charges, en fonction des contraintes opérationnelles, juridiques et techniques identifiées par l'audit initial. 

Page 3 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

**==> picture [29 x 23] intentionally omitted <==**

**==> picture [361 x 361] intentionally omitted <==**

Page 4 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **Synthèse comparative des 18 services** 

Le tableau ci-après donne une vue d'ensemble des services, de leurs phases de déploiement et de leurs délais cibles. 

|**Cod**<br>**e**|**Service**|**Phase**|**Délai cible**|
|---|---|---|---|
|**S01**|Immatriculation en ligne au Registre du<br>Commerce|P1|48 heures|
|**S02**|Modifications statutaires et radiations en ligne|P2|72 heures pour les<br>modifications, 7 jours<br>ouvrés pour les<br>radiations|
|**S03**|Délivrance d'attestations et extraits<br>dématérialisés|P1|Instantané pour les<br>attestations standards,<br>24 h pour les attestations<br>complexes|
|**S04**|Annuaire géolocalisé des entreprises tchadiennes|P2|Mise à jour en temps réel<br>à partir du RCCM|
|**S05**|Certificats d'origine numériques|P2|Délivrance en moins de 4<br>heures|
|**S06**|Carnets ATA numériques|P2|3 jours ouvrés|
|**S07**|Visa de factures et légalisations|P2|24 heures|
|**S08**|Espace adhérent et compte unifié entreprise|P1|Activation instantanée|
|**S09**|Gestion des cotisations consulaires|P2|Encaissement instantané|
|**S10**|Demande de rendez-vous et services présentiels|P1|Confirmation immédiate<br>du créneau|
|**S11**|Catalogue de formations et inscriptions en ligne|P2|Inscription instantanée|
|**S12**|Plateforme e-learning et bibliothèque numérique|P3|Accès immédiat aux<br>contenus|
|**S13**|Accompagnement individuel et coaching|P2|Premier rendez-vous<br>sous 7 jours|
|**S14**|Workflow interne d'instruction des dossiers|P1|Traitement temps réel<br>des affectations|
|**S15**|Gestion électronique des documents (GED)|P1|Recherche < 3 secondes<br>sur 10 millions de<br>documents|
|**S16**|Observatoire économique et tableaux de bord|P3|Indicateurs mensuels<br>publiés au plus tard le 15<br>du mois suivant|
|**S17**|Module financier et comptable intégré|P2|Comptabilisation temps<br>réel|
|**S18**|Système d'information ressources humaines<br>(SIRH)|P2|Self-service immédiat<br>pour la majorité des|



Page 5 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

**==> picture [29 x 23] intentionally omitted <==**

|**Cod**<br>**e**|**Service**|**Phase**|**Délai cible**|
|---|---|---|---|
||||opérations|



**==> picture [361 x 361] intentionally omitted <==**

Page 6 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

**==> picture [29 x 23] intentionally omitted <==**

## **Famille 1 — Formalités d'entreprise** 

Cette  famille  regroupe  les  actes  fondamentaux  qui  marquent  la  vie  réglementaire  de l'entreprise tchadienne, depuis sa création jusqu'à sa radiation. Elle est au cœur de la mission consulaire et représente le plus gros volume de transactions du programme. 

**==> picture [361 x 361] intentionally omitted <==**

Page 7 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **S01  Immatriculation en ligne au Registre du Commerce** 

_Créer son entreprise en moins de 48 heures, sans déplacement à N'Djamena_ 

|**Famille**|Formalités d'entreprise|
|---|---|
|**Bénéficiaires**|Entrepreneurs individuels, fondateurs de sociétés (SARL, SA, SAS),<br>professions libérales|
|**Canaux d'accès**|Portail web e-CCIAMA, application mobile, guichets des délégations<br>régionales|
|**Délai cible**|**48 heures (au lieu de 7 à 15 jours actuellement)**|
|**Phase de déploiement**|Phase 1 — déploiement en M6|



## **Description du service** 

Service permettant à tout entrepreneur de constituer son dossier d'immatriculation en ligne, de joindre les pièces justificatives numérisées, de signer électroniquement, de payer les frais via mobile money ou virement, puis de récupérer en ligne son extrait du RCCM avec QR-code de vérification. Une instruction interne automatisée s'enclenche en parallèle avec contrôle des pièces et validation par un agent CCIAMA. 

## **Processus utilisateur (parcours type)** 

8. L'usager crée un compte sécurisé (numéro de téléphone + e-mail + OTP). 

9. Il choisit le type d'entité (entreprise individuelle, SARL, SA, etc.) et remplit un formulaire dynamique adapté. 

10. Il téléverse les pièces requises (CNI, statuts, justificatif de domicile, etc.) : le système vérifie format et lisibilité. 

11. Le système calcule automatiquement les droits dus et propose le paiement (Airtel Money, Moov Money, virement, carte). 

12. L'usager  signe  électroniquement  la  déclaration  sur  l'honneur  (signature  OTP avancée). 

13. Le dossier est routé à l'agent instructeur compétent qui valide ou demande des compléments via la plateforme. 

14. Après validation, le RCCM numérique signé est généré, horodaté et notifié à l'usager (SMS + e-mail). 

15. L'usager télécharge l'extrait avec QR-code de vérification publique. 

## **Écrans et interfaces** 

- **Écran 1 — Création de compte :** Formulaire d'inscription avec validation OTP par SMS et e-mail. 

- **Écran 2 — Choix du type d'entité :** Cartes visuelles décrivant les formes juridiques avec aide contextuelle. 

- **Écran 3 — Formulaire dynamique :** Champs adaptatifs selon la forme choisie, sauvegarde automatique. 

Page 8 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

- **Écran 4 — Téléversement des pièces :** Glisser-déposer, contrôle de format, prévisualisation, OCR sur la CNI. 

- **Écran 5 — Récapitulatif et paiement :** Détail des droits, choix du moyen de paiement, redirection sécurisée. 

- **Écran 6 — Signature électronique :** Code OTP envoyé au mobile, acceptation des conditions, horodatage. 

- **Écran 7 — Suivi du dossier :** Statut en temps réel, historique des échanges, demandes de compléments. 

- **Écran 8 — Téléchargement du RCCM :** PDF signé électroniquement, QR-code de vérification publique. 

## **Données métier manipulées** 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Identifiant Unique d'Entreprise<br>(IUE)|Alphanum.|Générée par la CCIAMA, format normalisé|
|Raison sociale|Texte (255)|Saisie utilisateur, vérification unicité|
|Forme juridique|Énumération|Liste OHADA|
|Capital social|Décimal|Saisie, contrôle minimums OHADA|
|Adresse du siège|Adresse géolocalisée|API cartographique + saisie|
|Code NAF / activité principale|Code|Nomenclature CEMAC harmonisée|
|Dirigeants et associés|Liste de personnes|Saisie + croisement registres|
|Pièces justificatives|Fichiers PDF/JPG|Téléversement utilisateur|
|Statut du dossier|Workflow|Système (états : déposé, en cours, validé,<br>rejeté)|



## **Intégrations et systèmes connexes** 

- **ANIE :** Vérification des projets d'investissement et statuts d'investisseur agréé 

- **DGI :** Génération automatique du numéro d'identification fiscale (NIF) 

- **CNPS :** Pré-inscription de l'employeur dans le système de sécurité sociale 

- **Opérateurs mobile money :** Encaissement des droits d'immatriculation 

- **Service de signature électronique national :** Signature qualifiée des documents 

## **Indicateurs de performance** 

- Délai moyen de délivrance du RCCM (cible : 48 h) 

- Taux de dossiers traités sans demande de complément (cible : 75 %) 

- Taux de paiement réussi du premier coup (cible : 95 %) 

- Nombre d'immatriculations par mois (cible : 1 200 à 24 mois) 

- Taux de satisfaction usagers (cible : ≥ 85 %) 

## **Règles métier et contrôles** 

- Capital minimum contrôlé selon la forme juridique (OHADA). 

Page 9 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

**==> picture [29 x 23] intentionally omitted <==**

- Vérification de l'unicité de la raison sociale dans le registre national. 

- Refus automatique en cas de dirigeant interdit de gestion (croisement avec liste judiciaire). 

- Délai maximum de 5 jours ouvrés pour fournir les compléments demandés sous peine de rejet. 

**==> picture [361 x 361] intentionally omitted <==**

Page 10 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **S02  Modifications statutaires et radiations en ligne** 

_Mettre à jour ou clôturer son entreprise depuis chez soi_ 

|**Famille**|Formalités d'entreprise|
|---|---|
|**Bénéficiaires**|Entreprises immatriculées, mandataires sociaux, liquidateurs|
|**Canaux d'accès**|Portail web, application mobile, délégations régionales|
|**Délai cible**|**72 heures pour les modifications, 7 jours ouvrés pour les radiations**|
|**Phase de déploiement**|Phase 2 — M8|



## **Description du service** 

Service couvrant l'ensemble des actes de vie de l'entreprise après sa création : changement d'adresse, modification de capital, changement de dirigeants, transformation, cession de parts, dissolution et radiation. L'usager y accède via son espace personnel, où l'historique complet de son entreprise est consultable. 

## **Processus utilisateur (parcours type)** 

16. L'usager se connecte à son espace entreprise (authentification forte). 

17. Il sélectionne le type d'opération souhaitée dans un catalogue visuel. 

18. Il remplit le formulaire pré-rempli avec les données existantes de l'entreprise. 

19. Il téléverse les actes justificatifs (PV d'assemblée, statuts modifiés, etc.). 

20. Le système calcule les droits et déclenche le paiement. 

21. Signature électronique du représentant légal. 

22. Instruction par un agent, publication d'un avis modificatif si nécessaire, mise à jour du RCCM. 

23. Délivrance de l'extrait modifié avec horodatage de la modification. 

## **Écrans et interfaces** 

- **Écran 1 — Tableau de bord entreprise :** Vue 360° de l'entreprise (statut, dirigeants, historique des actes). 

- **Écran 2 — Catalogue des opérations :** Cartes par type d'acte avec aide et coûts. 

- **Écran 3 — Formulaire pré-rempli :** Données actuelles affichées, champs modifiables avec validation. 

- **Écran 4 — Téléversement des actes :** Modèles de PV téléchargeables, contrôle de conformité. 

- **Écran 5 — Confirmation et publication :** Aperçu de l'avis modificatif, validation, paiement. 

## **Données métier manipulées** 

|**Données métier manipulées**|||
|---|---|---|
|**Donnée**|**Type**|**Source / contrôle**|
|Référence de l'acte modificatif|Alphanum.|Générée séquentielle|
|Type d'opération|Énumération|Liste paramétrable|



Page 11 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Date d'effet|Date|Saisie utilisateur|
|Données modifiées|JSON différentiel|Calculé automatiquement|
|Liquidateur (si radiation)|Personne|Saisie + vérification|
|Motif de radiation|Énumération|Liste paramétrable|



## **Intégrations et systèmes connexes** 

- **DGI :** Mise à jour de la situation fiscale (continuation, cessation) 

- **Journal officiel :** Publication des avis modificatifs et de radiation 

- **CNPS :** Notification des changements affectant l'employeur 

- **Service de signature électronique :** Authentification des actes 

## **Indicateurs de performance** 

- Délai moyen de traitement des modifications (cible : 72 h) 

- Taux de dossiers complets au premier dépôt (cible : 80 %) 

- Nombre d'opérations modificatives traitées par mois 

- Délai de publication des avis légaux (cible : ≤ 5 jours) 

## **Règles métier et contrôles** 

- Seul un dirigeant ou mandataire dûment habilité peut initier une modification. 

- Une radiation suppose la production d'un PV de dissolution et d'un rapport du liquidateur. 

- Toute cession de parts au-delà de 10 % du capital nécessite une vérification renforcée. 

- Conservation des historiques pendant la durée légale (minimum 10 ans). 

Page 12 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **S03  Délivrance d'attestations et extraits dématérialisés** 

_Obtenir une attestation officielle en quelques minutes_ 

|**Famille**|Formalités d'entreprise|
|---|---|
|**Bénéficiaires**|Entreprises, partenaires bancaires et commerciaux, administrations|
|**Canaux d'accès**|Portail web, application mobile, USSD pour zones sans Internet|
|**Délai cible**|**Instantané pour les attestations standards, 24 h pour les attestations**<br>**complexes**|
|**Phase de déploiement**|Phase 1 — M6|



## **Description du service** 

Service de production en libre-service d'attestations consulaires : extrait du RCCM, attestation d'inscription,  attestation  de  non-faillite,  attestation  de  situation,  attestation  d'activité, attestation d'effectif. Chaque attestation est signée électroniquement et porte un QR-code permettant à un tiers de vérifier son authenticité en ligne. 

## **Processus utilisateur (parcours type)** 

24. L'usager se connecte à son espace entreprise. 

25. Il sélectionne le type d'attestation et la destination (bancaire, douanière, marché public, etc.). 

26. Le système génère un aperçu en temps réel. 

27. L'usager paie en ligne le tarif applicable. 

28. L'attestation signée électroniquement est immédiatement disponible au téléchargement. 

29. Un tiers (banque, douane, etc.) peut vérifier l'authenticité en scannant le QR-code ou en saisissant l'identifiant sur le portail public. 

## **Écrans et interfaces** 

- **Écran 1 — Catalogue des attestations :** Liste filtrable par usage avec aperçu et tarif. 

- **Écran 2 — Aperçu personnalisé :** Document généré en temps réel avec les données à jour. 

- **Écran 3 — Paiement et téléchargement :** Paiement, génération du PDF signé, archivage dans l'espace usager. 

- **Écran 4 (public) — Vérification par QR-code :** Page publique accessible à toute personne souhaitant authentifier un document. 

## **Données métier manipulées** 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Numéro d'attestation|UUID|Générée unique|
|Type d'attestation|Énumération|Liste paramétrable|



Page 13 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Données extraites du RCCM|Snapshot|Base entreprises|
|Hash du document|SHA-256|Calculé à la génération|
|URL de vérification|URL|Générée avec token|
|Date d'expiration|Date|Calculée selon le type|



## **Intégrations et systèmes connexes** 

- **Service de signature électronique :** Signature qualifiée à la volée 

- **Plateforme de paiement :** Encaissement des frais 

- **Portail public de vérification :** Authentification par les tiers 

## **Indicateurs de performance** 

- Nombre d'attestations délivrées par mois (cible : 8 000) 

- Délai moyen de délivrance (cible : < 5 min en libre-service) 

- Nombre de vérifications publiques par mois 

- Taux d'attestations rejetées en vérification (indicateur de fraude) 

## **Règles métier et contrôles** 

- Une attestation a une durée de validité explicite (1 à 3 mois selon le type). 

- Les attestations sensibles (non-faillite) nécessitent un contrôle humain a posteriori. 

- Toute génération est tracée dans un journal inviolable (logs horodatés). 

Page 14 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **S04  Annuaire géolocalisé des entreprises tchadiennes** 

_Donner de la visibilité aux entreprises et faciliter les mises en relation_ 

|**Famille**|Formalités d'entreprise|
|---|---|
|**Bénéficiaires**|Toutes les entreprises immatriculées, opérateurs économiques,<br>investisseurs, acheteurs publics|
|**Canaux d'accès**|Portail public, application mobile, API ouverte pour partenaires|
|**Délai cible**|**Mise à jour en temps réel à partir du RCCM**|
|**Phase de déploiement**|Phase 2 — M10|



## **Description du service** 

Annuaire public et interrogeable de toutes les entreprises tchadiennes, géolocalisées sur une carte, filtrables par secteur d'activité, taille, région, statut (PME, startup, exportateur). Chaque entreprise dispose d'une fiche enrichissable (photos, contacts, produits/services, certifications, références clients) qu'elle peut alimenter depuis son espace. 

## **Processus utilisateur (parcours type)** 

30. L'utilisateur public accède à l'annuaire sans création de compte. 

31. Il recherche par mot-clé, secteur, localisation ou filtre avancé. 

32. Il consulte la fiche d'une entreprise, sa carte, ses coordonnées, ses certifications. 

33. Il peut contacter directement via un formulaire intégré (la CCIAMA assure l'anti-spam). 

34. Côté entreprise : enrichissement de la fiche via l'espace adhérent (photos, vidéos, catalogue produits). 

## **Écrans et interfaces** 

- **Écran 1 — Page d'accueil annuaire :** Barre de recherche, filtres rapides, carte interactive. 

- **Écran 2 — Résultats :** Liste paginée + carte, tri par pertinence, distance ou alphabétique. 

- **Écran 3 — Fiche entreprise publique :** Identité, contacts, produits/services, certifications, carte. 

- **Écran 4 — Espace administration de la fiche :** Édition des contenus enrichis par le dirigeant de l'entreprise. 

## **Données métier manipulées** 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Données socle RCCM|Référentiel|Synchronisation temps réel|
|Coordonnées de contact|Texte|Saisie entreprise|
|Coordonnées GPS|Latitude/Longitude|Géocodage + validation|
|Logo et photos|Images|Téléversement entreprise (modération)|



Page 15 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Catalogue produits/services|Liste structurée|Saisie entreprise|
|Certifications|Liste|Saisie + justificatifs|
|Mots-clés|Tags|Saisie + suggestion automatique|



## **Intégrations et systèmes connexes** 

- **API cartographique :** Géolocalisation et affichage cartographique 

- **Service de modération :** Contrôle des contenus enrichis 

- **API publique CCIAMA :** Mise à disposition partenaires (acheteurs, investisseurs) 

## **Indicateurs de performance** 

- Nombre d'entreprises géolocalisées (cible : 60 000) 

- Nombre de fiches enrichies activement (cible : 15 000) 

- Nombre de visites mensuelles de l'annuaire (cible : 50 000) 

- Taux de contact aboutis (cible : 12 %) 

## **Règles métier et contrôles** 

- Toute fiche est par défaut publique pour la partie réglementaire (RCCM). 

- Les  contenus  enrichis  sont  soumis  à  modération  a  priori  pour  les  premières publications. 

- Les entreprises radiées sont retirées de la recherche mais conservent une fiche historique. 

Page 16 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

**==> picture [29 x 23] intentionally omitted <==**

## **Famille 2 — Commerce extérieur** 

Cette famille couvre les services liés aux opérations d'import-export. Elle est stratégique dans le contexte de la ZLECAf et de l'ouverture économique du Tchad. 

**==> picture [361 x 361] intentionally omitted <==**

Page 17 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **S05  Certificats d'origine numériques** 

_Édition instantanée et vérification mondiale en un scan_ 

|**Famille**|Commerce extérieur|
|---|---|
|**Bénéficiaires**|Exportateurs tchadiens, importateurs étrangers, services douaniers<br>étrangers|
|**Canaux d'accès**|Portail web, application mobile, postes décentralisés dans les délégations|
|**Délai cible**|**Délivrance en moins de 4 heures (au lieu de 2 à 5 jours actuellement)**|
|**Phase de déploiement**|Phase 2 — M9 (priorité ZLECAf)|



## **Description du service** 

Service  phare  du  programme  :  émission  de  certificats  d'origine  numériques  signés électroniquement, conformes aux standards ZLECAf et CEMAC. Chaque certificat porte un QR-code et un identifiant unique vérifiable par toute douane étrangère via le portail public ou par API. Réduit drastiquement la fraude et accélère le dédouanement à destination. 

## **Processus utilisateur (parcours type)** 

35. L'exportateur se connecte et lance une nouvelle demande de certificat. 

36. Il sélectionne le pays de destination et le type de certificat (CO standard, EUR.1, ZLECAf, etc.). 

37. Il saisit ou importe les données de la facture commerciale (produits, codes SH, valeurs, poids). 

38. Le système calcule automatiquement l'éligibilité aux préférences tarifaires. 

39. Il joint la facture, la liste de colisage, et tout document de support (déclarations du fournisseur, etc.). 

40. Paiement en ligne des droits. 

41. Instruction par un agent du service Commerce extérieur (workflow rapide). 

42. Signature électronique et émission du certificat numérique avec QR-code. 

43. Le certificat est transmis par e-mail à l'exportateur et accessible à la douane de destination via portail / API. 

## **Écrans et interfaces** 

- **Écran 1 — Nouvelle demande :** Choix du pays de destination, du type de certificat, et de l'opération. 

- **Écran 2 — Saisie des marchandises :** Tableau ligne par ligne avec autocomplétion des codes SH (système harmonisé). 

- **Écran 3 — Vérification d'éligibilité :** Le système indique automatiquement les régimes préférentiels applicables. 

- **Écran 4 — Téléversement des justificatifs :** Facture, liste de colisage, déclarations fournisseurs, B/L. 

- **Écran 5 — Aperçu du certificat :** Document généré avant validation, modifiable une dernière fois. 

Page 18 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

- **Écran 6 — Suivi et historique :** Statut, échanges, certificats antérieurs, possibilité de duplicata. 

- **Écran 7 (public) — Vérification douane :** Page accessible aux douanes étrangères : scan QR ou saisie du n° et de la clé. 

## **Données métier manipulées** 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|N° de certificat|Alphanum.|Séquentiel sécurisé|
|Type de certificat|Énumération|ZLECAf, EUR.1, CEMAC, standard|
|Pays de destination|Code ISO|Liste ISO 3166|
|Exportateur|Référence entreprise|RCCM CCIAMA|
|Importateur|Texte structuré|Saisie|
|Marchandises (lignes)|Tableau|Saisie + codes SH|
|Valeur FOB / poids|Décimal|Saisie + contrôle de cohérence|
|Régime préférentiel|Énumération|Calculé automatiquement|
|QR-code & hash|Données techniques|Générés à la signature|



## **Intégrations et systèmes connexes** 

- **Douanes tchadiennes :** Échange d'informations en temps réel 

- **API ZLECAf (à venir) :** Vérification croisée des certificats panafricains 

- **Plateforme de paiement :** Encaissement des droits 

- **Service de signature électronique :** Signature qualifiée du certificat 

- **API publique pour douanes étrangères :** Authentification du certificat à destination 

## **Indicateurs de performance** 

- Délai moyen de délivrance (cible : ≤ 4 heures, < 24 h sur 95 % des cas) 

- Nombre de certificats émis par mois (cible : 3 500) 

- Taux de rejet en vérification à destination (cible : < 0,5 %) 

- Volume de scans QR par les douanes étrangères (indicateur de confiance) 

- Délai moyen de dédouanement à destination (gain estimé : −30 %) 

## **Règles métier et contrôles** 

- Seul un exportateur inscrit et à jour de ses obligations peut émettre un certificat. 

- Tout certificat émis est verrouillé : aucune modification, seulement annulation et réémission. 

- Une vérification renforcée s'applique au-delà d'un certain seuil de valeur ou pour les pays sensibles. 

- Les justificatifs sont archivés sur 10 ans minimum. 

Page 19 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **S06  Carnets ATA numériques** 

_Faciliter l'admission temporaire de marchandises à l'international_ 

|**Famille**|Commerce extérieur|
|---|---|
|**Bénéficiaires**|Entreprises participant à des salons, expositions, missions commerciales,<br>échantillonnages|
|**Canaux d'accès**|Portail web, accompagnement en délégation pour les premiers carnets|
|**Délai cible**|**3 jours ouvrés (au lieu de 2 à 3 semaines)**|
|**Phase de déploiement**|Phase 2 — M11|



## **Description du service** 

Émission dématérialisée des carnets ATA (Admission Temporaire / Temporary Admission) permettant à une entreprise tchadienne d'exposer ou de faire transiter ses marchandises dans un pays étranger sans paiement de droits de douane. Le carnet ATA est un document international standardisé délivré sous la garantie de la chambre de commerce. La version numérique inclut un suivi des passages aux frontières. 

## **Processus utilisateur (parcours type)** 

44. L'entreprise saisit la liste des marchandises (description, valeur, poids, n° de série). 

45. Elle indique les pays prévus et la durée de séjour. 

46. Elle dépose les garanties exigées (caution bancaire ou dépôt). 

47. Validation par la CCIAMA, calcul des droits éventuels. 

48. Génération du carnet numérique signé et émission de la version papier de secours pour les pays n'acceptant pas encore le format numérique. 

49. Suivi des passages frontaliers : chaque entrée/sortie est saisie via une application dédiée. 

50. Apurement final du carnet et restitution de la garantie. 

## **Écrans et interfaces** 

- **Écran 1 — Création du carnet :** Formulaire ATA, type d'opération (foire, professionnel, échantillon). 

- **Écran 2 — Saisie des marchandises :** Tableau enrichi : description, valeur, poids, n° de série. 

- **Écran 3 — Garanties :** Choix de la caution bancaire ou dépôt en espèces, justificatifs. 

- **Écran 4 — Suivi des passages :** Carte mondiale avec les voyages, statut de chaque feuillet. 

- **Écran 5 — Apurement :** Validation finale, restitution de garantie, archivage. 

## **Données métier manipulées** 

Page 20 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|N° de carnet ATA|Alphanum.|Séquentiel international|
|Marchandises|Liste détaillée|Saisie utilisateur|
|Pays de destination|Liste pays ISO|Sélection|
|Garantie|Type + montant|Saisie + justificatif|
|Feuillets utilisés|Historique passages|Saisies frontière|
|Date d'expiration|Date|Calculée (1 an maximum)|



## **Intégrations et systèmes connexes** 

- **Réseau international ATA (ICC) :** Validation croisée avec les chambres consulaires étrangères 

- **Douanes tchadiennes :** Validation des sorties et retours 

- **Banques partenaires :** Cautions bancaires électroniques 

## **Indicateurs de performance** 

- Nombre de carnets ATA émis par an (cible : 250 d'ici 24 mois) 

- Délai moyen de délivrance (cible : 3 jours) 

- Taux d'apurement régulier (cible : 98 %) 

- Délai moyen de restitution de garantie (cible : 15 jours après retour) 

## **Règles métier et contrôles** 

- La garantie doit couvrir au moins 110 % de la valeur des marchandises. 

- Un carnet ATA a une validité de 1 an non renouvelable. 

- L'absence d'apurement dans les délais entraîne la mise en jeu de la garantie. 

Page 21 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **S07  Visa de factures et légalisations** 

_Authentifier ses documents commerciaux pour l'international_ 

|**Famille**|Commerce extérieur|
|---|---|
|**Bénéficiaires**|Exportateurs, prestataires de services à l'international, soumissionnaires à<br>des appels d'offres étrangers|
|**Canaux d'accès**|Portail web, application mobile|
|**Délai cible**|**24 heures**|
|**Phase de déploiement**|Phase 2 — M10|



## **Description du service** 

Service d'authentification numérique de factures commerciales, documents de soumission, attestations diverses destinées à des partenaires ou autorités étrangères. Le document est revêtu d'un cachet électronique de la CCIAMA et porte un QR-code de vérification. 

## **Processus utilisateur (parcours type)** 

51. L'usager téléverse le document à viser (PDF de préférence). 

52. Il indique le motif (factures, soumissions, attestations). 

53. Paiement des droits selon le type et le nombre de pages. 

54. Instruction par un agent (contrôle de cohérence avec l'activité déclarée). 

55. Apposition du cachet numérique CCIAMA et de la signature. 

56. Téléchargement immédiat du document visé. 

## **Écrans et interfaces** 

- **Écran 1 — Nouvelle demande :** Téléversement du document + sélection du motif. 

- **Écran 2 — Aperçu et paiement :** Document visualisé, calcul des droits, paiement. 

- **Écran 3 — Téléchargement :** Document visé téléchargeable, archive personnelle. 

## **Données métier manipulées** 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Type de document|Énumération|Liste paramétrable|
|Document original|Fichier PDF|Téléversement|
|Document visé|Fichier PDF signé|Généré par le système|
|Motif|Texte|Saisie|



## **Intégrations et systèmes connexes** 

- **Service de signature électronique :** Cachet numérique de l'institution 

- **Plateforme de paiement :** Encaissement 

## **Indicateurs de performance** 

- Nombre de visas délivrés par mois (cible : 2 500) 

Page 22 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

**==> picture [29 x 23] intentionally omitted <==**

- Délai moyen (cible : 24 h, 80 % en moins de 12 h) 

- Volume de pages traitées 

- Taux de rejet (manque de cohérence) 

## **Règles métier et contrôles** 

- Le  visa  atteste  de la  signature  et  de la  qualité  du  signataire, pas  du  contenu commercial. 

- Les documents incohérents avec l'activité déclarée font l'objet d'une demande de complément. 

**==> picture [361 x 361] intentionally omitted <==**

Page 23 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

**==> picture [29 x 23] intentionally omitted <==**

## **Famille 3 — Services aux membres** 

Cette famille couvre les services transverses offerts à chaque entreprise ressortissante : espace personnel, gestion des cotisations, prise de rendez-vous. 

**==> picture [361 x 361] intentionally omitted <==**

Page 24 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **S08  Espace adhérent et compte unifié entreprise** 

_Un compte, tous les services_ 

|**Famille**|Services aux membres|
|---|---|
|**Bénéficiaires**|Toutes les entreprises immatriculées|
|**Canaux d'accès**|Portail web, application mobile|
|**Délai cible**|**Activation instantanée**|
|**Phase de déploiement**|Phase 1 — M5|



## **Description du service** 

Espace personnel sécurisé donnant accès à l'ensemble des services CCIAMA : visualisation du registre, historique des actes, suivi des dossiers en cours, espace documentaire, gestion des cotisations, accès aux services partenaires. Un seul compte permet plusieurs utilisateurs avec des rôles distincts (dirigeant, comptable, RH, commercial). 

## **Processus utilisateur (parcours type)** 

57. Activation à la première connexion via l'identifiant unique d'entreprise et un code envoyé au dirigeant. 

58. Le dirigeant définit les utilisateurs secondaires et leurs droits. 

59. Chaque utilisateur dispose d'un tableau de bord adapté à son rôle. 

60. Notifications par e-mail et SMS pour les actes importants. 

61. Audit log accessible au dirigeant pour suivre toutes les actions de l'équipe. 

## **Écrans et interfaces** 

- **Écran 1 — Activation :** Saisie de l'IUE + OTP dirigeant + définition du mot de passe. 

- **Écran 2 — Tableau de bord :** Statut entreprise, dossiers en cours, factures, notifications. 

- **Écran 3 — Gestion des utilisateurs :** Liste des collaborateurs, attribution des rôles. 

- **Écran 4 — Documents :** Bibliothèque des actes, attestations, certificats émis. 

- **Écran 5 — Paramètres :** Préférences de notification, langues, méthodes de paiement enregistrées. 

- **Écran 6 — Audit log :** Journal des actions par utilisateur. 

## **Données métier manipulées** 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Compte utilisateur|Identifiants chiffrés|Création + bcrypt|
|Rôles et permissions|Matrice|Définie par dirigeant|
|Préférences|Configuration|Saisies utilisateur|
|Notifications|File d'événements|Système|



Page 25 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Sessions actives|Tokens|Système d'authentification|



## **Intégrations et systèmes connexes** 

- **Service d'authentification (SSO) :** Authentification unique pour tous les services 

- **Service de notification (SMS, e-mail, push) :** Alertes en temps réel 

- **Annuaire interne :** Synchronisation des informations entreprise 

## **Indicateurs de performance** 

- Nombre de comptes actifs (cible : 40 000 à 24 mois) 

- Taux d'utilisateurs revenant chaque mois (cible : 60 %) 

- Durée moyenne de session (indicateur d'engagement) 

- Taux d'activation de la double authentification (cible : 70 %) 

## **Règles métier et contrôles** 

- Le dirigeant déclaré au RCCM est l'administrateur du compte par défaut. 

- La double authentification (2FA) est obligatoire pour les actions sensibles (signature, paiement). 

- Toute action est journalisée et conservée 10 ans. 

Page 26 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **S09  Gestion des cotisations consulaires** 

_Payer ses cotisations en ligne, sans déplacement_ 

|**Famille**|Services aux membres|
|---|---|
|**Bénéficiaires**|Toutes les entreprises ressortissantes|
|**Canaux d'accès**|Portail web, application mobile, mobile money, virement|
|**Délai cible**|**Encaissement instantané**|
|**Phase de déploiement**|Phase 2 — M9|



## **Description du service** 

Service de calcul et de paiement en ligne des cotisations consulaires annuelles. Le système calcule automatiquement le montant dû selon la taille de l'entreprise et son secteur, envoie des rappels personnalisés, et délivre une attestation de paiement immédiate. 

## **Processus utilisateur (parcours type)** 

62. Calcul  automatique  de  la  cotisation  annuelle  (chiffre  d'affaires  déclaré,  secteur, effectif). 

63. Notification à l'entreprise dans son espace + e-mail + SMS. 

64. L'entreprise consulte le détail du calcul et peut le contester. 

65. Paiement en une fois ou en plusieurs échéances (mobile money, virement, carte). 

66. Délivrance immédiate de l'attestation de paiement. 

67. Rappels automatiques en cas d'impayé, escalade prévue. 

## **Écrans et interfaces** 

- **Écran 1 — Mes cotisations :** Historique, montants dus, dates d'échéance. 

- **Écran 2 — Détail du calcul :** Base de calcul, taux, contestation possible. 

- **Écran 3 — Paiement :** Choix du mode, échéancier, exécution. 

- **Écran 4 — Attestation :** Génération immédiate, téléchargement, archivage. 

## **Données métier manipulées** 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Cotisation annuelle|Décimal|Calcul automatique|
|Base de calcul|CA / effectif / secteur|Données entreprise|
|Paiements|Historique|Plateforme de paiement|
|Statut|Énumération|À jour, en retard, contesté|



## **Intégrations et systèmes connexes** 

- **Plateforme de paiement :** Encaissement multi-canal 

- **Comptabilité CCIAMA :** Enregistrement automatique en comptabilité 

- **DGI :** Croisement avec les déclarations fiscales pour la base de calcul 

Page 27 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

**==> picture [29 x 23] intentionally omitted <==**

## **Indicateurs de performance** 

- Taux de recouvrement à échéance (cible : 90 %) 

- Délai moyen de paiement après notification (cible : 30 jours) 

- Part de paiements dématérialisés (cible : 95 %) 

- Recettes de cotisations annuelles 

## **Règles métier et contrôles** 

- Le non-paiement à 90 jours entraîne la suspension des services en ligne. 

- Une contestation suspend l'exigibilité pendant son instruction. 

- Les paiements échelonnés sont possibles pour les TPE et les nouvelles entreprises. 

**==> picture [361 x 361] intentionally omitted <==**

Page 28 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **S10  Demande de rendez-vous et services présentiels** 

_Préparer sa visite en délégation pour ne pas attendre_ 

|**Famille**|Services aux membres|
|---|---|
|**Bénéficiaires**|Entreprises et particuliers nécessitant un rendez-vous physique|
|**Canaux d'accès**|Portail web, application mobile, USSD, centre d'appels|
|**Délai cible**|**Confirmation immédiate du créneau**|
|**Phase de déploiement**|Phase 1 — M6|



## **Description du service** 

Service de prise de rendez-vous en ligne dans les délégations CCIAMA pour les opérations nécessitant une présence physique (légalisation de signatures, dépôt d'originaux, sessions de conseil personnalisé). Réduit drastiquement les files d'attente. 

## **Processus utilisateur (parcours type)** 

68. L'usager choisit la délégation, l'objet du rendez-vous et un créneau disponible. 

69. Confirmation immédiate par SMS et e-mail. 

70. L'usager peut joindre des documents préparatoires. 

71. Rappel automatique 24 h avant. 

72. À l'arrivée, l'usager scanne un QR-code et est dirigé vers le guichet compétent. 

73. Évaluation du service après le rendez-vous. 

## **Écrans et interfaces** 

- **Écran 1 — Choix de la délégation et du motif :** Carte des délégations, catalogue des motifs. 

- **Écran 2 — Calendrier des créneaux :** Disponibilités en temps réel, choix d'horaire. 

- **Écran 3 — Pièces à apporter :** Liste personnalisée selon le motif, possibilité d'envoi préalable. 

- **Écran 4 — Confirmation et préparation :** Récapitulatif, QR-code d'arrivée, ajout au calendrier. 

## **Données métier manipulées** 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Délégation|Référence|Annuaire CCIAMA|
|Motif|Énumération|Liste paramétrable|
|Créneau|Date + heure|Calendrier des agents|
|Pièces préparatoires|Fichiers|Téléversement|
|QR-code de pointage|Code unique|Généré par le système|



## **Intégrations et systèmes connexes** 

Page 29 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

- **Agendas internes des agents :** Synchronisation des disponibilités 

- **Service de notification :** Confirmations et rappels 

- **Gestion de file d'attente physique :** Pointage à l'arrivée 

## **Indicateurs de performance** 

- Nombre de rendez-vous pris par mois 

- Taux d'absentéisme (cible : < 10 %) 

- Temps d'attente moyen sur place (cible : < 15 min) 

- Satisfaction post-rendez-vous (cible : ≥ 80 %) 

## **Règles métier et contrôles** 

- Annulation gratuite jusqu'à 24 h avant le rendez-vous. 

- Trois absences non justifiées entraînent un blocage temporaire de la prise de rendezvous en ligne. 

Page 30 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

**==> picture [29 x 23] intentionally omitted <==**

## **Famille 4 — Formation et accompagnement** 

Cette famille structure l'offre de montée en compétences et de conseil personnalisé proposée aux entrepreneurs tchadiens. Elle constitue un levier majeur de développement du secteur privé. 

**==> picture [361 x 361] intentionally omitted <==**

Page 31 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **S11  Catalogue de formations et inscriptions en ligne** 

_Monter en compétence sans quitter son entreprise_ 

|**Famille**|Formation et accompagnement|
|---|---|
|**Bénéficiaires**|Dirigeants, cadres, employés des entreprises tchadiennes|
|**Canaux d'accès**|Portail web, application mobile|
|**Délai cible**|**Inscription instantanée**|
|**Phase de déploiement**|Phase 2 — M12|



## **Description du service** 

Catalogue interrogeable de toutes les formations proposées par la CCIAMA et ses partenaires (gestion  d'entreprise,  commerce  international,  fiscalité,  numérique,  leadership,  etc.). Inscription en ligne, paiement, gestion des prérequis, certificat de participation à la clé. 

## **Processus utilisateur (parcours type)** 

74. Recherche  dans  le  catalogue  par  thème,  niveau,  format  (présentiel,  distanciel, hybride). 

75. Consultation de la fiche formation : objectifs, programme, formateurs, prérequis, dates. 

76. Inscription en ligne, paiement éventuel. 

77. Réception des supports avant la formation. 

78. Suivi en présentiel ou à distance via la plateforme e-learning intégrée. 

79. Évaluation, délivrance d'un certificat de participation signé électroniquement. 

## **Écrans et interfaces** 

- **Écran 1 — Catalogue :** Liste filtrable par thème, niveau, format, durée, prix. 

- **Écran 2 — Fiche formation :** Détail complet, formateurs, sessions, témoignages. 

- **Écran 3 — Inscription :** Choix de la session, paiement, conditions. 

- **Écran 4 — Mes formations :** Suivi des inscriptions, accès aux supports, calendrier. 

- **Écran 5 — Évaluation et certificat :** Questionnaire de satisfaction, téléchargement du certificat. 

## **Données métier manipulées** 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Formation|Fiche structurée|Catalogue interne|
|Session|Dates + lieu +<br>formateur|Planning interne|
|Inscription|Lien participant-<br>session|Système|
|Prérequis|Liste|Définition pédagogique|
|Évaluations|Notes +<br>commentaires|Participants|



Page 32 / 49 

EBENYX  •  Annexe technique — Mai 2026 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Certificat|PDF signé|Généré après validation|



## **Intégrations et systèmes connexes** 

- **Plateforme e-learning (LMS) :** Diffusion des contenus à distance 

- **Plateforme de paiement :** Encaissement des frais 

- **Espace adhérent :** Suivi unifié de la formation de l'équipe 

## **Indicateurs de performance** 

- Nombre d'inscriptions par mois (cible : 800) 

- Taux de complétion des formations (cible : 75 %) 

- Note moyenne de satisfaction (cible : 4,2/5) 

- Taux de réinscription d'une année sur l'autre (cible : 40 %) 

## **Règles métier et contrôles** 

- Les inscriptions sont closes 48 h avant la session. 

- Le certificat est délivré si le participant a assisté à au moins 80 % de la formation et obtenu la note minimale à l'évaluation finale. 

Page 33 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **S12  Plateforme e-learning et bibliothèque numérique** 

_Apprendre à son rythme, à distance_ 

|**Famille**|Formation et accompagnement|
|---|---|
|**Bénéficiaires**|Entrepreneurs en région, cadres des PME, étudiants|
|**Canaux d'accès**|Portail web (responsive), application mobile, accès hors-ligne possible|
|**Délai cible**|**Accès immédiat aux contenus**|
|**Phase de déploiement**|Phase 3 — M16|



## **Description du service** 

Plateforme e-learning intégrant des parcours certifiants en autonomie (gestion d'entreprise, marketing digital, comptabilité, export, etc.), des webinaires enregistrés, une bibliothèque de ressources (modèles de contrats, guides pratiques, vidéos de témoignages). Une partie des contenus est accessible gratuitement, d'autres en abonnement ou à l'unité. 

## **Processus utilisateur (parcours type)** 

80. Inscription à un parcours ou achat à l'unité. 

81. Accès aux modules vidéo, quiz interactifs, devoirs. 

82. Mode hors-ligne pour les zones à faible connectivité. 

83. Évaluations intermédiaires et finales. 

84. Délivrance d'un badge ou certificat numérique. 

## **Écrans et interfaces** 

- **Écran 1 — Mes parcours :** Progression visualisée, prochaine leçon, deadlines. 

- **Écran 2 — Lecteur de cours :** Vidéo, transcript, ressources liées, prise de notes. 

- **Écran 3 — Quiz et évaluations :** Questions multiples, scoring instantané, explications. 

- **Écran 4 — Bibliothèque :** Modèles téléchargeables, guides, fiches pratiques. 

- **Écran 5 — Mes certifications :** Badges obtenus, certificats partageables sur LinkedIn. 

## **Données métier manipulées** 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Cours|Structure<br>hiérarchique|Conception pédagogique|
|Progression apprenant|Pourcentage + traces<br>xAPI|Activité utilisateur|
|Évaluations|Notes + tentatives|LMS|
|Certifications|Badge / certificat<br>numérique|Système, signé électroniquement|



Page 34 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **Intégrations et systèmes connexes** 

- **LMS (Moodle ou équivalent) :** Gestion des cours et des progressions 

- **CDN :** Diffusion vidéo optimisée selon la bande passante 

- **Open Badges :** Émission de badges interopérables internationalement 

## **Indicateurs de performance** 

- Nombre d'apprenants actifs par mois (cible : 5 000) 

- Taux de complétion des parcours certifiants (cible : 60 %) 

- Nombre de badges délivrés 

- Temps moyen passé sur la plateforme 

## **Règles métier et contrôles** 

- Les contenus gratuits sont accessibles sans inscription complète. 

- Les certifications signées impliquent une vérification d'identité préalable. 

- Les contenus peuvent être téléchargés pour usage hors-ligne mais sont chiffrés. 

Page 35 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **S13  Accompagnement individuel et coaching** 

_Un expert à ses côtés pour chaque étape clé_ 

|**Famille**|Formation et accompagnement|
|---|---|
|**Bénéficiaires**|Porteurs de projet, dirigeants de PME, exportateurs débutants|
|**Canaux d'accès**|Visioconférence intégrée, présentiel en délégation|
|**Délai cible**|**Premier rendez-vous sous 7 jours**|
|**Phase de déploiement**|Phase 2 — M14|



## **Description du service** 

Service d'accompagnement personnalisé par des conseillers CCIAMA et un réseau d'experts partenaires : aide au business plan, accompagnement à l'export, conseil juridique de premier niveau,  recherche  de  financement.  Les  séances  peuvent  être  en  présentiel  ou  en visioconférence intégrée au portail. 

## **Processus utilisateur (parcours type)** 

85. L'usager remplit un diagnostic en ligne (étape de développement, besoins, secteurs). 

86. Le système recommande un programme d'accompagnement et un conseiller adapté. 87. Prise de rendez-vous (visio ou présentiel). 

88. Séances avec partage de documents, plan d'action, suivi. 

89. Bilan final et orientation vers d'autres services. 

## **Écrans et interfaces** 

- **Écran 1 — Diagnostic :** Questionnaire structuré générant un profil. 

- **Écran 2 — Programmes recommandés :** Liste personnalisée d'accompagnements. 

- **Écran 3 — Salle de visio :** Visioconférence intégrée, tableau blanc, partage d'écran, enregistrement. 

- **Écran 4 — Plan d'action :** Actions à mener entre les séances, échéances, ressources. 

## **Données métier manipulées** 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Profil entrepreneur|Diagnostic structuré|Réponses au questionnaire|
|Programme|Lien diagnostic-<br>programme|Recommandation système|
|Séances|Historique + notes|Conseiller|
|Plan d'action|Liste de tâches|Élaboré en séance|



## **Intégrations et systèmes connexes** 

- **Visioconférence (Jitsi ou Teams) :** Sessions à distance sécurisées 

Page 36 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

- **Annuaire des experts partenaires :** Mise en relation thématique 

- **Outil de prise de notes collaboratif :** Travail en séance 

## **Indicateurs de performance** 

- Nombre d'entreprises accompagnées par an (cible : 1 200) 

- Nombre moyen de séances par accompagnement 

- Taux de transformation en projet concret (cible : 50 %) 

- Satisfaction des bénéficiaires (cible : ≥ 85 %) 

## **Règles métier et contrôles** 

- Le premier rendez-vous est gratuit pour toute entreprise à jour de ses cotisations. 

- Au-delà, un tarif réduit s'applique selon la taille de l'entreprise. 

- Confidentialité absolue garantie par charte signée par les conseillers. 

Page 37 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

**==> picture [29 x 23] intentionally omitted <==**

## **Famille 5 — SI interne et gestion** 

Cette famille regroupe les briques transverses indispensables au bon fonctionnement de l'institution  :  moteur  de  workflow,  gestion  électronique  des  documents,  intelligence décisionnelle, comptabilité et ressources humaines. 

**==> picture [361 x 361] intentionally omitted <==**

Page 38 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **S14  Workflow interne d'instruction des dossiers** 

_Le moteur invisible qui fait tourner tous les services_ 

|**Famille**|SI interne|
|---|---|
|**Bénéficiaires**|Agents instructeurs CCIAMA, chefs de service, direction|
|**Canaux d'accès**|Application interne (web), application mobile pour les déplacements|
|**Délai cible**|**Traitement temps réel des affectations**|
|**Phase de déploiement**|Phase 1 — M6 (priorité)|



## **Description du service** 

Brique transverse à tous les services usagers : le moteur de workflow oriente chaque dossier (immatriculation, certificat, attestation, etc.) vers l'agent compétent, suit son avancement, déclenche des escalades en cas de retard, et fournit aux managers une vision en temps réel de la charge et des performances. 

## **Processus utilisateur (parcours type)** 

90. Tout dossier déposé par un usager génère un ticket de workflow. 

91. Le  système  l'affecte  selon  des  règles  paramétrables  (type,  région,  charge, compétence). 

92. L'agent reçoit une notification et accède au dossier dans sa file. 

93. Il peut valider, demander un complément, rejeter, ou réaffecter. 

94. Le chef de service voit la charge globale et peut rééquilibrer. 

95. Les délais sont contrôlés en continu : alerte à T-1 jour, escalade automatique au-delà. 

96. Toutes les actions sont journalisées pour audit. 

## **Écrans et interfaces** 

- **Écran 1 — Ma file de travail :** Liste priorisée des dossiers à traiter aujourd'hui. 

- **Écran 2 — Vue dossier :** Toutes les pièces, l'historique, les actions possibles. 

- **Écran 3 — Demande de complément :** Formulaire structuré, envoi automatique à l'usager. 

- **Écran 4 — Tableau de bord manager :** Charge par agent, délais, alertes, KPI temps réel. 

- **Écran 5 — Paramétrage des règles :** Configuration des règles d'affectation et d'escalade. 

## **Données métier manipulées** 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Ticket de workflow|Objet structuré|Généré à la création|
|État du ticket|Énumération|déposé, affecté, en cours, complément,<br>validé, rejeté|
|Agent affecté|Référence|Règles d'affectation|



Page 39 / 49 

EBENYX  •  Annexe technique — Mai 2026 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Délais|Dates|Calculées selon SLA|
|Historique des actions|Liste horodatée|Journal système|



## **Intégrations et systèmes connexes** 

- **Tous les services usagers :** Génération de tickets 

- **Service de notification interne :** Alertes aux agents et managers 

- **Annuaire RH CCIAMA :** Compétences et disponibilités des agents 

- **Module BI :** Tableau de bord et analyse 

## **Indicateurs de performance** 

- Délai moyen de traitement par type de dossier 

- Taux de respect des SLA par service (cible : 95 %) 

- Charge moyenne par agent 

- Nombre d'escalades par semaine 

## **Règles métier et contrôles** 

- Tout dossier non traité dans 80 % du SLA déclenche une alerte managériale. 

- Aucun dossier ne peut être supprimé : seul un changement d'état est possible (traçabilité). 

- Les règles d'affectation sont auditées tous les trimestres. 

Page 40 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **S15  Gestion électronique des documents (GED)** 

_Toute la mémoire de la chambre, accessible et sécurisée_ 

|**Famille**|SI interne|
|---|---|
|**Bénéficiaires**|Tous les agents CCIAMA, auditeurs, contrôleurs|
|**Canaux d'accès**|Application interne, application mobile|
|**Délai cible**|**Recherche < 3 secondes sur 10 millions de documents**|
|**Phase de déploiement**|Phase 1 — M8|



## **Description du service** 

Système de gestion électronique des documents couvrant à la fois les documents générés par les services (RCCM, certificats, attestations) et les documents internes (notes, contrats, courriers). Inclut numérisation, OCR, classement automatique, recherche plein-texte, gestion des versions et politique de conservation. 

## **Processus utilisateur (parcours type)** 

97. Tout document généré par les services usagers est automatiquement classé dans la GED. 

98. Les documents papier sont numérisés par les agents, OCR appliqué, classement assisté. 

99. Tout agent peut rechercher (plein-texte ou par métadonnée) selon ses droits d'accès. 

100. Les versions sont conservées avec historique des modifications. 

101. Les documents arrivés en fin de durée légale sont archivés ou détruits selon la politique. 

## **Écrans et interfaces** 

- **Écran 1 — Recherche :** Barre de recherche puissante, filtres avancés, suggestions. 

- **Écran 2 — Visionneuse :** Aperçu de tout format, annotations, marqueurs. 

- **Écran 3 — Numérisation :** Interface dédiée aux opérateurs de numérisation. 

- **Écran 4 — Gestion des versions :** Historique, comparaison, restauration. 

- **Écran 5 — Politique de conservation :** Paramétrage des règles d'archivage et de destruction. 

## **Données métier manipulées** 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Document|Fichier +<br>métadonnées|Multi-canal|
|Métadonnées|Schéma extensible|Saisie + extraction OCR|
|Versions|Historique|À chaque modification|
|Droits d'accès|ACL|Politique de sécurité|



Page 41 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Durée de conservation|Durée légale|Référentiel juridique|



## **Intégrations et systèmes connexes** 

- **Workflow :** Stockage des pièces de dossier 

- **Moteur de recherche (Elasticsearch) :** Indexation plein-texte 

- **Outil OCR :** Extraction texte des documents scannés 

- **Archivage à valeur probante :** Conservation longue durée des actes 

## **Indicateurs de performance** 

- Nombre de documents indexés (cible : > 10 millions à 24 mois) 

- Temps de recherche moyen (cible : < 3 secondes) 

- Taux de précision OCR (cible : > 95 %) 

- Volume archivé par mois 

## **Règles métier et contrôles** 

- Tout document généré par le SI est versé automatiquement en GED. 

- La consultation des documents sensibles est tracée et auditable. 

- Les  durées  de  conservation  respectent  les  textes  en  vigueur  (OHADA,  droit commercial, fiscal). 

Page 42 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **S16  Observatoire économique et tableaux de bord** 

_Comprendre l'économie tchadienne, données à l'appui_ 

|**Famille**|SI interne|
|---|---|
|**Bénéficiaires**|Direction CCIAMA, État, partenaires, public éclairé|
|**Canaux d'accès**|Portail public (données ouvertes), application interne (analyses)|
|**Délai cible**|**Indicateurs mensuels publiés au plus tard le 15 du mois suivant**|
|**Phase de déploiement**|Phase 3 — M18|



## **Description du service** 

Système décisionnel agrégeant l'ensemble des données du SI consulaire pour produire des tableaux  de  bord,  des  analyses  sectorielles,  et  un  observatoire  économique  publié périodiquement. Une partie des données est rendue publique en open data pour stimuler l'écosystème. 

## **Processus utilisateur (parcours type)** 

102. Collecte automatique des données des services usagers et internes. 

103. Croisement avec les données partenaires (DGI, INSEED, douanes). 

104. Nettoyage et anonymisation pour la publication. 

105. Production de tableaux de bord standardisés. 

106. Publication mensuelle de l'observatoire (PDF + dataviz interactive). 107. Mise à disposition des données en open data via API. 

## **Écrans et interfaces** 

- **Écran 1 — Tableau de bord direction :** Indicateurs clés de l'activité consulaire en temps réel. 

- **Écran 2 — Analyses sectorielles :** Vue par secteur d'activité, géographie, taille. 

- **Écran 3 — Observatoire public :** Dataviz interactives, téléchargement de rapports. 

- **Écran 4 — Portail open data :** Catalogue de jeux de données, API documentée. 

## **Données métier manipulées** 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Entrepôt de données (data<br>warehouse)|Schéma en étoile|ETL nocturne|
|Indicateurs|Mesures +<br>dimensions|Calculs définis|
|Données ouvertes|Jeux anonymisés|Publication open data|
|Métadonnées open data|DCAT|Standard européen|



## **Intégrations et systèmes connexes** 

Page 43 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

- **Outil de BI (Power BI, Metabase, Apache Superset) :** Visualisation et analyse 

- **Plateforme open data :** Mise à disposition publique 

- **DGI, INSEED, douanes :** Échange de données macroéconomiques 

## **Indicateurs de performance** 

- Nombre de jeux de données publiés (cible : 30 à 24 mois) 

- Nombre de téléchargements / appels API par mois 

- Délai de publication de l'observatoire (cible : J+15) 

- Citations de l'observatoire dans la presse économique 

## **Règles métier et contrôles** 

- Toute donnée publiée est anonymisée pour respecter la vie privée et le secret des affaires. 

- Les jeux open data sont publiés sous licence ouverte (équivalent ODbL). 

- Les indicateurs internes sont accessibles selon le rôle et la hiérarchie. 

Page 44 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **S17  Module financier et comptable intégré** 

_Une comptabilité fiable, en temps réel, audit-ready_ 

|**Famille**|SI interne|
|---|---|
|**Bénéficiaires**|Direction financière CCIAMA, agents comptables, auditeurs|
|**Canaux d'accès**|Application interne sécurisée|
|**Délai cible**|**Comptabilisation temps réel**|
|**Phase de déploiement**|Phase 2 — M11|



## **Description du service** 

Système comptable intégré au SI consulaire : chaque acte génère automatiquement les écritures comptables associées (recettes de services, encaissements, factures fournisseurs, paie). Conforme au plan comptable OHADA. Permet la production automatique des états financiers et le suivi budgétaire en temps réel. 

## **Processus utilisateur (parcours type)** 

108. Chaque opération métier (paiement de service, cotisation, etc.) génère une écriture comptable. 

109. Les  factures  fournisseurs  sont  saisies  /  scannées,  soumises  à  workflow d'approbation. 

110. Suivi budgétaire en continu par centre de coût. 

111. Rapprochement bancaire automatique (import des relevés). 

112. Production automatique du grand livre, du bilan, du compte de résultat. 

113. Export pour les commissaires aux comptes et l'État. 

## **Écrans et interfaces** 

- **Écran 1 — Tableau de bord financier :** Trésorerie, recettes, dépenses, alertes. 

- **Écran 2 — Saisie / contrôle d'écritures :** Plan comptable OHADA, contrôles de cohérence. 

- **Écran 3 — Suivi budgétaire :** Réalisé vs prévu par poste, par centre de coût. 

- **Écran 4 — Rapprochement bancaire :** Import des relevés, lettrage assisté. 

- **Écran 5 — États financiers :** Bilan, compte de résultat, annexes. 

## **Données métier manipulées** 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Écriture comptable|Débit/Crédit +<br>comptes|Génération auto + saisie|
|Plan comptable|Référentiel OHADA|Standard|
|Budget|Lignes par centre de<br>coût|Budget annuel validé|
|Relevés bancaires|Import standardisé|Banques partenaires|



Page 45 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **Intégrations et systèmes connexes** 

- **Plateforme de paiement :** Encaissements automatiques 

- **Banques de la place :** Import des relevés et virements 

- **SIRH :** Comptabilisation des paies 

- **DGI :** Télédéclarations fiscales 

## **Indicateurs de performance** 

- Délai de clôture mensuelle (cible : ≤ 5 jours) 

- Taux d'automatisation des écritures (cible : 80 %) 

- Délai de rapprochement bancaire (cible : J+1) 

- Nombre de redressements en audit (cible : zéro significatif) 

## **Règles métier et contrôles** 

- Conformité stricte au plan comptable OHADA révisé. 

- Aucune écriture ne peut être supprimée : seules les contrepassations sont autorisées. 

- Validation à double clé pour les écritures supérieures à un seuil. 

Page 46 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **S18  Système d'information ressources humaines (SIRH)** 

_Gérer le capital humain de la chambre, en toute fluidité_ 

|**Famille**|SI interne|
|---|---|
|**Bénéficiaires**|Direction des ressources humaines, managers, agents CCIAMA|
|**Canaux d'accès**|Application interne, portail RH self-service, application mobile|
|**Délai cible**|**Self-service immédiat pour la majorité des opérations**|
|**Phase de déploiement**|Phase 2 — M13|



## **Description du service** 

SIRH couvrant le cycle complet de l'agent : recrutement, dossier individuel, paie, congés, formation, évaluation annuelle. Inclut un portail self-service permettant à chaque agent de gérer ses informations, demander un congé, consulter son bulletin, suivre son plan de formation. 

## **Processus utilisateur (parcours type)** 

114. Tenue  du  dossier  de  chaque  agent  (administratif,  contrat,  formation, évaluation). 

115. Workflow de validation des congés et absences (manager + RH). 

116. Calcul automatique de la paie chaque mois, génération des bulletins. 

117. Évaluation annuelle structurée avec objectifs et restitutions. 

118. Plan de formation individuel suivi en lien avec le catalogue de formation. 

## **Écrans et interfaces** 

- **Écran 1 — Mon profil agent :** Self-service : coordonnées, contrat, RIB, ayants droit. 

- **Écran 2 — Mes congés :** Solde, demandes, validation, calendrier équipe. 

- **Écran 3 — Mes bulletins de paie :** Historique téléchargeable, attestations. 

- **Écran 4 — Mon évaluation :** Auto-évaluation, entretien, objectifs annuels. 

- **Écran 5 — Manager :** Validation des congés, vue d'équipe, évaluations à mener. 

- **Écran 6 — DRH :** Pilotage global, masse salariale, recrutements, formations. 

## **Données métier manipulées** 

|**Donnée**|**Type**|**Source / contrôle**|
|---|---|---|
|Dossier agent|Données chiffrées<br>sensibles|RH + agent|
|Contrat|Document structuré|Génération depuis modèle|
|Bulletin de paie|Calcul mensuel|Moteur de paie|
|Congés|Demande +<br>validation|Workflow|
|Évaluation annuelle|Formulaire structuré|Agent + manager|



Page 47 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **Intégrations et systèmes connexes** 

- **Comptabilité :** Comptabilisation des paies 

- **CNPS :** Déclarations sociales 

- **DGI :** Déclarations fiscales sur salaires 

- **Plateforme formation :** Suivi du plan de formation des agents 

## **Indicateurs de performance** 

- Taux d'utilisation du self-service (cible : 90 %) 

- Délai de validation des congés (cible : ≤ 48 h) 

- Taux d'agents évalués annuellement (cible : 100 %) 

- Fiabilité de la paie (cible : < 0,1 % de réclamations) 

## **Règles métier et contrôles** 

- Le dossier agent est conservé selon la durée légale après départ. 

- L'accès aux données salariales individuelles est strictement limité. 

- Tout changement de situation administrative déclenche un contrôle RH. 

Page 48 / 49 

EBENYX  •  Annexe technique — Mai 2026 

_Catalogue détaillé des services — CCIAMA du Tchad_ 

## **Conclusion** 

Les 18 services présentés dans ce catalogue forment un ensemble cohérent, conçu pour répondre  aux  besoins  des  opérateurs  économiques  tchadiens  et  aux  exigences  de modernisation  de  la  CCIAMA.  Leur  déploiement  séquencé  sur  24  mois  respecte  les contraintes opérationnelles, budgétaires et organisationnelles identifiées lors de la phase de cadrage. 

Chaque fiche service constitue la base d'un cahier des charges fonctionnel détaillé qui sera produit lors de la conception détaillée. Les éléments présentés ici (processus, écrans, données, intégrations) seront affinés avec les directions métiers concernées et les utilisateurs finaux dans une démarche de co-construction. 

Les indicateurs de performance définis pour chaque service alimenteront un tableau de bord consolidé permettant de piloter la performance de l'institution dans son ensemble et de démontrer la valeur créée par la digitalisation auprès des partenaires et de l'État. 

_Ce catalogue est un document vivant. Il sera actualisé à chaque étape clé du programme pour refléter les choix de conception et les retours du terrain._ 

Page 49 / 49 

EBENYX  •  Annexe technique — Mai 2026 

