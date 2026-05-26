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
  Sun,
  Moon,
  ChevronLeft,
  ChevronUp,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const statusColors: Record<string, { bg: string; text: string; border: string; icon: string; dot: string }> = {
  'favorable': { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', icon: '✓', dot: '●' },
  'risky': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: '⚠', dot: '●' },
  'blocked': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: '✕', dot: '●' },
  'abandoned': { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', icon: '-', dot: '●' },
  'completed': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', icon: '✓', dot: '●' },
  'pending': { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', icon: '◌', dot: '●' },
  'idea': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', icon: '💡', dot: '●' },
  'in_progress': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', icon: '→', dot: '●' },
  'to_review': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: '📋', dot: '●' },
  'in_retard': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: '⏱', dot: '●' },
  'terminated': { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', icon: '✓', dot: '●' },
};

interface GlobalViewEnhancedProps {
  studyId: number;
}

export default function GlobalViewEnhanced({ studyId }: GlobalViewEnhancedProps) {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedOptions, setExpandedOptions] = useState<Set<number>>(new Set());
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(true);

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

  const getStatusColor = (status?: string) => {
    return statusColors[status || 'pending'] || statusColors['pending'];
  };

  const optionsArray = options || [];
  const risksArray = risks || [];
  const alertsArray = alerts || [];

  const bestOption = useMemo(() => {
    if (optionsArray.length === 0) return null;
    return optionsArray.reduce((best, current) => {
      const bestScore = Number(best.globalScore || 0);
      const currentScore = Number(current.globalScore || 0);
      return currentScore > bestScore ? current : best;
    });
  }, [optionsArray]);

  const chartData = useMemo(() => {
    if (!optionsArray.length) return [];
    return optionsArray.map(opt => ({
      name: opt.name,
      value: Number(opt.globalScore || 0),
    }));
  }, [optionsArray]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const evaluationCriteria = [
    { name: language === 'fr' ? 'Impact / Valeur' : 'Impact / Value', weight: 40, icon: TrendingUp },
    { name: language === 'fr' ? 'Faisabilité' : 'Feasibility', weight: 20, icon: CheckCircle },
    { name: language === 'fr' ? 'Coût - Temps' : 'Cost - Time', weight: 20, icon: Clock },
    { name: language === 'fr' ? 'Risque' : 'Risk', weight: 10, icon: AlertCircle },
    { name: language === 'fr' ? 'Réversibilité' : 'Reversibility', weight: 10, icon: CheckCircle },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <Spinner className="w-8 h-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
        } border-r flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 justify-between">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold">📊</span>
          </div>
          {sidebarOpen && <span className="font-bold text-blue-400 text-sm">Feasibility</span>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-slate-800 rounded transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
          <NavItem icon={Home} label="Tableau de bord" active sidebarOpen={sidebarOpen} />
          <NavItem icon={FileText} label="Études" sidebarOpen={sidebarOpen} />
          <NavItem icon={BarChart3} label="Options" sidebarOpen={sidebarOpen} />
          <NavItem icon={Zap} label="Postes" sidebarOpen={sidebarOpen} />
          <NavItem icon={CheckCircle2} label="Actions" sidebarOpen={sidebarOpen} />
          <NavItem icon={Shield} label="Risques" sidebarOpen={sidebarOpen} />
          <NavItem icon={Bell} label="Alertes" sidebarOpen={sidebarOpen} />
          <NavItem icon={FileText} label="Rapports" sidebarOpen={sidebarOpen} />
          <NavItem icon={Sliders} label="Paramètres" sidebarOpen={sidebarOpen} />
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.[0] || 'A'}
                </div>
                <div>
                  <p className="text-xs font-semibold">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-slate-400">Administrateur</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded hover:bg-slate-800 transition"
            >
              {language === 'fr' ? '🇬🇧' : '🇫🇷'} {language === 'fr' ? 'English' : 'Français'}
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded hover:bg-red-500/20 text-red-400 transition"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        )}

        {/* Theme Toggle */}
        <div className="p-3 border-t border-slate-800 flex items-center justify-center gap-2">
          <button
            onClick={() => setDarkMode(true)}
            className={`p-2 rounded transition ${
              darkMode ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Moon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDarkMode(false)}
            className={`p-2 rounded transition ${
              !darkMode ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Sun className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div
          className={`border-b ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          } sticky top-0 z-40`}
        >
          <div className="px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Étude de faisabilité
                </p>
                <h1 className="text-3xl font-bold text-blue-400 mb-1">Vue globale</h1>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Synthèse complète de l'étude et de toutes les options
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className={`gap-2 ${
                    darkMode
                      ? 'border-slate-600 text-slate-300 hover:bg-slate-800'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filtrer
                </Button>
                <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Ajouter
                </Button>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-6 gap-4">
              <StatCard
                label="Options"
                value={optionsArray.length}
                icon="📁"
                color="blue"
                darkMode={darkMode}
                sublabel="Total des options"
              />
              <StatCard
                label="Postes"
                value={12}
                icon="📋"
                color="blue"
                darkMode={darkMode}
                sublabel="Tous les postes"
              />
              <StatCard
                label="Actions"
                value={28}
                icon="✓"
                color="green"
                darkMode={darkMode}
                sublabel="Toutes les actions"
              />
              <StatCard
                label="Actions en retard"
                value={5}
                icon="⏰"
                color="orange"
                darkMode={darkMode}
                sublabel="À traiter"
              />
              <StatCard
                label="Risques élevés"
                value={3}
                icon="🛡️"
                color="red"
                darkMode={darkMode}
                sublabel="Impact / Probabilité"
              />
              <StatCard
                label="Alertes"
                value={7}
                icon="🔔"
                color="purple"
                darkMode={darkMode}
                sublabel="Actives"
              />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-8 grid grid-cols-4 gap-6">
          {/* Left: Legend + Best Option */}
          <div className="space-y-4">
            {/* Légende */}
            <Card
              className={`${
                darkMode
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-white border-slate-200'
              } border`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-blue-400">Légende des statuts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {[
                  { status: 'favorable', label: 'Favorable' },
                  { status: 'risky', label: 'Risque' },
                  { status: 'blocked', label: 'Bloqué' },
                  { status: 'abandoned', label: 'Abandonné' },
                  { status: 'completed', label: 'Terminé' },
                  { status: 'in_progress', label: 'En cours' },
                  { status: 'en_attente', label: 'En attente' },
                  { status: 'idea', label: 'Idée' },
                  { status: 'in_retard', label: 'En retard' },
                  { status: 'terminated', label: 'Terminé / Clôturé' },
                ].map(({ status, label }) => (
                  <div key={status} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
                    <span className={`text-sm font-bold ${getStatusColor(status).text}`}>
                      {getStatusColor(status).dot}
                    </span>
                    <span
                      className={`text-sm ${
                        darkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Meilleure option */}
            {bestOption && (
              <Card
                className={`${
                  darkMode
                    ? 'bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30'
                    : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                } border cursor-pointer hover:shadow-lg transition`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-green-400 flex items-center gap-2">
                    <span>🏆</span>
                    Meilleure option
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-lg font-bold text-green-400">{bestOption.name}</p>
                    <Badge
                      className={`mt-1 ${
                        getStatusColor(bestOption.status).bg
                      } ${getStatusColor(bestOption.status).text}`}
                    >
                      {getStatusColor(bestOption.status).icon} Favorable
                    </Badge>
                  </div>
                  <div>
                    <p
                      className={`text-xs ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      Score global
                    </p>
                    <p className="text-3xl font-bold text-green-400">
                      {Number(bestOption.globalScore || 0)}
                    </p>
                    <p className="text-xs text-green-400/70">/ 100</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`w-full gap-2 ${
                      darkMode
                        ? 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                        : 'border-green-300 text-green-700 hover:bg-green-50'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    Voir le détail
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Center: Arborescence */}
          <div className="col-span-2">
            <Card
              className={`${
                darkMode
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-white border-slate-200'
              } border h-full`}
            >
              <CardHeader className="pb-3 flex items-center justify-between">
                <CardTitle className="text-sm">Arborescence globale</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-400 hover:bg-blue-500/10"
                >
                  <span className="text-xs">↔ Tout développer</span>
                </Button>
              </CardHeader>
              <CardContent className="space-y-1 max-h-96 overflow-y-auto">
                {optionsArray.map((option) => (
                  <TreeItem
                    key={option.id}
                    option={option}
                    expanded={expandedOptions.has(option.id)}
                    onToggle={() => toggleOption(option.id)}
                    selected={selectedOption === option.id}
                    onSelect={() => setSelectedOption(option.id)}
                    darkMode={darkMode}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right: Synthèse, Critères, Alertes */}
          <div className="space-y-4">
            {/* Synthèse des scores */}
            {chartData.length > 0 && (
              <Card
                className={`${
                  darkMode
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-white border-slate-200'
                } border`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Synthèse des scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center mb-4">
                    <div className="w-40 h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}/100`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {optionsArray.map((opt, idx) => (
                      <div
                        key={opt.id}
                        className={`flex items-center gap-2 text-xs p-2 rounded ${
                          darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                        }`}
                      >
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: COLORS[idx % COLORS.length],
                          }}
                        />
                        <span
                          className={darkMode ? 'text-slate-300' : 'text-slate-700'}
                        >
                          {opt.name}
                        </span>
                        <span className="ml-auto font-bold text-blue-400">
                          {Number(opt.globalScore || 0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Critères d'évaluation */}
            <Card
              className={`${
                darkMode
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-white border-slate-200'
              } border`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Critères d'évaluation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {evaluationCriteria.map((criteria, idx) => {
                  const Icon = criteria.icon;
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span
                        className={`text-sm flex-1 ${
                          darkMode ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        {criteria.name}
                      </span>
                      <span className="text-sm font-bold text-blue-400">
                        {criteria.weight}%
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Alertes actives */}
            <Card
              className={`${
                darkMode
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-white border-slate-200'
              } border`}
            >
              <CardHeader className="pb-3 flex items-center justify-between">
                <CardTitle className="text-sm">Alertes actives</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-400 text-xs hover:bg-blue-500/10"
                >
                  Voir tout
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { icon: '⏰', label: 'Actions en retard', count: 5, color: 'text-red-400' },
                  { icon: '⚠️', label: 'Risques élevés', count: 3, color: 'text-orange-400' },
                  { icon: '📋', label: 'Postes à revoir', count: 4, color: 'text-yellow-400' },
                  { icon: '⚡', label: 'Décisions en attente', count: 2, color: 'text-blue-400' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition ${
                      darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span>{item.icon}</span>
                      <span
                        className={`text-sm truncate ${
                          darkMode ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <span className={`text-sm font-bold ${item.color} flex-shrink-0`}>
                      {item.count}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Règles automatiques */}
            <Card
              className={`${
                darkMode
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-white border-slate-200'
              } border`}
            >
              <CardHeader className="pb-3 flex items-center justify-between">
                <CardTitle className="text-sm">Règles automatiques</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-400 text-xs hover:bg-blue-500/10"
                >
                  Voir tout
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  'Règle de score global',
                  'Règle de risque',
                  'Règle de délai',
                ].map((rule, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition ${
                      darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        darkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      {rule}
                    </span>
                    <Badge className="text-xs bg-green-500/20 text-green-400 border-0">
                      ✓ Active
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer: Timeline */}
        <div className="px-8 pb-8">
          <Card
            className={`${
              darkMode
                ? 'bg-slate-900 border-slate-800'
                : 'bg-white border-slate-200'
            } border`}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-sm">Chronologie globale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-2">
                <TimelinePoint label="Création de l'étude" date="07/04/2024" />
                <TimelineConnector />
                <TimelinePoint label="Ajout des options" date="05/04/2024" />
                <TimelineConnector />
                <TimelinePoint label="Début des postes" date="10/04/2024" />
                <TimelineConnector />
                <TimelinePoint label="Actions en cours" date="15/04/2024" />
                <TimelineConnector />
                <TimelinePoint label="Dernière action" date="20/05/2024" />
                <TimelineConnector />
                <div className="text-center p-3 rounded border-2 border-dashed border-green-500/30">
                  <p className="text-xs text-slate-400">Décision finale prévue</p>
                  <p className="text-lg font-bold text-green-400">19/06/2024</p>
                  <p className="text-xs text-slate-400">(Dans 30 jours)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div
          className={`px-8 pb-4 text-xs border-t ${
            darkMode
              ? 'bg-slate-900/50 border-slate-800 text-slate-400'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          } py-4`}
        >
          <p>
            Étude ID: #1234 • Créée le 01/04/2024 par Admin • Dernière mise à jour : 20/05/2024
            à 14:30
          </p>
        </div>
      </div>
    </div>
  );
}

// Composants auxiliaires
function NavItem({
  icon: Icon,
  label,
  active = false,
  sidebarOpen,
}: {
  icon: any;
  label: string;
  active?: boolean;
  sidebarOpen: boolean;
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
      title={label}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      {sidebarOpen && <span className="truncate">{label}</span>}
    </button>
  );
}

function StatCard({
  label,
  value,
  icon,
  color = 'blue',
  darkMode,
  sublabel,
}: {
  label: string;
  value: number;
  icon: string;
  color?: string;
  darkMode: boolean;
  sublabel?: string;
}) {
  const bgColorMap = {
    blue: darkMode ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200',
    green: darkMode ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200',
    orange: darkMode
      ? 'bg-orange-500/10 border-orange-500/30'
      : 'bg-orange-50 border-orange-200',
    red: darkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200',
    purple: darkMode
      ? 'bg-purple-500/10 border-purple-500/30'
      : 'bg-purple-50 border-purple-200',
  };

  const textColorMap = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    orange: 'text-orange-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
  };

  return (
    <div
      className={`p-4 rounded-lg border ${bgColorMap[color as keyof typeof bgColorMap]}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <p className={`text-lg font-bold ${textColorMap[color as keyof typeof textColorMap]}`}>
            {value}
          </p>
          <p
            className={`text-xs ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {label}
          </p>
          {sublabel && (
            <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface TreeItemProps {
  option: any;
  expanded: boolean;
  onToggle: () => void;
  selected: boolean;
  onSelect: () => void;
  darkMode: boolean;
}

function TreeItem({
  option,
  expanded,
  onToggle,
  selected,
  onSelect,
  darkMode,
}: TreeItemProps) {
  return (
    <div className="space-y-1">
      <div
        onClick={() => {
          onToggle();
          onSelect();
        }}
        className={`flex items-center gap-2 p-2 rounded cursor-pointer transition ${
          selected
            ? darkMode
              ? 'bg-blue-500/20'
              : 'bg-blue-100'
            : darkMode
            ? 'hover:bg-slate-800'
            : 'hover:bg-slate-100'
        }`}
      >
        <div className="flex items-center gap-1 flex-1 min-w-0">
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-blue-400 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
          )}
          <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">📁</span>
          <span
            className={`text-sm font-medium truncate ${
              darkMode ? 'text-slate-200' : 'text-slate-900'
            }`}
          >
            {option.name}
          </span>
        </div>
        <Badge
          variant="outline"
          className={`text-xs flex-shrink-0 ${
            darkMode
              ? 'border-slate-600 text-slate-300'
              : 'border-slate-300 text-slate-700'
          }`}
        >
          {Number(option.globalScore || 0)}/100
        </Badge>
      </div>

      {expanded && (
        <div
          className={`ml-4 pl-2 border-l ${
            darkMode ? 'border-slate-700' : 'border-slate-200'
          }`}
        >
          <div
            className={`text-xs py-2 ${
              darkMode ? 'text-slate-500' : 'text-slate-500'
            }`}
          >
            📋 Poste A1 - Analyse et conception
            <span
              className={`ml-2 px-2 py-1 rounded text-xs ${
                darkMode
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              En cours
            </span>
            <span className="ml-2 text-blue-400">70 / 100</span>
          </div>
          <div
            className={`text-xs py-2 ${
              darkMode ? 'text-slate-500' : 'text-slate-500'
            }`}
          >
            📋 Poste A2 - Développement
            <span
              className={`ml-2 px-2 py-1 rounded text-xs ${
                darkMode
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              En cours
            </span>
            <span className="ml-2 text-blue-400">55 / 100</span>
          </div>
        </div>
      )}
    </div>
  );
}

function TimelinePoint({
  label,
  date,
}: {
  label: string;
  date: string;
}) {
  return (
    <div className="text-center flex-1">
      <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-blue-400 mx-auto mb-2" />
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-xs font-semibold text-blue-400">{date}</p>
    </div>
  );
}

function TimelineConnector() {
  return <div className="flex-1 h-1 bg-blue-600/30 mx-1" />;
}
