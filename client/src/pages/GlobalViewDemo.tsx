import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Filter,
  ChevronRight,
  Plus,
  Trophy
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';

const statusColors: Record<string, { bg: string; text: string; icon: string }> = {
  'favorable': { bg: 'bg-green-500/20', text: 'text-green-600', icon: '●' },
  'risky': { bg: 'bg-yellow-500/20', text: 'text-yellow-600', icon: '●' },
  'blocked': { bg: 'bg-red-500/20', text: 'text-red-600', icon: '●' },
  'abandoned': { bg: 'bg-gray-500/20', text: 'text-gray-600', icon: '●' },
  'completed': { bg: 'bg-blue-500/20', text: 'text-blue-600', icon: '●' },
  'pending': { bg: 'bg-orange-500/20', text: 'text-orange-600', icon: '●' },
  'idea': { bg: 'bg-purple-500/20', text: 'text-purple-600', icon: '●' },
  'in_progress': { bg: 'bg-blue-500/20', text: 'text-blue-600', icon: '●' },
  'to_review': { bg: 'bg-yellow-500/20', text: 'text-yellow-600', icon: '●' },
  'in_retard': { bg: 'bg-red-500/20', text: 'text-red-600', icon: '●' },
  'terminated': { bg: 'bg-green-500/20', text: 'text-green-600', icon: '●' },
};

// Données mockées réalistes
const mockData = {
  options: [
    { id: 1, name: 'OPTION 1', subtitle: 'Solution A', score: 72, status: 'favorable' },
    { id: 2, name: 'OPTION 2', subtitle: 'Solution B', score: 65, status: 'risky' },
    { id: 3, name: 'OPTION 3', subtitle: 'Solution C', score: 48, status: 'risky' },
    { id: 4, name: 'OPTION 4', subtitle: 'Solution D', score: 55, status: 'risky' },
    { id: 5, name: 'OPTION 5', subtitle: 'Solution E', score: 25, status: 'abandoned' },
  ],
  posts: [
    { id: 1, optionId: 1, name: 'Poste 1.1', subtitle: 'Recherche techno', status: 'in_progress' },
    { id: 2, optionId: 1, name: 'Poste 1.2', subtitle: 'Partenaires', status: 'in_progress' },
    { id: 3, optionId: 1, name: 'Poste 1.3', subtitle: 'Prototype', status: 'in_progress' },
    { id: 4, optionId: 2, name: 'Poste 2.1', subtitle: 'Étude marché', status: 'in_progress' },
    { id: 5, optionId: 2, name: 'Poste 2.2', subtitle: 'Technologie', status: 'in_progress' },
    { id: 6, optionId: 2, name: 'Poste 2.3', subtitle: 'Modèle économique', status: 'in_progress' },
  ],
  actions: [
    { id: 1, postId: 1, name: 'Analyse faisabilité', status: 'terminated', advancement: 100, days: '15/06/2024' },
    { id: 2, postId: 1, name: 'Veille & benchmark', status: 'in_retard', advancement: 40, days: '10/06/2024' },
    { id: 3, postId: 1, name: 'Identifier partenaires', status: 'to_review', advancement: 70, days: '20/06/2024' },
    { id: 4, postId: 2, name: 'Négociation', status: 'to_review', advancement: 30, days: '25/06/2024' },
    { id: 5, postId: 2, name: 'Développement MVP', status: 'in_progress', advancement: 60, days: '05/07/2024' },
    { id: 6, postId: 2, name: 'Tests utilisateur', status: 'terminated', advancement: 100, days: '12/07/2024' },
    { id: 7, postId: 3, name: 'Analyse marché', status: 'terminated', advancement: 100, days: '18/06/2024' },
    { id: 8, postId: 3, name: 'Interviews clients', status: 'to_review', advancement: 50, days: '22/06/2024' },
    { id: 9, postId: 4, name: 'Architecture solution', status: 'in_progress', advancement: 60, days: '28/06/2024' },
    { id: 10, postId: 4, name: 'Choix technos', status: 'in_progress', advancement: 40, days: '30/06/2024' },
    { id: 11, postId: 5, name: 'Business model', status: 'terminated', advancement: 100, days: '07/07/2024' },
    { id: 12, postId: 5, name: 'Plan financier', status: 'in_retard', advancement: 10, days: '08/06/2024' },
  ],
  alerts: [
    '7 actions en retard',
    '6 risques élevés détectés',
    '2 échéances dépassées',
    'Option 5 abandonnée',
  ],
  criteria: [
    { name: 'Impact / Valeur', weight: 40 },
    { name: 'Faisabilité', weight: 20 },
    { name: 'Coût - Temps', weight: 20 },
    { name: 'Risque', weight: 10 },
    { name: 'Réversibilité', weight: 10 },
  ],
  rules: [
    'Statut mis à jour selon les dates',
    'Alerte si avancement < 30%',
    'Risque élevé si probabilité × impact > 30%',
    'Propagation du statut "Abandonné" aux postes liés',
  ],
  timeline: ['Mai 2024', 'Juin 2024', 'REVUE 2', 'Juillet 2024', 'Août 2024'],
};

