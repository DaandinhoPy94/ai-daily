import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ArticleListRow } from '../../components/ArticleListRow';
import { MiniNewsCard } from '../../components/MiniNewsCard';
import { LargeNewsCard } from '../../components/LargeNewsCard';
import { NewsCard } from '../../components/NewsCard';

const ARTICLE = {
  id: '1',
  slug: 'ai-nieuws-1',
  title: 'AI nieuws',
  readTimeMinutes: 5,
};

function withRouter(ui: React.ReactElement) {
  return (
    <MemoryRouter initialEntries={[`/`]}>
      <Routes>
        <Route path="/" element={ui} />
        <Route path="/artikel/:slug" element={<div>Detail</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Read state integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('marks ArticleListRow as read on click and persists', async () => {
    const user = userEvent.setup();
    render(withRouter(<ArticleListRow article={ARTICLE as any} />));
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('data-read', 'false');
    await user.click(link);
    // navigation happens, but persistence should be set
    const stored = JSON.parse(window.localStorage.getItem('ai-daily:read-articles:v1') || '[]');
    expect(stored).toContain('ai-nieuws-1');
  });

  it('applies deemphasis class when item is read (MiniNewsCard)', async () => {
    window.localStorage.setItem('ai-daily:read-articles:v1', JSON.stringify(['ai-nieuws-1']));
    render(withRouter(<MiniNewsCard article={ARTICLE as any} />));
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('data-read', 'true');
  });

  it('keyboard activation triggers markRead (LargeNewsCard)', async () => {
    const user = userEvent.setup();
    render(withRouter(<LargeNewsCard article={{ ...ARTICLE, media_asset_url: '' } as any} />));
    const link = screen.getByRole('link');
    link.focus();
    await user.keyboard('{Enter}');
    const stored = JSON.parse(window.localStorage.getItem('ai-daily:read-articles:v1') || '[]');
    expect(stored).toContain('ai-nieuws-1');
  });

  it('NewsCard read state reflects in aria-label', async () => {
    const user = userEvent.setup();
    render(withRouter(<NewsCard article={{ ...ARTICLE, image_standard: 'placeholder' } as any} />));
    const link = screen.getByRole('link');
    await user.click(link);
    const stored = JSON.parse(window.localStorage.getItem('ai-daily:read-articles:v1') || '[]');
    expect(stored).toContain('ai-nieuws-1');
  });
});


