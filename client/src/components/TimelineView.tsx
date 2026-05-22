import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

interface TimelineViewProps {
  studyId: number;
}

export default function TimelineView({ studyId }: TimelineViewProps) {
  const optionsQuery = trpc.options.list.useQuery({ studyId });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'idea': 'bg-blue-500/20',
      'in_progress': 'bg-yellow-500/20',
      'to_review': 'bg-purple-500/20',
      'in_retard': 'bg-red-500/20',
      'abandoned': 'bg-gray-500/20',
      'terminated': 'bg-green-500/20',
    };
    return colors[status] || 'bg-muted/20';
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="blueprint-title">Chronologie (Gantt Simplifié)</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="blueprint-button">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Jalon
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-accent/30">
            <DialogHeader>
              <DialogTitle className="text-accent">Nouveau Jalon</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom</label>
                <Input
                  id="new-milestone-name"
                  placeholder="Ex: Fin phase 1"
                  className="blueprint-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <Input
                  id="new-milestone-date"
                  type="date"
                  className="blueprint-input"
                />
              </div>
              <Button
                onClick={() => {
                  toast.info('Création de jalons - Fonctionnalité en développement');
                }}
                className="blueprint-button w-full"
              >
                Créer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="blueprint-card p-4">
          <h3 className="font-semibold text-accent mb-4">Chronologie des Options</h3>
          
          <div className="space-y-3">
            {optionsQuery.data?.map((option: any) => (
              <div key={option.id} className="space-y-2">
                <div className="text-sm font-medium text-accent">{option.name}</div>
                <div className="ml-4 p-3 bg-accent/5 rounded">
                  <p className="text-xs text-muted-foreground">
                    Score: {option.globalScore || '0'} | Avancement: {option.globalAdvancement || '0'}%
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(option.status)}`}>
                      {getStatusLabel(option.status)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="blueprint-card p-4">
          <h3 className="font-semibold text-accent mb-4">Légende des Statuts</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500/40 rounded"></div>
              <span>Idée</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500/40 rounded"></div>
              <span>En cours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500/40 rounded"></div>
              <span>À examiner</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500/40 rounded"></div>
              <span>En retard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500/40 rounded"></div>
              <span>Terminé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500/40 rounded"></div>
              <span>Abandonné</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
