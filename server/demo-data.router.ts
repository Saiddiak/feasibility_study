import { publicProcedure, router } from './_core/trpc';

// Données d'exemple réalistes
export const demoDataRouter = router({
  getStudyData: publicProcedure.query(() => {
    return {
      study: {
        id: 1,
        title: 'ÉTUDE DE FAISABILITÉ – VUE GLOBALE',
        description: 'Explorez les solutions en parallèle et choisir la plus adaptée',
      },
      options: [
        {
          id: 1,
          name: 'OPTION 1',
          subtitle: 'Solution A',
          score: 72,
          advancement: 60,
          status: 'favorable',
          costScore: 75,
          delayScore: 70,
          feasibilityScore: 72,
        },
        {
          id: 2,
          name: 'OPTION 2',
          subtitle: 'Solution B',
          score: 65,
          advancement: 45,
          status: 'risky',
          costScore: 60,
          delayScore: 65,
          feasibilityScore: 70,
        },
        {
          id: 3,
          name: 'OPTION 3',
          subtitle: 'Solution C',
          score: 48,
          advancement: 40,
          status: 'risky',
          costScore: 45,
          delayScore: 50,
          feasibilityScore: 48,
        },
        {
          id: 4,
          name: 'OPTION 4',
          subtitle: 'Solution D',
          score: 55,
          advancement: 35,
          status: 'risky',
          costScore: 55,
          delayScore: 55,
          feasibilityScore: 55,
        },
        {
          id: 5,
          name: 'OPTION 5',
          subtitle: 'Solution E',
          score: 25,
          advancement: 10,
          status: 'abandoned',
          costScore: 20,
          delayScore: 30,
          feasibilityScore: 25,
        },
      ],
      posts: [
        // Option 1
        { id: 1, optionId: 1, name: 'Poste 1.1', subtitle: 'Recherche techno', status: 'in_progress' },
        { id: 2, optionId: 1, name: 'Poste 1.2', subtitle: 'Partenaires', status: 'in_progress' },
        { id: 3, optionId: 1, name: 'Poste 1.3', subtitle: 'Prototype', status: 'in_progress' },
        // Option 2
        { id: 4, optionId: 2, name: 'Poste 2.1', subtitle: 'Étude marché', status: 'in_progress' },
        { id: 5, optionId: 2, name: 'Poste 2.2', subtitle: 'Technologie', status: 'in_progress' },
        { id: 6, optionId: 2, name: 'Poste 2.3', subtitle: 'Modèle économique', status: 'in_progress' },
        // Option 3
        { id: 7, optionId: 3, name: 'Poste 3.1', subtitle: 'Innovation', status: 'to_review' },
        { id: 8, optionId: 3, name: 'Poste 3.2', subtitle: 'Industrialisation', status: 'to_review' },
        // Option 4
        { id: 9, optionId: 4, name: 'Poste 4.1', subtitle: 'Approche interne', status: 'to_review' },
        { id: 10, optionId: 4, name: 'Poste 4.2', subtitle: 'Ressources', status: 'to_review' },
        // Option 5
        { id: 11, optionId: 5, name: 'Poste 5.1', subtitle: 'Faisabilité technique', status: 'abandoned' },
        { id: 12, optionId: 5, name: 'Poste 5.2', subtitle: 'Viabilité', status: 'abandoned' },
      ],
      actions: [
        // Poste 1.1
        { id: 1, postId: 1, name: 'Analyse faisabilité', status: 'terminated', advancement: 100, date: '15/06/2024' },
        { id: 2, postId: 1, name: 'Veille & benchmark', status: 'in_retard', advancement: 40, date: '10/06/2024' },
        { id: 3, postId: 1, name: 'Identifier partenaires', status: 'to_review', advancement: 70, date: '20/06/2024' },
        // Poste 1.2
        { id: 4, postId: 2, name: 'Négociation', status: 'to_review', advancement: 30, date: '25/06/2024' },
        { id: 5, postId: 2, name: 'Développement MVP', status: 'in_progress', advancement: 60, date: '05/07/2024' },
        { id: 6, postId: 2, name: 'Tests utilisateur', status: 'terminated', advancement: 100, date: '12/07/2024' },
        // Poste 1.3
        { id: 7, postId: 3, name: 'Analyse marché', status: 'terminated', advancement: 100, date: '18/06/2024' },
        { id: 8, postId: 3, name: 'Interviews clients', status: 'to_review', advancement: 50, date: '22/06/2024' },
        // Poste 2.1
        { id: 9, postId: 4, name: 'Architecture solution', status: 'in_progress', advancement: 60, date: '28/06/2024' },
        { id: 10, postId: 4, name: 'Choix technos', status: 'in_progress', advancement: 40, date: '30/06/2024' },
        // Poste 2.2
        { id: 11, postId: 5, name: 'Business model', status: 'terminated', advancement: 100, date: '07/07/2024' },
        { id: 12, postId: 5, name: 'Plan financier', status: 'in_retard', advancement: 10, date: '08/06/2024' },
        // Poste 2.3
        { id: 13, postId: 6, name: 'Recherche idées', status: 'to_review', advancement: 50, date: '25/06/2024' },
        { id: 14, postId: 6, name: 'Validation concept', status: 'to_review', advancement: 25, date: '02/07/2024' },
        // Poste 3.1
        { id: 15, postId: 7, name: 'Étude production', status: 'in_progress', advancement: 40, date: '15/07/2024' },
        { id: 16, postId: 7, name: 'Fournisseurs', status: 'to_review', advancement: 20, date: '20/07/2024' },
        // Poste 3.2
        { id: 17, postId: 8, name: 'Audit interne', status: 'in_progress', advancement: 70, date: '17/06/2024' },
        { id: 18, postId: 8, name: 'Compétences clés', status: 'in_retard', advancement: 20, date: '05/06/2024' },
        // Poste 4.1
        { id: 19, postId: 9, name: 'Recrutements', status: 'to_review', advancement: 40, date: '12/07/2024' },
        { id: 20, postId: 9, name: 'Budget', status: 'terminated', advancement: 100, date: '18/07/2024' },
        // Poste 4.2
        { id: 21, postId: 10, name: 'Tests techniques', status: 'abandoned', advancement: 10, date: '' },
        { id: 22, postId: 10, name: 'Contraintes', status: 'abandoned', advancement: 0, date: '' },
        // Poste 5.1
        { id: 23, postId: 11, name: 'Coûts', status: 'abandoned', advancement: 0, date: '' },
        { id: 24, postId: 11, name: 'ROI', status: 'abandoned', advancement: 0, date: '' },
      ],
      alerts: [
        { id: 1, message: '7 actions en retard', severity: 'high', isResolved: false },
        { id: 2, message: '6 risques élevés détectés', severity: 'high', isResolved: false },
        { id: 3, message: '2 échéances dépassées', severity: 'high', isResolved: false },
        { id: 4, message: 'Option 5 abandonnée', severity: 'medium', isResolved: false },
      ],
      criteria: [
        { name: 'Impact / Valeur', weight: 40, icon: 'TrendingUp' },
        { name: 'Faisabilité', weight: 20, icon: 'CheckCircle' },
        { name: 'Coût - Temps', weight: 20, icon: 'Clock' },
        { name: 'Risque', weight: 10, icon: 'AlertCircle' },
        { name: 'Réversibilité', weight: 10, icon: 'RotateCcw' },
      ],
      rules: [
        { name: 'Statut mis à jour selon les dates', isActive: true },
        { name: 'Alerte si échéance dépassée', isActive: true },
        { name: 'Risque élevé si probabilité × impact > 30%', isActive: true },
        { name: 'Propagation du statut "Abandonné" aux postes liés', isActive: true },
      ],
      timeline: ['Mai 2024', 'Juin 2024', 'REVUE 2', 'Juillet 2024', 'Août 2024'],
      finalDecisionDate: '15/09/2024',
      statistics: {
        totalOptions: 5,
        totalPosts: 12,
        totalActions: 24,
        delayedActions: 7,
        highRisks: 6,
        alerts: 4,
      },
    };
  }),
});
