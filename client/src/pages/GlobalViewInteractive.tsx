import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
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
  Plus,
  ChevronDown,
  ChevronRight,
  Eye,
  Settings,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Home,
  FileText,
  Shield,
  Bell,
  Sliders,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { toast } from 'sonner';

const statusColors: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  'favorable': { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', icon: '●' },
  'risky': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: '●' },
  'blocked': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: '●' },
  'abandoned': { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', icon: '●' },
  'completed': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', icon: '●' },
  'pending': { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', icon: '●' },
  'idea': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', icon: '●' },
  'in_progress': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', icon: '●' },
  'to_review': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: '●' },
  'in_retard': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: '●' },
  'terminated': { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', icon: '●' },
};

interface GlobalViewInteractiveProps {
  studyId: number;
}

export default function GlobalViewInteractive({ studyId }: GlobalViewInteractiveProps) {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [expandedOptions, setExpandedOptions] = useState<Set<number>>(new Set());
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAlerts, setShowAlerts] = useState(false);

  // Récupérer les données
  const { data: study, isLoading: studyLoading } = trpc.studies.get.useQuery(
    { studyId },
    { enabled: !!studyId }
  );
  const { data: options, isLoading: optionsLoading } = trpc.options.list.useQuery(
    { studyId },
    { enabled: !!studyId }
  );
  const { data: risks } = trpc.risks.list.useQuery({ studyId }, { enabled: !!studyId });
  const { data: alerts } = trpc.alerts.list.useQuery({ studyId }, { enabled: !!studyId });
  const { data: statusRules } = trpc.calculations.getStatusRules.useQuery(
    { studyId },
    { enabled: !!studyId }
  );

  // Charger les postes pour chaque option
  const allPostsData = useMemo(() => {
    if (!options || options.length === 0) return {};
    const data: Record<number, any[]> = {};
    options.forEach(opt => {
      // Simuler le chargement des postes (à remplacer par des vraies requêtes)
      data[opt.id] = [];
    });
    return data;
  }, [options]);

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

  // Calculer les statistiques
  const optionsArray = options || [];
  const risksArray = risks || [];
  const alertsArray = alerts || [];

  const totalOptions = optionsArray.length;
  const totalPosts = 12; // À remplacer par une vraie requête
  const totalActions = 28; // À remplacer par une vraie requête
  const delayedActions = 5; // À remplacer par une vraie requête
  const highRisks = risksArray.filter(r => r.impact === 'high' || r.probability === 'high').length;

  // Meilleure option
  const bestOption = useMemo(() => {
    if (optionsArray.length === 0) return null;
    return optionsArray.reduce((best, current) => {
      const bestScore = Number(best.globalScore || 0);
      const currentScore = Number(current.globalScore || 0);
      return currentScore > bestScore ? current : best;
    });
  }, [optionsArray]);

  // Données pour le graphique donut
  const chartData = useMemo(() => {
    if (!optionsArray.length) return [];
    return optionsArray.map(opt => ({
      name: opt.name,
      value: Number(opt.globalScore || 0),
    }));
  }, [optionsArray]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Critères d'évaluation
  const evaluationCriteria = [
    { name: language === 'fr' ? 'Impact / Valeur' : 'Impact / Value', weight: 40, icon: TrendingUp },
    { name: language === 'fr' ? 'Faisabilité' : 'Feasibility', weight: 20, icon: CheckCircle },
    { name: language === 'fr' ? 'Coût - Temps' : 'Cost - Time', weight: 20, icon: Clock },
    { name: language === 'fr' ? 'Risque' : 'Risk', weight: 10, icon: AlertCircle },
    { name: language === 'fr' ? 'Réversibilité' : 'Reversibility', weight: 10, icon: CheckCircle },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blueprint-dark">
        <Spinner className="w-8 h-8 text-blueprint-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blueprint-dark text-blueprint-light flex">
      {/* Sidebar */}
      <div className="w-64 bg-blueprint-dark/80 border-r border-blueprint-accent/30 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-blueprint-accent/30 flex items-center gap-3">
          <div className="w-10 h-10 bg-blueprint-accent rounded flex items-center justify-center">
            <span className="text-blueprint-dark font-bold">📊</span>
          </div>
          <span className="font-bold text-blueprint-accent">Feasibility</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={Home} label={language === 'fr' ? 'Tableau de bord' : 'Dashboard'} active />
          <NavItem icon={FileText} label={language === 'fr' ? 'Études' : 'Studies'} />
          <NavItem icon={BarChart3} label={language === 'fr' ? 'Options' : 'Options'} />
          <NavItem icon={Zap} label={language === 'fr' ? 'Postes' : 'Posts'} />
          <NavItem icon={CheckCircle2} label={language === 'fr' ? 'Actions' : 'Actions'} />
          <NavItem icon={Shield} label={language === 'fr' ? 'Risques' : 'Risks'} />
          <NavItem icon={Bell} label={language === 'fr' ? 'Alertes' : 'Alerts'} />
          <NavItem icon={FileText} label={language === 'fr' ? 'Rapports' : 'Reports'} />
          <NavItem icon={Sliders} label={language === 'fr' ? 'Paramètres' : 'Settings'} />
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blueprint-accent/30 space-y-2">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs text-blueprint-light/70">{user?.name || 'Admin'}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              className="text-blueprint-light/70 hover:text-blueprint-accent"
            >
              {language === 'fr' ? '🇬🇧' : '🇫🇷'}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full justify-start gap-2 text-blueprint-light/70 hover:text-blueprint-accent"
          >
            <LogOut className="w-4 h-4" />
            {language === 'fr' ? 'Déconnexion' : 'Logout'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b border-blueprint-accent/30 bg-blueprint-dark/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-blueprint-light/70 text-sm">{language === 'fr' ? 'Étude de faisabilité' : 'Feasibility Study'}</p>
                <h1 className="text-3xl font-bold text-blueprint-accent">{language === 'fr' ? 'Vue globale' : 'Global View'}</h1>
                <p className="text-blueprint-light/70 text-sm mt-1">
                  {language === 'fr'
                    ? 'Synthèse complète de l\'étude et de toutes les options'
                    : 'Complete summary of the study and all options'}
                </p>
              </div>
              <div className="flex items-center gap-3">
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
              <StatCard label={language === 'fr' ? 'Options' : 'Options'} value={totalOptions} icon="📁" />
              <StatCard label={language === 'fr' ? 'Postes' : 'Posts'} value={totalPosts} icon="📋" />
              <StatCard label={language === 'fr' ? 'Actions' : 'Actions'} value={totalActions} icon="✓" />
              <StatCard label={language === 'fr' ? 'Actions en retard' : 'Delayed'} value={delayedActions} icon="⏰" color="red" />
              <StatCard label={language === 'fr' ? 'Risques élevés' : 'High Risks'} value={highRisks} icon="⚠️" color="orange" />
              <StatCard label={language === 'fr' ? 'Alertes' : 'Alerts'} value={alertsArray.length} icon="🔔" color="green" />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-8 grid grid-cols-3 gap-6">
          {/* Left: Legend + Best Option */}
          <div className="space-y-4">
            {/* Légende */}
            <Card className="border-blueprint-accent/30 bg-blueprint-dark/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{language === 'fr' ? 'Légende des statuts' : 'Status Legend'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {Object.entries(statusColors)
                  .slice(0, 12)
                  .map(([status, colors]) => (
                    <div key={status} className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                      <div className={`w-3 h-3 rounded-full ${colors.bg} border ${colors.border}`} />
                      <span className="text-blueprint-light/70 capitalize">{status.replace('_', ' ')}</span>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Meilleure option */}
            {bestOption && (
              <Card className="border-green-500/30 bg-green-500/5 cursor-pointer hover:bg-green-500/10 transition">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-green-400 flex items-center gap-2">
                    <span>🏆</span>
                    {language === 'fr' ? 'Meilleure option' : 'Best Option'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-bold text-green-400 text-lg">{bestOption.name}</p>
                    <p className="text-green-400/70 text-xs">{getStatusColor(bestOption.status).text.replace('text-', '')}</p>
                  </div>
                  <div>
                    <p className="text-blueprint-light/70 text-xs">{language === 'fr' ? 'Score global' : 'Global Score'}</p>
                    <p className="text-2xl font-bold text-green-400">{Number(bestOption.globalScore || 0)} / 100</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Eye className="w-4 h-4" />
                    {language === 'fr' ? 'Voir le détail' : 'View Details'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Center: Arborescence */}
          <div className="col-span-1">
            <Card className="border-blueprint-accent/30 bg-blueprint-dark/50 h-full">
              <CardHeader className="pb-3 flex items-center justify-between">
                <CardTitle className="text-sm">{language === 'fr' ? 'Arborescence globale' : 'Global Tree'}</CardTitle>
                <Button variant="ghost" size="sm" className="text-blueprint-accent hover:bg-blueprint-accent/20">
                  <span className="text-xs">↔</span>
                </Button>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {optionsArray.map(option => (
                  <div key={option.id} className="space-y-1">
                    <div
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition ${
                        selectedOption === option.id ? 'bg-blueprint-accent/20' : 'hover:bg-blueprint-accent/10'
                      }`}
                      onClick={() => {
                        setSelectedOption(option.id);
                        toggleOption(option.id);
                      }}
                    >
                      {expandedOptions.has(option.id) ? (
                        <ChevronDown className="w-4 h-4 text-blueprint-accent" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-blueprint-accent/50" />
                      )}
                      <span className="text-xs font-medium">{option.name}</span>
                      <Badge variant="outline" className="ml-auto text-xs">{Number(option.globalScore || 0)}/100</Badge>
                    </div>

                    {expandedOptions.has(option.id) && (
                      <div className="ml-4 space-y-1 border-l border-blueprint-accent/20 pl-2">
                        <div className="text-xs text-blueprint-light/50 py-1">
                          {language === 'fr' ? '(Postes et actions)' : '(Posts and actions)'}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right: Synthèse, Critères, Alertes */}
          <div className="space-y-4">
            {/* Synthèse des scores */}
            {chartData.length > 0 && (
              <Card className="border-blueprint-accent/30 bg-blueprint-dark/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{language === 'fr' ? 'Synthèse des scores' : 'Score Summary'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}/100`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {optionsArray.map((opt, idx) => (
                      <div key={opt.id} className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-blueprint-light/70">{opt.name}</span>
                        <span className="ml-auto font-bold text-blueprint-accent">{Number(opt.globalScore || 0)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Critères d'évaluation */}
            <Card className="border-blueprint-accent/30 bg-blueprint-dark/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{language === 'fr' ? 'Critères d\'évaluation' : 'Evaluation Criteria'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {evaluationCriteria.map((criteria, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <criteria.icon className="w-4 h-4 text-blueprint-accent" />
                    <span className="text-xs text-blueprint-light/70 flex-1">{criteria.name}</span>
                    <span className="text-xs font-bold text-blueprint-accent">{criteria.weight}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Alertes actives */}
            <Card className="border-blueprint-accent/30 bg-blueprint-dark/50">
              <CardHeader className="pb-3 flex items-center justify-between">
                <CardTitle className="text-sm">{language === 'fr' ? 'Alertes actives' : 'Active Alerts'}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAlerts(!showAlerts)}
                  className="text-blueprint-accent text-xs"
                >
                  {language === 'fr' ? 'Voir tout' : 'View All'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                <AlertItem icon="⏰" label={language === 'fr' ? 'Actions en retard' : 'Delayed Actions'} count={delayedActions} color="red" />
                <AlertItem icon="⚠️" label={language === 'fr' ? 'Risques élevés' : 'High Risks'} count={highRisks} color="orange" />
                <AlertItem icon="📋" label={language === 'fr' ? 'Postes à revoir' : 'Posts to Review'} count={4} color="yellow" />
                <AlertItem icon="⚡" label={language === 'fr' ? 'Décisions en attente' : 'Pending Decisions'} count={2} color="blue" />
              </CardContent>
            </Card>

            {/* Règles automatiques */}
            <Card className="border-blueprint-accent/30 bg-blueprint-dark/50">
              <CardHeader className="pb-3 flex items-center justify-between">
                <CardTitle className="text-sm">{language === 'fr' ? 'Règles automatiques' : 'Automatic Rules'}</CardTitle>
                <Button variant="ghost" size="sm" className="text-blueprint-accent text-xs">
                  {language === 'fr' ? 'Voir tout' : 'View All'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                <RuleItem label={language === 'fr' ? 'Règle de score global' : 'Global Score Rule'} active />
                <RuleItem label={language === 'fr' ? 'Règle de risque' : 'Risk Rule'} active />
                <RuleItem label={language === 'fr' ? 'Règle de délai' : 'Delay Rule'} active />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer: Chronologie */}
        <div className="px-8 pb-8">
          <Card className="border-blueprint-accent/30 bg-blueprint-dark/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{language === 'fr' ? 'Chronologie globale' : 'Global Timeline'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <TimelineItem label={language === 'fr' ? 'Création de l\'étude' : 'Study Creation'} date="01/04/2024" />
                <div className="flex-1 h-1 bg-blueprint-accent/30 mx-2" />
                <TimelineItem label={language === 'fr' ? 'Ajout des options' : 'Add Options'} date="05/04/2024" />
                <div className="flex-1 h-1 bg-blueprint-accent/30 mx-2" />
                <TimelineItem label={language === 'fr' ? 'Début des postes' : 'Start Posts'} date="10/04/2024" />
                <div className="flex-1 h-1 bg-blueprint-accent/30 mx-2" />
                <TimelineItem label={language === 'fr' ? 'Actions en cours' : 'Actions In Progress'} date="15/04/2024" />
                <div className="flex-1 h-1 bg-blueprint-accent/30 mx-2" />
                <TimelineItem label={language === 'fr' ? 'Dernière action' : 'Last Action'} date="20/05/2024" />
                <div className="flex-1 h-1 bg-blueprint-accent/30 mx-2" />
                <div className="text-center">
                  <p className="text-xs text-blueprint-light/70">{language === 'fr' ? 'Décision finale prévue' : 'Final Decision Expected'}</p>
                  <p className="text-sm font-bold text-green-400">19/06/2024</p>
                  <p className="text-xs text-blueprint-light/50">{language === 'fr' ? '(Dans 30 jours)' : '(In 30 days)'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="px-8 pb-4 text-xs text-blueprint-light/50 border-t border-blueprint-accent/30 py-4">
          <p>
            {language === 'fr'
              ? 'Étude ID: #1234 • Créée le 01/04/2024 par Admin • Dernière mise à jour : 20/05/2024 à 14:30'
              : 'Study ID: #1234 • Created on 01/04/2024 by Admin • Last updated: 20/05/2024 at 14:30'}
          </p>
        </div>
      </div>
    </div>
  );
}

// Composants auxiliaires
function NavItem({ icon: Icon, label, active = false }: { icon: any; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition ${
        active
          ? 'bg-blueprint-accent/20 text-blueprint-accent'
          : 'text-blueprint-light/70 hover:bg-blueprint-accent/10 hover:text-blueprint-accent'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}

function StatCard({ label, value, icon, color = 'blue' }: { label: string; value: number; icon: string; color?: string }) {
  const bgColor = {
    blue: 'bg-blue-500/10 border-blue-500/30',
    red: 'bg-red-500/10 border-red-500/30',
    orange: 'bg-orange-500/10 border-orange-500/30',
    green: 'bg-green-500/10 border-green-500/30',
  }[color];

  const textColor = {
    blue: 'text-blue-400',
    red: 'text-red-400',
    orange: 'text-orange-400',
    green: 'text-green-400',
  }[color];

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded border ${bgColor}`}>
      <span className="text-2xl">{icon}</span>
      <div>
        <p className={`text-lg font-bold ${textColor}`}>{value}</p>
        <p className="text-xs text-blueprint-light/70">{label}</p>
      </div>
    </div>
  );
}

function AlertItem({ icon, label, count, color }: { icon: string; label: string; count: number; color: string }) {
  const textColor = {
    red: 'text-red-400',
    orange: 'text-orange-400',
    yellow: 'text-yellow-400',
    blue: 'text-blue-400',
  }[color];

  return (
    <div className="flex items-center justify-between p-2 rounded hover:bg-blueprint-accent/10 cursor-pointer transition">
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="text-xs text-blueprint-light/70">{label}</span>
      </div>
      <span className={`text-sm font-bold ${textColor}`}>{count}</span>
    </div>
  );
}

function RuleItem({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between p-2 rounded hover:bg-blueprint-accent/10 cursor-pointer transition">
      <span className="text-xs text-blueprint-light/70">{label}</span>
      <Badge variant={active ? 'default' : 'secondary'} className="text-xs">
        {active ? '✓ Active' : 'Inactive'}
      </Badge>
    </div>
  );
}

function TimelineItem({ label, date }: { label: string; date: string }) {
  return (
    <div className="text-center">
      <div className="w-6 h-6 rounded-full bg-blueprint-accent/30 border border-blueprint-accent mx-auto mb-2" />
      <p className="text-xs text-blueprint-light/70">{label}</p>
      <p className="text-xs font-bold text-blueprint-accent">{date}</p>
    </div>
  );
}
