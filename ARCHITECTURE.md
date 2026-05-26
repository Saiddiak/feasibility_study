# 🏗️ Architecture de l'Application d'Étude de Faisabilité

## 📊 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                    UTILISATEUR FINAL                             │
│                   (Navigateur Web)                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   FRONTEND (React 19)                            │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Pages:                                                       ││
│  │ • Home.tsx → Page d'accueil avec login                      ││
│  │ • FeasibilityStudy.tsx → Gestion des études (onglets)      ││
│  │ • GlobalViewComplete.tsx → Vue globale complète (DÉMO)     ││
│  │ • SettingsPage.tsx → Configuration des règles              ││
│  │ • AIAnalysisPage.tsx → Analyse IA                          ││
│  │ • ExportPage.tsx → Export PDF/Excel                        ││
│  └─────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Composants:                                                  ││
│  │ • TreeView → Arborescence interactive                       ││
│  │ • TimelineView → Chronologie/Gantt                          ││
│  │ • MatrixView → Matrice de comparaison                       ││
│  │ • DashboardView → Tableau de bord                           ││
│  │ • RisksView → Gestion des risques                           ││
│  │ • ControlBar → Thème et langue                              ││
│  └─────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Contextes:                                                   ││
│  │ • ThemeContext → Gestion du thème clair/sombre              ││
│  │ • LanguageContext → Support multilingue FR/EN               ││
│  └─────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ tRPC Client (client/src/lib/trpc.ts):                       ││
│  │ • Appelle les procédures du backend                         ││
│  │ • Gère le cache et la synchronisation                       ││
│  │ • Superjson pour les types complexes                        ││
│  └─────────────────────────────────────────────────────────────┘│
└────────────────────────┬────────────────────────────────────────┘
                         │
              ┌──────────┴──────────┐
              │ HTTP/tRPC           │
              │ /api/trpc/*         │
              ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (Express + tRPC)                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Routers tRPC (server/routers.ts):                           ││
│  │ • auth.* → Authentification Manus OAuth                     ││
│  │ • studies.* → CRUD des études                               ││
│  │ • options.* → CRUD des options                              ││
│  │ • posts.* → CRUD des postes                                 ││
│  │ • actions.* → CRUD des actions                              ││
│  │ • risks.* → CRUD des risques                                ││
│  │ • alerts.* → CRUD des alertes                               ││
│  │ • scoring.* → Calculs de scores                             ││
│  │ • calculations.* → Règles et seuils                         ││
│  │ • export.* → Export PDF/Excel                               ││
│  │ • ai.* → Analyse IA                                         ││
│  │ • demoData.* → Données de démonstration                     ││
│  └─────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Services Backend:                                            ││
│  │ • db.ts → Helpers de base de données                        ││
│  │ • scoring.ts → Calculs des scores                           ││
│  │ • calculations.ts → Règles et seuils                        ││
│  │ • export.service.ts → Génération d'exports                 ││
│  │ • ai.service.ts → Analyse IA                                ││
│  └─────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Authentification:                                            ││
│  │ • server/_core/oauth.ts → Manus OAuth                       ││
│  │ • server/_core/context.ts → Contexte utilisateur            ││
│  │ • Protections: publicProcedure, protectedProcedure          ││
│  └─────────────────────────────────────────────────────────────┘│
└────────────────────────┬────────────────────────────────────────┘
                         │
              ┌──────────┴──────────┐
              │ SQL Queries         │
              │ Drizzle ORM         │
              ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BASE DE DONNÉES (MySQL)                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Tables:                                                      ││
│  │ • users → Utilisateurs (Manus OAuth)                        ││
│  │ • studies → Études de faisabilité                           ││
│  │ • options → Solutions/Options                               ││
│  │ • posts → Étapes/Phases                                     ││
│  │ • actions → Tâches concrètes                                ││
│  │ • action_dependencies → Dépendances entre actions           ││
│  │ • risks → Risques identifiés                                ││
│  │ • alerts → Alertes automatiques                             ││
│  │ • status_rules → Règles de statuts configurables            ││
│  │ • alert_thresholds → Seuils d'alertes                       ││
│  │ • evaluation_criteria → Critères d'évaluation               ││
│  │ • ai_analyses → Résultats d'analyses IA                     ││
│  │ • translations → Textes multilingues                        ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flux de Données

### 1️⃣ **Affichage de la Vue Globale**

```
Utilisateur accède à /demo
         │
         ▼
GlobalViewComplete.tsx charge
         │
         ├─► demo.getStudyData() [tRPC]
         │   └─► Retourne: 5 options, 12 postes, 24 actions
         │
         ├─► demo.getAlerts() [tRPC]
         │   └─► Retourne: alertes automatiques
         │
         ├─► demo.getStatusRules() [tRPC]
         │   └─► Retourne: règles de statuts
         │
         └─► Affiche la vue complète avec tous les éléments
```

### 2️⃣ **Création d'une Étude**

```
Utilisateur clique "Nouvelle Étude"
         │
         ▼
FeasibilityStudy.tsx → studies.create() [tRPC]
         │
         ▼
Backend: createStudy(title, description)
         │
         ├─► Insère dans DB: studies
         ├─► Crée les critères d'évaluation par défaut
         └─► Retourne: étude créée
         │
         ▼
Frontend: Affiche l'étude dans la liste
```

### 3️⃣ **Ajout d'une Option**

```
Utilisateur clique "Ajouter Option"
         │
         ▼
TreeView.tsx → options.create() [tRPC]
         │
         ▼
Backend: createOption(studyId, title, description)
         │
         ├─► Insère dans DB: options
         ├─► Calcule le score initial (0)
         └─► Retourne: option créée
         │
         ▼
Frontend: Ajoute l'option à l'arborescence
         │
         ▼
Calculs automatiques:
         ├─► Score total = moyenne des scores des postes
         └─► Statut = applique les règles
```

### 4️⃣ **Ajout d'une Action**

```
Utilisateur clique "Ajouter Action" sous un poste
         │
         ▼
TreeView.tsx → actions.create() [tRPC]
         │
         ▼
Backend: createAction(postId, title, cost, days, ...)
         │
         ├─► Insère dans DB: actions
         ├─► Calcule le score de l'action
         └─► Retourne: action créée
         │
         ▼
Frontend: Ajoute l'action à l'arborescence
         │
         ▼
Calculs en cascade:
         ├─► Score du poste = moyenne des scores des actions
         ├─► Score de l'option = moyenne des scores des postes
         ├─► Vérification des seuils d'alertes
         └─► Mise à jour des statuts
```

### 5️⃣ **Calcul des Scores**

```
Quand une action est modifiée:
         │
         ▼
calculateActionScore(action)
         │
         ├─► Impact × 40% = score impact
         ├─► Faisabilité × 20% = score faisabilité
         ├─► (Coût + Délai) × 20% = score coût-temps
         ├─► Risque × 10% = score risque
         ├─► Réversibilité × 10% = score réversibilité
         │
         ▼
Score final = somme pondérée
         │
         ▼
Applique les règles de statuts:
         ├─► Si score > 70 → "Favorable"
         ├─► Si score 40-70 → "Risqué"
         └─► Si score < 40 → "Bloquant"
         │
         ▼
Vérifie les seuils d'alertes:
         ├─► Coût > seuil → Alerte "Coût dépassé"
         ├─► Délai > seuil → Alerte "Délai critique"
         └─► Score < seuil → Alerte "Score insuffisant"
```

### 6️⃣ **Export du Rapport**

```
Utilisateur clique "Exporter en PDF"
         │
         ▼
ExportPage.tsx → export.generatePDF() [tRPC]
         │
         ▼
Backend: generatePDFReport(studyId)
         │
         ├─► Récupère toutes les données de l'étude
         ├─► Génère les graphiques
         ├─► Formate le rapport
         └─► Retourne: fichier PDF
         │
         ▼
Frontend: Télécharge le fichier
```

### 7️⃣ **Analyse IA**

```
Utilisateur clique "Analyser avec IA"
         │
         ▼
AIAnalysisPage.tsx → ai.analyzeStudy() [tRPC]
         │
         ▼
Backend: analyzeStudyWithAI(studyId)
         │
         ├─► Récupère les données de l'étude
         ├─► Envoie à l'API IA (LLM)
         ├─► Analyse:
         │   ├─► Meilleure option
         │   ├─► Risques cachés
         │   ├─► Recommandations
         │   └─► Résumé exécutif
         │
         └─► Retourne: résultats d'analyse
         │
         ▼
Frontend: Affiche les résultats
```

---

## 🎯 Flux d'Authentification

```
Utilisateur clique "Se connecter"
         │
         ▼
Redirection vers Manus OAuth
         │
         ▼
Utilisateur se connecte
         │
         ▼
Redirection vers /api/oauth/callback
         │
         ▼
Backend: Valide le token OAuth
         │
         ├─► Récupère les infos utilisateur
         ├─► Crée/Met à jour dans DB
         └─► Crée un session cookie
         │
         ▼
Frontend: Utilisateur connecté
         │
         ▼
Accès aux pages protégées (FeasibilityStudy)
```

---

## 📁 Structure des Fichiers

```
feasibility_study/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Page d'accueil
│   │   │   ├── FeasibilityStudy.tsx # Gestion des études
│   │   │   ├── GlobalViewComplete.tsx # Vue globale (DÉMO)
│   │   │   ├── SettingsPage.tsx    # Paramètres
│   │   │   ├── AIAnalysisPage.tsx  # Analyse IA
│   │   │   └── ExportPage.tsx      # Export
│   │   ├── components/
│   │   │   ├── TreeView.tsx        # Arborescence
│   │   │   ├── TimelineView.tsx    # Chronologie
│   │   │   ├── MatrixView.tsx      # Matrice
│   │   │   ├── DashboardView.tsx   # Dashboard
│   │   │   ├── RisksView.tsx       # Risques
│   │   │   └── ControlBar.tsx      # Thème/Langue
│   │   ├── contexts/
│   │   │   ├── ThemeContext.tsx    # Thème
│   │   │   └── LanguageContext.tsx # Langue
│   │   ├── lib/
│   │   │   └── trpc.ts             # Client tRPC
│   │   └── index.css               # Styles blueprint
│   └── index.html
│
├── server/                          # Backend Express + tRPC
│   ├── routers.ts                  # Tous les routers tRPC
│   ├── db.ts                       # Helpers de base de données
│   ├── scoring.ts                  # Calculs de scores
│   ├── calculations.ts             # Règles et seuils
│   ├── export.service.ts           # Export PDF/Excel
│   ├── export.router.ts            # Router export
│   ├── ai.service.ts               # Analyse IA
│   ├── ai.router.ts                # Router IA
│   ├── demo-data.router.ts         # Données de démo
│   ├── _core/
│   │   ├── index.ts                # Serveur Express
│   │   ├── oauth.ts                # Manus OAuth
│   │   ├── context.ts              # Contexte utilisateur
│   │   ├── trpc.ts                 # Configuration tRPC
│   │   └── llm.ts                  # API LLM
│   └── *.test.ts                   # Tests Vitest
│
├── drizzle/                         # Schéma et migrations
│   ├── schema.ts                   # Définition des tables
│   └── migrations/                 # Fichiers SQL
│
├── shared/                          # Code partagé
│   ├── const.ts                    # Constantes
│   └── types.ts                    # Types TypeScript
│
└── package.json                     # Dépendances
```

---

## 🔌 Technologies Utilisées

| Couche | Technologie | Rôle |
|--------|-------------|------|
| **Frontend** | React 19 | Framework UI |
| | Tailwind CSS 4 | Styles |
| | tRPC | Communication client-serveur |
| | Recharts | Graphiques |
| | Wouter | Routage |
| **Backend** | Express 4 | Serveur HTTP |
| | tRPC 11 | API RPC typée |
| | Drizzle ORM | Accès base de données |
| **Base de données** | MySQL | Stockage des données |
| | Drizzle Kit | Migrations |
| **Authentification** | Manus OAuth | Login utilisateur |
| **Tests** | Vitest | Tests unitaires |
| **Autres** | TypeScript | Typage statique |
| | Superjson | Sérialisation avancée |

---

## 🚀 Déploiement

```
Code local
    │
    ▼
Git push
    │
    ▼
Manus Platform
    │
    ├─► Build frontend (Vite)
    ├─► Build backend (esbuild)
    ├─► Déploie sur Cloud Run
    ├─► Crée la base de données
    └─► Attribue un domaine
    │
    ▼
Application en ligne
    │
    ▼
https://feasystudy-bjhvlesn.manus.space
```

---

## 📊 Exemple de Flux Complet

```
1. Utilisateur accède à /demo
   └─► Voir la vue globale avec données mockées

2. Utilisateur se connecte
   └─► Redirection vers /study

3. Utilisateur crée une étude
   └─► studies.create() → Étude créée

4. Utilisateur ajoute 5 options
   └─► options.create() × 5 → Options créées

5. Utilisateur ajoute des postes et actions
   └─► posts.create() + actions.create() → Hiérarchie créée

6. Calculs automatiques
   └─► Scores calculés, statuts appliqués, alertes générées

7. Utilisateur exporte le rapport
   └─► export.generatePDF() → PDF téléchargé

8. Utilisateur demande une analyse IA
   └─► ai.analyzeStudy() → Recommandations reçues
```

---

**Résumé** : L'application est une **plateforme web complète** avec frontend React, backend Express + tRPC, base de données MySQL, authentification OAuth, et calculs automatiques. Tout est typé avec TypeScript et testé avec Vitest. 🎯
