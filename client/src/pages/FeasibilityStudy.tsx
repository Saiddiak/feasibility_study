import { useState, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, ChevronDown, ChevronRight, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { ControlBar } from '@/components/ControlBar';
import { useLanguage } from '@/contexts/LanguageContext';
import TreeView from '@/components/TreeView';
import TimelineView from '@/components/TimelineView';
import MatrixView from '@/components/MatrixView';
import DashboardView from '@/components/DashboardView';
import RisksView from '@/components/RisksView';
import GlobalView from '@/pages/GlobalView';
import GlobalViewDemo from '@/pages/GlobalViewDemo';
import GlobalViewComplete from '@/pages/GlobalViewComplete';
import GlobalViewInteractive from '@/pages/GlobalViewInteractive';

interface Study {
  id: number;
  title: string;
  description?: string;
  status: string;
}

export default function FeasibilityStudy() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [studies, setStudies] = useState<Study[]>([]);
  const [currentStudy, setCurrentStudy] = useState<Study | null>(null);
  const [showNewStudyDialog, setShowNewStudyDialog] = useState(false);
  const [newStudyTitle, setNewStudyTitle] = useState('');
  const [newStudyDescription, setNewStudyDescription] = useState('');

  const studiesQuery = trpc.studies.list.useQuery(undefined, {
    enabled: !!user,
  });

  const createStudyMutation = trpc.studies.create.useMutation({
    onSuccess: (result) => {
      setShowNewStudyDialog(false);
      setNewStudyTitle('');
      setNewStudyDescription('');
      studiesQuery.refetch();
    },
  });

  useEffect(() => {
    if (studiesQuery.data) {
      setStudies(studiesQuery.data as Study[]);
      if (!currentStudy && studiesQuery.data.length > 0) {
        setCurrentStudy(studiesQuery.data[0] as Study);
      }
    }
  }, [studiesQuery.data]);

  const handleCreateStudy = () => {
    if (newStudyTitle.trim()) {
      createStudyMutation.mutate({
        title: newStudyTitle,
        description: newStudyDescription || undefined,
      });
    }
  };

  if (!currentStudy && studies.length === 0) {
    return (
      <>
        <GlobalViewComplete />
        <div className="min-h-screen blueprint-grid bg-background flex flex-col items-center justify-center p-4 hidden">
          <div className="blueprint-container max-w-md w-full text-center">
            <h1 className="blueprint-title mb-4">Étude de Faisabilité</h1>
            <p className="text-muted-foreground mb-6">Créez votre première étude de faisabilité pour commencer</p>
          
          <Dialog open={showNewStudyDialog} onOpenChange={setShowNewStudyDialog}>
            <DialogTrigger asChild>
              <Button className="blueprint-button w-full">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Étude
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-accent/30">
              <DialogHeader>
                <DialogTitle className="text-accent">Nouvelle Étude de Faisabilité</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <Input
                    placeholder="Ex: Étude de faisabilité - Projet X"
                    value={newStudyTitle}
                    onChange={(e) => setNewStudyTitle(e.target.value)}
                    className="blueprint-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description (optionnel)</label>
                  <Input
                    placeholder="Description de l'étude"
                    value={newStudyDescription}
                    onChange={(e) => setNewStudyDescription(e.target.value)}
                    className="blueprint-input"
                  />
                </div>
                <Button
                  onClick={handleCreateStudy}
                  disabled={!newStudyTitle.trim()}
                  className="blueprint-button w-full"
                >
                  Créer l'étude
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      </>
    );
  }

  return (
    <div className="min-h-screen blueprint-grid bg-background">
      <div className="container mx-auto py-6">
        {/* Header */}
        <div className="blueprint-container mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="blueprint-title">{currentStudy?.title}</h1>
              {currentStudy?.description && (
                <p className="text-muted-foreground text-sm mt-2">{currentStudy.description}</p>
              )}
            </div>
            <Dialog open={showNewStudyDialog} onOpenChange={setShowNewStudyDialog}>
              <DialogTrigger asChild>
                <Button className="blueprint-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Étude
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-accent/30">
                <DialogHeader>
                  <DialogTitle className="text-accent">Nouvelle Étude de Faisabilité</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Titre</label>
                    <Input
                      placeholder="Ex: Étude de faisabilité - Projet X"
                      value={newStudyTitle}
                      onChange={(e) => setNewStudyTitle(e.target.value)}
                      className="blueprint-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description (optionnel)</label>
                    <Input
                      placeholder="Description de l'étude"
                      value={newStudyDescription}
                      onChange={(e) => setNewStudyDescription(e.target.value)}
                      className="blueprint-input"
                    />
                  </div>
                  <Button
                    onClick={handleCreateStudy}
                    disabled={!newStudyTitle.trim()}
                    className="blueprint-button w-full"
                  >
                    Créer l'étude
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Study Selector */}
          {studies.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {studies.map((study) => (
                <button
                  key={study.id}
                  onClick={() => setCurrentStudy(study)}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    currentStudy?.id === study.id
                      ? 'bg-accent/30 border border-accent text-accent'
                      : 'bg-muted/50 border border-muted text-muted-foreground hover:border-accent/50'
                  }`}
                >
                  {study.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content with Tabs */}
        {currentStudy && (
          <Tabs defaultValue="global" className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-card border border-accent/30 p-1 rounded-lg mb-6">
              <TabsTrigger value="global" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                Vue Globale
              </TabsTrigger>
              <TabsTrigger value="tree" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                Arborescence
              </TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                Chronologie
              </TabsTrigger>
              <TabsTrigger value="matrix" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                Matrice
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                Tableau de bord
              </TabsTrigger>
              <TabsTrigger value="risks" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                Risques
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                Paramètres
              </TabsTrigger>
            </TabsList>

            <TabsContent value="global" className="space-y-4">
              <GlobalViewInteractive studyId={currentStudy.id} />
            </TabsContent>

            <TabsContent value="tree" className="space-y-4">
              <TreeView studyId={currentStudy.id} />
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <TimelineView studyId={currentStudy.id} />
            </TabsContent>

            <TabsContent value="matrix" className="space-y-4">
              <MatrixView studyId={currentStudy.id} />
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-4">
              <DashboardView studyId={currentStudy.id} />
            </TabsContent>

            <TabsContent value="risks" className="space-y-4">
              <RisksView studyId={currentStudy.id} />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="blueprint-container">
                <h2 className="blueprint-title mb-6">Paramètres de l'étude</h2>
                <p className="text-muted-foreground">Les paramètres seront disponibles bientôt...</p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
