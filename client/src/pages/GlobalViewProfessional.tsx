import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  CircleDot,
  Clock3,
  Eye,
  FileText,
  Filter,
  FolderOpen,
  Gauge,
  LayoutDashboard,
  ListChecks,
  Moon,
  Plus,
  Settings,
  ShieldAlert,
  Sparkles,
  Sun,
  Trophy,
} from 'lucide-react';

interface Action {
  id: number;
  name: string;
  status: StatusKey;
  score: number;
}

interface Post {
  id: number;
  name: string;
  status: StatusKey;
  score: number;
  actions: Action[];
}

interface Option {
  id: number;
  name: string;
  status: StatusKey;
  score: number;
  posts: Post[];
}

type StatusKey =
  | 'favorable'
  | 'risk'
  | 'blocked'
  | 'abandoned'
  | 'completed'
  | 'waiting'
  | 'idea'
  | 'in_progress'
  | 'review'
  | 'delayed'
  | 'pending';

const mockData: Option[] = [
  {
    id: 1,
    name: 'Option A – Modernisation du système existant',
    status: 'risk',
    score: 62,
    posts: [
      {
        id: 1,
        name: 'Poste A1 – Analyse et conception',
        status: 'in_progress',
        score: 70,
        actions: [
          { id: 1, name: 'Action A1.1 – Collecte des besoins', status: 'completed', score: 100 },
          { id: 2, name: 'Action A1.2 – Spécifications fonctionnelles', status: 'delayed', score: 40 },
        ],
      },
      {
        id: 2,
        name: 'Poste A2 – Développement',
        status: 'in_progress',
        score: 55,
        actions: [
          { id: 3, name: 'Action A2.1 – Développement module 1', status: 'delayed', score: 30 },
          { id: 4, name: 'Action A2.2 – Développement module 2', status: 'waiting', score: 0 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Option B – Nouvelle solution',
    status: 'favorable',
    score: 78,
    posts: [
      { id: 3, name: 'Poste B1 – Étude de faisabilité', status: 'completed', score: 90, actions: [] },
      { id: 4, name: 'Poste B2 – Implémentation', status: 'in_progress', score: 65, actions: [] },
    ],
  },
  { id: 3, name: 'Option C – Solution hybride', status: 'risk', score: 58, posts: [] },
  { id: 4, name: 'Option D – Abandon du projet', status: 'abandoned', score: 20, posts: [] },
];

const statusMeta: Record<StatusKey, { label: string; color: string; bg: string; border: string }> = {
  favorable: { label: 'Favorable', color: '#34d399', bg: 'rgba(52, 211, 153, .14)', border: 'rgba(52, 211, 153, .34)' },
  risk: { label: 'Risque', color: '#facc15', bg: 'rgba(250, 204, 21, .14)', border: 'rgba(250, 204, 21, .34)' },
  blocked: { label: 'Bloqué', color: '#f87171', bg: 'rgba(248, 113, 113, .14)', border: 'rgba(248, 113, 113, .34)' },
  abandoned: { label: 'Abandonné', color: '#cbd5e1', bg: 'rgba(148, 163, 184, .14)', border: 'rgba(148, 163, 184, .28)' },
  completed: { label: 'Terminé', color: '#3b82f6', bg: 'rgba(59, 130, 246, .14)', border: 'rgba(59, 130, 246, .32)' },
  waiting: { label: 'En attente', color: '#f97316', bg: 'rgba(249, 115, 22, .14)', border: 'rgba(249, 115, 22, .32)' },
  idea: { label: 'Idée', color: '#a855f7', bg: 'rgba(168, 85, 247, .14)', border: 'rgba(168, 85, 247, .34)' },
  in_progress: { label: 'En cours', color: '#3b82f6', bg: 'rgba(59, 130, 246, .14)', border: 'rgba(59, 130, 246, .32)' },
  review: { label: 'À revoir', color: '#facc15', bg: 'rgba(250, 204, 21, .14)', border: 'rgba(250, 204, 21, .34)' },
  delayed: { label: 'En retard', color: '#ef4444', bg: 'rgba(239, 68, 68, .14)', border: 'rgba(239, 68, 68, .34)' },
  pending: { label: 'À traiter', color: '#f59e0b', bg: 'rgba(245, 158, 11, .14)', border: 'rgba(245, 158, 11, .34)' },
};

const criteria = [
  { label: 'Impact / Valeur', value: 40, color: '#2563eb', icon: BarChart3 },
  { label: 'Faisabilité', value: 20, color: '#22c55e', icon: CheckCircle2 },
  { label: 'Coût - Temps', value: 20, color: '#f59e0b', icon: Clock3 },
  { label: 'Risque', value: 10, color: '#ef4444', icon: AlertTriangle },
  { label: 'Réversibilité', value: 10, color: '#8b5cf6', icon: CircleDot },
];

const navItems = [
  { icon: LayoutDashboard, label: 'Tableau de bord' },
  { icon: FileText, label: 'Études', active: true },
  { icon: Gauge, label: 'Options' },
  { icon: CalendarDays, label: 'Postes' },
  { icon: ListChecks, label: 'Actions' },
  { icon: AlertTriangle, label: 'Risques' },
  { icon: Bell, label: 'Alertes' },
  { icon: FileText, label: 'Rapports' },
  { icon: Settings, label: 'Paramètres' },
];

const StatCard = ({ icon: Icon, value, label, helper, color }: { icon: any; value: number; label: string; helper: string; color: string }) => (
  <div className="rounded-lg border border-slate-700/70 bg-[#0b1a2f]/86 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.04),0_16px_42px_rgba(0,0,0,.22)] backdrop-blur-xl">
    <div className="flex items-center gap-4">
      <div className="grid h-11 w-11 place-items-center rounded-full shadow-[0_0_24px_rgba(37,99,235,.22)]" style={{ background: `radial-gradient(circle at 30% 30%, ${color}66, ${color}22 55%, transparent)` }}>
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div>
        <div className="text-2xl font-extrabold leading-6 text-white">{value}</div>
        <div className="mt-1 text-sm font-medium text-slate-100">{label}</div>
        <div className="mt-0.5 text-xs text-slate-500">{helper}</div>
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: StatusKey }) => {
  const meta = statusMeta[status];
  return (
    <span className="inline-flex min-w-[86px] items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium" style={{ color: meta.color, backgroundColor: meta.bg, borderColor: meta.border }}>
      {meta.label}
    </span>
  );
};

const Donut = ({ value }: { value: number }) => {
  const radius = 41;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative h-32 w-32">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90 drop-shadow-[0_0_22px_rgba(37,99,235,.25)]">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(15,23,42,.92)" strokeWidth="17" />
        {criteria.map((item, index) => {
          const length = (item.value / 100) * circumference;
          const strokeDasharray = `${length - 4} ${circumference}`;
          const strokeDashoffset = -offset;
          offset += length;
          return <circle key={item.label} cx="60" cy="60" r={radius} fill="none" stroke={item.color} strokeWidth="17" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} strokeLinecap="butt" opacity={index === 0 ? 1 : 0.95} />;
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-3xl font-extrabold leading-none text-white">{value}</div>
          <div className="mt-1 text-sm text-slate-400">/100</div>
        </div>
      </div>
    </div>
  );
};

export default function GlobalViewProfessional() {
  const [expandedOptions, setExpandedOptions] = useState<Set<number>>(new Set([1, 2]));
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set([1, 2, 3, 4]));

  const stats = useMemo(() => {
    const totalOptions = mockData.length;
    const totalPosts = mockData.reduce((sum, opt) => sum + opt.posts.length, 0);
    const totalActions = mockData.reduce((sum, opt) => sum + opt.posts.reduce((s, p) => s + p.actions.length, 0), 0);
    return {
      totalOptions,
      totalPosts: totalPosts + 8,
      totalActions: totalActions + 24,
      delayedActions: 5,
      highRisks: 3,
      alerts: 7,
      avgScore: Math.round(mockData.reduce((sum, opt) => sum + opt.score, 0) / mockData.length),
      bestOption: mockData.reduce((best, opt) => (opt.score > best.score ? opt : best)),
    };
  }, []);

  const toggleOption = (id: number) => {
    const next = new Set(expandedOptions);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedOptions(next);
  };

  const togglePost = (id: number) => {
    const next = new Set(expandedPosts);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedPosts(next);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#020817] text-slate-100" style={{ backgroundImage: 'radial-gradient(circle at 30% -10%, rgba(37,99,235,.18), transparent 32%), radial-gradient(circle at 88% 8%, rgba(59,130,246,.13), transparent 28%)' }}>
      <div className="flex min-h-screen">
        <aside className="flex w-[184px] shrink-0 flex-col border-r border-blue-500/15 bg-[#061123]/85 shadow-[12px_0_36px_rgba(0,0,0,.18)] backdrop-blur-xl">
          <div className="flex h-20 items-center px-5">
            <div className="relative h-9 w-9">
              <div className="absolute inset-0 rounded-xl bg-blue-600/20 blur-lg" />
              <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-950/50">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1.5 px-2.5 py-2">
            {navItems.map((item) => (
              <button key={item.label} className={`group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition ${item.active ? 'bg-blue-600/20 text-white shadow-[inset_3px_0_0_#3b82f6]' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                <item.icon className={`h-4.5 w-4.5 ${item.active ? 'text-blue-300' : 'text-slate-400 group-hover:text-blue-300'}`} />
                <span className="truncate text-[13px] font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="border-t border-blue-500/10 p-4">
            <div className="mb-6 flex items-center justify-center gap-2 text-slate-400">
              <Sun className="h-4 w-4" />
              <button className="relative h-6 w-12 rounded-full border border-blue-400/30 bg-blue-950/80 p-0.5">
                <span className="block h-5 w-5 translate-x-6 rounded-full bg-gradient-to-br from-blue-300 to-blue-600 shadow-[0_0_14px_rgba(96,165,250,.8)]" />
              </button>
              <Moon className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-400 to-blue-700 text-xs font-bold text-white">AD</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">Admin</p>
                <p className="truncate text-xs text-slate-500">Administrateur</p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between px-7 pb-5 pt-5">
            <div>
              <p className="text-sm font-medium text-slate-300">Étude de faisabilité</p>
              <h1 className="mt-0.5 text-3xl font-extrabold tracking-tight text-white">Vue globale</h1>
              <p className="mt-1 text-sm text-slate-400">Synthèse complète de l'étude et de toutes les options</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-500/60 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:border-blue-400/70 hover:bg-blue-500/10">
                <Filter className="h-4 w-4" />
                Filtrer
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(37,99,235,.28)] transition hover:brightness-110">
                <Plus className="h-4 w-4" />
                Ajouter
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-7 pb-7">
            <section className="grid grid-cols-6 gap-3.5">
              <StatCard icon={FolderOpen} value={stats.totalOptions} label="Options" helper="Total des options" color="#2563eb" />
              <StatCard icon={CheckSquare} value={stats.totalPosts} label="Postes" helper="Tous les postes" color="#3b82f6" />
              <StatCard icon={CheckCircle2} value={stats.totalActions} label="Actions" helper="Toutes les actions" color="#22c55e" />
              <StatCard icon={Clock3} value={stats.delayedActions} label="Actions en retard" helper="À traiter" color="#f59e0b" />
              <StatCard icon={ShieldAlert} value={stats.highRisks} label="Risques élevés" helper="Impact / Probabilité" color="#ef4444" />
              <StatCard icon={Bell} value={stats.alerts} label="Alertes" helper="Actives" color="#8b5cf6" />
            </section>

            <section className="mt-3.5 grid grid-cols-[214px_minmax(520px,1fr)_350px] gap-3.5">
              <div className="space-y-3.5">
                <div className="rounded-lg border border-slate-700/70 bg-[#0b1a2f]/86 p-4 shadow-xl shadow-black/10">
                  <h2 className="mb-4 text-base font-bold text-white">Légende des statuts</h2>
                  <div className="space-y-3">
                    {(['favorable', 'risk', 'blocked', 'abandoned', 'completed', 'waiting', 'idea', 'in_progress', 'review', 'delayed', 'completed'] as StatusKey[]).map((status, index) => (
                      <div key={`${status}-${index}`} className="flex items-center gap-3 text-sm text-slate-300">
                        <span className="h-3 w-3 rounded-full shadow-[0_0_14px_currentColor]" style={{ color: statusMeta[status].color, backgroundColor: statusMeta[status].color }} />
                        <span>{index === 10 ? 'Terminé / Clôturé' : statusMeta[status].label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-700/70 bg-[#0b1a2f]/86 p-4 shadow-xl shadow-black/10">
                  <div className="mb-4 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-400" />
                    <h2 className="text-base font-bold text-white">Meilleure option</h2>
                  </div>
                  <div className="rounded-lg border border-emerald-400/80 bg-emerald-500/5 px-4 py-5 text-center shadow-[0_0_22px_rgba(34,197,94,.12)]">
                    <p className="text-xl font-extrabold text-emerald-400">Option B</p>
                    <span className="mt-3 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/15 px-3 py-1 text-sm font-medium text-emerald-300">Favorable</span>
                    <p className="mt-5 text-sm text-slate-300">Score global</p>
                    <p className="mt-1 text-2xl font-extrabold text-emerald-400">78 <span className="text-base font-medium text-slate-300">/ 100</span></p>
                  </div>
                  <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-600/80 bg-slate-900/60 px-3 py-2.5 text-sm font-medium text-white transition hover:border-blue-400/60 hover:bg-blue-500/10">
                    <Eye className="h-4 w-4 text-slate-300" />
                    Voir le détail
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-slate-700/70 bg-[#0b1a2f]/86 shadow-xl shadow-black/10">
                <div className="flex items-center justify-between border-b border-slate-700/60 px-4 py-3">
                  <h2 className="text-base font-bold text-white">Arborescence globale</h2>
                  <button className="inline-flex items-center gap-2 rounded-lg border border-slate-600/70 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-blue-500/10">
                    <ChevronsDownUp className="h-3.5 w-3.5" />
                    Tout développer
                  </button>
                </div>
                <div className="grid grid-cols-[1fr_120px_96px] border-b border-slate-700/60 px-5 py-3 text-xs font-medium text-slate-400">
                  <span>Élément</span>
                  <span>Statut</span>
                  <span className="text-right">Score global</span>
                </div>
                <div className="max-h-[548px] overflow-y-auto px-3 py-2">
                  {mockData.map((option) => (
                    <div key={option.id}>
                      <button onClick={() => toggleOption(option.id)} className="grid w-full grid-cols-[1fr_120px_96px] items-center gap-2 rounded-md px-2 py-2.5 text-left transition hover:bg-white/[.04]">
                        <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-white">
                          {expandedOptions.has(option.id) ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
                          <FileText className="h-4 w-4 shrink-0 text-blue-400" />
                          <span className="truncate">{option.name}</span>
                        </div>
                        <StatusBadge status={option.status} />
                        <span className="text-right text-sm font-semibold text-white">{option.score} / 100</span>
                      </button>
                      {expandedOptions.has(option.id) && option.posts.map((post) => (
                        <div key={post.id}>
                          <button onClick={() => togglePost(post.id)} className="grid w-full grid-cols-[1fr_120px_96px] items-center gap-2 rounded-md px-2 py-2.5 pl-8 text-left transition hover:bg-white/[.04]">
                            <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-slate-300">
                              {expandedPosts.has(post.id) ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
                              <FileText className="h-4 w-4 shrink-0 text-blue-300" />
                              <span className="truncate">{post.name}</span>
                            </div>
                            <StatusBadge status={post.status} />
                            <span className="text-right text-sm font-semibold text-white">{post.score} / 100</span>
                          </button>
                          {expandedPosts.has(post.id) && post.actions.map((action) => (
                            <div key={action.id} className="grid grid-cols-[1fr_120px_96px] items-center gap-2 rounded-md px-2 py-2.5 pl-14 text-left">
                              <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-slate-400">
                                <CircleDot className="h-3 w-3 shrink-0 text-slate-500" />
                                <span className="truncate">{action.name}</span>
                              </div>
                              <StatusBadge status={action.status} />
                              <span className="text-right text-sm font-semibold text-white">{action.score} / 100</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3.5">
                <div className="rounded-lg border border-slate-700/70 bg-[#0b1a2f]/86 p-4 shadow-xl shadow-black/10">
                  <h2 className="mb-4 text-base font-bold text-white">Synthèse des scores</h2>
                  <div className="flex justify-center">
                    <Donut value={stats.avgScore} />
                  </div>
                </div>

                <div className="rounded-lg border border-slate-700/70 bg-[#0b1a2f]/86 p-4 shadow-xl shadow-black/10">
                  <h2 className="mb-4 text-base font-bold text-white">Critères d'évaluation</h2>
                  <div className="space-y-3">
                    {criteria.map((item) => (
                      <div key={item.label} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-slate-300">{item.label}</span>
                        </div>
                        <span className="font-semibold text-white">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-700/70 bg-[#0b1a2f]/86 p-4 shadow-xl shadow-black/10">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-bold text-white">Alertes actives</h2>
                    <a href="#" className="text-xs font-semibold text-blue-400 hover:text-blue-300">Voir tout</a>
                  </div>
                  <div className="space-y-2 text-sm">
                    {[
                      { label: 'Actions en retard', value: 5, color: '#ef4444' },
                      { label: 'Risques élevés', value: 3, color: '#f59e0b' },
                      { label: 'Postes à revoir', value: 4, color: '#facc15' },
                      { label: 'Décisions en attente', value: 2, color: '#3b82f6' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-slate-300">{item.label}</span>
                        </div>
                        <span className="font-semibold" style={{ color: item.color }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-700/70 bg-[#0b1a2f]/86 p-4 shadow-xl shadow-black/10">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-bold text-white">Règles automatiques</h2>
                    <a href="#" className="text-xs font-semibold text-blue-400 hover:text-blue-300">Voir tout</a>
                  </div>
                  <div className="space-y-2 text-sm">
                    {[
                      { label: 'Règle de score global', status: 'Actif', color: '#22c55e' },
                      { label: 'Règle de risque', status: 'Actif', color: '#22c55e' },
                      { label: 'Règle de délai', status: 'Actif', color: '#22c55e' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-slate-300">{item.label}</span>
                        <span className="font-semibold" style={{ color: item.color }}>{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-3.5 rounded-lg border border-slate-700/70 bg-[#0b1a2f]/86 p-4 shadow-xl shadow-black/10">
              <h2 className="mb-6 text-base font-bold text-white">Chronologie globale</h2>
              <div className="flex items-start justify-between">
                {[
                  { label: 'Création de l\'étude', date: '07/04/2024', completed: true },
                  { label: 'Ajout des options', date: '05/04/2024', completed: true },
                  { label: 'Début des postes', date: '10/04/2024', completed: true },
                  { label: 'Actions en cours', date: '15/04/2024', completed: true },
                  { label: 'Dernière action', date: '20/05/2024', completed: true },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center ${item.completed ? 'border-blue-400 bg-blue-500/20' : 'border-slate-600 bg-slate-900/60'}`}>
                      {item.completed && <CheckCircle2 className="h-4 w-4 text-blue-400" />}
                    </div>
                    <div className="mt-3 text-center text-xs font-medium text-slate-300">{item.label}</div>
                    <div className="mt-1 text-xs text-slate-500">{item.date}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-lg border border-dashed border-slate-600/50 bg-slate-900/30 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Décision finale prévue</p>
                    <p className="mt-1 text-xs text-slate-400">Dans 30 jours</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-emerald-400">19/06/2024</p>
                    <p className="mt-1 text-xs text-slate-400">(Dans 30 jours)</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-6 border-t border-slate-700/60 pt-4 text-xs text-slate-500">
              <p>Étude ID : #1234 • Créée le 01/04/2024 par Admin • Dernière mise à jour : 20/05/2024 à 14:30</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
