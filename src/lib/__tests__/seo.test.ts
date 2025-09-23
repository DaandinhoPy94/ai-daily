import { describe, it, expect } from 'vitest';
import { buildCanonical, buildArticleJSONLD, buildBreadcrumbJSONLD, buildOrganizationJSONLD } from '../seo';

describe('seo utils', () => {
  it('buildCanonical adds base', () => {
    const url = buildCanonical('/artikel/test');
    expect(url).toMatch(/^https:\/\/aidagelijks\.nl\/artikel\/test/);
  });

  it('buildArticleJSONLD contains required keys', () => {
    const json = buildArticleJSONLD({
      id: '1',
      slug: 'test',
      title: 'Titel',
      summary: 'Samenvatting',
      published_at: '2025-09-01T10:00:00.000Z',
      updated_at: '2025-09-01T12:00:00.000Z'
    } as any);
    const obj = JSON.parse(json);
    expect(obj['@type']).toBe('NewsArticle');
    expect(obj.headline).toBe('Titel');
    expect(obj.datePublished).toBeDefined();
    expect(obj.publisher?.name).toBeDefined();
    expect(obj.mainEntityOfPage?.['@id']).toMatch(/aidagelijks\.nl/);
  });

  it('buildBreadcrumbJSONLD builds list items', () => {
    const json = buildBreadcrumbJSONLD([
      { name: 'Home', url: 'https://aidagelijks.nl' },
      { name: 'Topic', url: 'https://aidagelijks.nl/topic/ai' }
    ]);
    const obj = JSON.parse(json);
    expect(obj.itemListElement.length).toBe(2);
    expect(obj.itemListElement[0].position).toBe(1);
  });

  it('organization json-ld contains social profiles', () => {
    const obj = JSON.parse(buildOrganizationJSONLD());
    expect(obj.sameAs).toEqual(expect.arrayContaining([
      'https://x.com/AI_dagelijks',
      'https://www.linkedin.com/company/ai-dagelijks/'
    ]));
  });
});


