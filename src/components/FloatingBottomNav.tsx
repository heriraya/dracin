import { Link, useLocation } from "react-router-dom";
import { Home, Clock, TrendingUp, Mic, Menu } from "lucide-react";

const navItems = [
  { path: "/", label: "Beranda", icon: Home },
  { path: "/terpopuler", label: "Populer", icon: TrendingUp },
  { path: "/history", label: "Riwayat", icon: Clock },
  { path: "/sulih-suara", label: "Sulih Suara", icon: Mic },
];

export function FloatingBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass-strong border-t border-border/50">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "fill-primary/20" : ""}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
