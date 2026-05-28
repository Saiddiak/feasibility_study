import { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, Filter, Plus, LogOut, Settings, BarChart3, BookOpen, FolderOpen, CheckSquare, AlertTriangle, Bell, FileText, Shield, Sun, Moon, Eye as EyeIcon, Trophy } from 'lucide-react';
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

const statusColors: Record<string, { bg: string; text: string; dot: string; icon: string }> = {
  favorable: { bg: '#059669', text: '#10b981', dot: '#10b981', icon: '●' },
  risk: { bg: '#d97706', text: '#f59e0b', dot: '#f59e0b', icon: '●' },
  blocked: { bg: '#dc2626', text: '#ef4444', dot: '#ef4444', icon: '●' },
  abandoned: { bg: '#6b7280', text: '#9ca3af', dot: '#9ca3af', icon: '●' },
  in_progress: { bg: '#2563eb', text: '#3b82f6', dot: '#3b82f6', icon: '●' },
  completed: { bg: '#059669', text: '#10b981', dot: '#10b981', icon: '✓' },
  delayed: { bg: '#dc2626', text: '#ef4444', dot: '#ef4444', icon: '●' },
  pending: { bg: '#6b7280', text: '#9ca3af', dot: '#9ca3af', icon: '●' },
};

export default function GlobalViewProfessional() {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [expandedOptions, setExpandedOptions] = useState<Set<number>>(new Set([1, 2]));
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set([1, 3, 4]));

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
  const bestOption = mockData.reduce((best, opt) => opt.score > best.score ? opt : best);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0f172a' }}>
      {/* Sidebar */}
      <div className="w-56 flex flex-col" style={{ backgroundColor: '#0f172a', borderRight: '1px solid rgba(59, 130, 246, 0.2)' }}>
        {/* Logo */}
        <div className="p-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#1e40af' }}>
            <BarChart3 className="w-5 h-5 text-blue-400" />
          </div>
          <span className="font-bold text-white text-sm">Faisabilité</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
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
                backgroundColor: item.active ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              }}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 space-y-2" style={{ borderTop: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#3b82f6' }}>
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white">Admin</p>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-red-400 transition-colors">
            <LogOut className="w-3 h-3" />
            Déconnexion
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="p-3 flex items-center justify-center gap-2" style={{ borderTop: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <Sun className="w-4 h-4 text-gray-500" />
          <button className="w-10 h-6 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
          <Moon className="w-4 h-4 text-gray-500" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 py-4 flex items-center justify-between" style={{ backgroundColor: '#0f172a', borderBottom: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <div>
            <p className="text-xs text-gray-500">Étude de faisabilité</p>
            <h1 className="text-2xl font-bold text-white">Vue globale</h1>
            <p className="text-xs text-gray-500">Synthèse complète de l'étude et de toutes les options</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm rounded border" style={{ borderColor: 'rgba(96, 165, 250, 0.3)', color: '#60a5fa' }}>
              <Filter className="w-4 h-4" />
              Filtrer
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm rounded text-white font-medium" style={{ backgroundColor: '#3b82f6' }}>
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: '#0f172a', backgroundImage: `
          linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, 0.03) 25%, rgba(59, 130, 246, 0.03) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.03) 75%, rgba(59, 130, 246, 0.03) 76%, transparent 77%, transparent),
          linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, 0.03) 25%, rgba(59, 130, 246, 0.03) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.03) 75%, rgba(59, 130, 246, 0.03) 76%, transparent 77%, transparent)
        `, backgroundSize: '50px 50px' }}>
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-6 gap-4">
              {[
                { icon: FolderOpen, label: 'Options', value: totalOptions, color: '#3b82f6', bg: '#1e3a8a' },
                { icon: CheckSquare, label: 'Postes', value: totalPosts, color: '#3b82f6', bg: '#1e3a8a' },
                { icon: CheckSquare, label: 'Actions', value: totalActions, color: '#10b981', bg: '#064e3b' },
                { icon: AlertTriangle, label: 'Actions en retard', value: delayedActions, color: '#f59e0b', bg: '#78350f' },
                { icon: Shield, label: 'Risques élevés', value: highRisks, color: '#ef4444', bg: '#7f1d1d' },
                { icon: Bell, label: 'Alertes', value: alerts, color: '#a78bfa', bg: '#4c1d95' },
              ].map((stat, i) => (
                <div key={i} className="rounded p-4 border" style={{ backgroundColor: stat.bg, borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                  </div>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                  <p className="text-xs text-gray-600">Total des {stat.label.toLowerCase()}</p>
                </div>
              ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-3 gap-6">
              {/* Left: Legend and Tree */}
              <div className="col-span-2 space-y-6">
                {/* Legend */}
                <div className="rounded p-4 border" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
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
                <div className="rounded p-4 border" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white">Arborescence globale</h3>
                    <button className="flex items-center gap-1 px-2 py-1 text-xs rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}>
                      <Eye className="w-3 h-3" />
                      Tout développer
                    </button>
                  </div>
                  <div className="space-y-1 max-h-96 overflow-y-auto">
                    {mockData.map((option) => (
                      <div key={option.id}>
                        <button
                          onClick={() => toggleOption(option.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded text-left text-sm transition-colors"
                          style={{ color: '#e5e7eb', backgroundColor: expandedOptions.has(option.id) ? 'rgba(59, 130, 246, 0.1)' : 'transparent' }}
                        >
                          {expandedOptions.has(option.id) ? (
                            <ChevronDown className="w-4 h-4" style={{ color: '#60a5fa' }} />
                          ) : (
                            <ChevronRight className="w-4 h-4" style={{ color: '#60a5fa' }} />
                          )}
                          <FolderOpen className="w-4 h-4" style={{ color: '#60a5fa' }} />
                          <span className="flex-1 truncate">{option.name}</span>
                          <span className="text-xs px-2 py-1 rounded font-medium" style={{ backgroundColor: `${statusColors[option.status]?.bg}40`, color: statusColors[option.status]?.text }}>
                            {getStatusLabel(option.status)}
                          </span>
                          <span className="text-sm font-bold text-white ml-2">{option.score} / 100</span>
                        </button>

                        {expandedOptions.has(option.id) && (
                          <div className="ml-6 space-y-1 border-l" style={{ borderColor: 'rgba(59, 130, 246, 0.1)' }}>
                            {option.posts.map((post) => (
                              <div key={post.id}>
                                <button
                                  onClick={() => togglePost(post.id)}
                                  className="w-full flex items-center gap-2 px-3 py-2 rounded text-left text-sm transition-colors"
                                  style={{ color: '#d1d5db', backgroundColor: expandedPosts.has(post.id) ? 'rgba(59, 130, 246, 0.05)' : 'transparent' }}
                                >
                                  {expandedPosts.has(post.id) ? (
                                    <ChevronDown className="w-4 h-4" style={{ color: '#93c5fd' }} />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" style={{ color: '#93c5fd' }} />
                                  )}
                                  <CheckSquare className="w-4 h-4" style={{ color: '#93c5fd' }} />
                                  <span className="flex-1 truncate">{post.name}</span>
                                  <span className="text-xs px-2 py-1 rounded font-medium" style={{ backgroundColor: `${statusColors[post.status]?.bg}40`, color: statusColors[post.status]?.text }}>
                                    {getStatusLabel(post.status)}
                                  </span>
                                  <span className="text-sm font-bold text-white ml-2">{post.score} / 100</span>
                                </button>

                                {expandedPosts.has(post.id) && (
                                  <div className="ml-6 space-y-1 border-l" style={{ borderColor: 'rgba(59, 130, 246, 0.05)' }}>
                                    {post.actions.map((action) => (
                                      <div key={action.id} className="flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors" style={{ color: '#9ca3af', backgroundColor: 'rgba(59, 130, 246, 0.02)' }}>
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[action.status]?.dot }} />
                                        <span className="flex-1 truncate">{action.name}</span>
                                        <span className="text-xs px-2 py-1 rounded font-medium" style={{ backgroundColor: `${statusColors[action.status]?.bg}40`, color: statusColors[action.status]?.text }}>
                                          {getStatusLabel(action.status)}
                                        </span>
                                        <span className="font-bold text-white ml-2">{action.score} / 100</span>
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

              {/* Right: Best Option, Scores, Alerts */}
              <div className="space-y-6">
                {/* Best Option */}
                <div className="rounded p-4 border" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className="w-5 h-5" style={{ color: '#f59e0b' }} />
                    <h3 className="text-sm font-semibold text-white">Meilleure option</h3>
                  </div>
                  <div className="rounded p-3 border-2" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981' }}>
                    <p className="text-sm font-semibold text-green-400 mb-1">{bestOption.name.split(' - ')[1]}</p>
                    <p className="text-xs text-green-400 mb-3">{getStatusLabel(bestOption.status)}</p>
                    <p className="text-2xl font-bold text-white">
                      <span style={{ color: '#10b981' }}>{bestOption.score}</span>
                      <span className="text-gray-400 text-sm"> / 100</span>
                    </p>
                    <button className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 text-xs rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
                      <EyeIcon className="w-3 h-3" />
                      Voir le détail
                    </button>
                  </div>
                </div>

                {/* Score Summary */}
                <div className="rounded p-4 border" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                  <h3 className="text-sm font-semibold text-white mb-4">Synthèse des scores</h3>
                  <div className="flex justify-center mb-4">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="10" />
                        <circle cx="60" cy="60" r="50" fill="none" stroke="#3b82f6" strokeWidth="10" strokeDasharray={`${(avgScore / 100) * 314} 314`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white">{avgScore}</span>
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
                <div className="rounded p-4 border" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
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
                <div className="rounded p-4 border" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
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
                <div className="rounded p-4 border" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
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
            <div className="rounded p-4 border" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
              <h3 className="text-sm font-semibold text-white mb-6">Chronologie globale</h3>
              <div className="flex items-start justify-between px-4">
                {[
                  { label: 'Création de l\'étude', date: '07/04/2024', completed: true },
                  { label: 'Ajout des options', date: '05/04/2024', completed: true },
                  { label: 'Début des postes', date: '10/04/2024', completed: true },
                  { label: 'Actions en cours', date: '15/04/2024', completed: true },
                  { label: 'Dernière action', date: '20/05/2024', completed: true },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center flex-1 relative">
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center mb-2 relative z-10" style={{ backgroundColor: item.completed ? '#3b82f6' : 'transparent', borderColor: item.completed ? '#3b82f6' : '#4b5563' }}>
                      {item.completed && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    {i < 4 && <div className="absolute top-3 left-1/2 w-1/2 h-0.5" style={{ backgroundColor: '#3b82f6' }} />}
                    <p className="text-xs text-gray-400 text-center mt-2">{item.label}</p>
                    <p className="text-xs text-gray-600">{item.date}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-3 rounded border" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <p className="text-xs text-gray-400 mb-1">Décision finale prévue</p>
                <p className="text-lg font-bold text-green-400">19/06/2024</p>
                <p className="text-xs text-gray-600 mt-1">(Dans 30 jours)</p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-xs text-gray-600" style={{ borderTop: '1px solid rgba(59, 130, 246, 0.2)', paddingTop: '1rem' }}>
              Étude ID : #1234 • Créée le 07/04/2024 par Admin • Dernière mise à jour : 20/05/2024 à 14:30
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
