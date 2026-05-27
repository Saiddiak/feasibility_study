import { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, Filter, Plus, LogOut, Settings, BarChart3, BookOpen, FolderOpen, CheckSquare, AlertTriangle, Bell, FileText, Shield } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

interface Action {
  id: number;
  name: string;
  status: 'completed' | 'in_progress' | 'delayed' | 'pending';
  score: number;
}

interface Post {
  id: number;
  name: string;
  status: string;
  score: number;
  actions: Action[];
}

interface Option {
  id: number;
  name: string;
  status: string;
  score: number;
  posts: Post[];
}

const mockData: Option[] = [
  {
    id: 1,
    name: 'Option A - Modernisation du système existant',
    status: 'risk',
    score: 62,
    posts: [
      {
        id: 1,
        name: 'Poste A1 - Analyse et conception',
        status: 'in_progress',
        score: 70,
        actions: [
          { id: 1, name: 'Action A1.1 - Collecte des besoins', status: 'completed', score: 100 },
          { id: 2, name: 'Action A1.2 - Spécifications fonctionnelles', status: 'delayed', score: 40 },
        ],
      },
      {
        id: 2,
        name: 'Poste A2 - Développement',
        status: 'in_progress',
        score: 55,
        actions: [
          { id: 3, name: 'Action A2.1 - Développement module 1', status: 'delayed', score: 30 },
          { id: 4, name: 'Action A2.2 - Développement module 2', status: 'pending', score: 0 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Option B - Nouvelle solution',
    status: 'favorable',
    score: 78,
    posts: [
      {
        id: 3,
        name: 'Poste B1 - Étude de faisabilité',
        status: 'completed',
        score: 90,
        actions: [],
      },
      {
        id: 4,
        name: 'Poste B2 - Implémentation',
        status: 'in_progress',
        score: 65,
        actions: [],
      },
    ],
  },
  {
    id: 3,
    name: 'Option C - Solution hybride',
    status: 'risk',
    score: 58,
    posts: [],
  },
  {
    id: 4,
    name: 'Option D - Abandon du projet',
    status: 'abandoned',
    score: 20,
    posts: [],
  },
];

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  favorable: { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-500' },
  risk: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-500' },
  blocked: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-500' },
  abandoned: { bg: 'bg-gray-500/20', text: 'text-gray-400', dot: 'bg-gray-500' },
  in_progress: { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-500' },
  completed: { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-500' },
  delayed: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-500' },
  pending: { bg: 'bg-gray-500/20', text: 'text-gray-400', dot: 'bg-gray-500' },
};

export default function GlobalViewProfessional() {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [expandedOptions, setExpandedOptions] = useState<Set<number>>(new Set([1, 2]));
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set([1, 3]));

  const toggleOption = (id: number) => {
    const newSet = new Set(expandedOptions);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedOptions(newSet);
  };

  const togglePost = (id: number) => {
    const newSet = new Set(expandedPosts);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedPosts(newSet);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      favorable: 'Favorable',
      risk: 'Risque',
      blocked: 'Bloqué',
      abandoned: 'Abandonné',
      in_progress: 'En cours',
      completed: 'Terminé',
      delayed: 'En retard',
      pending: 'À traiter',
    };
    return labels[status] || status;
  };

  const totalOptions = mockData.length;
  const totalPosts = mockData.reduce((sum, opt) => sum + opt.posts.length, 0);
  const totalActions = mockData.reduce((sum, opt) => sum + opt.posts.reduce((s, p) => s + p.actions.length, 0), 0);
  const delayedActions = mockData.reduce((sum, opt) => sum + opt.posts.reduce((s, p) => s + p.actions.filter(a => a.status === 'delayed').length, 0), 0);
  const highRisks = mockData.filter(opt => opt.status === 'risk').length;
  const alerts = delayedActions + highRisks;

  const avgScore = Math.round(mockData.reduce((sum, opt) => sum + opt.score, 0) / mockData.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" style={{
      backgroundImage: `
        linear-gradient(0deg, transparent 24%, rgba(79, 172, 254, 0.05) 25%, rgba(79, 172, 254, 0.05) 26%, transparent 27%, transparent 74%, rgba(79, 172, 254, 0.05) 75%, rgba(79, 172, 254, 0.05) 76%, transparent 77%, transparent),
        linear-gradient(90deg, transparent 24%, rgba(79, 172, 254, 0.05) 25%, rgba(79, 172, 254, 0.05) 26%, transparent 27%, transparent 74%, rgba(79, 172, 254, 0.05) 75%, rgba(79, 172, 254, 0.05) 76%, transparent 77%, transparent)
      `,
      backgroundSize: '50px 50px',
    }}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-slate-950/80 border-r border-blue-500/20 flex flex-col">
          {/* Logo */}
          <div className="p-4 border-b border-blue-500/20 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">Faisabilité</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {[
              { icon: BarChart3, label: 'Tableau de bord', active: true },
              { icon: BookOpen, label: 'Études' },
              { icon: FolderOpen, label: 'Options' },
              { icon: CheckSquare, label: 'Postes' },
              { icon: CheckSquare, label: 'Actions' },
              { icon: AlertTriangle, label: 'Risques' },
              { icon: Bell, label: 'Alertes' },
              { icon: FileText, label: 'Rapports' },
              { icon: Settings, label: 'Paramètres' },
            ].map((item, i) => (
              <button
                key={i}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800/50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-blue-500/20 space-y-2">
            <div className="flex items-center gap-2 px-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-slate-950/50 border-b border-blue-500/20 px-8 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Étude de faisabilité</p>
              <h1 className="text-2xl font-bold text-white">Vue globale</h1>
              <p className="text-sm text-gray-400 mt-1">Synthèse complète de l'étude et de toutes les options</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/10 transition-colors">
                <Filter className="w-4 h-4" />
                Filtrer
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-6 gap-4">
                <div className="bg-slate-800/50 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FolderOpen className="w-5 h-5 text-blue-400" />
                    <span className="text-2xl font-bold text-white">{totalOptions}</span>
                  </div>
                  <p className="text-sm text-gray-400">Options</p>
                  <p className="text-xs text-gray-500">Total des options</p>
                </div>

                <div className="bg-slate-800/50 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckSquare className="w-5 h-5 text-blue-400" />
                    <span className="text-2xl font-bold text-white">{totalPosts}</span>
                  </div>
                  <p className="text-sm text-gray-400">Postes</p>
                  <p className="text-xs text-gray-500">Tous les postes</p>
                </div>

                <div className="bg-slate-800/50 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckSquare className="w-5 h-5 text-green-400" />
                    <span className="text-2xl font-bold text-white">{totalActions}</span>
                  </div>
                  <p className="text-sm text-gray-400">Actions</p>
                  <p className="text-xs text-gray-500">Toutes les actions</p>
                </div>

                <div className="bg-slate-800/50 border border-orange-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    <span className="text-2xl font-bold text-white">{delayedActions}</span>
                  </div>
                  <p className="text-sm text-gray-400">Actions en retard</p>
                  <p className="text-xs text-gray-500">À traiter</p>
                </div>

                <div className="bg-slate-800/50 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    <span className="text-2xl font-bold text-white">{highRisks}</span>
                  </div>
                  <p className="text-sm text-gray-400">Risques élevés</p>
                  <p className="text-xs text-gray-500">Impact / Probabilité</p>
                </div>

                <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="w-5 h-5 text-purple-400" />
                    <span className="text-2xl font-bold text-white">{alerts}</span>
                  </div>
                  <p className="text-sm text-gray-400">Alertes</p>
                  <p className="text-xs text-gray-500">Actives</p>
                </div>
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-3 gap-6">
                {/* Left: Tree and Legend */}
                <div className="col-span-2 space-y-6">
                  {/* Legend */}
                  <div className="bg-slate-800/50 border border-blue-500/20 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Légende des statuts</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { status: 'favorable', label: 'Favorable' },
                        { status: 'risk', label: 'Risque' },
                        { status: 'blocked', label: 'Bloqué' },
                        { status: 'abandoned', label: 'Abandonné' },
                        { status: 'in_progress', label: 'En cours' },
                        { status: 'completed', label: 'Terminé' },
                        { status: 'delayed', label: 'En retard' },
                        { status: 'pending', label: 'À traiter' },
                      ].map((item) => (
                        <div key={item.status} className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${statusColors[item.status]?.dot}`} />
                          <span className="text-xs text-gray-400">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tree */}
                  <div className="bg-slate-800/50 border border-blue-500/20 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-4">Arborescence globale</h3>
                    <div className="space-y-2">
                      {mockData.map((option) => (
                        <div key={option.id}>
                          <button
                            onClick={() => toggleOption(option.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-700/50 rounded transition-colors text-left"
                          >
                            {expandedOptions.has(option.id) ? (
                              <ChevronDown className="w-4 h-4 text-blue-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-blue-400" />
                            )}
                            <FolderOpen className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-white flex-1">{option.name}</span>
                            <span className={`text-xs px-2 py-1 rounded ${statusColors[option.status]?.bg} ${statusColors[option.status]?.text}`}>
                              {getStatusLabel(option.status)}
                            </span>
                            <span className="text-sm font-semibold text-white">{option.score} / 100</span>
                          </button>

                          {expandedOptions.has(option.id) && (
                            <div className="ml-6 space-y-1">
                              {option.posts.map((post) => (
                                <div key={post.id}>
                                  <button
                                    onClick={() => togglePost(post.id)}
                                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-700/50 rounded transition-colors text-left"
                                  >
                                    {expandedPosts.has(post.id) ? (
                                      <ChevronDown className="w-4 h-4 text-blue-300" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-blue-300" />
                                    )}
                                    <CheckSquare className="w-4 h-4 text-blue-300" />
                                    <span className="text-sm text-gray-300 flex-1">{post.name}</span>
                                    <span className={`text-xs px-2 py-1 rounded ${statusColors[post.status]?.bg} ${statusColors[post.status]?.text}`}>
                                      {getStatusLabel(post.status)}
                                    </span>
                                    <span className="text-sm font-semibold text-white">{post.score} / 100</span>
                                  </button>

                                  {expandedPosts.has(post.id) && (
                                    <div className="ml-6 space-y-1">
                                      {post.actions.map((action) => (
                                        <div key={action.id} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:bg-slate-700/50 rounded transition-colors">
                                          <div className={`w-2 h-2 rounded-full ${statusColors[action.status]?.dot}`} />
                                          <span className="flex-1">{action.name}</span>
                                          <span className={`text-xs px-2 py-1 rounded ${statusColors[action.status]?.bg} ${statusColors[action.status]?.text}`}>
                                            {getStatusLabel(action.status)}
                                          </span>
                                          <span className="font-semibold text-white">{action.score} / 100</span>
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
                </div>

                {/* Right: Scores and Alerts */}
                <div className="space-y-6">
                  {/* Score Summary */}
                  <div className="bg-slate-800/50 border border-blue-500/20 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-4">Synthèse des scores</h3>
                    <div className="flex justify-center mb-4">
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                          <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="8" />
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            strokeDasharray={`${(avgScore / 100) * 314} 314`}
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-white">{avgScore}</span>
                          <span className="text-xs text-gray-400">/100</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-400" />
                          <span className="text-gray-400">Impact / Valeur</span>
                        </div>
                        <span className="text-white font-semibold">40%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                          <span className="text-gray-400">Faisabilité</span>
                        </div>
                        <span className="text-white font-semibold">20%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-400" />
                          <span className="text-gray-400">Coût - Temps</span>
                        </div>
                        <span className="text-white font-semibold">20%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-400" />
                          <span className="text-gray-400">Risque</span>
                        </div>
                        <span className="text-white font-semibold">10%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-400" />
                          <span className="text-gray-400">Réversibilité</span>
                        </div>
                        <span className="text-white font-semibold">10%</span>
                      </div>
                    </div>
                  </div>

                  {/* Criteria */}
                  <div className="bg-slate-800/50 border border-blue-500/20 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Critères d'évaluation</h3>
                    <div className="space-y-2 text-sm">
                      {[
                        { icon: '📊', label: 'Impact / Valeur', value: '40%' },
                        { icon: '✓', label: 'Faisabilité', value: '20%' },
                        { icon: '⏱', label: 'Coût - Temps', value: '20%' },
                        { icon: '⚠', label: 'Risque', value: '10%' },
                        { icon: '↩', label: 'Réversibilité', value: '10%' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-gray-400">{item.label}</span>
                          <span className="text-white font-semibold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Alerts */}
                  <div className="bg-slate-800/50 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-white">Alertes actives</h3>
                      <a href="#" className="text-xs text-blue-400 hover:text-blue-300">Voir tout</a>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-gray-400">Actions en retard</span>
                        </div>
                        <span className="text-red-400 font-semibold">5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-gray-400">Risques élevés</span>
                        </div>
                        <span className="text-red-400 font-semibold">3</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          <span className="text-gray-400">Postes à revoir</span>
                        </div>
                        <span className="text-yellow-400 font-semibold">4</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-gray-400">Décisions en attente</span>
                        </div>
                        <span className="text-blue-400 font-semibold">2</span>
                      </div>
                    </div>
                  </div>

                  {/* Automatic Rules */}
                  <div className="bg-slate-800/50 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-white">Règles automatiques</h3>
                      <a href="#" className="text-xs text-blue-400 hover:text-blue-300">Voir tout</a>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-gray-400">Règle de score global</span>
                        </div>
                        <span className="text-green-400 font-semibold">Actif</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-gray-400">Règle de risque</span>
                        </div>
                        <span className="text-green-400 font-semibold">Actif</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-gray-400">Règle de délai</span>
                        </div>
                        <span className="text-green-400 font-semibold">Actif</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-slate-800/50 border border-blue-500/20 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-4">Chronologie globale</h3>
                <div className="flex items-center justify-between">
                  {[
                    { label: 'Création de l\'étude', date: '07/04/2024', completed: true },
                    { label: 'Ajout des options', date: '05/04/2024', completed: true },
                    { label: 'Début des postes', date: '10/04/2024', completed: true },
                    { label: 'Actions en cours', date: '15/04/2024', completed: true },
                    { label: 'Dernière action', date: '20/05/2024', completed: true },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center flex-1">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mb-2 ${item.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-500'}`}>
                        {item.completed && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <p className="text-xs text-gray-400 text-center">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="text-xs text-gray-500 border-t border-blue-500/20 pt-4">
                Étude ID : #1234 • Créée le 07/04/2024 par Admin • Dernière mise à jour : 20/05/2024 à 14:30
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
