import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as client from '@/integrations/supabase/client';
import { ensureProfile } from '@/lib/ensureProfile';

describe('ensureProfile', () => {
  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: { name: 'Test User' },
    aud: 'authenticated',
    role: 'authenticated',
    identities: [],
    created_at: '',
    updated_at: '',
    is_anonymous: false,
  } as any;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('upserts profile by user_id and returns row', async () => {
    const upsert = vi.fn().mockReturnValue({ select: () => ({ single: () => ({ data: { user_id: mockUser.id, display_name: 'Test User' } }) }) });
    const from = vi.fn().mockReturnValue({ upsert });
    vi.spyOn(client, 'supabase', 'get').mockReturnValue({ from } as any);

    const result = await ensureProfile(mockUser);
    expect(from).toHaveBeenCalledWith('profiles');
    expect(upsert).toHaveBeenCalled();
    expect(result?.user_id).toBe('user-1');
  });
});


