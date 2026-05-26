# 📁 Structure des Fichiers - Groupés par Fonction

## 🎯 Vue d'ensemble

Le programme est organisé en **6 groupes principaux** qui répondent à des besoins spécifiques :

```
┌─────────────────────────────────────────────────────────────┐
│ 1️⃣ AUTHENTIFICATION & UTILISATEURS                          │
│ 2️⃣ INTERFACE UTILISATEUR (Frontend)                         │
│ 3️⃣ LOGIQUE MÉTIER (Backend)                                 │
│ 4️⃣ BASE DE DONNÉES                                          │
│ 5️⃣ SERVICES AVANCÉS (Export, IA, Calculs)                  │
│ 6️⃣ CONFIGURATION & DÉPLOIEMENT                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 1️⃣ AUTHENTIFICATION & UTILISATEURS

### 📍 Localisation
```
server/_core/oauth.ts
server/_core/context.ts
server/_core/cookies.ts
client/src/_core/hooks/useAuth.ts
```

### 🎯 Objectif
Gérer la **connexion des utilisateurs** via Manus OAuth et maintenir les **sessions actives**.

### 📋 Rôle de chaque fichier

| Fichier | Rôle |
|---------|------|
| `oauth.ts` | Gère le flux OAuth (connexion, callback, tokens) |
| `context.ts` | Crée le contexte utilisateur pour chaque requête |
| `cookies.ts` | Gère les cookies de session (création, suppression) |
| `useAuth.ts` | Hook React pour accéder à l'utilisateur connecté |

### 💡 Exemple d'utilisation
```typescript
// Dans React
const { user, logout } = useAuth();
// Retourne: { id, email, name, role, ... }

// Dans le backend
const user = ctx.user; // Automatiquement injecté par tRPC
```

### ✅ Résultat
- ✓ Utilisateurs authentifiés via Manus OAuth
- ✓ Sessions persistantes avec cookies
- ✓ Accès à l'utilisateur dans tous les routers tRPC
- ✓ Logout automatique

---

## 2️⃣ INTERFACE UTILISATEUR (Frontend)

### 📍 Localisation
```
client/src/
├── pages/                    # Pages principales
├── components/               # Composants réutilisables
├── contexts/                 # Contextes React (Thème, Langue)
├── hooks/                    # Hooks personnalisés
├── lib/                      # Utilitaires (tRPC client)
└── index.css                 # Styles globaux
```

### 🎯 Objectif
Afficher une **interface professionnelle** pour que l'utilisateur puisse :
- Créer et gérer des études de faisabilité
- Visualiser les options, postes, actions
- Voir les alertes et risques
- Exporter les rapports

### 📋 Structure détaillée

#### **Pages** (Vues principales)
```
pages/
├── Home.tsx                  # Page d'accueil
├── FeasibilityStudy.tsx      # Gestion des études (onglets)
├── GlobalViewComplete.tsx    # Vue globale avec données réelles
├── SettingsPage.tsx          # Configuration des règles
├── AIAnalysisPage.tsx        # Analyse IA
└── ExportPage.tsx            # Export PDF/Excel
```

**Rôle** : Chaque page affiche une vue différente de l'application

#### **Composants** (Éléments réutilisables)
```
components/
├── TreeView.tsx              # Arborescence interactive
├── TimelineView.tsx          # Chronologie/Gantt
├── MatrixView.tsx            # Matrice de comparaison
├── DashboardView.tsx         # Tableau de bord
├── RisksView.tsx             # Gestion des risques
├── ControlBar.tsx            # Barre de contrôle (thème, langue)
└── DashboardLayout.tsx       # Layout principal
```

**Rôle** : Composants réutilisables pour afficher les données

#### **Contextes** (État global)
```
contexts/
├── ThemeContext.tsx          # Gestion du thème (clair/sombre)
└── LanguageContext.tsx       # Gestion de la langue (FR/EN)
```

**Rôle** : Partager l'état entre les composants sans passer de props

#### **Hooks** (Logique réutilisable)
```
hooks/
├── useComposition.ts         # Composition de composants
├── useMobile.tsx             # Détection mobile
└── usePersistFn.ts           # Fonction persistante
```

**Rôle** : Logique réutilisable entre composants

#### **Styles**
```
index.css                      # Thème blueprint architectural
                               # Couleurs, typographie, animations
