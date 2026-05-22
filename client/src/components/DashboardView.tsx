import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardViewProps {
  studyId: number;
}

interface KPI {
  label: string;
  value: string | number;
  unit: string;
  trend?: number;
}

export default function DashboardView({ studyId }: DashboardViewProps) {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<any[]>([]);

  const optionsQuery = trpc.options.list.useQuery({ studyId });
  const scoringQuery = trpc.scoring.recalculateStudyScores.useMutation();

  useEffect(() => {
    if (!optionsQuery.data) return;

    // Calculer les KPIs
    const newKpis: KPI[] = [];
    let totalOptions = optionsQuery.data.length;
    let totalCost = 0;
    let totalDays = 0;
    let avgScore = 0;

    optionsQuery.data.forEach((opt: any) => {
      totalCost += parseFloat(opt.globalScore || '0');
      totalDays += parseFloat(opt.globalAdvancement || '0');
      avgScore += parseFloat(opt.globalScore || '0');
    });

    newKpis.push(
      { label: 'Nombre d\'options', value: totalOptions, unit: '' },
      { label: 'Score moyen', value: (avgScore / Math.max(totalOptions, 1)).toFixed(2), unit: '/100' },
      { label: 'Avancement moyen', value: (totalDays / Math.max(totalOptions, 1)).toFixed(1), unit: '%' },
      { label: 'Coût total estimé', value: totalCost.toFixed(0), unit: 'K€' }
    );

    setKpis(newKpis);

    // Préparer les données pour le graphique
    const chartData = optionsQuery.data.map((opt: any) => ({
      name: opt.name,
      score: parseFloat(opt.globalScore || '0'),
      advancement: parseFloat(opt.globalAdvancement || '0'),
    }));
    setChartData(chartData);

    // Distribution des statuts
    const statusCounts: Record<string, number> = {};
    optionsQuery.data.forEach((opt: any) => {
      const status = opt.status || 'unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const statusData = Object.entries(statusCounts).map(([status, count]) => ({
      name: getStatusLabel(status),
      value: count,
      color: getStatusColor(status),
    }));
    setStatusDistribution(statusData);
  }, [optionsQuery.data]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'idea': '#3b82f6',
      'in_progress': '#eab308',
      'to_review': '#a855f7',
      'in_retard': '#ef4444',
      'abandoned': '#6b7280',
      'terminated': '#22c55e',
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'idea': 'Idée',
      'in_progress': 'En cours',
      'to_review': 'À examiner',
      'in_retard': 'En retard',
      'abandoned': 'Abandonné',
      'terminated': 'Terminé',
    };
    return labels[status] || status;
  };

  return (
    <div className="blueprint-container">
      <h2 className="blueprint-title mb-6">Tableau de Bord</h2>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, index) => (
          <div key={index} className="blueprint-card p-4 text-center">
            <div className="blueprint-metric-label mb-2">{kpi.label}</div>
            <div className="blueprint-metric-value">
              {kpi.value}{kpi.unit}
            </div>
            {kpi.trend !== undefined && (
              <div className={`text-xs mt-2 ${kpi.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {kpi.trend >= 0 ? '↑' : '↓'} {Math.abs(kpi.trend)}%
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Graphique de comparaison */}
        <div className="blueprint-card p-4">
          <h3 className="font-semibold text-accent mb-4">Comparaison des Options</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.1)" />
                <XAxis dataKey="name" stroke="rgba(232, 240, 255, 0.6)" />
                <YAxis stroke="rgba(232, 240, 255, 0.6)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 31, 53, 0.9)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                  }}
                />
                <Legend />
                <Bar dataKey="score" fill="#00d4ff" name="Score" />
                <Bar dataKey="advancement" fill="#00f0ff" name="Avancement %" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucune donnée disponible
            </div>
          )}
        </div>

        {/* Distribution des statuts */}
        <div className="blueprint-card p-4">
          <h3 className="font-semibold text-accent mb-4">Distribution des Statuts</h3>
          {statusDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 31, 53, 0.9)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucune donnée disponible
            </div>
          )}
        </div>
      </div>

      {/* Synthèse par option */}
      <div className="blueprint-card p-4">
        <h3 className="font-semibold text-accent mb-4">Synthèse par Option</h3>
        <div className="space-y-3">
          {optionsQuery.data?.map((opt: any) => (
            <div key={opt.id} className="flex items-center justify-between p-3 bg-accent/5 rounded">
              <div className="flex-1">
                <div className="font-medium">{opt.name}</div>
                <div className="text-xs text-muted-foreground">
                  Score: {opt.globalScore || '0'} | Avancement: {opt.globalAdvancement || '0'}%
                </div>
              </div>
              <div className={`px-3 py-1 rounded text-xs font-semibold ${
                opt.status === 'terminated' ? 'bg-green-500/20 text-green-400' :
                opt.status === 'in_retard' ? 'bg-red-500/20 text-red-400' :
                opt.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {getStatusLabel(opt.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
