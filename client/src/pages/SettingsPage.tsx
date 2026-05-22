import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';

interface Study {
  id: number;
  title: string;
}

export default function SettingsPage({ studyId }: { studyId: number }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [showNewRuleDialog, setShowNewRuleDialog] = useState(false);
  const [showNewThresholdDialog, setShowNewThresholdDialog] = useState(false);

  // Récupérer les règles de statut
  const rulesQuery = trpc.calculations.getStatusRules.useQuery({ studyId });

  // Récupérer les seuils d'alertes
  const thresholdsQuery = trpc.calculations.getAlertThresholds.useQuery({ studyId });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rules">{t('label.rule')}</TabsTrigger>
          <TabsTrigger value="thresholds">{t('label.threshold')}</TabsTrigger>
        </TabsList>

        {/* Règles de statuts */}
        <TabsContent value="rules" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t('label.rule')}</h3>
            <Dialog open={showNewRuleDialog} onOpenChange={setShowNewRuleDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  {t('button.add')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouvelle Règle de Statut</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom</label>
                    <Input placeholder="Ex: Option favorable" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Condition</label>
                    <Input placeholder="Ex: score > 75" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Statut résultant</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="favorable">Favorable</SelectItem>
                        <SelectItem value="risky">Risqué</SelectItem>
                        <SelectItem value="blocked">Bloquant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">{t('button.save')}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            {rulesQuery.data?.map((rule: any) => (
              <Card key={rule.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{rule.name}</h4>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                      <p className="text-sm mt-2">Statut: <span className="font-semibold">{rule.resultStatus}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm"><Edit2 className="w-4 h-4" /></Button>
                      <Button variant="destructive" size="sm"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!rulesQuery.data?.length && (
              <p className="text-center text-muted-foreground py-8">{t('message.no_data')}</p>
            )}
          </div>
        </TabsContent>

        {/* Seuils d'alertes */}
        <TabsContent value="thresholds" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t('label.threshold')}</h3>
            <Dialog open={showNewThresholdDialog} onOpenChange={setShowNewThresholdDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  {t('button.add')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouveau Seuil d'Alerte</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom</label>
                    <Input placeholder="Ex: Coût élevé" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cost">Coût</SelectItem>
                        <SelectItem value="delay">Délai</SelectItem>
                        <SelectItem value="score">Score</SelectItem>
                        <SelectItem value="advancement">Avancement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Opérateur</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Opérateur" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=">">Supérieur à (&gt;)</SelectItem>
                          <SelectItem value="<">Inférieur à (&lt;)</SelectItem>
                          <SelectItem value=">=">&gt;=</SelectItem>
                          <SelectItem value="<=">&lt;=</SelectItem>
                          <SelectItem value="=">=</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Valeur</label>
                      <Input type="number" placeholder="100000" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Sévérité</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la sévérité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Avertissement</SelectItem>
                        <SelectItem value="critical">Critique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">{t('button.save')}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            {thresholdsQuery.data?.map((threshold: any) => (
              <Card key={threshold.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{threshold.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {threshold.type} {threshold.operator} {threshold.threshold}
                      </p>
                      <p className="text-sm mt-2">
                        Sévérité: <span className="font-semibold capitalize">{threshold.severity}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm"><Edit2 className="w-4 h-4" /></Button>
                      <Button variant="destructive" size="sm"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!thresholdsQuery.data?.length && (
              <p className="text-center text-muted-foreground py-8">{t('message.no_data')}</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
