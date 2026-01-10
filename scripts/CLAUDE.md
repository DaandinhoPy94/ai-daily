# AI-Daily Scripts

## Overzicht

Dit project bevat scripts voor het automatisch verzamelen en verwerken van tech-nieuws.

## Mapstructuur

```
scripts/
├── scraper/          # Nieuws scraper
│   ├── main.py       # Hoofd-script
│   ├── requirements.txt
│   ├── .env          # Lokale config (niet in git)
│   └── .gitignore
└── tekstverwerker/   # (TODO) Tekst verwerking met AI
```

## 1. Scraper (`/scripts/scraper`)

### Wat doet het?
- Scraped automatisch tech-nieuws van meerdere bronnen
- Slaat artikelen op in Supabase (`article_websites` tabel)
- Voorkomt duplicaten door URL-check
- Draait elke 30 minuten via GitHub Actions

### Huidige bronnen
- **NOS Tech**: https://nos.nl/nieuws/tech
- **The Guardian Tech**: https://www.theguardian.com/uk/technology

### Nieuwe bron toevoegen

Open `scripts/scraper/main.py` en voeg een item toe aan de `SOURCES` lijst:

```python
SOURCES = [
    # ... bestaande bronnen ...
    {
        "name": "tweakers",                    # Unieke naam (wordt opgeslagen in 'source' kolom)
        "url": "https://tweakers.net/nieuws/", # Pagina om te scrapen
        "link_pattern": r"/nieuws/\d+/",       # Regex pattern voor artikel-URLs
        "base_url": "https://tweakers.net",    # Voor relatieve URLs (leeg als absolute)
    },
]
```

### Link pattern tips
- Gebruik regex voor complexe patterns: `r"/artikel/\d+/"`
- Simpele strings werken ook: `"/nieuws/"`
- Test eerst welke URLs de pagina bevat voordat je het pattern kiest
- Vermijd topic/categorie pagina's door specifiek te zijn (bijv. met datum: `\d{4}/`)

### Lokaal testen
```bash
cd scripts/scraper
source venv/bin/activate  # of: python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Database
- **Supabase URL**: https://ykfiubiogxetbgdkavep.supabase.co
- **Tabel**: `article_websites`
- **Kolommen**: id, created_at, url (unique), title, content, source, status

## 2. Tekstverwerker (`/scripts/tekstverwerker`)

TODO: Volgende stap - AI-verwerking van artikelen.

## GitHub Actions

De scraper draait automatisch via `.github/workflows/scrape_cron.yml`:
- **Schedule**: Elke 30 minuten
- **Handmatig**: Via Actions tab → "Run workflow"
- **Secrets**: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
