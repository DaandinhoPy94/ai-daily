import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

const LOCAL_STORAGE_KEY = 'bookmarks_local_ids';

function readLocalSet(): Set<string> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function writeLocalSet(set: Set<string>) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

export function useBookmark(articleId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine initial state
  useEffect(() => {
    let mounted = true;
    async function init() {
      if (!articleId) return;
      setError(null);
      if (user) {
        const { data, error } = await supabase
          .from('bookmarks')
          .select('id')
          .eq('article_id', articleId)
          .maybeSingle();
        if (!mounted) return;
        if (error && error.code !== 'PGRST116') {
          setError(error.message);
          setIsBookmarked(false);
        } else {
          setIsBookmarked(!!data);
        }
      } else {
        const set = readLocalSet();
        setIsBookmarked(set.has(articleId));
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, [articleId, user]);

  const toggleBookmark = useMemo(() => {
    return async () => {
      if (!articleId) return;
      setLoading(true);
      setError(null);
      try {
        if (user) {
          if (isBookmarked) {
            const { error } = await supabase
              .from('bookmarks')
              .delete()
              .eq('article_id', articleId);
            if (error) throw error;
            setIsBookmarked(false);
            toast({ description: 'Bookmark verwijderd', duration: 2000 });
          } else {
            const { error } = await supabase
              .from('bookmarks')
              .insert({ user_id: user.id, article_id: articleId });
            if (error) throw error;
            setIsBookmarked(true);
            toast({ description: 'Bookmark toegevoegd', duration: 2000 });
          }
        } else {
          const set = readLocalSet();
          if (set.has(articleId)) {
            set.delete(articleId);
            writeLocalSet(set);
            setIsBookmarked(false);
            toast({ description: 'Bookmark verwijderd (lokaal)', duration: 2000 });
          } else {
            set.add(articleId);
            writeLocalSet(set);
            setIsBookmarked(true);
            toast({ description: 'Bookmark toegevoegd (lokaal). Log in om overal te bewaren.', duration: 2500 });
          }
        }
      } catch (err: any) {
        setError(err?.message || 'Onbekende fout');
      } finally {
        setLoading(false);
      }
    };
  }, [articleId, user, isBookmarked, toast]);

  return { isBookmarked, toggleBookmark, loading, error };
}