```

**Rôle** : Style global avec variables CSS pour le thème

### 💡 Flux de données
```
User clicks → Component → useQuery/useMutation → Backend → Database
                ↓
         Display result
```

### ✅ Résultat
- ✓ Interface professionnelle blueprint
- ✓ Thème clair/sombre commutable
- ✓ Multilingue (FR/EN)
- ✓ Responsive et accessible
- ✓ Données synchronisées en temps réel

---

## 3️⃣ LOGIQUE MÉTIER (Backend)

### 📍 Localisation
```
server/
├── routers.ts                # Procédures tRPC principales
├── scoring.router.ts         # Calculs de scores
├── calculations.router.ts    # Règles et seuils
├── export.router.ts          # Export PDF/Excel
├── ai.router.ts              # Analyse IA
└── demo-data.router.ts       # Données de démonstration
```

### 🎯 Objectif
Traiter les **requêtes du frontend** et exécuter la **logique métier** :
- Créer/modifier/supprimer des options, postes, actions
- Calculer les scores automatiquement
- Appliquer les règles de statuts
- Générer les exports
- Analyser avec l'IA

### 📋 Structure détaillée

#### **Routers** (Procédures tRPC)
```typescript
// routers.ts - Procédures principales
router({
  auth: { me, logout },           // Authentification
  studies: { create, list, get },  // Gestion des études
  options: { create, list, get },  // Gestion des options
  posts: { create, list, get },    // Gestion des postes
  actions: { create, list, get },  // Gestion des actions
  risks: { create, list, get },    // Gestion des risques
  scoring: { ... },                // Calculs de scores
  export: { ... },                 // Export des rapports
  ai: { ... }                      // Analyse IA
})
```

**Rôle** : Définir les procédures disponibles (comme des API endpoints)

#### **Scoring Router**
```typescript
// scoring.router.ts
scoring: {
  calculateScores(),     // Calcule les scores des options
  applyStatusRules(),    // Applique les règles de statuts
  checkAlertThresholds() // Vérifie les seuils d'alertes
}
```

**Rôle** : Calculs automatiques des scores et alertes

#### **Calculations Router**
```typescript
// calculations.router.ts
calculations: {
  createStatusRule(),    // Crée une règle de statut
  updateStatusRule(),    // Modifie une règle
  deleteStatusRule(),    // Supprime une règle
  createAlertThreshold() // Crée un seuil d'alerte
}
```

**Rôle** : Gestion des règles configurables

#### **Export Router**
```typescript
// export.router.ts
export: {
  generateCSV(),         // Exporte en CSV
  generateJSON(),        // Exporte en JSON
  generateExecutiveSummary() // Résumé exécutif
}
```

**Rôle** : Génération des rapports

#### **AI Router**
```typescript
// ai.router.ts
ai: {
  analyzeStudy(),        // Analyse complète
  suggestBestOption(),   // Suggère la meilleure option
  detectRisks(),         // Détecte les risques cachés
  generateSummary()      // Génère un résumé
}
```

**Rôle** : Analyse IA des données

### 💡 Flux de traitement
```
Frontend appelle → tRPC Router → Service métier → Base de données
                                    ↓
                            Calculs/Validations
                                    ↓
                            Retour au Frontend
