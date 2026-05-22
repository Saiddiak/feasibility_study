import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { Download, FileText, Sheet } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ExportPage({ studyId }: { studyId: number }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedSections, setSelectedSections] = useState({
    overview: true,
    options: true,
    timeline: true,
    matrix: true,
    risks: true,
    recommendations: true,
  });

  const generateReport = trpc.export.generateReport.useQuery({ studyId }, { enabled: false });
  const generateExcelReport = trpc.export.generateExcelReport.useQuery({ studyId }, { enabled: false });
  const generateExecutiveSummary = trpc.export.generateExecutiveSummary.useQuery({ studyId }, { enabled: false });

  const handleExport = async (format: 'csv' | 'excel' | 'summary') => {
    try {
      switch (format) {
        case 'csv':
          await generateExcelReport.refetch();
          if (generateExcelReport.data) {
            const blob = new Blob([generateExcelReport.data.content], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = generateExcelReport.data.filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Export CSV réussi');
          }
          break;
        case 'excel':
          await generateReport.refetch();
          if (generateReport.data) {
            const blob = new Blob([JSON.stringify(generateReport.data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `etude-faisabilite-${studyId}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Export JSON réussi');
          }
          break;
        case 'summary':
          await generateExecutiveSummary.refetch();
          if (generateExecutiveSummary.data) {
            const blob = new Blob([generateExecutiveSummary.data], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `resume-executif-${studyId}.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Résumé exécutif généré');
          }
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Erreur lors de l\'export');
    }
  };

  const toggleSection = (section: keyof typeof selectedSections) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Sélection des sections */}
      <Card className="border-blueprint-accent/30">
        <CardHeader>
          <CardTitle>Sections à exporter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'overview', label: 'Vue d\'ensemble' },
              { key: 'options', label: 'Options' },
              { key: 'timeline', label: 'Chronologie' },
              { key: 'matrix', label: 'Matrice' },
              { key: 'risks', label: 'Risques' },
              { key: 'recommendations', label: 'Recommandations' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={selectedSections[key as keyof typeof selectedSections]}
                  onCheckedChange={() => toggleSection(key as keyof typeof selectedSections)}
                />
                <label htmlFor={key} className="text-sm font-medium cursor-pointer">
                  {label}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Options d'export */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Export CSV */}
        <Card className="border-blueprint-accent/30 hover:border-blueprint-accent/60 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sheet className="w-5 h-5 text-green-500" />
              CSV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Format CSV pour utilisation dans Excel ou autres outils
            </p>
            <Button
              onClick={() => handleExport('csv')}
              disabled={generateExcelReport.isLoading}
              className="w-full gap-2"
            >
              {generateExcelReport.isLoading ? (
                <Spinner className="w-4 h-4" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Télécharger CSV
            </Button>
          </CardContent>
        </Card>

        {/* Export JSON */}
        <Card className="border-blueprint-accent/30 hover:border-blueprint-accent/60 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sheet className="w-5 h-5 text-blue-500" />
              JSON
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Format JSON avec toutes les données de l'étude
            </p>
            <Button
              onClick={() => handleExport('excel')}
              disabled={generateReport.isLoading}
              className="w-full gap-2"
            >
              {generateReport.isLoading ? (
                <Spinner className="w-4 h-4" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Télécharger JSON
            </Button>
          </CardContent>
        </Card>

        {/* Export Résumé Exécutif */}
        <Card className="border-blueprint-accent/30 hover:border-blueprint-accent/60 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-red-500" />
              Résumé Exécutif
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Résumé professionnel et actionnable de l'étude
            </p>
            <Button
              onClick={() => handleExport('summary')}
              disabled={generateExecutiveSummary.isLoading}
              className="w-full gap-2"
            >
              {generateExecutiveSummary.isLoading ? (
                <Spinner className="w-4 h-4" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Télécharger Résumé
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Informations */}
      <Card className="border-blueprint-accent/30 bg-blueprint-accent/5">
        <CardHeader>
          <CardTitle className="text-sm">Informations</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Les exports incluent toutes les données sélectionnées ci-dessus</p>
          <p>• Les formats Excel et PDF incluent des graphiques et une mise en forme professionnelle</p>
          <p>• Les fichiers sont générés en temps réel avec les données actuelles</p>
          <p>• Vous pouvez télécharger plusieurs formats du même rapport</p>
        </CardContent>
      </Card>
    </div>
  );
}
