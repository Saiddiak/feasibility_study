import { trpc } from '@/lib/trpc';

interface TimelineViewProps {
  studyId: number;
}

export default function TimelineView({ studyId }: TimelineViewProps) {
  return (
    <div className="blueprint-container">
      <h2 className="blueprint-title mb-6">Chronologie (Gantt)</h2>
      <p className="text-muted-foreground">La vue chronologie sera disponible bientôt...</p>
      <p className="text-muted-foreground text-sm mt-2">Affichage des actions dans le temps avec jalons et dépendances</p>
    </div>
  );
}
