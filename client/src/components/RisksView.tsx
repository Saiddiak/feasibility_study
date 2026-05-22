import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Edit2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface RisksViewProps {
  studyId: number;
}

export default function RisksView({ studyId }: RisksViewProps) {
  const risksQuery = trpc.risks.list.useQuery({ studyId });

  const getRiskLevel = (probability: number, impact: number) => {
    const level = probability * impact;
    if (level >= 16) return { label: 'Critique', color: 'bg-red-500/20 text-red-400' };
    if (level >= 9) return { label: 'Élevé', color: 'bg-orange-500/20 text-orange-400' };
    if (level >= 4) return { label: 'Moyen', color: 'bg-yellow-500/20 text-yellow-400' };
    return { label: 'Faible', color: 'bg-green-500/20 text-green-400' };
  };

  const getProbabilityLabel = (value: number) => {
    if (value <= 1) return 'Très faible';
    if (value <= 2) return 'Faible';
    if (value <= 3) return 'Moyen';
    if (value <= 4) return 'Élevé';
    return 'Très élevé';
  };

  const getImpactLabel = (value: number) => {
    if (value <= 1) return 'Minimal';
    if (value <= 2) return 'Faible';
    if (value <= 3) return 'Modéré';
    if (value <= 4) return 'Important';
    return 'Critique';
  };

  return (
    <div className="blueprint-container">
      <div className="flex items-center justify-between mb-6">
        <h2 className="blueprint-title">Gestion des Risques</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="blueprint-button">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Risque
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-accent/30">
            <DialogHeader>
              <DialogTitle className="text-accent">Identifier un Nouveau Risque</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Input
                  id="new-risk-description"
                  placeholder="Ex: Délai de livraison des composants"
                  className="blueprint-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Probabilité (1-5)</label>
                  <Input
                    id="new-risk-probability"
                    type="number"
                    min="1"
                    max="5"
                    defaultValue="3"
                    className="blueprint-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Impact (1-5)</label>
                  <Input
                    id="new-risk-impact"
                    type="number"
                    min="1"
                    max="5"
                    defaultValue="3"
                    className="blueprint-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Plan d'action</label>
                <Input
                  id="new-risk-mitigation"
                  placeholder="Ex: Contacter les fournisseurs en avance"
                  className="blueprint-input"
                />
              </div>
              <Button
                onClick={() => {
                  toast.info('Création de risques - Fonctionnalité en développement');
                }}
                className="blueprint-button w-full"
              >
                Créer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {risksQuery.isLoading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Chargement des risques...</p>
        </div>
      ) : risksQuery.data?.length === 0 ? (
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-accent/30 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Aucun risque identifié</p>
          <p className="text-sm text-muted-foreground">Identifiez les risques potentiels pour votre projet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Matrice de risques */}
          <div className="blueprint-card p-4 mb-6">
            <h3 className="font-semibold text-accent mb-4">Matrice de Risques</h3>
            <div className="grid grid-cols-5 gap-2 text-xs">
              {[1, 2, 3, 4, 5].map(impact => (
                <div key={`impact-${impact}`} className="space-y-2">
                  <div className="text-center font-semibold text-muted-foreground">Impact {impact}</div>
                  {[1, 2, 3, 4, 5].map(prob => {
                    const level = getRiskLevel(prob, impact);
                    const risksInCell = risksQuery.data?.filter(
                      (r: any) => r.probability === prob && r.impact === impact
                    ) || [];
                    return (
                      <div
                        key={`risk-${prob}-${impact}`}
                        className={`p-2 rounded text-center ${level.color} min-h-12 flex items-center justify-center`}
                      >
                        {risksInCell.length > 0 && (
                          <span className="font-bold">{risksInCell.length}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Liste des risques triés par niveau */}
          <div className="space-y-3">
            {risksQuery.data
              ?.sort((a: any, b: any) => (b.probability * b.impact) - (a.probability * a.impact))
              .map((risk: any) => {
                const level = getRiskLevel(risk.probability, risk.impact);
                return (
                  <div key={risk.id} className="blueprint-card p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${level.color}`}>
                            {level.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Prob: {getProbabilityLabel(risk.probability)} | Impact: {getImpactLabel(risk.impact)}
                          </span>
                        </div>
                        <p className="font-medium mb-2">{risk.description}</p>
                        {risk.mitigationPlan && (
                          <div className="bg-accent/5 p-2 rounded text-sm">
                            <span className="font-semibold text-accent">Plan d'action: </span>
                            {risk.mitigationPlan}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            toast.info('Suppression de risques - Fonctionnalité en développement');
                          }}
                          className="text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Légende */}
      <div className="blueprint-card p-4 mt-6">
        <h3 className="font-semibold text-accent mb-3">Légende</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500/20 rounded"></div>
            <span>Faible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500/20 rounded"></div>
            <span>Moyen</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500/20 rounded"></div>
            <span>Élevé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500/20 rounded"></div>
            <span>Critique</span>
          </div>
        </div>
      </div>
    </div>
  );
}
