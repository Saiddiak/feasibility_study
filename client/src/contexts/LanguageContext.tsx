import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  fr: {
    'app.title': 'Étude de Faisabilité',
    'app.subtitle': 'Outil professionnel d\'analyse et de comparaison d\'options',
    'app.description': 'Connectez-vous pour commencer votre étude de faisabilité',
    'auth.login': 'Se connecter',
    'auth.logout': 'Se déconnecter',
    'nav.overview': 'Vue d\'ensemble',
    'nav.treeview': 'Arborescence',
    'nav.timeline': 'Chronologie',
    'nav.matrix': 'Matrice',
    'nav.dashboard': 'Tableau de bord',
    'nav.risks': 'Risques',
    'nav.settings': 'Paramètres',
    'nav.ai': 'Analyse IA',
    'nav.export': 'Export',
    'button.add': 'Ajouter',
    'button.edit': 'Modifier',
    'button.delete': 'Supprimer',
    'button.save': 'Enregistrer',
    'button.cancel': 'Annuler',
    'button.export': 'Exporter',
    'button.analyze': 'Analyser',
    'status.idea': 'Idée',
    'status.in_progress': 'En cours',
    'status.to_review': 'À examiner',
    'status.in_retard': 'En retard',
    'status.abandoned': 'Abandonné',
    'status.terminated': 'Terminé',
    'status.favorable': 'Favorable',
    'status.risky': 'Risqué',
    'status.blocked': 'Bloquant',
    'label.cost': 'Coût',
    'label.delay': 'Délai',
    'label.advancement': 'Avancement',
    'label.score': 'Score',
    'label.probability': 'Probabilité',
    'label.impact': 'Impact',
    'label.risk': 'Risque',
    'label.alert': 'Alerte',
    'label.threshold': 'Seuil',
    'label.rule': 'Règle',
    'label.criteria': 'Critère',
    'label.evaluation': 'Évaluation',
    'label.recommendation': 'Recommandation',
    'label.summary': 'Résumé',
    'label.analysis': 'Analyse',
    'message.loading': 'Chargement...',
    'message.success': 'Succès',
    'message.error': 'Erreur',
    'message.confirm': 'Êtes-vous sûr ?',
    'message.no_data': 'Aucune donnée disponible',
  },
  en: {
    'app.title': 'Feasibility Study',
    'app.subtitle': 'Professional tool for analyzing and comparing options',
    'app.description': 'Sign in to start your feasibility study',
    'auth.login': 'Sign in',
    'auth.logout': 'Sign out',
    'nav.overview': 'Overview',
    'nav.treeview': 'Tree View',
    'nav.timeline': 'Timeline',
    'nav.matrix': 'Matrix',
    'nav.dashboard': 'Dashboard',
    'nav.risks': 'Risks',
    'nav.settings': 'Settings',
    'nav.ai': 'AI Analysis',
    'nav.export': 'Export',
    'button.add': 'Add',
    'button.edit': 'Edit',
    'button.delete': 'Delete',
    'button.save': 'Save',
    'button.cancel': 'Cancel',
    'button.export': 'Export',
    'button.analyze': 'Analyze',
    'status.idea': 'Idea',
    'status.in_progress': 'In Progress',
    'status.to_review': 'To Review',
    'status.in_retard': 'Delayed',
    'status.abandoned': 'Abandoned',
    'status.terminated': 'Terminated',
    'status.favorable': 'Favorable',
    'status.risky': 'Risky',
    'status.blocked': 'Blocked',
    'label.cost': 'Cost',
    'label.delay': 'Delay',
    'label.advancement': 'Advancement',
    'label.score': 'Score',
    'label.probability': 'Probability',
    'label.impact': 'Impact',
    'label.risk': 'Risk',
    'label.alert': 'Alert',
    'label.threshold': 'Threshold',
    'label.rule': 'Rule',
    'label.criteria': 'Criteria',
    'label.evaluation': 'Evaluation',
    'label.recommendation': 'Recommendation',
    'label.summary': 'Summary',
    'label.analysis': 'Analysis',
    'message.loading': 'Loading...',
    'message.success': 'Success',
    'message.error': 'Error',
    'message.confirm': 'Are you sure?',
    'message.no_data': 'No data available',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Charger la langue sauvegardée
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    } else {
      // Utiliser la langue du navigateur
      const browserLang = navigator.language.split('-')[0];
      const lang = (browserLang === 'en' ? 'en' : 'fr') as Language;
      setLanguageState(lang);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
