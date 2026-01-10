import { useCallback, useEffect, useMemo, useState } from 'react';

export type ReadArticlesConfig = {
  storageKey: string;
  deemphasisClass: string; // Tailwind classes to apply to read titles
};

const DEFAULT_CONFIG: ReadArticlesConfig = {
  storageKey: 'ai-daily:read-articles:v1',
  deemphasisClass: 'text-foreground/80',
};

function safeGetStorageSet(storageKey: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    if (Array.isArray(parsed)) return new Set(parsed);
    return new Set();
  } catch {
    return new Set();
  }
}

function safePersist(storageKey: string, values: Set<string>) {
  if (typeof window === 'undefined') return;
  try {
    const arr = Array.from(values);
    window.localStorage.setItem(storageKey, JSON.stringify(arr));
  } catch {
    // ignore quota or privacy mode errors
  }
}

export function useReadArticles(userConfig?: Partial<ReadArticlesConfig>) {
  const config = useMemo<ReadArticlesConfig>(
    () => ({ ...DEFAULT_CONFIG, ...userConfig }),
    [userConfig]
  );

  const [readSet, setReadSet] = useState<Set<string>>(() => safeGetStorageSet(config.storageKey));

  useEffect(() => {
    // Sync on mount in case other tabs changed it
    setReadSet(safeGetStorageSet(config.storageKey));

    const onStorage = (e: StorageEvent) => {
      if (e.key === config.storageKey) {
        setReadSet(safeGetStorageSet(config.storageKey));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [config.storageKey]);

  const isRead = useCallback(
    (idOrSlug?: string | number | null) => {
      if (idOrSlug === undefined || idOrSlug === null) return false;
      return readSet.has(String(idOrSlug));
    },
    [readSet]
  );

  const markRead = useCallback(
    (idOrSlug?: string | number | null) => {
      if (idOrSlug === undefined || idOrSlug === null) return;
      setReadSet(prev => {
        if (prev.has(String(idOrSlug))) return prev;
        const next = new Set(prev);
        next.add(String(idOrSlug));
        safePersist(config.storageKey, next);
        return next;
      });
    },
    [config.storageKey]
  );

  const clearAll = useCallback(() => {
    setReadSet(new Set());
    if (typeof window !== 'undefined') {
      try { window.localStorage.removeItem(config.storageKey); } catch {}
    }
  }, [config.storageKey]);

  return {
    config,
    readSet,
    isRead,
    markRead,
    clearAll,
  };
}

export function getArticleKey(input: { slug?: string | null; id?: string | number | null }): string | undefined {
  if (input.slug) return String(input.slug);
  if (input.id !== undefined && input.id !== null) return String(input.id);
  return undefined;
}


