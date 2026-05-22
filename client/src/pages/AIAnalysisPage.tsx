import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { Streamdown } from 'streamdown';
import { Zap, Brain, AlertTriangle, FileText } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AIAnalysisPage({ studyId }: { studyId: number }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  // Mutations pour l'analyse IA
  const suggestBestOption = trpc.ai.suggestBestOption.useMutation({
    onSuccess: () => {
      toast.success('Analyse complétée');
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'analyse');
    },
  });

  const detectHiddenRisks = trpc.ai.detectHiddenRisks.useMutation({
    onSuccess: () => {
      toast.success('Analyse des risques complétée');
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'analyse des risques');
    },
  });

  const generateExecutiveSummary = trpc.ai.generateExecutiveSummary.useMutation({
    onSuccess: () => {
      toast.success('Résumé exécutif généré');
    },
    onError: (error) => {
      toast.error('Erreur lors de la génération du résumé');
    },
  });

  const performFullAnalysis = trpc.ai.performFullAnalysis.useMutation({
    onSuccess: () => {
      toast.success('Analyse complète terminée');
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'analyse complète');
    },
  });

  const handleAnalysis = async (type: 'best' | 'risks' | 'summary' | 'full') => {
    setLoading(true);
    try {
      switch (type) {
        case 'best':
          await suggestBestOption.mutateAsync({ studyId });
          break;
        case 'risks':
          await detectHiddenRisks.mutateAsync({ studyId });
          break;
        case 'summary':
          await generateExecutiveSummary.mutateAsync({ studyId });
          break;
        case 'full':
          await performFullAnalysis.mutateAsync({ studyId });
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Meilleure option */}
        <Card className="border-blueprint-accent/30 hover:border-blueprint-accent/60 transition-colors cursor-pointer"
          onClick={() => handleAnalysis('best')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-blueprint-accent" />
              Meilleure Option
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Analyse IA pour identifier la meilleure option basée sur les scores et critères
            </p>
            {suggestBestOption.isPending && <Spinner className="mt-4" />}
            {suggestBestOption.data && (
              <Streamdown className="mt-4 text-sm">{suggestBestOption.data}</Streamdown>
            )}
          </CardContent>
        </Card>

        {/* Détection de risques */}
        <Card className="border-blueprint-accent/30 hover:border-blueprint-accent/60 transition-colors cursor-pointer"
          onClick={() => handleAnalysis('risks')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Risques Cachés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Identification des risques potentiels non détectés
            </p>
            {detectHiddenRisks.isPending && <Spinner className="mt-4" />}
            {detectHiddenRisks.data && (
              <Streamdown className="mt-4 text-sm">{detectHiddenRisks.data}</Streamdown>
            )}
          </CardContent>
        </Card>

        {/* Résumé exécutif */}
        <Card className="border-blueprint-accent/30 hover:border-blueprint-accent/60 transition-colors cursor-pointer"
          onClick={() => handleAnalysis('summary')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-blueprint-accent" />
              Résumé Exécutif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Génération d'un résumé professionnel et actionnable
            </p>
            {generateExecutiveSummary.isPending && <Spinner className="mt-4" />}
            {generateExecutiveSummary.data && (
              <Streamdown className="mt-4 text-sm">{generateExecutiveSummary.data}</Streamdown>
            )}
          </CardContent>
        </Card>

        {/* Analyse complète */}
        <Card className="border-blueprint-accent/30 hover:border-blueprint-accent/60 transition-colors cursor-pointer"
          onClick={() => handleAnalysis('full')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="w-5 h-5 text-purple-500" />
              Analyse Complète
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Analyse complète combinant tous les types d'analyses
            </p>
            {performFullAnalysis.isPending && <Spinner className="mt-4" />}
            {performFullAnalysis.data && (
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Meilleure Option</h4>
                  <Streamdown className="text-sm">{performFullAnalysis.data.bestOptionSuggestion}</Streamdown>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Risques Cachés</h4>
                  <Streamdown className="text-sm">{performFullAnalysis.data.hiddenRisks}</Streamdown>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Résumé Exécutif</h4>
                  <Streamdown className="text-sm">{performFullAnalysis.data.executiveSummary}</Streamdown>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bouton d'analyse complète */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={() => handleAnalysis('full')}
          disabled={loading}
          className="gap-2"
        >
          {loading ? <Spinner className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
          Lancer l'Analyse Complète
        </Button>
      </div>
    </div>
  );
}
