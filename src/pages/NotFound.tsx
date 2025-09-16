import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="relative z-10 max-w-md w-full text-center space-y-4 rounded-3xl border border-border/40 bg-background/80 backdrop-blur-lg px-8 py-10 shadow-[0_0_40px_rgba(14,165,233,0.25)]">
        <h1 className="text-5xl font-bold gradient-text">404</h1>
        <p className="text-lg text-muted-foreground">
          Oops! Page not found
        </p>
        <a href="/" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-primary-foreground transition-transform hover:scale-105">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
