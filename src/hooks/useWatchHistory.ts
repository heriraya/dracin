import { useState, useEffect, useCallback } from "react";

export interface WatchHistoryItem {
  id: string;
  title: string;
  poster: string;
  episode: number;
  totalEpisodes: number;
  progress: number; // 0-100 percentage
  lastWatched: number; // timestamp
  platform: "dramabox" | "netshort";
}

const STORAGE_KEY = "watch_history";
const MAX_HISTORY_ITEMS = 50;

export function useWatchHistory() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  // Save to localStorage whenever history changes
  const saveHistory = useCallback((newHistory: WatchHistoryItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    setHistory(newHistory);
  }, []);

  // Add or update an item in history
  const addToHistory = useCallback((item: Omit<WatchHistoryItem, "lastWatched">) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let currentHistory: WatchHistoryItem[] = [];
    
    if (stored) {
      try {
        currentHistory = JSON.parse(stored);
      } catch {
        currentHistory = [];
      }
    }

    // Remove existing entry for same drama
    const filtered = currentHistory.filter((h) => h.id !== item.id);

    // Add new entry at the beginning
    const newItem: WatchHistoryItem = {
      ...item,
      lastWatched: Date.now(),
    };

    const newHistory = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    saveHistory(newHistory);
  }, [saveHistory]);

  // Update progress for an existing item
  const updateProgress = useCallback((id: string, episode: number, progress: number) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const currentHistory: WatchHistoryItem[] = JSON.parse(stored);
      const index = currentHistory.findIndex((h) => h.id === id);
      
      if (index !== -1) {
        currentHistory[index] = {
          ...currentHistory[index],
          episode,
          progress,
          lastWatched: Date.now(),
        };
        
        // Move to front if watching a new episode or significant progress
        const [item] = currentHistory.splice(index, 1);
        currentHistory.unshift(item);
        
        saveHistory(currentHistory);
      }
    } catch {
      // Ignore errors
    }
  }, [saveHistory]);

  // Remove an item from history
  const removeFromHistory = useCallback((id: string) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const currentHistory: WatchHistoryItem[] = JSON.parse(stored);
      const newHistory = currentHistory.filter((h) => h.id !== id);
      saveHistory(newHistory);
    } catch {
      // Ignore errors
    }
  }, [saveHistory]);

  // Clear all history
  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  // Get last watched episode for a drama
  const getLastWatched = useCallback((id: string): WatchHistoryItem | undefined => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return undefined;

    try {
      const currentHistory: WatchHistoryItem[] = JSON.parse(stored);
      return currentHistory.find((h) => h.id === id);
    } catch {
      return undefined;
    }
  }, []);

  return {
    history,
    addToHistory,
    updateProgress,
    removeFromHistory,
    clearHistory,
    getLastWatched,
  };
}
