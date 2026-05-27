import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import FeasibilityStudy from "./pages/FeasibilityStudy";
import GlobalViewComplete from "./pages/GlobalViewComplete";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

function ProtectedRoute({ component: Component }: { component: React.ComponentType<any> }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen blueprint-grid bg-background flex items-center justify-center">
        <div className="blueprint-container text-center">
          <div className="animate-spin inline-block">
            <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full"></div>
          </div>
          <p className="text-muted-foreground mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen blueprint-grid bg-background flex items-center justify-center p-4">
        <div className="blueprint-container max-w-md w-full text-center">
          <h1 className="blueprint-title mb-4 text-3xl">Étude de Faisabilité</h1>
          <p className="text-muted-foreground mb-6">Outil professionnel d'analyse et de comparaison d'options</p>
          <p className="text-sm text-muted-foreground mb-8">Connectez-vous pour commencer votre étude de faisabilité</p>
          <a href={getLoginUrl()}>
            <button className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors">
              Se connecter
            </button>
          </a>
        </div>
      </div>
    );
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path={"/demo"} component={GlobalViewComplete} />
      <Route path={"/study"} component={() => <ProtectedRoute component={FeasibilityStudy} />} />
      <Route path={"/404"} component={NotFound} />
      {/* Redirect root to /study */}
      <Route path={""} component={() => <ProtectedRoute component={FeasibilityStudy} />} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