```

### ✅ Résultat
- ✓ Procédures tRPC bien organisées
- ✓ Logique métier centralisée
- ✓ Calculs automatiques
- ✓ Règles configurables
- ✓ Export et IA intégrés

---

## 4️⃣ BASE DE DONNÉES

### 📍 Localisation
```
drizzle/
├── schema.ts                 # Définition des tables
├── migrations/               # Migrations SQL
└── relations.ts              # Relations entre tables
```

### 🎯 Objectif
Définir la **structure des données** et les **tables** pour stocker :
- Les études de faisabilité
- Les options, postes, actions
- Les risques et alertes
- Les règles et critères
- Les analyses IA

### 📋 Structure des tables

| Table | Rôle |
|-------|------|
| `users` | Utilisateurs connectés |
| `studies` | Études de faisabilité |
| `options` | Solutions/Options à évaluer |
| `posts` | Étapes/Phases du projet |
| `actions` | Tâches concrètes |
| `action_dependencies` | Dépendances entre actions |
| `risks` | Risques identifiés |
| `alerts` | Alertes automatiques |
| `status_rules` | Règles de statuts configurables |
| `alert_thresholds` | Seuils d'alertes configurables |
| `evaluation_criteria` | Critères d'évaluation |
| `ai_analyses` | Résultats d'analyses IA |

### 💡 Exemple de table

```sql
CREATE TABLE options (
  id INT PRIMARY KEY AUTO_INCREMENT,
  studyId INT NOT NULL,
  title VARCHAR(255),
  description TEXT,
  costScore INT,
  delayScore INT,
  feasibilityScore INT,
  status ENUM('favorable', 'risky', 'blocked'),
  createdAt TIMESTAMP DEFAULT NOW()
);
```

### ✅ Résultat
- ✓ 12 tables bien structurées
- ✓ Relations entre tables définies
- ✓ Données persistantes
- ✓ Migrations versionnées

---

## 5️⃣ SERVICES AVANCÉS

### 📍 Localisation
```
server/
├── db.ts                     # Helpers de base de données
├── scoring.ts                # Logique de calcul des scores
├── calculations.ts           # Logique des règles
├── export.service.ts         # Service d'export
├── ai.service.ts             # Service d'analyse IA
└── storage.ts                # Gestion du stockage S3
```

### 🎯 Objectif
Fournir des **services réutilisables** pour :
- Interroger la base de données
- Calculer les scores
- Générer les exports
- Analyser avec l'IA
- Stocker les fichiers

### 📋 Structure détaillée

#### **db.ts** - Helpers de base de données
```typescript
// Fonctions pour interroger la BD
export async function getStudiesForUser(userId)
export async function getOptionsForStudy(studyId)
export async function getActionsForPost(postId)
export async function createOption(data)
export async function updateOption(id, data)
export async function deleteOption(id)
```

**Rôle** : Centraliser les requêtes SQL pour éviter la duplication

#### **scoring.ts** - Logique de calcul
```typescript
// Fonctions pour calculer les scores
export function calculateOptionScore(option)
export function calculatePostScore(post)
export function calculateActionScore(action)
export function applyStatusRules(option)
export function checkAlertThresholds(option)
```

**Rôle** : Formules de calcul des scores et statuts

#### **calculations.ts** - Logique des règles
```typescript
// Fonctions pour gérer les règles
export async function createStatusRule(rule)
export async function updateStatusRule(id, rule)
export async function deleteStatusRule(id)
export async function getStatusRules(studyId)
```

**Rôle** : Gestion des règles configurables

#### **export.service.ts** - Service d'export
```typescript
// Fonctions pour générer les exports
export async function generateCSV(studyId)
export async function generateJSON(studyId)
export async function generateExecutiveSummary(studyId)
```

**Rôle** : Génération des rapports en différents formats

#### **ai.service.ts** - Service d'analyse IA
```typescript
// Fonctions pour analyser avec l'IA
export async function analyzeStudy(studyId)
export async function suggestBestOption(studyId)
export async function detectRisks(studyId)
export async function generateSummary(studyId)
```

**Rôle** : Utilise l'API LLM pour analyser les données

#### **storage.ts** - Gestion du stockage
```typescript
// Fonctions pour stocker les fichiers
export async function storagePut(key, data, contentType)
export async function storageGet(key)
```

**Rôle** : Upload/téléchargement de fichiers sur S3

### ✅ Résultat
- ✓ Services réutilisables
- ✓ Logique métier centralisée
- ✓ Pas de duplication de code
- ✓ Facile à tester et maintenir

---

## 6️⃣ CONFIGURATION & DÉPLOIEMENT

### 📍 Localisation
```
├── package.json              # Dépendances et scripts
├── tsconfig.json             # Configuration TypeScript
├── vite.config.ts            # Configuration Vite (frontend)
├── drizzle.config.ts         # Configuration Drizzle
├── vitest.config.ts          # Configuration des tests
├── .env                       # Variables d'environnement
└── server/_core/env.ts       # Validation des env vars
```

### 🎯 Objectif
Configurer l'application pour :
- **Développement** : Hot reload, debugging
- **Tests** : Vitest avec couverture
- **Production** : Build optimisé, déploiement

### 📋 Fichiers clés

| Fichier | Rôle |
|---------|------|
| `package.json` | Dépendances npm, scripts (dev, build, test) |
| `tsconfig.json` | Configuration TypeScript (strict mode) |
| `vite.config.ts` | Configuration Vite (bundler frontend) |
| `drizzle.config.ts` | Configuration Drizzle (ORM) |
| `vitest.config.ts` | Configuration des tests |
| `.env` | Variables d'environnement (secrets) |
| `env.ts` | Validation et typage des env vars |

### 💡 Scripts disponibles
```bash
pnpm dev              # Démarre le serveur de développement
pnpm build            # Build pour la production
pnpm start            # Démarre le serveur de production
pnpm test             # Exécute les tests
pnpm format           # Formate le code
pnpm check            # Vérifie les types TypeScript
```

### ✅ Résultat
- ✓ Configuration centralisée
- ✓ Variables d'environnement sécurisées
- ✓ TypeScript strict
- ✓ Tests automatisés
- ✓ Prêt pour la production

---

## 📊 Résumé des Groupes

```
┌─────────────────────────────────────────────────────────────┐
│ 1️⃣ AUTHENTIFICATION                                         │
│    └─ Gère les utilisateurs et les sessions                │
├─────────────────────────────────────────────────────────────┤
│ 2️⃣ INTERFACE (Frontend)                                     │
│    └─ Affiche les données et capture les clics             │
├─────────────────────────────────────────────────────────────┤
│ 3️⃣ LOGIQUE MÉTIER (Backend)                                │
│    └─ Traite les requêtes et exécute la logique            │
├─────────────────────────────────────────────────────────────┤
│ 4️⃣ BASE DE DONNÉES                                          │
│    └─ Stocke les données de manière persistante            │
├─────────────────────────────────────────────────────────────┤
│ 5️⃣ SERVICES AVANCÉS                                         │
│    └─ Fournit des fonctionnalités réutilisables            │
├─────────────────────────────────────────────────────────────┤
│ 6️⃣ CONFIGURATION & DÉPLOIEMENT                              │
│    └─ Configure l'application pour tous les environnements │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flux Complet

