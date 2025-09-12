// Search functionality with types and TanStack Query integration
import { supabase } from '@/integrations/supabase/client';

export interface SearchResult {
  id: string;
  slug: string;
  title: string;
  summary: string;
  published_at: string;
  read_time_minutes: number;
  fts_rank?: number;
  semantic_rank?: number;
  combined_rank?: number;
  search_type?: string;
  snippet: string;
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
}

export interface SearchResponse {
  data: SearchResult[];
  error: any;
  search_type?: string;
}

// Enhanced search function with semantic capabilities
export async function searchArticles(query: string, options: SearchOptions = {}): Promise<SearchResponse> {
  const { limit = 20, offset = 0 } = options;
  
  if (!query?.trim()) {
    return { data: [], error: null, search_type: 'text' };
  }

  try {
    // Try semantic search first
    const { data: semanticResponse, error: semanticError } = await supabase.functions.invoke('semantic-search', {
      body: {
        query: query.trim(),
        limit,
        offset,
        semantic_weight: 0.6 // Favor semantic results slightly
      }
    });

    if (semanticError) {
      console.warn('Semantic search failed, falling back to FTS:', semanticError);
      // Fall back to regular search
      return await searchArticlesFTS(query, options);
    }

    return {
      data: semanticResponse.data || [],
      error: null,
      search_type: semanticResponse.search_type || 'semantic'
    };
  } catch (error) {
    console.error('Search error:', error);
    // Fall back to FTS as last resort
    return await searchArticlesFTS(query, options);
  }
}

// Fallback FTS search
async function searchArticlesFTS(query: string, options: SearchOptions = {}): Promise<SearchResponse> {
  const { limit = 20, offset = 0 } = options;
  
  const { data, error } = await supabase.rpc('search_articles', {
    q: query.trim(),
    search_limit: limit,
    search_offset: offset
  });

  // Transform data to match new interface
  const transformedData = (data || []).map((item: any) => ({
    ...item,
    fts_rank: item.rank,
    semantic_rank: 0,
    combined_rank: item.rank,
    search_type: 'text'
  }));

  return { 
    data: transformedData, 
    error,
    search_type: 'text'
  };
}

// Re-export the main search function
export const hybridSearchArticles = searchArticles;

// TanStack Query keys for search
export const searchKeys = {
  all: ['search'] as const,
  query: (q: string) => ['search', q] as const,
  queryWithOptions: (q: string, options: SearchOptions) => ['search', q, options] as const,
};

// Helper function to get search type display text
export function getSearchTypeLabel(searchType: string): string {
  switch (searchType) {
    case 'semantic':
      return 'AI-boosted';
    case 'hybrid':
      return 'AI-boosted';
    case 'text':
    default:
      return 'text search';
  }
}

// Helper function to highlight search terms in text
export function highlightSearchTerms(text: string, isSnippet = false): string {
  if (isSnippet) {
    // The snippet already has HTML highlighting from ts_headline
    return text;
  }
  
  // For regular text, we don't have search terms available here
  // This would be enhanced with the actual search query if needed
  return text;
}

// Function to parse snippet and extract highlighted terms
export function parseSnippet(snippet: string): string {
  // ts_headline wraps matches in <b> tags by default
  return snippet;
}

// Debounce utility for search input
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Format date for search results
export function formatSearchDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return `${diffInHours} uur geleden`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} dag${diffInDays === 1 ? '' : 'en'} geleden`;
  }
  
  return date.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}