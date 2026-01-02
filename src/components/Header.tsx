import { Search, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface HeaderProps {
  platform?: "dramabox" | "netshort";
  onPlatformChange?: (platform: "dramabox" | "netshort") => void;
}

export function Header({ platform = "dramabox", onPlatformChange }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg">
      <div className="flex items-center justify-between h-14 px-4 md:px-8">
        {/* Logo & Platform Selector */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-badge-top flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-lg">D</span>
            </div>
          </Link>
          
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 text-foreground hover:text-primary transition-colors"
          >
            <span className="font-semibold text-lg">
              {platform === "dramabox" ? "DramaBox" : "NetShort"}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-14 left-4 bg-surface-2 rounded-lg shadow-xl border border-border overflow-hidden animate-fade-in">
              <button
                onClick={() => {
                  onPlatformChange?.("dramabox");
                  setShowDropdown(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-surface-3 transition-colors ${
                  platform === "dramabox" ? "text-primary" : "text-foreground"
                }`}
              >
                DramaBox
              </button>
              <button
                onClick={() => {
                  onPlatformChange?.("netshort");
                  setShowDropdown(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-surface-3 transition-colors ${
                  platform === "netshort" ? "text-primary" : "text-foreground"
                }`}
              >
                Ubah ke NetShort
              </button>
            </div>
          )}
        </div>

        {/* Search Button */}
        <Link
          to="/search"
          className="p-2 rounded-full hover:bg-surface-2 transition-colors"
        >
          <Search className="w-5 h-5 text-foreground" />
        </Link>
      </div>

      {/* Search Hint Banner */}
      <div className="mx-4 md:mx-8 mb-3 px-4 py-2.5 bg-surface-1 rounded-lg border border-border">
        <Link to="/search" className="flex items-center gap-2 text-primary text-sm">
          <div className="w-4 h-4 rounded-full border border-primary flex items-center justify-center">
            <span className="text-xs">!</span>
          </div>
          <span>Drama tidak ditemukan? Gunakan fitur pencarian untuk menemukan lebih banyak judul Dramabox.</span>
        </Link>
      </div>
    </header>
  );
}
