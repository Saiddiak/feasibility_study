import { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, Filter, Plus, BarChart3, BookOpen, FolderOpen, CheckSquare, AlertTriangle, Bell, FileText, Settings, Sun, Moon, Trophy } from 'lucide-react';

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

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0f172a' }}>
      {/* SIDEBAR */}
      <div className="w-48 flex flex-col flex-shrink-0" style={{ backgroundColor: '#0f172a', borderRight: '1px solid rgba(59, 130, 246, 0.15)' }}>
        <div className="px-4 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(59, 130, 246, 0.15)' }}>
          <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3B82F6, #1e40af)' }}>
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white text-xs">Faisabilité</span>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
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
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-xs font-medium transition-all"
              style={{
                color: item.active ? '#3B82F6' : '#9CA3AF',
                backgroundColor: item.active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              }}
            >
              <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate text-xs">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-2 space-y-2 flex-shrink-0" style={{ borderTop: '1px solid rgba(59, 130, 246, 0.15)' }}>
          <div className="flex items-center gap-1.5 px-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-semibold text-xs" style={{ background: 'linear-gradient(135deg, #3B82F6, #1e40af)' }}>
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white">Admin</p>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 px-2 py-1.5 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
            <Sun className="w-3 h-3 text-gray-500" />
            <button className="w-8 h-4 rounded-full" style={{ backgroundColor: '#3B82F6' }} />
            <Moon className="w-3 h-3 text-gray-500" />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ backgroundColor: '#0f172a', borderBottom: '1px solid rgba(59, 130, 246, 0.15)' }}>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Étude de faisabilité</p>
            <h1 className="text-xl font-bold text-white mt-0.5">Vue globale</h1>
            <p className="text-xs text-gray-500 mt-0.5">Synthèse complète de l'étude et de toutes les options</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded" style={{ color: '#3B82F6', border: '1px solid rgba(59, 130, 246, 0.3)', backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
              <Filter className="w-3 h-3" />
              Filtrer
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded text-white" style={{ background: 'linear-gradient(135deg, #3B82F6, #1e40af)' }}>
              <Plus className="w-3 h-3" />
              Ajouter
            </button>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#0f172a' }}>
          <div className="p-4" style={{ backgroundColor: '#020817' }}>
            {/* KPI CARDS - 6 colonnes */}
            <div className="grid grid-cols-6 gap-4 mb-6">
              {[
                { icon: FolderOpen, label: 'Options', value: 4, subtext: 'Total des options', color: '#3B82F6' },
                { icon: CheckSquare, label: 'Postes', value: 12, subtext: 'Tous les postes', color: '#3B82F6' },
                { icon: CheckSquare, label: 'Actions', value: 28, subtext: 'Toutes les actions', color: '#22C55E' },
                { icon: AlertTriangle, label: 'Actions en retard', value: 5, subtext: 'À traiter', color: '#F59E0B' },
                { icon: AlertTriangle, label: 'Risques élevés', value: 3, subtext: 'Impact / Probabilité', color: '#EF4444' },
                { icon: Bell, label: 'Alertes', value: 7, subtext: 'Actives', color: '#8B5CF6' },
              ].map((stat, i) => (
                <div key={i} className="rounded p-3 shadow border" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', borderColor: 'rgba(148, 163, 184, 0.2)' }}>
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0" style={{ background: `${stat.color}20` }}>
                      <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                    </div>
                    <span className="text-lg font-bold text-white">{stat.value}</span>
                  </div>
                  <p className="text-xs font-medium text-gray-300">{stat.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.subtext}</p>
                </div>
              ))}
            </div>

            {/* MAIN GRID - 3 COLONNES */}
            <div className="grid grid-cols-[280px_1fr_320px] gap-4 mb-6">
              {/* LEFT COLUMN */}
              <div className="space-y-4">
                {/* LEGEND */}
                <div className="rounded p-3 shadow border" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', borderColor: 'rgba(148, 163, 184, 0.2)' }}>
                  <h3 className="text-xs font-bold text-white mb-2 uppercase tracking-wide">Légende des statuts</h3>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {[
                      { status: 'Favorable', color: '#22C55E' },
                      { status: 'Risque', color: '#F59E0B' },
                      { status: 'Bloqué', color: '#EF4444' },
                      { status: 'Abandonné', color: '#6B7280' },
                      { status: 'En cours', color: '#3B82F6' },
                      { status: 'Terminé', color: '#10B981' },
                      { status: 'En retard', color: '#EF4444' },
                      { status: 'À revoir', color: '#F59E0B' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-400">{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BEST OPTION */}
                <div className="rounded p-3 shadow border" style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Trophy className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wide">Meilleure option</h3>
                  </div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: '#22C55E' }}>Option B</p>
                  <p className="text-xs mb-3" style={{ color: '#22C55E' }}>Favorable</p>
                  <p className="text-2xl font-bold mb-3">
                    <span style={{ color: '#22C55E' }}>78</span>
                    <span className="text-gray-500 text-xs"> / 100</span>
                  </p>
                  <button className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-semibold rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <Eye className="w-3 h-3" />
                    Voir le détail
                  </button>
                </div>
              </div>

              {/* CENTER COLUMN - ARBORESCENCE */}
              <div className="rounded border p-3 shadow" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', borderColor: 'rgba(30, 58, 138, 0.6)' }}>
                <h3 className="text-xs font-bold text-white mb-3 uppercase tracking-wide">Arborescence globale</h3>
                <div className="space-y-0 max-h-96 overflow-y-auto pr-2">
                  {/* OPTION A */}
                  <div>
                    <button
                      onClick={() => toggleOption(1)}
                      className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-left text-xs transition-colors hover:bg-white/5"
                    >
                      {expandedOptions.has(1) ? (
                        <ChevronDown className="w-3 h-3 flex-shrink-0" style={{ color: '#3B82F6' }} />
                      ) : (
                        <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: '#3B82F6' }} />
                      )}
                      <FolderOpen className="w-3 h-3 flex-shrink-0" style={{ color: '#3B82F6' }} />
                      <span className="flex-1 truncate font-medium text-white text-xs">Option A - Modernisation du système existant</span>
                      <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0 font-medium" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>Risque</span>
                      <span className="text-xs font-bold text-gray-300 flex-shrink-0">62/100</span>
                    </button>
                    {expandedOptions.has(1) && (
                      <div className="ml-3 space-y-0">
                        {/* POST A1 */}
                        <div>
                          <button
                            onClick={() => togglePost(1)}
                            className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-left text-xs transition-colors hover:bg-white/5"
                          >
                            {expandedPosts.has(1) ? (
                              <ChevronDown className="w-3 h-3 flex-shrink-0" style={{ color: '#93c5fd' }} />
                            ) : (
                              <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: '#93c5fd' }} />
                            )}
                            <CheckSquare className="w-3 h-3 flex-shrink-0" style={{ color: '#93c5fd' }} />
                            <span className="flex-1 truncate text-gray-300 text-xs">Poste A1 - Analyse et conception</span>
                            <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0 font-medium" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>En cours</span>
                            <span className="text-xs font-bold text-gray-300 flex-shrink-0">70/100</span>
                          </button>
                          {expandedPosts.has(1) && (
                            <div className="ml-3 space-y-0">
                              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded text-xs transition-colors hover:bg-white/5">
                                <ChevronRight className="w-3 h-3 opacity-0 flex-shrink-0" />
                                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#22C55E' }} />
                                <span className="flex-1 truncate text-gray-400 text-xs">Action A1.1 - Collecte des besoins</span>
                                <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0 font-medium" style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22C55E' }}>Terminé</span>
                                <span className="text-xs font-bold text-gray-300 flex-shrink-0">100/100</span>
                              </div>
                              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded text-xs transition-colors hover:bg-white/5">
                                <ChevronRight className="w-3 h-3 opacity-0 flex-shrink-0" />
                                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#EF4444' }} />
                                <span className="flex-1 truncate text-gray-400 text-xs">Action A1.2 - Spécifications fonctionnelles</span>
                                <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0 font-medium" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}>En retard</span>
                                <span className="text-xs font-bold text-gray-300 flex-shrink-0">40/100</span>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* POST A2 */}
                        <div>
                          <button
                            onClick={() => togglePost(2)}
                            className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-left text-xs transition-colors hover:bg-white/5"
                          >
                            {expandedPosts.has(2) ? (
                              <ChevronDown className="w-3 h-3 flex-shrink-0" style={{ color: '#93c5fd' }} />
                            ) : (
                              <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: '#93c5fd' }} />
                            )}
                            <CheckSquare className="w-3 h-3 flex-shrink-0" style={{ color: '#93c5fd' }} />
                            <span className="flex-1 truncate text-gray-300 text-xs">Poste A2 - Développement</span>
                            <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0 font-medium" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>En cours</span>
                            <span className="text-xs font-bold text-gray-300 flex-shrink-0">55/100</span>
                          </button>
                          {expandedPosts.has(2) && (
                            <div className="ml-3 space-y-0">
                              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded text-xs transition-colors hover:bg-white/5">
                                <ChevronRight className="w-3 h-3 opacity-0 flex-shrink-0" />
                                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#EF4444' }} />
                                <span className="flex-1 truncate text-gray-400 text-xs">Action A2.1 - Développement module 1</span>
                                <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0 font-medium" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}>En retard</span>
                                <span className="text-xs font-bold text-gray-300 flex-shrink-0">30/100</span>
                              </div>
                              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded text-xs transition-colors hover:bg-white/5">
                                <ChevronRight className="w-3 h-3 opacity-0 flex-shrink-0" />
                                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#6B7280' }} />
                                <span className="flex-1 truncate text-gray-400 text-xs">Action A2.2 - Développement module 2</span>
                                <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0 font-medium" style={{ backgroundColor: 'rgba(107, 114, 128, 0.15)', color: '#9CA3AF' }}>En attente</span>
                                <span className="text-xs font-bold text-gray-300 flex-shrink-0">0/100</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* OPTION B */}
                  <div>
                    <button
                      onClick={() => toggleOption(2)}
                      className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-left text-xs transition-colors hover:bg-white/5"
                    >
                      {expandedOptions.has(2) ? (
                        <ChevronDown className="w-3 h-3 flex-shrink-0" style={{ color: '#3B82F6' }} />
                      ) : (
                        <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: '#3B82F6' }} />
                      )}
                      <FolderOpen className="w-3 h-3 flex-shrink-0" style={{ color: '#3B82F6' }} />
                      <span className="flex-1 truncate font-medium text-white text-xs">Option B - Nouvelle solution</span>
                      <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0 font-medium" style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22C55E' }}>Favorable</span>
                      <span className="text-xs font-bold text-gray-300 flex-shrink-0">78/100</span>
                    </button>
                    {expandedOptions.has(2) && (
                      <div className="ml-3 space-y-0">
                        <button
                          onClick={() => togglePost(3)}
                          className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-left text-xs transition-colors hover:bg-white/5"
                        >
                          {expandedPosts.has(3) ? (
                            <ChevronDown className="w-3 h-3 flex-shrink-0" style={{ color: '#93c5fd' }} />
                          ) : (
                            <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: '#93c5fd' }} />
                          )}
                          <CheckSquare className="w-3 h-3 flex-shrink-0" style={{ color: '#93c5fd' }} />
                          <span className="flex-1 truncate text-gray-300 text-xs">Poste B1 - Étude de faisabilité</span>
                          <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0 font-medium" style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22C55E' }}>Terminé</span>
                          <span className="text-xs font-bold text-gray-300 flex-shrink-0">90/100</span>
                        </button>
                        <button
                          onClick={() => togglePost(4)}
                          className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-left text-xs transition-colors hover:bg-white/5"
                        >
                          {expandedPosts.has(4) ? (
                            <ChevronDown className="w-3 h-3 flex-shrink-0" style={{ color: '#93c5fd' }} />
                          ) : (
                            <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: '#93c5fd' }} />
                          )}
                          <CheckSquare className="w-3 h-3 flex-shrink-0" style={{ color: '#93c5fd' }} />
                          <span className="flex-1 truncate text-gray-300 text-xs">Poste B2 - Implémentation</span>
                          <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0 font-medium" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>En cours</span>
                          <span className="text-xs font-bold text-gray-300 flex-shrink-0">65/100</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* OPTION C */}
                  <div>
                    <button
                      onClick={() => toggleOption(3)}
                      className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-left text-xs transition-colors hover:bg-white/5"
                    >
                      {expandedOptions.has(3) ? (
                        <ChevronDown className="w-3 h-3 flex-shrink-0" style={{ color: '#3B82F6' }} />
                      ) : (
                        <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: '#3B82F6' }} />
                      )}
                      <FolderOpen className="w-3 h-3 flex-shrink-0" style={{ color: '#3B82F6' }} />
                      <span className="flex-1 truncate font-medium text-white text-xs">Option C - Solution hybride</span>
                      <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0 font-medium" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>Risque</span>
                      <span className="text-xs font-bold text-gray-300 flex-shrink-0">58/100</span>
                    </button>
                  </div>

                  {/* OPTION D */}
                  <div>
                    <button
                      onClick={() => toggleOption(4)}
                      className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-left text-xs transition-colors hover:bg-white/5"
                    >
                      {expandedOptions.has(4) ? (
                        <ChevronDown className="w-3 h-3 flex-shrink-0" style={{ color: '#3B82F6' }} />
                      ) : (
                        <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: '#3B82F6' }} />
                      )}
                      <FolderOpen className="w-3 h-3 flex-shrink-0" style={{ color: '#3B82F6' }} />
                      <span className="flex-1 truncate font-medium text-white text-xs">Option D - Abandon du projet</span>
                      <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0 font-medium" style={{ backgroundColor: 'rgba(107, 114, 128, 0.15)', color: '#9CA3AF' }}>Abandonné</span>
                      <span className="text-xs font-bold text-gray-300 flex-shrink-0">20/100</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-4">
                {/* SCORE SUMMARY */}
                <div className="rounded p-3 shadow border" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', borderColor: 'rgba(148, 163, 184, 0.2)' }}>
                  <h3 className="text-xs font-bold text-white mb-2 uppercase tracking-wide">Synthèse des scores</h3>
                  <div className="flex justify-center mb-2">
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="6" />
                        <circle cx="60" cy="60" r="45" fill="none" stroke="#3B82F6" strokeWidth="6" strokeDasharray="141.5 283" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold text-white">65</span>
                        <span className="text-xs text-gray-500">/100</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#3B82F6' }} />
                        <span className="text-gray-400">Impact / Valeur</span>
                      </div>
                      <span className="font-semibold text-white">40%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#22C55E' }} />
                        <span className="text-gray-400">Faisabilité</span>
                      </div>
                      <span className="font-semibold text-white">20%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
                        <span className="text-gray-400">Coût - Temps</span>
                      </div>
                      <span className="font-semibold text-white">20%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#EF4444' }} />
                        <span className="text-gray-400">Risque</span>
                      </div>
                      <span className="font-semibold text-white">10%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#8B5CF6' }} />
                        <span className="text-gray-400">Réversibilité</span>
                      </div>
                      <span className="font-semibold text-white">10%</span>
                    </div>
                  </div>
                </div>

                {/* CRITERIA */}
                <div className="rounded p-3 shadow border" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', borderColor: 'rgba(148, 163, 184, 0.2)' }}>
                  <h3 className="text-xs font-bold text-white mb-2 uppercase tracking-wide">Critères d'évaluation</h3>
                  <div className="space-y-1 text-xs">
                    {[
                      { label: 'Impact / Valeur', value: '40%' },
                      { label: 'Faisabilité', value: '20%' },
                      { label: 'Coût - Temps', value: '20%' },
                      { label: 'Risque', value: '10%' },
                      { label: 'Réversibilité', value: '10%' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-gray-400">{item.label}</span>
                        <span className="font-semibold text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ALERTS */}
                <div className="rounded p-3 shadow border" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', borderColor: 'rgba(148, 163, 184, 0.2)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wide">Alertes actives</h3>
                    <a href="#" className="text-xs font-semibold" style={{ color: '#3B82F6' }}>Voir tout</a>
                  </div>
                  <div className="space-y-1 text-xs">
                    {[
                      { label: 'Actions en retard', value: '5', color: '#EF4444' },
                      { label: 'Risques élevés', value: '3', color: '#EF4444' },
                      { label: 'Postes à revoir', value: '4', color: '#F59E0B' },
                      { label: 'Décisions en attente', value: '2', color: '#3B82F6' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-400">{item.label}</span>
                        </div>
                        <span className="font-semibold" style={{ color: item.color }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RULES */}
                <div className="rounded p-3 shadow border" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', borderColor: 'rgba(148, 163, 184, 0.2)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wide">Règles automatiques</h3>
                    <a href="#" className="text-xs font-semibold" style={{ color: '#3B82F6' }}>Voir tout</a>
                  </div>
                  <div className="space-y-1 text-xs">
                    {[
                      { label: 'Règle de score global', color: '#22C55E' },
                      { label: 'Règle de risque', color: '#22C55E' },
                      { label: 'Règle de délai', color: '#22C55E' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-400">{item.label}</span>
                        </div>
                        <span className="font-semibold" style={{ color: item.color }}>Actif</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* TIMELINE */}
            <div className="rounded p-3 shadow border" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', borderColor: 'rgba(148, 163, 184, 0.2)' }}>
              <h3 className="text-xs font-bold text-white mb-3 uppercase tracking-wide">Chronologie globale</h3>
              <div className="flex items-start justify-between px-2 mb-4">
                {[
                  { label: 'Création de l\'étude', date: '07/04/2024', completed: true },
                  { label: 'Ajout des options', date: '05/04/2024', completed: true },
                  { label: 'Début des postes', date: '10/04/2024', completed: true },
                  { label: 'Actions en cours', date: '15/04/2024', completed: true },
                  { label: 'Dernière action', date: '20/05/2024', completed: true },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center flex-1 relative">
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center mb-2 relative z-10" style={{ backgroundColor: item.completed ? '#3B82F6' : 'transparent', borderColor: item.completed ? '#3B82F6' : '#4b5563' }}>
                      {item.completed && <div className="w-1 h-1 bg-white rounded-full" />}
                    </div>
                    {i < 4 && <div className="absolute top-2 left-1/2 w-1/2 h-0.5" style={{ backgroundColor: '#3B82F6' }} />}
                    <p className="text-xs text-gray-400 text-center mt-1.5 font-medium">{item.label}</p>
                    <p className="text-xs text-gray-600">{item.date}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 rounded border" style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)', borderColor: 'rgba(34, 197, 94, 0.2)' }}>
                <p className="text-xs text-gray-400 mb-0.5 font-medium">Décision finale prévue</p>
                <p className="text-sm font-bold" style={{ color: '#22C55E' }}>19/06/2024</p>
                <p className="text-xs text-gray-600 mt-0.5">(Dans 30 jours)</p>
              </div>
            </div>

            {/* FOOTER */}
            <div className="text-xs text-gray-600 pt-2 mt-2" style={{ borderTop: '1px solid rgba(59, 130, 246, 0.15)' }}>
              Étude ID : #1234 • Créée le 07/04/2024 par Admin • Dernière mise à jour : 20/05/2024 à 14:30
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
