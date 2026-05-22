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
  Trophy,
  RotateCcw
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  'favorable': { bg: 'bg-green-500/20', text: 'text-green-600', border: 'border-green-600' },
  'risky': { bg: 'bg-yellow-500/20', text: 'text-yellow-600', border: 'border-yellow-600' },
  'blocked': { bg: 'bg-red-500/20', text: 'text-red-600', border: 'border-red-600' },
  'abandoned': { bg: 'bg-gray-500/20', text: 'text-gray-600', border: 'border-gray-600' },
  'completed': { bg: 'bg-blue-500/20', text: 'text-blue-600', border: 'border-blue-600' },
  'pending': { bg: 'bg-orange-500/20', text: 'text-orange-600', border: 'border-orange-600' },
  'idea': { bg: 'bg-purple-500/20', text: 'text-purple-600', border: 'border-purple-600' },
  'in_progress': { bg: 'bg-blue-500/20', text: 'text-blue-600', border: 'border-blue-600' },
  'to_review': { bg: 'bg-yellow-500/20', text: 'text-yellow-600', border: 'border-yellow-600' },
  'in_retard': { bg: 'bg-red-500/20', text: 'text-red-600', border: 'border-red-600' },
  'terminated': { bg: 'bg-green-500/20', text: 'text-green-600', border: 'border-green-600' },
};

