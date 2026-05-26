# 🔗 Comment le Programme est Fait - Schéma Simple

## Vue d'ensemble en 3 parties

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                        │
│  UTILISATEUR (Navigateur Web)                                        │
│  https://feasystudy-bjhvlesn.manus.space/demo                       │
│                                                                        │
└─────────────────────────────┬──────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              │ (tRPC API calls)
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│                          BACKEND (Node.js)                            │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ Express Server (http://localhost:3000)                         │  │
│  │                                                                 │  │
│  │ Reçoit les requêtes du frontend                               │  │
│  │ Exécute la logique métier                                     │  │
│  │ Communique avec la base de données                            │  │
│  │ Retourne les données au frontend                              │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ tRPC Routers (Procédures)                                      │  │
│  │                                                                 │  │
│  │ • studies.create() → Crée une étude                           │  │
│  │ • options.create() → Crée une option                          │  │
│  │ • actions.create() → Crée une action                          │  │
│  │ • demo.getStudyData() → Récupère les données de démo          │  │
│  │ • scoring.calculateScores() → Calcule les scores              │  │
│  │ • export.generatePDF() → Génère un PDF                        │  │
│  │ • ai.analyzeStudy() → Lance une analyse IA                    │  │
│  │                                                                 │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
└─────────────────────────────┬──────────────────────────────────────┘
                              │
                              │ SQL Queries
                              │ (Drizzle ORM)
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     BASE DE DONNÉES (MySQL)                           │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ Tables:                                                         │  │
│  │                                                                 │  │
│  │ • users → Utilisateurs connectés                              │  │
│  │ • studies → Études de faisabilité                             │  │
│  │ • options → Solutions/Options                                 │  │
│  │ • posts → Étapes/Phases du projet                             │  │
│  │ • actions → Tâches concrètes                                  │  │
│  │ • risks → Risques identifiés                                  │  │
│  │ • alerts → Alertes automatiques                               │  │
│  │ • status_rules → Règles de statuts                            │  │
│  │ • alert_thresholds → Seuils d'alertes                         │  │
│  │ • evaluation_criteria → Critères d'évaluation                 │  │
│  │ • ai_analyses → Résultats d'analyses IA                       │  │
│  │                                                                 │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 📱 Exemple Concret : Créer une Option

### Étape 1 : L'utilisateur clique sur "Ajouter Option"

```
┌─────────────────────────────────────────────┐
│ INTERFACE (React)                            │
│                                              │
│ Utilisateur clique:                          │
│ [+ Ajouter Option]                           │
│                                              │
│ Le code React appelle:                       │
│ trpc.options.create.useMutation({            │
│   title: "Solution A",                       │
│   description: "Première option"             │
│ })                                           │
│                                              │
└──────────────┬──────────────────────────────┘
               │
               │ Envoie une requête HTTP
               │ POST /api/trpc/options.create
               │ Avec les données JSON
               │
               ▼
┌─────────────────────────────────────────────┐
│ BACKEND (Express + tRPC)                     │
│                                              │
│ Reçoit la requête                            │
│                                              │
│ Exécute la procédure:                        │
│ options.create = async (input) => {          │
│   // Valide les données                      │
│   // Prépare l'insertion                     │
│   // Appelle la base de données              │
│   return result;                             │
│ }                                            │
│                                              │
└──────────────┬──────────────────────────────┘
               │
               │ Exécute une requête SQL
               │ INSERT INTO options (...)
               │ VALUES (...)
               │
               ▼
┌─────────────────────────────────────────────┐
│ BASE DE DONNÉES (MySQL)                      │
│                                              │
│ Reçoit la requête SQL                        │
│                                              │
│ Insère dans la table 'options':              │
│ ┌─────────────────────────────────────────┐ │
│ │ ID | Title      | Description           │ │
│ ├─────────────────────────────────────────┤ │
│ │ 1  | Solution A | Première option       │ │
│ │ 2  | Solution B | Deuxième option       │ │
│ │ 3  | Solution C | Troisième option      │ │
│ └─────────────────────────────────────────┘ │
│                                              │
│ Retourne: ID = 3                             │
│                                              │
└──────────────┬──────────────────────────────┘
               │
               │ Retourne le résultat
               │ { id: 3, title: "Solution C", ... }
               │
               ▼
┌─────────────────────────────────────────────┐
│ BACKEND (Express + tRPC)                     │
│                                              │
│ Reçoit la réponse de la BD                   │
│ Retourne les données au frontend             │
│                                              │
└──────────────┬──────────────────────────────┘
               │
               │ Envoie la réponse HTTP
               │ { id: 3, title: "Solution C" }
               │
               ▼
┌─────────────────────────────────────────────┐
│ INTERFACE (React)                            │
│                                              │
│ Reçoit la réponse                            │
│                                              │
│ Met à jour l'écran:                          │
│ ✓ Ajoute "Solution C" à la liste             │
│ ✓ Affiche le nouvel ID (3)                   │
│ ✓ Montre un message de succès                │
│                                              │
│ L'utilisateur voit:                          │
│ [✓] Solution A (ID: 1)                       │
│ [✓] Solution B (ID: 2)                       │
│ [✓] Solution C (ID: 3) ← NOUVEAU             │
│                                              │
└─────────────────────────────────────────────┘
```

---

## 🔄 Flux Complet : Afficher les Données

### Quand l'utilisateur accède à `/demo`

```
1. INTERFACE charge
   └─► React charge GlobalViewComplete.tsx

2. INTERFACE appelle le BACKEND
   └─► trpc.demo.getStudyData.useQuery()
   
3. BACKEND reçoit la requête
   └─► Exécute: demo.getStudyData()
   
4. BACKEND interroge la BASE DE DONNÉES
   ├─► SELECT * FROM studies
   ├─► SELECT * FROM options
   ├─► SELECT * FROM posts
   ├─► SELECT * FROM actions
   └─► SELECT * FROM risks
   
5. BASE DE DONNÉES retourne les données
   └─► Toutes les lignes des tables
   
6. BACKEND traite les données
   ├─► Formate les résultats
   ├─► Calcule les scores
   ├─► Applique les règles
   └─► Retourne au frontend
   
7. INTERFACE reçoit les données
   └─► Affiche la vue globale complète
```

---

## 💾 Où sont stockées les données ?

### Exemple : Table "options"

```
BASE DE DONNÉES (MySQL)
│
├─► Fichier: /var/lib/mysql/feasibility_study/options.ibd
│
├─► Contenu:
│   ┌─────────────────────────────────────────────────────────┐
│   │ ID │ StudyID │ Title      │ Score │ Status   │ CreatedAt │
│   ├─────────────────────────────────────────────────────────┤
│   │ 1  │ 1       │ Solution A │ 72    │ Favorable│ 2026-05-26│
│   │ 2  │ 1       │ Solution B │ 65    │ Risky    │ 2026-05-26│
│   │ 3  │ 1       │ Solution C │ 48    │ Risky    │ 2026-05-26│
│   └─────────────────────────────────────────────────────────┘
│
└─► Persiste même si le serveur redémarre
```

---

## 🔌 Comment les 3 parties communiquent ?

### 1. Interface → Backend

```javascript
// Dans React (client/src/pages/GlobalViewComplete.tsx)
const { data } = trpc.demo.getStudyData.useQuery();

// Cela envoie:
// POST /api/trpc/demo.getStudyData
// Headers: { "Content-Type": "application/json" }
// Body: {}
```

### 2. Backend → Base de Données

```typescript
// Dans le backend (server/demo-data.router.ts)
export const demoDataRouter = router({
  getStudyData: publicProcedure.query(async ({ ctx }) => {
    // Utilise Drizzle ORM pour interroger la BD
    const studies = await db.select().from(studies_table);
    const options = await db.select().from(options_table);
    
    // Retourne les données
    return { studies, options };
  }),
});
```

### 3. Base de Données → Backend

```sql
-- La requête SQL exécutée par Drizzle:
SELECT * FROM studies;
SELECT * FROM options WHERE studyId = 1;
SELECT * FROM posts WHERE optionId = 1;

-- Résultat retourné au backend:
[
  { id: 1, title: "Solution A", score: 72 },
  { id: 2, title: "Solution B", score: 65 }
]
```

### 4. Backend → Interface

```json
// Le backend retourne au frontend:
{
  "result": {
    "data": {
      "studies": [...],
      "options": [...],
      "posts": [...],
      "actions": [...]
    }
  }
}
```

---

## 📊 Résumé Visuel

```
┌─────────────┐
│  INTERFACE  │  ← Utilisateur voit et clique
│  (React)    │
└──────┬──────┘
       │ HTTP JSON
       │ /api/trpc/*
       ▼
┌─────────────┐
│  BACKEND    │  ← Logique métier
│  (Express)  │  ← Calculs
│  (tRPC)     │  ← Validations
└──────┬──────┘
       │ SQL
       │ SELECT/INSERT/UPDATE/DELETE
       ▼
┌─────────────┐
│  BASE DE    │  ← Données persistantes
│  DONNÉES    │  ← Tables MySQL
│  (MySQL)    │
└─────────────┘
```

---

## 🎯 Exemple Complet : Ajouter une Action

### 1. Utilisateur remplit le formulaire
```
Titre: "Analyser faisabilité"
Coût: 5000 €
Délai: 5 jours
Impact: 8/10
Faisabilité: 9/10
```

### 2. Utilisateur clique "Ajouter"
```javascript
// Interface (React)
trpc.actions.create.useMutation({
  postId: 1,
  title: "Analyser faisabilité",
  cost: 5000,
  days: 5,
  impact: 8,
  feasibility: 9
})
```

### 3. Backend reçoit et traite
```typescript
// Backend (Express + tRPC)
actions.create = protectedProcedure
  .input(createActionSchema)
  .mutation(async ({ input, ctx }) => {
    // Valide les données
    // Calcule le score
    const score = calculateScore(input);
    
    // Insère dans la BD
    const result = await db.insert(actions).values({
      postId: input.postId,
      title: input.title,
      cost: input.cost,
      days: input.days,
      score: score
    });
    
    // Retourne au frontend
    return result;
  })
```

### 4. Backend interroge la BD
```sql
INSERT INTO actions (postId, title, cost, days, score, createdAt)
VALUES (1, 'Analyser faisabilité', 5000, 5, 8.5, NOW());
```

### 5. Base de données stocke
```
Table: actions
┌────┬────────┬──────────────────────┬──────┬──────┬───────┐
│ ID │ PostID │ Title                │ Cost │ Days │ Score │
├────┬────────┬──────────────────────┬──────┬──────┬───────┤
│ 1  │ 1      │ Analyser faisabilité │ 5000 │ 5    │ 8.5   │
└────┴────────┴──────────────────────┴──────┴──────┴───────┘
```

### 6. Backend retourne le résultat
```json
{
  "id": 1,
  "postId": 1,
  "title": "Analyser faisabilité",
  "cost": 5000,
  "days": 5,
  "score": 8.5,
  "createdAt": "2026-05-26T10:00:00Z"
}
```

### 7. Interface affiche
```
✓ Action créée avec succès !

Poste 1.1 - Recherche techno
├─ [✓] Analyser faisabilité (Score: 8.5/10)
├─ [ ] Veille & benchmark
└─ [ ] Identifier partenaires
```

---

## 🚀 Résumé

| Partie | Rôle | Technologie |
|--------|------|-------------|
| **Interface** | Affiche les données, capture les clics | React + TypeScript |
| **Backend** | Reçoit les requêtes, exécute la logique | Express + tRPC + TypeScript |
| **Base de données** | Stocke les données de manière persistante | MySQL + Drizzle ORM |

**Le flux** : Interface → Backend → Base de données → Backend → Interface ✅
