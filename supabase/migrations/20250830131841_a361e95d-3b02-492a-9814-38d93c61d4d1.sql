-- Enable RLS on any tables that have policies but RLS disabled
-- These are likely from the migration seeding process

-- Check if there are any tables with policies but RLS disabled and enable RLS
DO $$
DECLARE
    tbl_name text;
BEGIN
    -- Enable RLS on any public tables that might have been missed
    FOR tbl_name IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name NOT IN (
            SELECT schemaname||'.'||tablename 
            FROM pg_tables t
            JOIN pg_class c ON c.relname = t.tablename
            WHERE c.relrowsecurity = true
        )
    LOOP
        -- Only enable RLS if the table exists in our schema
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = tbl_name AND table_schema = 'public') THEN
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl_name);
        END IF;
    END LOOP;
END
$$;