interface MatrixViewProps {
  studyId: number;
}

export default function MatrixView({ studyId }: MatrixViewProps) {
  return (
    <div className="blueprint-container">
      <h2 className="blueprint-title mb-6">Matrice de Comparaison</h2>
      <p className="text-muted-foreground">La matrice de comparaison des options sera disponible bientôt...</p>
      <p className="text-muted-foreground text-sm mt-2">Scores pondérés et classement automatique des options</p>
    </div>
  );
}
