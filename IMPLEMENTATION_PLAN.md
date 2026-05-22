# Plan d'Implémentation Complet - Étude de Faisabilité

## Phase 1 : Refactorisation du Modèle de Données

### 1.1 Ajouter les champs manquants
- [ ] Ajouter `studyId` à la table `risks` pour lier directement aux études
- [ ] Ajouter `studyId` à la table `milestones` 
- [ ] Ajouter des colonnes de calcul : `costScore`, `delayScore`, `feasibilityScore` aux options
- [ ] Ajouter `thresholdValue` et `operator` aux alertes pour les seuils configurables

### 1.2 Créer les helpers de calcul
- [ ] `calculateOptionScores()` : Calcul coût, délai, faisabilité
- [ ] `applyStatusRules()` : Application des règles de statut
- [ ] `checkAlertThresholds()` : Vérification des seuils d'alertes
- [ ] `recalculateAllScores()` : Recalcul global après changement

## Phase 2 : Système de Règles Configurables

### 2.1 Interface de configuration
- [ ] Créer `RulesConfigView.tsx` avec formulaire pour ajouter/éditer/supprimer règles
- [ ] Interface visuelle pour définir conditions (AND/OR, opérateurs)
- [ ] Aperçu des statuts résultants

### 2.2 Moteur de règles
- [ ] Implémenter `evaluateRules()` côté serveur
- [ ] Mapper les conditions aux champs d'option
- [ ] Appliquer les règles par ordre de priorité

## Phase 3 : Seuils d'Alertes

### 3.1 Interface de configuration
- [ ] Créer `AlertThresholdsConfigView.tsx`
- [ ] Formulaire pour ajouter seuils (coût > X, délai > Y, score < Z)
- [ ] Configuration de la sévérité (info, warning, critical)

### 3.2 Système de notifications
- [ ] Créer `AlertsPanel.tsx` pour afficher les alertes
- [ ] Notifications toast en temps réel
- [ ] Historique des alertes
- [ ] Marquer comme lues/archivées

## Phase 4 : Chronologie Complète

### 4.1 Gantt Chart
- [ ] Utiliser `react-gantt-chart` ou implémenter custom
- [ ] Afficher options sur timeline
- [ ] Afficher jalons (milestones)
- [ ] Afficher dépendances entre actions

### 4.2 Gestion des jalons
- [ ] CRUD des jalons
- [ ] Lier jalons aux actions
- [ ] Gestion des dépendances

## Phase 5 : Matrice Finalisée

### 5.1 Persistance des critères
- [ ] Sauvegarder les critères en base de données
- [ ] CRUD complet des critères
- [ ] Pondération des critères

### 5.2 Scores persistés
- [ ] Sauvegarder les scores option-critère
- [ ] Calcul automatique du classement
- [ ] Édition en ligne des scores

## Phase 6 : Tableau de Bord Avancé

### 6.1 Vraies métriques
- [ ] Coût total réel (somme des actions)
- [ ] Délai total (date fin - date début)
- [ ] Faisabilité moyenne (moyenne des scores)
- [ ] Progression réelle (% actions terminées)

### 6.2 Graphiques avancés
- [ ] Gantt simplifié
- [ ] Courbe de coût cumulé
- [ ] Heatmap risques/options
- [ ] Évolution des statuts dans le temps

## Phase 7 : Gestion des Risques Refactorisée

### 7.1 Refactorisation du modèle
- [ ] Ajouter `studyId` à la table risks
- [ ] Créer migration SQL
- [ ] Mettre à jour les helpers db

### 7.2 Matrice interactive
- [ ] Cliquer sur une cellule pour voir les risques
- [ ] Ajouter/éditer risques directement
- [ ] Calcul automatique du niveau

### 7.3 Plans d'action
- [ ] Lier plans d'action aux risques
- [ ] Suivi du statut de mitigation
- [ ] Assignation des responsables

## Phase 8 : Export PDF et Excel

### 8.1 Export PDF
- [ ] Utiliser `pdfkit` ou `weasyprint`
- [ ] Générer rapport avec toutes les vues
- [ ] Inclure graphiques et tableaux
- [ ] Mise en page professionnelle

### 8.2 Export Excel
- [ ] Utiliser `xlsx`
- [ ] Créer feuilles pour chaque vue
- [ ] Formules de calcul dans Excel
- [ ] Mise en forme

## Phase 9 : Intégration IA

### 9.1 Analyse des données
- [ ] Appeler LLM avec contexte de l'étude
- [ ] Analyser les options
- [ ] Identifier les risques cachés

### 9.2 Suggestions
- [ ] Recommander la meilleure option
- [ ] Proposer des actions correctives
- [ ] Générer résumé exécutif

## Phase 10 : Thème et Multilingue

### 10.1 Thème clair/sombre
- [ ] Ajouter toggle dans header
- [ ] Persister en localStorage
- [ ] Adapter les couleurs blueprint

### 10.2 Multilingue
- [ ] Créer fichiers i18n (FR/EN)
- [ ] Intégrer `react-i18next`
- [ ] Traduire tous les textes

## Phase 11 : Tests et Livraison

### 11.1 Tests unitaires
- [ ] Tests des calculs
- [ ] Tests des règles
- [ ] Tests des alertes

### 11.2 Tests d'intégration
- [ ] Flux complet utilisateur
- [ ] Export PDF/Excel
- [ ] Analyse IA

### 11.3 Optimisations
- [ ] Performance des calculs
- [ ] Caching des résultats
- [ ] Lazy loading des vues

### 11.4 Documentation
- [ ] Guide utilisateur
- [ ] Documentation API
- [ ] Diagrammes d'architecture