export default function GlobalViewComplete() {
  const { language } = useLanguage();
  const [expandedOptions, setExpandedOptions] = useState<Set<number>>(new Set([1, 2]));
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set([1, 2, 3, 4, 5]));

  // Charger les données réelles
  const { data: studyData, isLoading } = trpc.demo.getStudyData.useQuery();

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

  if (isLoading || !studyData) {
    return (
      <div className="flex items-center justify-center h-screen bg-blueprint-dark">
        <div className="text-blueprint-light">Chargement...</div>
      </div>
    );
  }

  const bestOption = studyData.options.reduce((best, current) => 
    current.score > best.score ? current : best
  );

  const getPostsForOption = (optionId: number) => 
    studyData.posts.filter(p => p.optionId === optionId);

  const getActionsForPost = (postId: number) => 
    studyData.actions.filter(a => a.postId === postId);

  return (
    <div className="min-h-screen bg-blueprint-dark text-blueprint-light overflow-x-hidden">
      {/* Header avec statistiques */}
      <div className="border-b border-blueprint-accent/30 bg-blueprint-dark/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-blueprint-accent flex items-center gap-3">
                <span className="text-xl">⚙️</span>
                {studyData.study.title}
              </h1>
              <p className="text-blueprint-light/70 text-sm mt-1">{studyData.study.description}</p>
            </div>
            <div className="flex items-center gap-2">
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
          <div className="grid grid-cols-6 gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-blueprint-accent/10 rounded border border-blueprint-accent/30">
              <span className="text-blueprint-accent font-bold text-lg">{studyData.statistics.totalOptions}</span>
              <span className="text-blueprint-light/70 text-xs">{language === 'fr' ? 'OPTIONS' : 'OPTIONS'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-blueprint-accent/10 rounded border border-blueprint-accent/30">
              <span className="text-blueprint-accent font-bold text-lg">{studyData.statistics.totalPosts}</span>
              <span className="text-blueprint-light/70 text-xs">{language === 'fr' ? 'POSTES' : 'POSTS'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-blueprint-accent/10 rounded border border-blueprint-accent/30">
              <span className="text-blueprint-accent font-bold text-lg">{studyData.statistics.totalActions}</span>
              <span className="text-blueprint-light/70 text-xs">{language === 'fr' ? 'ACTIONS' : 'ACTIONS'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 rounded border border-red-500/30">
              <span className="text-red-400 font-bold text-lg">{studyData.statistics.delayedActions}</span>
              <span className="text-blueprint-light/70 text-xs">{language === 'fr' ? 'EN RETARD' : 'DELAYED'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 rounded border border-orange-500/30">
              <span className="text-orange-400 font-bold text-lg">{studyData.statistics.highRisks}</span>
              <span className="text-blueprint-light/70 text-xs">{language === 'fr' ? 'RISQUES' : 'RISKS'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 rounded border border-green-500/30">
              <span className="text-green-400 font-bold text-lg">{studyData.statistics.alerts}</span>
              <span className="text-blueprint-light/70 text-xs">{language === 'fr' ? 'ALERTES' : 'ALERTS'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 p-6 max-w-full">
        {/* Left Sidebar - Légende et meilleure option */}
        <div className="w-64 space-y-4 flex-shrink-0 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Légende */}
          <Card className="border-blueprint-accent/30 bg-blueprint-dark/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-blueprint-accent">{language === 'fr' ? 'LÉGENDE' : 'LEGEND'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500/40 border border-green-600" />
                <span className="text-blueprint-light/70">À l'heure</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500/40 border border-yellow-600" />
                <span className="text-blueprint-light/70">En risque</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500/40 border border-red-600" />
                <span className="text-blueprint-light/70">En retard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-500/40 border border-gray-600" />
                <span className="text-blueprint-light/70">Abandonné</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500/40 border border-blue-600" />
                <span className="text-blueprint-light/70">Terminé</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500/40 border border-purple-600" />
                <span className="text-blueprint-light/70">Idée</span>
              </div>
            </CardContent>
          </Card>

          {/* Meilleure option */}
          <Card className="border-green-500/30 bg-green-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-green-400 font-bold">{language === 'fr' ? 'MEILLEURE OPTION' : 'BEST OPTION'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="font-semibold text-blueprint-light text-sm">{bestOption.name}</div>
              <div className="text-xs text-blueprint-light/70">{bestOption.subtitle}</div>
              <div className="text-sm font-bold text-green-400">{bestOption.score}/100</div>
              <div className="w-full bg-blueprint-dark/50 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all"
                  style={{ width: `${bestOption.score}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center - Arborescence complète */}
        <div className="flex-1 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="space-y-3">
            {studyData.options.map((option) => (
              <div key={option.id} className="border border-blueprint-accent/30 rounded-lg overflow-hidden bg-blueprint-dark/30">
                {/* Option Header */}
                <div
                  onClick={() => toggleOption(option.id)}
                  className="p-3 bg-blueprint-accent/5 hover:bg-blueprint-accent/10 cursor-pointer transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <ChevronRight
                      className={`w-5 h-5 text-blueprint-accent transition flex-shrink-0 ${
                        expandedOptions.has(option.id) ? 'rotate-90' : ''
                      }`}
                    />
                    <div className="min-w-0">
                      <h3 className="font-bold text-blueprint-accent text-sm">{option.name}</h3>
                      <p className="text-xs text-blueprint-light/50">{option.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className="text-xs">
                      {option.score}/100
                    </Badge>
                    <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(option.status).bg} border ${getStatusColor(option.status).border}`} />
                  </div>
                </div>

                {/* Postes */}
                {expandedOptions.has(option.id) && (
                  <div className="bg-blueprint-dark/20 p-3 space-y-2 border-t border-blueprint-accent/20">
                    {getPostsForOption(option.id).map((post) => (
                      <div key={post.id} className="border border-blueprint-accent/20 rounded bg-blueprint-dark/30">
                        {/* Post Header */}
                        <div
                          onClick={() => togglePost(post.id)}
                          className="p-2 bg-blueprint-accent/5 hover:bg-blueprint-accent/10 cursor-pointer transition flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <ChevronRight
                              className={`w-4 h-4 text-blueprint-accent/70 transition flex-shrink-0 ${
                                expandedPosts.has(post.id) ? 'rotate-90' : ''
                              }`}
                            />
                            <span className="text-xs font-semibold text-blueprint-light">{post.name}</span>
                          </div>
                          <span className="text-xs text-blueprint-light/50 flex-shrink-0">{post.subtitle}</span>
                        </div>

                        {/* Actions */}
                        {expandedPosts.has(post.id) && (
                          <div className="bg-blueprint-dark/40 p-2 space-y-1 border-t border-blueprint-accent/20">
                            {getActionsForPost(post.id).map((action) => (
                              <div
                                key={action.id}
                                className="flex items-center justify-between p-1.5 bg-blueprint-dark/30 rounded text-xs border border-blueprint-accent/10 hover:border-blueprint-accent/30 transition"
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getStatusColor(action.status).bg} border ${getStatusColor(action.status).border}`} />
                                  <span className="text-blueprint-light/80 truncate">{action.name}</span>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                  <span className="text-blueprint-light/50">{action.advancement}%</span>
                                  {action.date && <span className="text-blueprint-light/50">{action.date}</span>}
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
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 space-y-3 flex-shrink-0 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Synthèse des options */}
          <Card className="border-blueprint-accent/30 bg-blueprint-dark/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-blueprint-accent">{language === 'fr' ? 'SYNTHÈSE DES OPTIONS' : 'OPTIONS SUMMARY'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {studyData.options.map((option) => (
                <div key={option.id} className="p-2 bg-blueprint-accent/5 rounded border border-blueprint-accent/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-blueprint-light text-xs">{option.name}</span>
                    <span className="text-xs font-bold text-blueprint-accent">{option.score}/100</span>
                  </div>
                  <div className="w-full bg-blueprint-dark/50 rounded-full h-1.5 overflow-hidden">
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
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-blueprint-accent">{language === 'fr' ? 'CRITÈRES D\'ÉVALUATION' : 'EVALUATION CRITERIA'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-xs">
              {studyData.criteria.map((criterion) => (
                <div key={criterion.name} className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span className="text-blueprint-light/70">{criterion.name} ({criterion.weight}%)</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Alertes automatiques */}
          <Card className="border-red-500/30 bg-red-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-red-400">{language === 'fr' ? 'ALERTES AUTOMATIQUES' : 'AUTOMATIC ALERTS'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {studyData.alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-2 text-xs">
                  <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-blueprint-light/70">{alert.message}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Règles automatiques actives */}
          <Card className="border-blueprint-accent/30 bg-blueprint-dark/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-blueprint-accent">{language === 'fr' ? 'RÈGLES AUTOMATIQUES ACTIVES' : 'ACTIVE AUTOMATIC RULES'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {studyData.rules.map((rule, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span className="text-blueprint-light/70">{rule.name}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Timeline */}
      <div className="border-t border-blueprint-accent/30 bg-blueprint-dark/50 p-4 mt-6">
        <div className="max-w-full">
          <h3 className="text-xs font-bold text-blueprint-accent mb-3">{language === 'fr' ? 'CHRONOLOGIE GLOBALE' : 'GLOBAL TIMELINE'}</h3>
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {studyData.timeline.map((month, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className="w-20 h-10 bg-blueprint-accent/10 rounded border border-blueprint-accent/30 flex items-center justify-center">
                  <span className="text-xs text-blueprint-light/70 text-center font-semibold">{month}</span>
                </div>
                {idx < studyData.timeline.length - 1 && <div className="w-6 h-0.5 bg-blueprint-accent/30" />}
              </div>
            ))}
            <div className="flex-shrink-0 ml-auto">
              <div className="flex flex-col items-center gap-1">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-xs text-blueprint-light/70">{language === 'fr' ? 'DÉCISION FINALE' : 'FINAL DECISION'}</span>
                <span className="text-xs font-bold text-blueprint-accent">{studyData.finalDecisionDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