### Exemple : Créer une option

```
1. INTERFACE (Frontend)
   └─ Utilisateur remplit le formulaire et clique "Ajouter"
   
2. LOGIQUE MÉTIER (Backend)
   └─ Reçoit la requête tRPC
   └─ Valide les données
   └─ Calcule les scores (SERVICES)
   
3. BASE DE DONNÉES
   └─ Insère la nouvelle option
   
4. SERVICES AVANCÉS
   └─ Applique les règles de statuts
   └─ Vérifie les seuils d'alertes
   
5. INTERFACE (Frontend)
   └─ Reçoit le résultat
   └─ Met à jour l'affichage
```

---

## 📚 Fichiers de Documentation

```
├── ARCHITECTURE.md              # Architecture complète
├── SCHEMA_SIMPLE.md             # Schéma simple expliqué
├── FILE_STRUCTURE_EXPLAINED.md  # Ce fichier
├── architecture.mmd             # Diagramme Mermaid
└── architecture.png             # Diagramme PNG
```

---

## ✅ Conclusion

L'application est organisée en **6 groupes logiques** qui répondent à des besoins spécifiques :

1. **Authentification** : Sécurité et gestion des utilisateurs
2. **Interface** : Expérience utilisateur professionnelle
3. **Logique métier** : Traitement des requêtes
4. **Base de données** : Stockage des données
5. **Services avancés** : Fonctionnalités réutilisables
6. **Configuration** : Déploiement et environnements

Chaque groupe est **indépendant** mais **interconnecté**, ce qui rend le code :
- ✓ Facile à comprendre
- ✓ Facile à maintenir
- ✓ Facile à tester
- ✓ Facile à étendre
