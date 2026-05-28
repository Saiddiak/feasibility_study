import { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, Filter, Plus, BarChart3, BookOpen, FolderOpen, CheckSquare, AlertTriangle, Bell, FileText, Settings, Sun, Moon, Trophy } from 'lucide-react';

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

const statusColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  favorable: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22C55E', border: '#22C55E', glow: 'rgba(34, 197, 94, 0.2)' },
  risk: { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B', border: '#F59E0B', glow: 'rgba(245, 158, 11, 0.2)' },
  blocked: { bg: 'rgba(239, 68, 68, 0.1)', text: '#EF4444', border: '#EF4444', glow: 'rgba(239, 68, 68, 0.2)' },
  abandoned: { bg: 'rgba(107, 114, 128, 0.1)', text: '#9CA3AF', border: '#9CA3AF', glow: 'rgba(107, 114, 128, 0.2)' },
  in_progress: { bg: 'rgba(37, 99, 235, 0.1)', text: '#2563EB', border: '#2563EB', glow: 'rgba(37, 99, 235, 0.2)' },
  completed: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22C55E', border: '#22C55E', glow: 'rgba(34, 197, 94, 0.2)' },
  delayed: { bg: 'rgba(239, 68, 68, 0.1)', text: '#EF4444', border: '#EF4444', glow: 'rgba(239, 68, 68, 0.2)' },
  pending: { bg: 'rgba(107, 114, 128, 0.1)', text: '#9CA3AF', border: '#9CA3AF', glow: 'rgba(107, 114, 128, 0.2)' },
};

