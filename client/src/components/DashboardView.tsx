interface DashboardViewProps {
  studyId: number;
}

export default function DashboardView({ studyId }: DashboardViewProps) {
  return (
    <div className="blueprint-container">
      <h2 className="blueprint-title mb-6">Tableau de Bord</h2>
      <p className="text-muted-foreground">Le tableau de bord avec KPIs et graphiques sera disponible bientôt...</p>
      <p className="text-muted-foreground text-sm mt-2">KPIs globaux, graphiques de progression et synthèse par option</p>
    </div>
  );
}
