import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { LINKS } from "@/config/links";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden text-foreground">
      <div className="relative z-10 rounded-2xl border border-white/10 bg-background/70 px-8 py-10 text-center shadow-[0_30px_60px_rgba(12,14,30,0.45)] backdrop-blur-lg">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">
          Oops! Page not found
        </p>
        <a
          href={LINKS.home}
          className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/20 px-6 py-2 text-sm font-semibold text-primary-foreground transition hover:border-primary hover:bg-primary/30"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
