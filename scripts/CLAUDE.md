# AI-Daily Scripts

## Overzicht

Dit project bevat scripts voor het automatisch verzamelen, verwerken en illustreren van tech-nieuws.

## Mapstructuur

```
scripts/
├── scraper/              # Stap 1: Nieuws scraper
│   ├── main.py
│   ├── requirements.txt
│   └── .env
├── tekstverwerker/       # Stap 2: AI tekst processor
│   ├── processor.py
│   ├── requirements.txt
│   └── .env
└── afbeelding-generator/ # Stap 3: AI thumbnail generator
    ├── image_generator.py
    ├── requirements.txt
    ├── .env
    └── afbeeldingen/     # Gegenereerde thumbnails
```

---

## Pipeline Flow

```
1. SCRAPER
   nos.nl, guardian.com → article_websites (status='new')
                ↓
2. TEKSTVERWERKER
   article_websites → OpenAI → articles (status='published')
                ↓
3. AFBEELDING-GENERATOR
   articles → OpenAI Images → afbeeldingen/*.png
```

---

## 1. Scraper (`/scripts/scraper`)

### Wat doet het?
- Scraped tech-nieuws van meerdere bronnen
- Slaat artikelen op in `article_websites` tabel
- Voorkomt duplicaten door URL-check

### Huidige bronnen
- **NOS Tech**: https://nos.nl/nieuws/tech
- **The Guardian Tech**: https://www.theguardian.com/uk/technology

### Nieuwe bron toevoegen

Open `scripts/scraper/main.py` en voeg toe aan `SOURCES`:

```python
{
    "name": "tweakers",                    # Unieke naam
    "url": "https://tweakers.net/nieuws/", # Pagina om te scrapen
    "link_pattern": r"/nieuws/\d+/",       # Regex voor artikel-URLs
    "base_url": "https://tweakers.net",    # Voor relatieve URLs
},
```

### Link pattern tips
- Regex voor complexe patterns: `r"/artikel/\d+/"`
- Simpele strings werken ook: `"/nieuws/"`
- Vermijd topic pagina's met specifieke patterns (bijv. `\d{4}/` voor datums)

---

## 2. Tekstverwerker (`/scripts/tekstverwerker`)

### Wat doet het?
- Haalt artikelen op met `status='new'` uit `article_websites`
- Verwerkt tekst met OpenAI (gpt-4o-mini)
- Genereert: title, summary, body, SEO velden, topic
- Slaat op in `articles` tabel
- Update status naar 'processed'

### Topics
Het script selecteert automatisch een passend topic uit 30+ categorieën (AI, Big Tech, Europa, etc.)

---

## 3. Afbeelding Generator (`/scripts/afbeelding-generator`)

### Wat doet het?
- Haalt artikelen op waar `image_standard IS NULL`
- Genereert clickbait thumbnail met OpenAI Images API
- Model: gpt-image-1, quality: medium
- Prompt: titel + summary + "USE NO TEXT IN IMAGE!"
- Slaat op als slugified bestandsnaam

### Bestandsnaam
Titel wordt omgezet naar veilige bestandsnaam:
- "AI revolutie in 2026!" → `ai-revolutie-in-2026.png`

---

## Lokaal testen

```bash
# Stap 1: Scraper
cd scripts/scraper
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python main.py

# Stap 2: Tekstverwerker
cd scripts/tekstverwerker
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python processor.py

# Stap 3: Afbeelding generator
cd scripts/afbeelding-generator
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python image_generator.py
```

---

## Database

- **Supabase URL**: https://ykfiubiogxetbgdkavep.supabase.co
- **Tabellen**:
  - `article_websites`: ruwe gescrapete artikelen
  - `articles`: verwerkte artikelen voor publicatie

---

## GitHub Actions

Workflow: `.github/workflows/scrape_cron.yml`

- **Schedule**: Elke 30 minuten
- **Handmatig**: Actions tab → "Run workflow"
- **Secrets**: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `OPENAI_API_KEY`

### Pipeline volgorde:
1. Install + Run scraper
2. Install + Run tekstverwerker
3. Install + Run afbeelding-generator