export default function GlobalViewProfessional() {
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
    <div className="min-h-screen flex" style={{ backgroundColor: '#020817' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }

        .glass-card {
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(37, 99, 235, 0.1);
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .glass-card:hover {
          background: rgba(15, 23, 42, 0.7);
          border-color: rgba(37, 99, 235, 0.2);
          box-shadow: 0 8px 32px rgba(37, 99, 235, 0.1);
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(37, 99, 235, 0.15);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at top right, rgba(37, 99, 235, 0.1), transparent);
          pointer-events: none;
        }

        .stat-card:hover {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(37, 99, 235, 0.08) 100%);
          border-color: rgba(37, 99, 235, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(37, 99, 235, 0.15);
        }

        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .accordion-expand {
          animation: expandAccordion 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }

        @keyframes expandAccordion {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }

        .glow-text {
          text-shadow: 0 0 20px rgba(37, 99, 235, 0.3);
        }

        .premium-border {
          border-image: linear-gradient(135deg, rgba(37, 99, 235, 0.3), rgba(139, 92, 246, 0.1)) 1;
        }
      `}</style>

      {/* Sidebar */}
      <div className="w-56 flex flex-col flex-shrink-0" style={{ backgroundColor: '#0f172a', borderRight: '1px solid rgba(37, 99, 235, 0.1)' }}>
        {/* Logo */}
        <div className="p-6 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(37, 99, 235, 0.1)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #1e40af)' }}>
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-white text-base">Faisabilité</span>
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300"
              style={{
                color: item.active ? '#2563EB' : '#9CA3AF',
                backgroundColor: item.active ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                borderLeft: item.active ? '3px solid #2563EB' : 'none',
                paddingLeft: item.active ? '13px' : '16px',
              }}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 space-y-4" style={{ borderTop: '1px solid rgba(37, 99, 235, 0.1)' }}>
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #2563EB, #1e40af)' }}>
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">Admin</p>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-center gap-3 px-2 py-2 rounded-lg" style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)' }}>
            <Sun className="w-4 h-4 text-gray-500" />
            <button className="w-10 h-6 rounded-full transition-all" style={{ backgroundColor: '#2563EB' }} />
            <Moon className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between" style={{ backgroundColor: '#0f172a', borderBottom: '1px solid rgba(37, 99, 235, 0.1)' }}>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Étude de faisabilité</p>
            <h1 className="text-3xl font-bold text-white mt-1">Vue globale</h1>
            <p className="text-sm text-gray-400 mt-1">Synthèse complète de l'étude et de toutes les options</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all" style={{ color: '#2563EB', border: '1px solid rgba(37, 99, 235, 0.3)', backgroundColor: 'rgba(37, 99, 235, 0.05)' }}>
              <Filter className="w-4 h-4" />
              Filtrer
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg text-white transition-all" style={{ background: 'linear-gradient(135deg, #2563EB, #1e40af)' }}>
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: '#020817' }}>
          <div className="space-y-8 fade-in">
            {/* Stats Cards */}
            <div className="grid grid-cols-6 gap-4">
              {[
                { icon: FolderOpen, label: 'Options', value: totalOptions, color: '#2563EB' },
                { icon: CheckSquare, label: 'Postes', value: totalPosts, color: '#2563EB' },
                { icon: CheckSquare, label: 'Actions', value: totalActions, color: '#22C55E' },
                { icon: AlertTriangle, label: 'Actions en retard', value: delayedActions, color: '#F59E0B' },
                { icon: AlertTriangle, label: 'Risques élevés', value: highRisks, color: '#EF4444' },
                { icon: Bell, label: 'Alertes', value: alerts, color: '#8B5CF6' },
              ].map((stat, i) => (
                <div key={i} className="stat-card rounded-xl p-4 relative group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}20` }}>
                        <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-gray-400">{stat.label}</p>
                  <p className="text-xs text-gray-600 mt-1">Total des {stat.label.toLowerCase()}</p>
                </div>
              ))}
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-4 gap-6">
              {/* Left Column: Legend + Best Option */}
              <div className="flex flex-col gap-6">
                {/* Legend */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Légende des statuts</h3>
                  <div className="grid grid-cols-2 gap-3">
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
                      <div key={item.status} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: statusColors[item.status]?.text }} />
                        <span className="text-xs text-gray-300">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best Option */}
                <div className="glass-card rounded-2xl p-6 border-2" style={{ borderColor: '#22C55E' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-5 h-5" style={{ color: '#F59E0B' }} />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Meilleure option</h3>
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#22C55E' }}>{bestOption.name.split(' - ')[1]}</p>
                  <p className="text-xs mb-4" style={{ color: '#22C55E' }}>{getStatusLabel(bestOption.status)}</p>
                  <p className="text-4xl font-bold mb-6">
                    <span style={{ color: '#22C55E' }}>{bestOption.score}</span>
                    <span className="text-gray-500 text-lg"> / 100</span>
                  </p>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all" style={{ backgroundColor: 'rgba(37, 99, 235, 0.15)', color: '#2563EB', border: '1px solid rgba(37, 99, 235, 0.3)' }}>
                    <Eye className="w-4 h-4" />
                    Voir le détail
                  </button>
                </div>
              </div>

              {/* Center Column: Arborescence */}
              <div className="col-span-2 glass-card rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Arborescence globale</h3>
                <div className="space-y-1 max-h-96 overflow-y-auto pr-2">
                  {mockData.map((option) => (
                    <div key={option.id} className="space-y-1">
                      {/* Option */}
                      <button
                        onClick={() => toggleOption(option.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all hover:bg-white/5"
                      >
                        {expandedOptions.has(option.id) ? (
                          <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: '#2563EB' }} />
                        ) : (
                          <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: '#2563EB' }} />
                        )}
                        <FolderOpen className="w-4 h-4 flex-shrink-0" style={{ color: '#2563EB' }} />
                        <span className="flex-1 truncate font-medium text-white">{option.name}</span>
                        <span className="text-xs px-2.5 py-1 rounded-md flex-shrink-0 font-medium" style={{ backgroundColor: statusColors[option.status]?.bg, color: statusColors[option.status]?.text }}>
                          {getStatusLabel(option.status)}
                        </span>
                        <span className="text-xs font-bold text-gray-300 flex-shrink-0">{option.score}/100</span>
                      </button>

                      {/* Posts */}
                      {expandedOptions.has(option.id) && (
                        <div className="ml-4 space-y-1 accordion-expand">
                          {option.posts.map((post) => (
                            <div key={post.id} className="space-y-1">
                              <button
                                onClick={() => togglePost(post.id)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all hover:bg-white/5"
                              >
                                {expandedPosts.has(post.id) ? (
                                  <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: '#93c5fd' }} />
                                ) : (
                                  <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: '#93c5fd' }} />
                                )}
                                <CheckSquare className="w-4 h-4 flex-shrink-0" style={{ color: '#93c5fd' }} />
                                <span className="flex-1 truncate text-gray-200">{post.name}</span>
                                <span className="text-xs px-2.5 py-1 rounded-md flex-shrink-0 font-medium" style={{ backgroundColor: statusColors[post.status]?.bg, color: statusColors[post.status]?.text }}>
                                  {getStatusLabel(post.status)}
                                </span>
                                <span className="text-xs font-bold text-gray-300 flex-shrink-0">{post.score}/100</span>
                              </button>

                              {/* Actions */}
                              {expandedPosts.has(post.id) && (
                                <div className="ml-4 space-y-1 accordion-expand">
                                  {post.actions.map((action) => (
                                    <div key={action.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all hover:bg-white/5">
                                      <ChevronRight className="w-4 h-4 opacity-0 flex-shrink-0" />
                                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: statusColors[action.status]?.text }} />
                                      <span className="flex-1 truncate text-gray-400">{action.name}</span>
                                      <span className="text-xs px-2.5 py-1 rounded-md flex-shrink-0 font-medium" style={{ backgroundColor: statusColors[action.status]?.bg, color: statusColors[action.status]?.text }}>
                                        {getStatusLabel(action.status)}
                                      </span>
                                      <span className="text-xs font-bold text-gray-300 flex-shrink-0">{action.score}/100</span>
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

              {/* Right Column: Synthèse + Critères + Alertes */}
              <div className="flex flex-col gap-6">
                {/* Score Summary */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Synthèse des scores</h3>
                  <div className="flex justify-center mb-6">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(37, 99, 235, 0.1)" strokeWidth="8" />
                        <circle cx="60" cy="60" r="50" fill="none" stroke="#2563EB" strokeWidth="8" strokeDasharray={`${(avgScore / 100) * 314} 314`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white">{avgScore}</span>
                        <span className="text-xs text-gray-500">/100</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2.5 text-sm">
                    {[
                      { label: 'Impact / Valeur', value: '40%', color: '#2563EB' },
                      { label: 'Faisabilité', value: '20%', color: '#22C55E' },
                      { label: 'Coût - Temps', value: '20%', color: '#F59E0B' },
                      { label: 'Risque', value: '10%', color: '#EF4444' },
                      { label: 'Réversibilité', value: '10%', color: '#8B5CF6' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-300">{item.label}</span>
                        </div>
                        <span className="font-semibold text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Criteria */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Critères d'évaluation</h3>
                  <div className="space-y-2.5 text-sm">
                    {[
                      { label: 'Impact / Valeur', value: '40%' },
                      { label: 'Faisabilité', value: '20%' },
                      { label: 'Coût - Temps', value: '20%' },
                      { label: 'Risque', value: '10%' },
                      { label: 'Réversibilité', value: '10%' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <span className="text-gray-300">{item.label}</span>
                        <span className="font-semibold text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Alerts */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Alertes actives</h3>
                    <a href="#" className="text-xs font-semibold transition-colors" style={{ color: '#2563EB' }}>Voir tout</a>
                  </div>
                  <div className="space-y-2.5 text-sm">
                    {[
                      { label: 'Actions en retard', value: '5', color: '#EF4444' },
                      { label: 'Risques élevés', value: '3', color: '#EF4444' },
                      { label: 'Postes à revoir', value: '4', color: '#F59E0B' },
                      { label: 'Décisions en attente', value: '2', color: '#2563EB' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-300">{item.label}</span>
                        </div>
                        <span className="font-semibold" style={{ color: item.color }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Automatic Rules */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Règles automatiques</h3>
                    <a href="#" className="text-xs font-semibold transition-colors" style={{ color: '#2563EB' }}>Voir tout</a>
                  </div>
                  <div className="space-y-2.5 text-sm">
                    {[
                      { label: 'Règle de score global', color: '#22C55E' },
                      { label: 'Règle de risque', color: '#22C55E' },
                      { label: 'Règle de délai', color: '#22C55E' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-300">{item.label}</span>
                        </div>
                        <span className="font-semibold" style={{ color: item.color }}>Actif</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-8 uppercase tracking-wider">Chronologie globale</h3>
              <div className="flex items-start justify-between px-4">
                {[
                  { label: 'Création de l\'étude', date: '07/04/2024', completed: true },
                  { label: 'Ajout des options', date: '05/04/2024', completed: true },
                  { label: 'Début des postes', date: '10/04/2024', completed: true },
                  { label: 'Actions en cours', date: '15/04/2024', completed: true },
                  { label: 'Dernière action', date: '20/05/2024', completed: true },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center flex-1 relative">
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center mb-3 relative z-10 transition-all" style={{ backgroundColor: item.completed ? '#2563EB' : 'transparent', borderColor: item.completed ? '#2563EB' : '#4b5563' }}>
                      {item.completed && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    {i < 4 && <div className="absolute top-3 left-1/2 w-1/2 h-0.5" style={{ backgroundColor: '#2563EB' }} />}
                    <p className="text-xs text-gray-400 text-center mt-2 font-medium">{item.label}</p>
                    <p className="text-xs text-gray-600">{item.date}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl border" style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
                <p className="text-xs text-gray-400 mb-1 font-medium">Décision finale prévue</p>
                <p className="text-lg font-bold" style={{ color: '#22C55E' }}>19/06/2024</p>
                <p className="text-xs text-gray-600 mt-1">(Dans 30 jours)</p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-xs text-gray-600 pt-4" style={{ borderTop: '1px solid rgba(37, 99, 235, 0.1)' }}>
              Étude ID : #1234 • Créée le 07/04/2024 par Admin • Dernière mise à jour : 20/05/2024 à 14:30
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
