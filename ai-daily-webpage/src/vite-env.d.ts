/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
  readonly VITE_USE_MOCK_AUTH?: string
  readonly VITE_DEBUG_AUTH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
