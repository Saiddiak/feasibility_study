import { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, Filter, Plus, LogOut, Settings, BarChart3, BookOpen, FolderOpen, CheckSquare, AlertTriangle, Bell, FileText, Shield, Sun, Moon } from 'lucide-react';
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

const statusColors: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  favorable: { bg: '#10b981', text: '#10b981', dot: '#10b981', border: '#10b981' },
  risk: { bg: '#f59e0b', text: '#f59e0b', dot: '#f59e0b', border: '#f59e0b' },
  blocked: { bg: '#ef4444', text: '#ef4444', dot: '#ef4444', border: '#ef4444' },
  abandoned: { bg: '#6b7280', text: '#6b7280', dot: '#6b7280', border: '#6b7280' },
  in_progress: { bg: '#3b82f6', text: '#3b82f6', dot: '#3b82f6', border: '#3b82f6' },
  completed: { bg: '#10b981', text: '#10b981', dot: '#10b981', border: '#10b981' },
  delayed: { bg: '#ef4444', text: '#ef4444', dot: '#ef4444', border: '#ef4444' },
  pending: { bg: '#6b7280', text: '#6b7280', dot: '#6b7280', border: '#6b7280' },
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
    <div className="min-h-screen" style={{ backgroundColor: '#0f172a', backgroundImage: `
      linear-gradient(0deg, transparent 24%, rgba(30, 58, 138, 0.08) 25%, rgba(30, 58, 138, 0.08) 26%, transparent 27%, transparent 74%, rgba(30, 58, 138, 0.08) 75%, rgba(30, 58, 138, 0.08) 76%, transparent 77%, transparent),
      linear-gradient(90deg, transparent 24%, rgba(30, 58, 138, 0.08) 25%, rgba(30, 58, 138, 0.08) 26%, transparent 27%, transparent 74%, rgba(30, 58, 138, 0.08) 75%, rgba(30, 58, 138, 0.08) 76%, transparent 77%, transparent)
    `, backgroundSize: '50px 50px' }}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-56" style={{ backgroundColor: '#0f172a', borderRight: '1px solid rgba(30, 58, 138, 0.3)' }}>
          {/* Logo */}
          <div className="p-4" style={{ borderBottom: '1px solid rgba(30, 58, 138, 0.3)' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded" style={{ backgroundColor: '#1e3a8a' }} />
              <span className="font-bold text-white text-sm">Faisabilité</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1 overflow-y-auto flex-1">
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
                className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors"
                style={{
                  color: item.active ? '#60a5fa' : '#9ca3af',
                  backgroundColor: item.active ? 'rgba(96, 165, 250, 0.1)' : 'transparent',
                }}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User */}
          <div className="p-3" style={{ borderTop: '1px solid rgba(30, 58, 138, 0.3)' }}>
            <div className="flex items-center gap-2 px-2 py-2 mb-2">
              <div className="w-7 h-7 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: '#0f172a', borderBottom: '1px solid rgba(30, 58, 138, 0.3)' }}>
            <div>
              <p className="text-xs text-gray-500">Étude de faisabilité</p>
              <h1 className="text-xl font-bold text-white">Vue globale</h1>
              <p className="text-xs text-gray-500 mt-1">Synthèse complète de l'étude et de toutes les options</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-sm border rounded" style={{ borderColor: 'rgba(96, 165, 250, 0.3)', color: '#60a5fa' }}>
                <Filter className="w-4 h-4" />
                Filtrer
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm rounded text-white" style={{ backgroundColor: '#3b82f6' }}>
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-6 gap-3">
                {[
                  { icon: FolderOpen, label: 'Options', value: totalOptions, color: '#3b82f6' },
                  { icon: CheckSquare, label: 'Postes', value: totalPosts, color: '#3b82f6' },
                  { icon: CheckSquare, label: 'Actions', value: totalActions, color: '#10b981' },
                  { icon: AlertTriangle, label: 'Actions en retard', value: delayedActions, color: '#f59e0b' },
                  { icon: Shield, label: 'Risques élevés', value: highRisks, color: '#ef4444' },
                  { icon: Bell, label: 'Alertes', value: alerts, color: '#a78bfa' },
                ].map((stat, i) => (
                  <div key={i} className="rounded p-4" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', border: '1px solid rgba(30, 58, 138, 0.6)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                      <span className="text-lg font-bold text-white">{stat.value}</span>
                    </div>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                    <p className="text-xs text-gray-600">Total des {stat.label.toLowerCase()}</p>
                  </div>
                ))}
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-3 gap-6">
                {/* Left: Tree and Legend */}
                <div className="col-span-2 space-y-6">
                  {/* Legend */}
                  <div className="rounded p-4" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', border: '1px solid rgba(30, 58, 138, 0.6)' }}>
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
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[item.status]?.dot }} />
                          <span className="text-xs text-gray-400">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tree */}
                  <div className="rounded p-4" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', border: '1px solid rgba(30, 58, 138, 0.6)' }}>
                    <h3 className="text-sm font-semibold text-white mb-4">Arborescence globale</h3>
                    <div className="space-y-1">
                      {mockData.map((option) => (
                        <div key={option.id}>
                          <button
                            onClick={() => toggleOption(option.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded text-left text-sm transition-colors"
                            style={{ color: '#e5e7eb', backgroundColor: expandedOptions.has(option.id) ? 'rgba(96, 165, 250, 0.1)' : 'transparent' }}
                          >
                            {expandedOptions.has(option.id) ? (
                              <ChevronDown className="w-4 h-4" style={{ color: '#60a5fa' }} />
                            ) : (
                              <ChevronRight className="w-4 h-4" style={{ color: '#60a5fa' }} />
                            )}
                            <FolderOpen className="w-4 h-4" style={{ color: '#60a5fa' }} />
                            <span className="flex-1">{option.name}</span>
                            <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${statusColors[option.status]?.bg}20`, color: statusColors[option.status]?.text }}>
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
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded text-left text-sm transition-colors"
                                    style={{ color: '#d1d5db', backgroundColor: expandedPosts.has(post.id) ? 'rgba(96, 165, 250, 0.05)' : 'transparent' }}
                                  >
                                    {expandedPosts.has(post.id) ? (
                                      <ChevronDown className="w-4 h-4" style={{ color: '#93c5fd' }} />
                                    ) : (
                                      <ChevronRight className="w-4 h-4" style={{ color: '#93c5fd' }} />
                                    )}
                                    <CheckSquare className="w-4 h-4" style={{ color: '#93c5fd' }} />
                                    <span className="flex-1">{post.name}</span>
                                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${statusColors[post.status]?.bg}20`, color: statusColors[post.status]?.text }}>
                                      {getStatusLabel(post.status)}
                                    </span>
                                    <span className="text-sm font-semibold text-white">{post.score} / 100</span>
                                  </button>

                                  {expandedPosts.has(post.id) && (
                                    <div className="ml-6 space-y-1">
                                      {post.actions.map((action) => (
                                        <div key={action.id} className="flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors" style={{ color: '#9ca3af', backgroundColor: 'rgba(96, 165, 250, 0.02)' }}>
                                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[action.status]?.dot }} />
                                          <span className="flex-1">{action.name}</span>
                                          <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${statusColors[action.status]?.bg}20`, color: statusColors[action.status]?.text }}>
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
                  <div className="rounded p-4" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', border: '1px solid rgba(30, 58, 138, 0.6)' }}>
                    <h3 className="text-sm font-semibold text-white mb-4">Synthèse des scores</h3>
                    <div className="flex justify-center mb-4">
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(30, 58, 138, 0.5)" strokeWidth="8" />
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
                      {[
                        { label: 'Impact / Valeur', value: '40%', color: '#3b82f6' },
                        { label: 'Faisabilité', value: '20%', color: '#10b981' },
                        { label: 'Coût - Temps', value: '20%', color: '#f59e0b' },
                        { label: 'Risque', value: '10%', color: '#ef4444' },
                        { label: 'Réversibilité', value: '10%', color: '#a78bfa' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-gray-400">{item.label}</span>
                          </div>
                          <span className="text-white font-semibold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Criteria */}
                  <div className="rounded p-4" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', border: '1px solid rgba(30, 58, 138, 0.6)' }}>
                    <h3 className="text-sm font-semibold text-white mb-3">Critères d'évaluation</h3>
                    <div className="space-y-2 text-sm">
                      {[
                        { label: 'Impact / Valeur', value: '40%' },
                        { label: 'Faisabilité', value: '20%' },
                        { label: 'Coût - Temps', value: '20%' },
                        { label: 'Risque', value: '10%' },
                        { label: 'Réversibilité', value: '10%' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-gray-400">{item.label}</span>
                          <span className="text-white font-semibold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Alerts */}
                  <div className="rounded p-4" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', border: '1px solid rgba(30, 58, 138, 0.6)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-white">Alertes actives</h3>
                      <a href="#" className="text-xs" style={{ color: '#60a5fa' }}>Voir tout</a>
                    </div>
                    <div className="space-y-2 text-sm">
                      {[
                        { label: 'Actions en retard', value: '5', color: '#ef4444' },
                        { label: 'Risques élevés', value: '3', color: '#ef4444' },
                        { label: 'Postes à revoir', value: '4', color: '#f59e0b' },
                        { label: 'Décisions en attente', value: '2', color: '#3b82f6' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-gray-400">{item.label}</span>
                          </div>
                          <span style={{ color: item.color }} className="font-semibold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Automatic Rules */}
                  <div className="rounded p-4" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', border: '1px solid rgba(30, 58, 138, 0.6)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-white">Règles automatiques</h3>
                      <a href="#" className="text-xs" style={{ color: '#60a5fa' }}>Voir tout</a>
                    </div>
                    <div className="space-y-2 text-sm">
                      {[
                        { label: 'Règle de score global', color: '#10b981' },
                        { label: 'Règle de risque', color: '#10b981' },
                        { label: 'Règle de délai', color: '#10b981' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-gray-400">{item.label}</span>
                          </div>
                          <span style={{ color: item.color }} className="font-semibold">Actif</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="rounded p-4" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', border: '1px solid rgba(30, 58, 138, 0.6)' }}>
                <h3 className="text-sm font-semibold text-white mb-4">Chronologie globale</h3>
                <div className="flex items-center justify-between px-4">
                  {[
                    { label: 'Création de l\'étude', date: '07/04/2024', completed: true },
                    { label: 'Ajout des options', date: '05/04/2024', completed: true },
                    { label: 'Début des postes', date: '10/04/2024', completed: true },
                    { label: 'Actions en cours', date: '15/04/2024', completed: true },
                    { label: 'Dernière action', date: '20/05/2024', completed: true },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center flex-1">
                      <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center mb-2" style={{ backgroundColor: item.completed ? '#3b82f6' : 'transparent', borderColor: item.completed ? '#3b82f6' : '#4b5563' }}>
                        {item.completed && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <p className="text-xs text-gray-400 text-center">{item.label}</p>
                      <p className="text-xs text-gray-600">{item.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="text-xs text-gray-600 border-t" style={{ borderColor: 'rgba(30, 58, 138, 0.3)', paddingTop: '1rem' }}>
                Étude ID : #1234 • Créée le 07/04/2024 par Admin • Dernière mise à jour : 20/05/2024 à 14:30
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
