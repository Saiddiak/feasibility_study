interface RisksViewProps {
  studyId: number;
}

export default function RisksView({ studyId }: RisksViewProps) {
  return (
    <div className="blueprint-container">
      <h2 className="blueprint-title mb-6">Gestion des Risques</h2>
      <p className="text-muted-foreground">La gestion des risques sera disponible bientôt...</p>
      <p className="text-muted-foreground text-sm mt-2">Identification, impact/probabilité, et plan d'action par poste</p>
    </div>
  );
}