export default function GlobalViewDemo() {
  const { language } = useLanguage();
  const [expandedOptions, setExpandedOptions] = useState<Set<number>>(new Set([1]));
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set([1, 2]));

  const toggleOption = (optionId: number) => {
    const newExpanded = new Set(expandedOptions);
    if (newExpanded.has(optionId)) {
      newExpanded.delete(optionId);
    } else {
      newExpanded.add(optionId);
    }
    setExpandedOptions(newExpanded);
  };

  const togglePost = (postId: number) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  const getStatusColor = (status?: string) => {
    return statusColors[status || 'pending'] || statusColors['pending'];
  };

  const bestOption = mockData.options.reduce((best, current) => 
    current.score > best.score ? current : best
  );

  return (
    <div className="min-h-screen bg-blueprint-dark text-blueprint-light">
      {/* Header */}
      <div className="border-b border-blueprint-accent/30 bg-blueprint-dark/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-blueprint-accent flex items-center gap-3">
                <span className="text-2xl">⚙️</span>
                {language === 'fr' ? 'ÉTUDE DE FAISABILITÉ – VUE GLOBALE' : 'FEASIBILITY STUDY – GLOBAL VIEW'}
              </h1>
              <p className="text-blueprint-light/70 text-sm mt-1">
                {language === 'fr' 
                  ? 'Explorez les solutions en parallèle et choisir la plus adaptée'
                  : 'Explore solutions in parallel and choose the most suitable'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                {language === 'fr' ? 'Filtrer' : 'Filter'}
              </Button>
              <Button size="sm" className="gap-2 bg-blueprint-accent hover:bg-blueprint-accent/90">
                <Plus className="w-4 h-4" />
                {language === 'fr' ? 'Ajouter' : 'Add'}
              </Button>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-6 gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-blueprint-accent/10 rounded border border-blueprint-accent/30">
              <span className="text-blueprint-accent font-bold">5</span>
              <span className="text-blueprint-light/70 text-sm">{language === 'fr' ? 'OPTIONS' : 'OPTIONS'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-blueprint-accent/10 rounded border border-blueprint-accent/30">
              <span className="text-blueprint-accent font-bold">14</span>
              <span className="text-blueprint-light/70 text-sm">{language === 'fr' ? 'POSTES' : 'POSTS'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-blueprint-accent/10 rounded border border-blueprint-accent/30">
              <span className="text-blueprint-accent font-bold">42</span>
              <span className="text-blueprint-light/70 text-sm">{language === 'fr' ? 'ACTIONS' : 'ACTIONS'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 rounded border border-red-500/30">
              <span className="text-red-400 font-bold">7</span>
              <span className="text-blueprint-light/70 text-sm">{language === 'fr' ? 'EN RETARD' : 'DELAYED'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 rounded border border-orange-500/30">
              <span className="text-orange-400 font-bold">6</span>
              <span className="text-blueprint-light/70 text-sm">{language === 'fr' ? 'RISQUES ÉLEVÉS' : 'HIGH RISKS'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 rounded border border-green-500/30">
              <span className="text-green-400 font-bold">4</span>
              <span className="text-blueprint-light/70 text-sm">{language === 'fr' ? 'ALERTES' : 'ALERTS'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 p-6 max-w-full">
        {/* Left Sidebar */}
        <div className="w-64 space-y-4 flex-shrink-0">
          {/* Légende */}
          <Card className="border-blueprint-accent/30 bg-blueprint-dark/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{language === 'fr' ? 'LÉGENDE' : 'LEGEND'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-600" />
                <span className="text-blueprint-light/70">À l'heure</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-600" />
                <span className="text-blueprint-light/70">En risque</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-600" />
                <span className="text-blueprint-light/70">En retard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-500/20 border border-gray-600" />
                <span className="text-blueprint-light/70">Abandonné</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-600" />
                <span className="text-blueprint-light/70">Terminé</span>
              </div>
            </CardContent>
          </Card>

          {/* Meilleure option */}
          <Card className="border-green-500/30 bg-green-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-green-400">{language === 'fr' ? 'MEILLEURE OPTION' : 'BEST OPTION'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="font-semibold text-blueprint-light">{bestOption.name}</div>
              <div className="text-xs text-blueprint-light/70">{bestOption.subtitle}</div>
              <div className="text-sm font-bold text-green-400">{bestOption.score}/100</div>
            </CardContent>
          </Card>
        </div>

        {/* Center - Arborescence */}
        <div className="flex-1 space-y-4">
          <Card className="border-blueprint-accent/30 bg-blueprint-dark/50">
            <CardHeader>
              <CardTitle className="text-lg">{language === 'fr' ? 'OPTIONS' : 'OPTIONS'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {mockData.options.map((option) => (
                <div key={option.id} className="border border-blueprint-accent/30 rounded-lg overflow-hidden">
                  {/* Option Header */}
                  <div
                    onClick={() => toggleOption(option.id)}
                    className="p-4 bg-blueprint-accent/5 hover:bg-blueprint-accent/10 cursor-pointer transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <ChevronRight
                        className={`w-5 h-5 text-blueprint-accent transition ${
                          expandedOptions.has(option.id) ? 'rotate-90' : ''
                        }`}
                      />
                      <div>
                        <h3 className="font-bold text-blueprint-accent">{option.name}</h3>
                        <p className="text-xs text-blueprint-light/50">{option.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {option.score}/100
                      </Badge>
                      <span className={`w-3 h-3 rounded-full ${getStatusColor(option.status).bg}`} />
                    </div>
                  </div>

                  {/* Postes */}
                  {expandedOptions.has(option.id) && (
                    <div className="bg-blueprint-dark/30 p-4 space-y-3 border-t border-blueprint-accent/20">
                      {mockData.posts
                        .filter((p) => p.optionId === option.id)
                        .map((post) => (
                          <div key={post.id} className="border border-blueprint-accent/20 rounded">
                            {/* Post Header */}
                            <div
                              onClick={() => togglePost(post.id)}
                              className="p-3 bg-blueprint-accent/5 hover:bg-blueprint-accent/10 cursor-pointer transition flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <ChevronRight
                                  className={`w-4 h-4 text-blueprint-accent/70 transition ${
                                    expandedPosts.has(post.id) ? 'rotate-90' : ''
                                  }`}
                                />
                                <span className="text-sm font-semibold text-blueprint-light">{post.name}</span>
                              </div>
                              <span className="text-xs text-blueprint-light/50">{post.subtitle}</span>
                            </div>

                            {/* Actions */}
                            {expandedPosts.has(post.id) && (
                              <div className="bg-blueprint-dark/50 p-3 space-y-2 border-t border-blueprint-accent/20">
                                {mockData.actions
                                  .filter((a) => a.postId === post.id)
                                  .map((action) => (
                                    <div
                                      key={action.id}
                                      className="flex items-center justify-between p-2 bg-blueprint-dark/30 rounded text-xs border border-blueprint-accent/10 hover:border-blueprint-accent/30 transition"
                                    >
                                      <div className="flex items-center gap-2 flex-1">
                                        <span className={`w-2 h-2 rounded-full ${getStatusColor(action.status).bg}`} />
                                        <span className="text-blueprint-light/80">{action.name}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-blueprint-light/50">{action.advancement}%</span>
                                        <span className="text-blueprint-light/50">{action.days}</span>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 space-y-4 flex-shrink-0">
          {/* Synthèse des options */}
          <Card className="border-blueprint-accent/30 bg-blueprint-dark/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{language === 'fr' ? 'SYNTHÈSE DES OPTIONS' : 'OPTIONS SUMMARY'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockData.options.map((option) => (
                <div key={option.id} className="p-3 bg-blueprint-accent/5 rounded border border-blueprint-accent/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-blueprint-light text-sm">{option.name}</span>
                    <span className="text-xs font-bold text-blueprint-accent">{option.score}/100</span>
                  </div>
                  <div className="w-full bg-blueprint-dark/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blueprint-accent h-full transition-all"
                      style={{ width: `${option.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Critères d'évaluation */}
          <Card className="border-blueprint-accent/30 bg-blueprint-dark/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{language === 'fr' ? 'CRITÈRES D\'ÉVALUATION' : 'EVALUATION CRITERIA'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {mockData.criteria.map((criterion) => (
                <div key={criterion.name} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-blueprint-light/70">{criterion.name} ({criterion.weight}%)</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Alertes automatiques */}
          <Card className="border-red-500/30 bg-red-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-red-400">{language === 'fr' ? 'ALERTES AUTOMATIQUES' : 'AUTOMATIC ALERTS'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockData.alerts.map((alert, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-blueprint-light/70">{alert}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Règles automatiques actives */}
          <Card className="border-blueprint-accent/30 bg-blueprint-dark/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{language === 'fr' ? 'RÈGLES AUTOMATIQUES ACTIVES' : 'ACTIVE AUTOMATIC RULES'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockData.rules.map((rule, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-blueprint-light/70">{rule}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Timeline */}
      <div className="border-t border-blueprint-accent/30 bg-blueprint-dark/50 p-6">
        <div className="max-w-full">
          <h3 className="text-sm font-bold text-blueprint-accent mb-4">{language === 'fr' ? 'CHRONOLOGIE GLOBALE' : 'GLOBAL TIMELINE'}</h3>
          <div className="flex items-center gap-4 overflow-x-auto pb-4">
            {mockData.timeline.map((month, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-24 h-12 bg-blueprint-accent/10 rounded border border-blueprint-accent/30 flex items-center justify-center">
                  <span className="text-xs text-blueprint-light/70 text-center font-semibold">{month}</span>
                </div>
                {idx < mockData.timeline.length - 1 && <div className="w-8 h-0.5 bg-blueprint-accent/30" />}
              </div>
            ))}
            <div className="flex-shrink-0 ml-auto">
              <div className="flex flex-col items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className="text-xs text-blueprint-light/70">{language === 'fr' ? 'DÉCISION FINALE' : 'FINAL DECISION'}</span>
                <span className="text-xs font-bold text-blueprint-accent">15/09/2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
