export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_endpoints: {
        Row: {
          base_url: string | null
          created_at: string
          enabled: boolean
          id: string
          model: string
          name: string
          provider: string
        }
        Insert: {
          base_url?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          model: string
          name: string
          provider: string
        }
        Update: {
          base_url?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          model?: string
          name?: string
          provider?: string
        }
        Relationships: []
      }
      ai_requests: {
        Row: {
          created_at: string
          created_by: string | null
          duration_ms: number | null
          endpoint_id: string | null
          id: number
          input: Json
          output: Json | null
          status: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          duration_ms?: number | null
          endpoint_id?: string | null
          id?: number
          input: Json
          output?: Json | null
          status?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          duration_ms?: number | null
          endpoint_id?: string | null
          id?: number
          input?: Json
          output?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ai_requests_endpoint_id_fkey"
            columns: ["endpoint_id"]
            isOneToOne: false
            referencedRelation: "ai_endpoints"
            referencedColumns: ["id"]
          },
        ]
      }
      article_comments: {
        Row: {
          article_id: string
          content: string
          created_at: string
          dislikes_count: number
          id: string
          likes_count: number
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          article_id: string
          content: string
          created_at?: string
          dislikes_count?: number
          id?: string
          likes_count?: number
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          article_id?: string
          content?: string
          created_at?: string
          dislikes_count?: number
          id?: string
          likes_count?: number
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_homepage_slots"
            referencedColumns: ["article_id"]
          },
          {
            foreignKeyName: "article_comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_latest_published"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_most_read_24h"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "article_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      article_embeddings: {
        Row: {
          article_id: string
          embedding: string | null
          updated_at: string | null
        }
        Insert: {
          article_id: string
          embedding?: string | null
          updated_at?: string | null
        }
        Update: {
          article_id?: string
          embedding?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "article_embeddings_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: true
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_embeddings_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: true
            referencedRelation: "v_homepage_slots"
            referencedColumns: ["article_id"]
          },
          {
            foreignKeyName: "article_embeddings_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: true
            referencedRelation: "v_latest_published"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_embeddings_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: true
            referencedRelation: "v_most_read_24h"
            referencedColumns: ["id"]
          },
        ]
      }
      article_relations: {
        Row: {
          article_id: string
          related_article_id: string
          relation_order: number
        }
        Insert: {
          article_id: string
          related_article_id: string
          relation_order?: number
        }
        Update: {
          article_id?: string
          related_article_id?: string
          relation_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "article_relations_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_relations_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_homepage_slots"
            referencedColumns: ["article_id"]
          },
          {
            foreignKeyName: "article_relations_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_latest_published"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_relations_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_most_read_24h"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_relations_related_article_id_fkey"
            columns: ["related_article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_relations_related_article_id_fkey"
            columns: ["related_article_id"]
            isOneToOne: false
            referencedRelation: "v_homepage_slots"
            referencedColumns: ["article_id"]
          },
          {
            foreignKeyName: "article_relations_related_article_id_fkey"
            columns: ["related_article_id"]
            isOneToOne: false
            referencedRelation: "v_latest_published"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_relations_related_article_id_fkey"
            columns: ["related_article_id"]
            isOneToOne: false
            referencedRelation: "v_most_read_24h"
            referencedColumns: ["id"]
          },
        ]
      }
      article_tags: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_homepage_slots"
            referencedColumns: ["article_id"]
          },
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_latest_published"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_most_read_24h"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      article_views: {
        Row: {
          article_id: string
          id: number
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
          viewed_at: string
        }
        Insert: {
          article_id: string
          id?: number
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Update: {
          article_id?: string
          id?: number
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_views_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_views_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_homepage_slots"
            referencedColumns: ["article_id"]
          },
          {
            foreignKeyName: "article_views_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_latest_published"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_views_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_most_read_24h"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_id: string | null
          body: string | null
          created_at: string
          hero_image_id: string | null
          id: string
          image_large: string | null
          image_list: string | null
          image_mobile: string | null
          image_standard: string | null
          image_tablet: string | null
          is_featured: boolean
          published_at: string | null
          read_time_minutes: number
          scheduled_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["article_status"]
          subtitle: string | null
          summary: string | null
          title: string
          topic_id: string | null
          tsv: unknown | null
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          created_at?: string
          hero_image_id?: string | null
          id?: string
          image_large?: string | null
          image_list?: string | null
          image_mobile?: string | null
          image_standard?: string | null
          image_tablet?: string | null
          is_featured?: boolean
          published_at?: string | null
          read_time_minutes?: number
          scheduled_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["article_status"]
          subtitle?: string | null
          summary?: string | null
          title: string
          topic_id?: string | null
          tsv?: unknown | null
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: string | null
          created_at?: string
          hero_image_id?: string | null
          id?: string
          image_large?: string | null
          image_list?: string | null
          image_mobile?: string | null
          image_standard?: string | null
          image_tablet?: string | null
          is_featured?: boolean
          published_at?: string | null
          read_time_minutes?: number
          scheduled_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["article_status"]
          subtitle?: string | null
          summary?: string | null
          title?: string
          topic_id?: string | null
          tsv?: unknown | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_hero_image_id_fkey"
            columns: ["hero_image_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_articles_hero_image_id"
            columns: ["hero_image_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      authors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "authors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          article_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_homepage_slots"
            referencedColumns: ["article_id"]
          },
          {
            foreignKeyName: "bookmarks_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_latest_published"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_most_read_24h"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      comment_reactions: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          reaction_type: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "article_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      email_outbox: {
        Row: {
          body: string
          created_at: string
          id: number
          last_error: string | null
          metadata: Json | null
          scheduled_at: string
          sent_at: string | null
          status: string
          subject: string
          to_email: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: number
          last_error?: string | null
          metadata?: Json | null
          scheduled_at?: string
          sent_at?: string | null
          status?: string
          subject: string
          to_email: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: number
          last_error?: string | null
          metadata?: Json | null
          scheduled_at?: string
          sent_at?: string | null
          status?: string
          subject?: string
          to_email?: string
          updated_at?: string
        }
        Relationships: []
      }
      embedding_jobs: {
        Row: {
          article_id: string
          created_at: string | null
          error_message: string | null
          id: number
          processed_at: string | null
          status: string
        }
        Insert: {
          article_id: string
          created_at?: string | null
          error_message?: string | null
          id?: never
          processed_at?: string | null
          status?: string
        }
        Update: {
          article_id?: string
          created_at?: string | null
          error_message?: string | null
          id?: never
          processed_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "embedding_jobs_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "embedding_jobs_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_homepage_slots"
            referencedColumns: ["article_id"]
          },
          {
            foreignKeyName: "embedding_jobs_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_latest_published"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "embedding_jobs_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_most_read_24h"
            referencedColumns: ["id"]
          },
        ]
      }
      follows_topics: {
        Row: {
          created_at: string
          topic_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          topic_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          topic_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_topics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_topics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      homepage_slot_items: {
        Row: {
          article_id: string
          id: string
          item_order: number
          slot_id: string
        }
        Insert: {
          article_id: string
          id?: string
          item_order?: number
          slot_id: string
        }
        Update: {
          article_id?: string
          id?: string
          item_order?: number
          slot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "homepage_slot_items_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homepage_slot_items_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_homepage_slots"
            referencedColumns: ["article_id"]
          },
          {
            foreignKeyName: "homepage_slot_items_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_latest_published"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homepage_slot_items_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_most_read_24h"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homepage_slot_items_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "homepage_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_slots: {
        Row: {
          code: string
          display_order: number
          id: string
          is_active: boolean
          max_items: number
          name: string
        }
        Insert: {
          code: string
          display_order?: number
          id?: string
          is_active?: boolean
          max_items?: number
          name: string
        }
        Update: {
          code?: string
          display_order?: number
          id?: string
          is_active?: boolean
          max_items?: number
          name?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          attempts: number
          created_at: string
          id: number
          kind: string
          last_error: string | null
          payload: Json
          run_at: string
          status: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          id?: number
          kind: string
          last_error?: string | null
          payload: Json
          run_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          created_at?: string
          id?: number
          kind?: string
          last_error?: string | null
          payload?: Json
          run_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          alt: string | null
          created_at: string
          credit: string | null
          height: number | null
          id: string
          path: string
          title: string | null
          type: Database["public"]["Enums"]["media_type"]
          width: number | null
        }
        Insert: {
          alt?: string | null
          created_at?: string
          credit?: string | null
          height?: number | null
          id?: string
          path: string
          title?: string | null
          type?: Database["public"]["Enums"]["media_type"]
          width?: number | null
        }
        Update: {
          alt?: string | null
          created_at?: string
          credit?: string | null
          height?: number | null
          id?: string
          path?: string
          title?: string | null
          type?: Database["public"]["Enums"]["media_type"]
          width?: number | null
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          confirmed: boolean
          created_at: string
          email: string
          id: string
        }
        Insert: {
          confirmed?: boolean
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          confirmed?: boolean
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      ticker_quotes: {
        Row: {
          id: number
          metadata: Json | null
          quote_time: string
          ticker_id: string
          value: number
        }
        Insert: {
          id?: number
          metadata?: Json | null
          quote_time: string
          ticker_id: string
          value: number
        }
        Update: {
          id?: number
          metadata?: Json | null
          quote_time?: string
          ticker_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "ticker_quotes_ticker_id_fkey"
            columns: ["ticker_id"]
            isOneToOne: false
            referencedRelation: "tickers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticker_quotes_ticker_id_fkey"
            columns: ["ticker_id"]
            isOneToOne: false
            referencedRelation: "v_ticker_latest"
            referencedColumns: ["ticker_id"]
          },
        ]
      }
      tickers: {
        Row: {
          created_at: string
          display_metric: Database["public"]["Enums"]["metric_type"]
          display_order: number
          id: string
          name: string
          symbol: string
          type: Database["public"]["Enums"]["ticker_type"]
          unit: string | null
        }
        Insert: {
          created_at?: string
          display_metric?: Database["public"]["Enums"]["metric_type"]
          display_order?: number
          id?: string
          name: string
          symbol: string
          type: Database["public"]["Enums"]["ticker_type"]
          unit?: string | null
        }
        Update: {
          created_at?: string
          display_metric?: Database["public"]["Enums"]["metric_type"]
          display_order?: number
          id?: string
          name?: string
          symbol?: string
          type?: Database["public"]["Enums"]["ticker_type"]
          unit?: string | null
        }
        Relationships: []
      }
      topic_aliases: {
        Row: {
          created_at: string
          from_slug: string
          to_slug: string
        }
        Insert: {
          created_at?: string
          from_slug: string
          to_slug: string
        }
        Update: {
          created_at?: string
          from_slug?: string
          to_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_aliases_to_slug_fkey"
            columns: ["to_slug"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "topic_aliases_to_slug_fkey"
            columns: ["to_slug"]
            isOneToOne: false
            referencedRelation: "v_topic_sections_cards"
            referencedColumns: ["topic_slug"]
          },
        ]
      }
      topic_section_pins: {
        Row: {
          article_id: string
          item_order: number
          section_id: string
        }
        Insert: {
          article_id: string
          item_order?: number
          section_id: string
        }
        Update: {
          article_id?: string
          item_order?: number
          section_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_section_pins_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_section_pins_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_homepage_slots"
            referencedColumns: ["article_id"]
          },
          {
            foreignKeyName: "topic_section_pins_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_latest_published"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_section_pins_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_most_read_24h"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_section_pins_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "topic_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_section_pins_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "v_topic_sections_cards"
            referencedColumns: ["section_id"]
          },
        ]
      }
      topic_sections: {
        Row: {
          display_order: number
          heading: string
          id: string
          is_active: boolean
          topic_id: string
        }
        Insert: {
          display_order?: number
          heading: string
          id?: string
          is_active?: boolean
          topic_id: string
        }
        Update: {
          display_order?: number
          heading?: string
          id?: string
          is_active?: boolean
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_sections_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          name: string
          parent_slug: string | null
          slug: string
          type: Database["public"]["Enums"]["topic_type"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          parent_slug?: string | null
          slug: string
          type?: Database["public"]["Enums"]["topic_type"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          parent_slug?: string | null
          slug?: string
          type?: Database["public"]["Enums"]["topic_type"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_parent_slug_fkey"
            columns: ["parent_slug"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "topics_parent_slug_fkey"
            columns: ["parent_slug"]
            isOneToOne: false
            referencedRelation: "v_topic_sections_cards"
            referencedColumns: ["topic_slug"]
          },
        ]
      }
      user_preferences: {
        Row: {
          email_opt_in: boolean | null
          locale: string | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          email_opt_in?: boolean | null
          locale?: string | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          email_opt_in?: boolean | null
          locale?: string | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      topics_resolved: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string | null
          is_active: boolean | null
          name: string | null
          parent_slug: string | null
          slug: string | null
          type: Database["public"]["Enums"]["topic_type"] | null
          updated_at: string | null
        }
        Relationships: []
      }
      v_article_views_24h: {
        Row: {
          article_id: string | null
          views_24h: number | null
        }
        Relationships: [
          {
            foreignKeyName: "article_views_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_views_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_homepage_slots"
            referencedColumns: ["article_id"]
          },
          {
            foreignKeyName: "article_views_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_latest_published"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_views_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "v_most_read_24h"
            referencedColumns: ["id"]
          },
        ]
      }
      v_homepage_slots: {
        Row: {
          article_id: string | null
          code: string | null
          display_order: number | null
          image_alt: string | null
          image_path: string | null
          item_order: number | null
          name: string | null
          published_at: string | null
          read_time_minutes: number | null
          slug: string | null
          summary: string | null
          title: string | null
        }
        Relationships: []
      }
      v_latest_published: {
        Row: {
          id: string | null
          image_alt: string | null
          image_path: string | null
          published_at: string | null
          read_time_minutes: number | null
          slug: string | null
          summary: string | null
          title: string | null
          topic_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      v_most_read_24h: {
        Row: {
          id: string | null
          image_alt: string | null
          image_path: string | null
          published_at: string | null
          slug: string | null
          summary: string | null
          title: string | null
          views_24h: number | null
        }
        Relationships: []
      }
      v_ticker_latest: {
        Row: {
          display_metric: Database["public"]["Enums"]["metric_type"] | null
          display_order: number | null
          last_value: number | null
          name: string | null
          pct_change: number | null
          quote_time: string | null
          symbol: string | null
          ticker_id: string | null
          type: Database["public"]["Enums"]["ticker_type"] | null
          unit: string | null
        }
        Relationships: []
      }
      v_topic_sections_cards: {
        Row: {
          article_id: string | null
          display_order: number | null
          heading: string | null
          is_active: boolean | null
          section_id: string | null
          topic_name: string | null
          topic_slug: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      article_tsvector: {
        Args: { body: string; summary: string; title: string }
        Returns: unknown
      }
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      enqueue_embedding_job: {
        Args: { p_article_id: string }
        Returns: undefined
      }
      enqueue_job: {
        Args: { p_kind: string; p_payload: Json; p_run_at?: string }
        Returns: number
      }
      estimate_read_time_minutes: {
        Args: { body: string }
        Returns: number
      }
      generate_unique_article_slug: {
        Args: { base_title: string }
        Returns: string
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      hybrid_search: {
        Args: {
          q: string
          search_limit?: number
          search_offset?: number
          semantic_weight?: number
        }
        Returns: {
          combined_rank: number
          fts_rank: number
          id: string
          published_at: string
          read_time_minutes: number
          search_type: string
          semantic_rank: number
          slug: string
          snippet: string
          summary: string
          title: string
        }[]
      }
      is_editor: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      queue_email: {
        Args: {
          p_body: string
          p_subject: string
          p_to: string
          p_when?: string
        }
        Returns: number
      }
      resolve_topic_slug: {
        Args: { p_slug: string }
        Returns: string
      }
      schema_overview: {
        Args: { schema_name?: string }
        Returns: Json
      }
      search_articles: {
        Args: { q: string; search_limit?: number; search_offset?: number }
        Returns: {
          id: string
          published_at: string
          rank: number
          read_time_minutes: number
          slug: string
          snippet: string
          summary: string
          title: string
        }[]
      }
      semantic_search_with_embedding: {
        Args: {
          query_embedding: string
          query_text: string
          search_limit?: number
          search_offset?: number
          semantic_weight?: number
        }
        Returns: {
          combined_rank: number
          fts_rank: number
          id: string
          published_at: string
          read_time_minutes: number
          search_type: string
          semantic_rank: number
          slug: string
          snippet: string
          summary: string
          title: string
        }[]
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      slugify: {
        Args: { input: string }
        Returns: string
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      unaccent: {
        Args: { "": string }
        Returns: string
      }
      unaccent_init: {
        Args: { "": unknown }
        Returns: unknown
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      article_status: "draft" | "scheduled" | "published" | "archived"
      media_type: "image" | "video" | "infographic"
      metric_type: "price" | "valuation" | "sentiment" | "custom_index"
      ticker_type:
        | "index"
        | "equity"
        | "crypto"
        | "forex"
        | "commodity"
        | "future"
        | "ai_lab"
        | "public_company"
      topic_type: "main" | "sub"
      user_role: "reader" | "contributor" | "editor" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      article_status: ["draft", "scheduled", "published", "archived"],
      media_type: ["image", "video", "infographic"],
      metric_type: ["price", "valuation", "sentiment", "custom_index"],
      ticker_type: [
        "index",
        "equity",
        "crypto",
        "forex",
        "commodity",
        "future",
        "ai_lab",
        "public_company",
      ],
      topic_type: ["main", "sub"],
      user_role: ["reader", "contributor", "editor", "admin"],
    },
  },
} as const
