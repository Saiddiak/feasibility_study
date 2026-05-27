import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import GlobalViewProfessional from "./pages/GlobalViewProfessional";
import GlobalViewComplete from "./pages/GlobalViewComplete";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

function ProtectedRoute({ component: Component }: { component: React.ComponentType<any> }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
          </div>
          <p className="text-gray-400 mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Étude de Faisabilité</h1>
          <p className="text-gray-400 mb-2">Outil professionnel d'analyse et de comparaison d'options</p>
          <p className="text-sm text-gray-500 mb-8">Connectez-vous pour commencer votre étude de faisabilité</p>
          <a href={getLoginUrl()}>
            <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-blue-500/50">
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
      <Route path={"/study"} component={() => <ProtectedRoute component={GlobalViewProfessional} />} />
      <Route path={"/404"} component={NotFound} />
      {/* Redirect root to /study */}
      <Route path={""} component={() => <ProtectedRoute component={GlobalViewProfessional} />} />
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
