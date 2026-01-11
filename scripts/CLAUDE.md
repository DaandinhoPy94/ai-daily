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
├── afbeelding-generator/ # Stap 3: AI thumbnails
│   ├── image_generator.py
│   ├── requirements.txt
│   ├── .env
│   ├── .gitignore
│   └── afbeeldingen/     # Tijdelijke opslag
└── afbeelding-processor/ # Stap 4: Image verwerking
    ├── image_processor.py
    ├── requirements.txt
    ├── .env
    └── .gitignore
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
                ↓
4. IMAGE-PROCESSOR
   *.png → Pillow → 7 webp varianten → Supabase Storage → published_at
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
- Genereert: title, summary (3 zinnen als platte tekst), body, SEO velden, topic
- Slaat op in `articles` tabel
- Update status naar 'processed'

### Summary formaat
De summary is een enkele string van platte tekst met exact 3 krachtige zinnen. Geen lijst-notatie, geen bullets, geen blokhaken.

### Topics
Het script selecteert automatisch een passend topic uit 30+ categorieën (AI, Big Tech, Europa, etc.)

---

## 3. Afbeelding Generator (`/scripts/afbeelding-generator`)

### Wat doet het?
- Haalt artikelen op waar `image_standard IS NULL`
- Genereert clickbait thumbnail met OpenAI Images API
- Model: gpt-image-1, quality: medium
- Prompt: titel + summary + "USE NO TEXT IN IMAGE!"
- Slaat op als slugified bestandsnaam in `afbeeldingen/`

### Bestandsnaam
Titel wordt omgezet naar veilige bestandsnaam:
- "AI revolutie in 2026!" → `ai-revolutie-in-2026.png`

---

## 4. Image Processor (`/scripts/afbeelding-processor`)

### Wat doet het?
- Leest PNG bestanden uit `/afbeelding-generator/afbeeldingen/`
- Vindt artikel via `image_standard` veld (bestandsnaam = slug)
- Genereert 7 webp varianten met Pillow (quality 85)
- Upload naar Supabase Storage (`media/articles/[UUID]/`)
- Update database met 5 image URLs
- Zet `published_at` timestamp (artikel gaat live)
- Verwijdert lokale bestanden na upload

### Gegenereerde formaten

**16:9 Ladder (hero images):**
| Resolutie | Bestandsnaam | Database kolom |
|-----------|--------------|----------------|
| 1280×720 | hero_1600.webp | `image_large` |
| 1024×576 | hero_1200.webp | `image_standard` |
| 768×432 | hero_800.webp | `image_tablet` |
| 480×270 | hero_400.webp | `image_mobile` |

**1:1 Ladder (center crop, list images):**
| Resolutie | Bestandsnaam | Database kolom |
|-----------|--------------|----------------|
| 384×384 | list_320.webp | `image_list` |
| 512×512 | list_480.webp | - |
| 768×768 | list_600.webp | - |

### Storage structuur
```
media/
└── articles/
    └── [UUID]/
        ├── hero_1600.webp
        ├── hero_1200.webp
        ├── hero_800.webp
        ├── hero_400.webp
        ├── list_320.webp
        ├── list_480.webp
        └── list_600.webp
```

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

# Stap 4: Image processor
cd scripts/afbeelding-processor
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python image_processor.py
```

---

## Database

- **Supabase URL**: https://ykfiubiogxetbgdkavep.supabase.co
- **Tabellen**:
  - `article_websites`: ruwe gescrapete artikelen
  - `articles`: verwerkte artikelen voor publicatie
- **Storage Bucket**: `media`

---

## GitHub Actions

Workflow: `.github/workflows/scrape_cron.yml`

- **Schedule**: Elke 30 minuten
- **Handmatig**: Actions tab → "Run workflow"
- **Secrets**: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `OPENAI_API_KEY`

### Pipeline volgorde:
1. Install + Run scraper (scripts/scraper)
2. Install + Run tekstverwerker (scripts/tekstverwerker)
3. Install + Run image_generator (scripts/afbeelding-generator)
4. Install + Run image_processor (scripts/afbeelding-processor)
