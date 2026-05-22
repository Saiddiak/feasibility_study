import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen blueprint-grid bg-background flex items-center justify-center p-4">
        <div className="blueprint-container max-w-md w-full text-center">
          <h1 className="blueprint-title mb-4 text-3xl">Étude de Faisabilité</h1>
          <p className="text-muted-foreground mb-6">Outil professionnel d'analyse et de comparaison d'options</p>
          <p className="text-sm text-muted-foreground mb-8">Connectez-vous pour commencer votre étude de faisabilité</p>
          <a href={getLoginUrl()}>
            <Button className="blueprint-button w-full">
              Se connecter
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen blueprint-grid bg-background flex items-center justify-center p-4">
      <div className="blueprint-container max-w-md w-full text-center">
        <h1 className="blueprint-title mb-4 text-3xl">Bienvenue, {user?.name || 'Utilisateur'}</h1>
        <p className="text-muted-foreground mb-8">Commencez votre étude de faisabilité</p>
        <Button
          onClick={() => navigate('/study')}
          className="blueprint-button w-full"
        >
          Accéder à l'outil
        </Button>
      </div>
    </div>
  );
}
