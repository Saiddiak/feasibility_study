import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface MatrixViewProps {
  studyId: number;
}

interface Option {
  id: number;
  name: string;
  globalScore: string | null;
}

interface Criteria {
  id: number;
  name: string;
  weight: string | null;
}

export default function MatrixView({ studyId }: MatrixViewProps) {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});

  const criteriaQuery = trpc.evaluationCriteria.list.useQuery({ studyId });
  const optionsQuery = trpc.options.list.useQuery({ studyId });

  useEffect(() => {
    if (criteriaQuery.data) {
      setCriteria(criteriaQuery.data as Criteria[]);
    }
  }, [criteriaQuery.data]);

  useEffect(() => {
    if (optionsQuery.data) {
      setOptions(optionsQuery.data as Option[]);
    }
  }, [optionsQuery.data]);

  const calculateWeightedScore = (optionId: number) => {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const c of criteria) {
      const weight = parseFloat(c.weight?.toString() || '1');
      const score = scores[`${optionId}-${c.id}`] || 0;
      totalWeightedScore += score * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 100) / 100 : 0;
  };

  const getRanking = () => {
    const ranked = options
      .map(opt => ({
        ...opt,
        weightedScore: calculateWeightedScore(opt.id),
      }))
      .sort((a, b) => b.weightedScore - a.weightedScore);

    return ranked;
  };

  return (
    <div className="blueprint-container">
      <div className="flex items-center justify-between mb-6">
        <h2 className="blueprint-title">Matrice de Comparaison</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="blueprint-button">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Critère
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-accent/30">
            <DialogHeader>
              <DialogTitle className="text-accent">Nouveau Critère d'Évaluation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom</label>
                <Input
                  id="new-criteria-name"
                  placeholder="Ex: Coût"
                  className="blueprint-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Poids</label>
                <Input
                  id="new-criteria-weight"
                  type="number"
                  defaultValue="1"
                  className="blueprint-input"
                />
              </div>
              <Button
                onClick={() => {
                  toast.info('Création de critères - Fonctionnalité en développement');
                }}
                className="blueprint-button w-full"
              >
                Créer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {criteria.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Aucun critère d'évaluation défini</p>
          <p className="text-sm text-muted-foreground">Créez des critères pour commencer la comparaison</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Matrice de scores */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-accent/30">
                  <th className="text-left py-2 px-3 text-accent font-semibold">Critère</th>
                  {options.map(opt => (
                    <th key={opt.id} className="text-center py-2 px-3 text-accent font-semibold">
                      {opt.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {criteria.map(c => (
                  <tr key={c.id} className="border-b border-accent/20 hover:bg-accent/5">
                    <td className="py-2 px-3 text-foreground">
                      {c.name}
                      <span className="text-xs text-muted-foreground ml-2">(poids: {c.weight})</span>
                    </td>
                    {options.map(opt => (
                      <td key={`${opt.id}-${c.id}`} className="text-center py-2 px-3">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={scores[`${opt.id}-${c.id}`] || 0}
                          onChange={(e) => {
                            setScores({
                              ...scores,
                              [`${opt.id}-${c.id}`]: parseFloat(e.target.value) || 0,
                            });
                          }}
                          className="blueprint-input w-16 text-center"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Classement */}
          <div className="blueprint-card p-4">
            <h3 className="font-semibold text-accent mb-4">Classement des Options</h3>
            <div className="space-y-2">
              {getRanking().map((opt, index) => (
                <div key={opt.id} className="flex items-center justify-between p-3 bg-accent/5 rounded">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-accent text-lg">#{index + 1}</span>
                    <span className="font-medium">{opt.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-accent-light"
                        style={{ width: `${Math.min(opt.weightedScore, 100)}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-accent">{opt.weightedScore}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
