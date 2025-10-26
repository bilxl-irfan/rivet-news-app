import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface SavedArticle extends Article {
  savedAt: string;
}

interface HistoryArticle extends Article {
  viewedAt: string;
}

interface StorageContextType {
  savedArticles: SavedArticle[];
  historyArticles: HistoryArticle[];
  saveArticle: (article: Article) => Promise<void>;
  unsaveArticle: (url: string) => Promise<void>;
  isArticleSaved: (url: string) => boolean;
  addToHistory: (article: Article) => Promise<void>;
  clearHistory: () => Promise<void>;
  removeFromHistory: (url: string) => Promise<void>;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

const SAVED_KEY = '@saved_articles';
const HISTORY_KEY = '@reading_history';
const MAX_HISTORY = 50;

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [historyArticles, setHistoryArticles] = useState<HistoryArticle[]>([]);

  // Load saved articles and history on mount
  useEffect(() => {
    loadSavedArticles();
    loadHistory();
  }, []);

  const loadSavedArticles = async () => {
    try {
      const saved = await AsyncStorage.getItem(SAVED_KEY);
      if (saved) {
        setSavedArticles(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load saved articles:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(HISTORY_KEY);
      if (history) {
        setHistoryArticles(JSON.parse(history));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const saveArticle = async (article: Article) => {
    try {
      const savedArticle: SavedArticle = {
        ...article,
        savedAt: new Date().toISOString(),
      };
      const updated = [savedArticle, ...savedArticles.filter(a => a.url !== article.url)];
      setSavedArticles(updated);
      await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save article:', error);
    }
  };

  const unsaveArticle = async (url: string) => {
    try {
      const updated = savedArticles.filter(a => a.url !== url);
      setSavedArticles(updated);
      await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to unsave article:', error);
    }
  };

  const isArticleSaved = (url: string) => {
    return savedArticles.some(a => a.url === url);
  };

  const addToHistory = async (article: Article) => {
    try {
      const historyArticle: HistoryArticle = {
        ...article,
        viewedAt: new Date().toISOString(),
      };
      // Remove if already exists, add to front, limit to MAX_HISTORY
      const updated = [
        historyArticle,
        ...historyArticles.filter(a => a.url !== article.url)
      ].slice(0, MAX_HISTORY);
      
      setHistoryArticles(updated);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to add to history:', error);
    }
  };

  const clearHistory = async () => {
    try {
      setHistoryArticles([]);
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const removeFromHistory = async (url: string) => {
    try {
      const updated = historyArticles.filter(a => a.url !== url);
      setHistoryArticles(updated);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to remove from history:', error);
    }
  };

  return (
    <StorageContext.Provider
      value={{
        savedArticles,
        historyArticles,
        saveArticle,
        unsaveArticle,
        isArticleSaved,
        addToHistory,
        clearHistory,
        removeFromHistory,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within StorageProvider');
  }
  return context;
};
