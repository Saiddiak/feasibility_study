import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Filter,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const statusColors: Record<string, { bg: string; text: string; icon: string }> = {
  'favorable': { bg: 'bg-green-500/20', text: 'text-green-600', icon: '●' },
  'risky': { bg: 'bg-yellow-500/20', text: 'text-yellow-600', icon: '●' },
  'blocked': { bg: 'bg-red-500/20', text: 'text-red-600', icon: '●' },
  'abandoned': { bg: 'bg-gray-500/20', text: 'text-gray-600', icon: '●' },
  'completed': { bg: 'bg-blue-500/20', text: 'text-blue-600', icon: '●' },
  'pending': { bg: 'bg-orange-500/20', text: 'text-orange-600', icon: '●' },
};

interface GlobalViewProps {
  studyId: number;
}

export default function GlobalView({ studyId }: GlobalViewProps) {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [expandedOptions, setExpandedOptions] = useState<Set<number>>(new Set());
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());

  // Récupérer les données
  // Récupérer l'étude courante
  const { data: study, isLoading: studyLoading } = trpc.studies.get.useQuery({ studyId }, { enabled: !!studyId });
  const { data: options, isLoading: optionsLoading } = trpc.options.list.useQuery({ studyId });
  
  // Initialiser les tableaux
  const optionsArray = options || [];
  
  // Les postes sont récupérés par option, pas directement par étude
  const { data: posts, isLoading: postsLoading } = trpc.posts.list.useQuery(
    optionsArray.length > 0 ? { optionId: optionsArray[0]?.id || 0 } : { optionId: 0 },
    { enabled: optionsArray.length > 0 }
  );
  
  const postsArray = posts || [];
  
  // Les actions sont récupérées par poste, pas directement par étude
  const { data: actions, isLoading: actionsLoading } = trpc.actions.list.useQuery(
    postsArray.length > 0 ? { postId: postsArray[0]?.id || 0 } : { postId: 0 },
    { enabled: postsArray.length > 0 }
  );
  // Les risques sont liés à l'étude
  const { data: risks } = trpc.risks.list.useQuery({ studyId }, { enabled: !!studyId });
  // Les alertes sont liées à l'étude
  const { data: alerts } = trpc.alerts.list.useQuery({ studyId }, { enabled: !!studyId });
  // Les règles de statut sont liées à l'étude
  const { data: statusRules } = trpc.calculations.getStatusRules.useQuery({ studyId }, { enabled: !!studyId });

  const isLoading = studyLoading || optionsLoading;

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  const actionsArray = actions || [];
  const risksArray = risks || [];
  const alertsArray = alerts || [];
  const rulesArray = statusRules || [];

  // Calculer les statistiques
  const totalOptions = optionsArray.length;
  const totalPosts = postsArray.length;
  const totalActions = actionsArray.length;
  const delayedActions = actionsArray.filter(a => a.status === 'in_retard').length;
  const highRisks = risksArray.filter(r => r.impact === 'high' || r.probability === 'high').length;

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
              <span className="text-blueprint-accent font-bold">{totalOptions}</span>
              <span className="text-blueprint-light/70 text-sm">{language === 'fr' ? 'OPTIONS' : 'OPTIONS'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-blueprint-accent/10 rounded border border-blueprint-accent/30">
              <span className="text-blueprint-accent font-bold">{totalPosts}</span>
              <span className="text-blueprint-light/70 text-sm">{language === 'fr' ? 'POSTES' : 'POSTS'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-blueprint-accent/10 rounded border border-blueprint-accent/30">
              <span className="text-blueprint-accent font-bold">{totalActions}</span>
              <span className="text-blueprint-light/70 text-sm">{language === 'fr' ? 'ACTIONS' : 'ACTIONS'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 rounded border border-red-500/30">
              <span className="text-red-400 font-bold">{delayedActions}</span>
              <span className="text-blueprint-light/70 text-sm">{language === 'fr' ? 'EN RETARD' : 'DELAYED'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 rounded border border-orange-500/30">
              <span className="text-orange-400 font-bold">{highRisks}</span>
              <span className="text-blueprint-light/70 text-sm">{language === 'fr' ? 'RISQUES ÉLEVÉS' : 'HIGH RISKS'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 rounded border border-green-500/30">
              <span className="text-green-400 font-bold">{alertsArray.length}</span>
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
              {Object.entries(statusColors).map(([status, colors]) => (
                <div key={status} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${colors.bg} border ${colors.text}`} />
                  <span className="text-blueprint-light/70 capitalize">{status}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card className="border-blueprint-accent/30 bg-blueprint-dark/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{language === 'fr' ? 'NAVIGATION' : 'NAVIGATION'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {['Tableau de bord', 'Options', 'Postes', 'Actions', 'Risques', 'Décisions'].map((item) => (
                <div key={item} className="flex items-center gap-2 px-3 py-2 hover:bg-blueprint-accent/10 rounded cursor-pointer transition">
                  <ChevronRight className="w-4 h-4 text-blueprint-accent/50" />
                  <span className="text-sm text-blueprint-light/70">{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Center - Arborescence */}
        <div className="flex-1 space-y-4">
          <Card className="border-blueprint-accent/30 bg-blueprint-dark/50">
            <CardHeader>
              <CardTitle className="text-lg">{language === 'fr' ? 'OPTIONS' : 'OPTIONS'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {optionsArray.map((option) => (
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
                        <p className="text-xs text-blueprint-light/50">{option.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {option.globalScore ? `${Math.round(Number(option.globalScore))}/100` : '0/100'}
                      </Badge>
                      <span className={`w-3 h-3 rounded-full ${getStatusColor(option.status).bg}`} />
                    </div>
                  </div>

                  {/* Postes */}
                  {expandedOptions.has(option.id) && (
                    <div className="bg-blueprint-dark/30 p-4 space-y-3 border-t border-blueprint-accent/20">
                      {postsArray
                        // Afficher tous les postes pour cette option
                        .filter((p) => p.optionId === option.id || postsArray.length === 0)
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
                              <span className="text-xs text-blueprint-light/50">{post.description}</span>
                            </div>

                            {/* Actions */}
                            {expandedPosts.has(post.id) && (
                              <div className="bg-blueprint-dark/50 p-3 space-y-2 border-t border-blueprint-accent/20">
                                {actionsArray
                                  // Afficher toutes les actions pour ce poste
                                  .filter((a) => a.postId === post.id || actionsArray.length === 0)
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
                                        <span className="text-blueprint-light/50">{action.advancement || 0}%</span>
                                        <span className="text-blueprint-light/50">
                                          {action.estimatedDays ? `${action.estimatedDays}j` : '-'}
                                        </span>
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
              {optionsArray.map((option) => (
                <div key={option.id} className="p-3 bg-blueprint-accent/5 rounded border border-blueprint-accent/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-blueprint-light text-sm">{option.name}</span>
                    <span className="text-xs font-bold text-blueprint-accent">
                      {option.globalScore ? `${Math.round(Number(option.globalScore))}/100` : '0/100'}
                    </span>
                  </div>
                  <div className="w-full bg-blueprint-dark/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blueprint-accent h-full transition-all"
                      style={{ width: `${option.globalScore ? Math.round(Number(option.globalScore)) : 0}%` }}
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
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-blueprint-light/70">{language === 'fr' ? 'Impact / Valeur (40%)' : 'Impact / Value (40%)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-blueprint-light/70">{language === 'fr' ? 'Faisabilité (20%)' : 'Feasibility (20%)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-blueprint-light/70">{language === 'fr' ? 'Coût - Temps (20%)' : 'Cost - Time (20%)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span className="text-blueprint-light/70">{language === 'fr' ? 'Risque (10%)' : 'Risk (10%)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span className="text-blueprint-light/70">{language === 'fr' ? 'Réversibilité (10%)' : 'Reversibility (10%)'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Alertes automatiques */}
          {alertsArray.length > 0 && (
            <Card className="border-red-500/30 bg-red-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-red-400">{language === 'fr' ? 'ALERTES AUTOMATIQUES' : 'AUTOMATIC ALERTS'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {alertsArray.slice(0, 5).map((alert, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-blueprint-light/70">{alert.message}</span>
                  </div>
                ))}
                {alertsArray.length > 5 && (
                  <p className="text-xs text-blueprint-light/50 text-center">
                    +{alertsArray.length - 5} {language === 'fr' ? 'alertes' : 'alerts'}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Règles automatiques actives */}
          {rulesArray.length > 0 && (
            <Card className="border-blueprint-accent/30 bg-blueprint-dark/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{language === 'fr' ? 'RÈGLES AUTOMATIQUES ACTIVES' : 'ACTIVE AUTOMATIC RULES'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {rulesArray.slice(0, 4).map((rule, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-blueprint-light/70">{rule.name}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Bottom Timeline */}
      <div className="border-t border-blueprint-accent/30 bg-blueprint-dark/50 p-6">
        <div className="max-w-full">
          <h3 className="text-sm font-bold text-blueprint-accent mb-4">{language === 'fr' ? 'CHRONOLOGIE GLOBALE' : 'GLOBAL TIMELINE'}</h3>
          <div className="flex items-center gap-4 overflow-x-auto pb-4">
            {['Mai 2024', 'Juin 2024', 'Juillet 2024', 'Août 2024'].map((month, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-24 h-12 bg-blueprint-accent/10 rounded border border-blueprint-accent/30 flex items-center justify-center">
                  <span className="text-xs text-blueprint-light/70">{month}</span>
                </div>
                {idx < 3 && <div className="w-8 h-0.5 bg-blueprint-accent/30" />}
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

// Icône Trophy
function Trophy(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2h-2" />
      <path d="M6 9c0-1 1-3 6-3s6 2 6 3" />
      <path d="M9 5v4h6V5" />
    </svg>
  );
}
