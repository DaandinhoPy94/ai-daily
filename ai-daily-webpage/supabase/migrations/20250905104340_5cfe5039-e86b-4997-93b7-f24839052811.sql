-- Step 1: Delete existing articles
DELETE FROM articles WHERE id IN (
  '750e8400-e29b-41d4-a716-446655440001',
  '750e8400-e29b-41d4-a716-446655440002', 
  '750e8400-e29b-41d4-a716-446655440003',
  '750e8400-e29b-41d4-a716-446655440004',
  '750e8400-e29b-41d4-a716-446655440005',
  '750e8400-e29b-41d4-a716-446655440006'
);

-- Step 2: Create media assets for articles with hero images
INSERT INTO media_assets (id, path, alt, title, type, created_at) VALUES
('9f15a6d0-cc9d-4b0c-b0f4-fc13f5b9c91c', 'https://static01.nyt.com/images/2025/08/27/multimedia/27google-pixel-review/27google-pixel-review-superJumbo.jpg', 'Google Pixel 10 Pro review', 'Google Pixel 10 Pro A.I. smartphone', 'image', now()),
('3f07bb32-08d8-46a2-b28f-8db9a95d9d58', 'https://static01.nyt.com/images/2025/09/03/multimedia/03google-ruling-analysis/03google-ruling-analysis-superJumbo.jpg', 'Google antitrust ruling analysis', 'Big Tech analysis', 'image', now()),
('8d4b3f5c-5c12-4b8f-9f34-8b20d77b3ae8', 'https://static01.nyt.com/images/2025/09/02/multimedia/02techfix-google/02techfix-google-superJumbo.jpg', 'Google search monopoly fixes', 'Google search changes', 'image', now()),
('4e19f8a6-1c1e-4d6c-8b23-2b58942c7a3c', 'https://static01.nyt.com/images/2025/09/02/multimedia/02google-antitrust/02google-antitrust-superJumbo.jpg', 'Google antitrust case', 'Google antitrust verdict', 'image', now()),
('f32cb9a8-6c3b-49f5-a87f-97c13a48b04e', 'https://static01.nyt.com/images/2025/08/26/multimedia/26ai-superpacs/26ai-superpacs-superJumbo.jpg', 'Silicon Valley AI super PACs', 'AI political lobbying', 'image', now()),
('b89c12e1-40ad-4f2a-91f6-6a4eab7ef41e', 'https://static01.nyt.com/images/2025/08/27/multimedia/27nvidia-earnings/27nvidia-earnings-superJumbo.jpg', 'Nvidia earnings AI boom', 'Nvidia financial results', 'image', now());

-- Step 3: Insert new articles with proper references
INSERT INTO articles (
  id, slug, status, title, summary, body, read_time_minutes, 
  topic_id, author_id, hero_image_id, is_featured, 
  published_at, scheduled_at, created_at, updated_at
) VALUES
-- Article 1: Hisense AI
('7e1c2c0a-bfd6-46da-bf4b-6f78f9b3e7c2', 'hisense-ai-your-life', 'published', 
'Hisense zet vol in op AI met ''AI Your Life''', 
'- Hisense presenteert AI-strategie op IFA 2025 met tv''s, koelkasten en airco''s
- Veel functies draaien om gemak, maar niet altijd echte AI
- Illustratie van hoe AI-achtige toepassingen steeds meer de huiskamer binnendringen',
'Op de IFA 2025 in Berlijn lanceerde **Hisense** zijn nieuwe strategie *AI Your Life*, waarbij kunstmatige intelligentie centraal staat in het dagelijks leven. Het Chinese elektronicamerk presenteerde een reeks innovaties die het gebruiksgemak en entertainmentervaring in huis moeten verbeteren.

### AI-gedreven producten
Bij entertainment speelt Hisense hoog in op beleving. De nieuwe **RGB-MiniLED TV 116" UX** belooft levensechte kleuren en contrast, aangevuld met AI-functies die resolutie opschalen tot bijna 4K en visuele ruis verminderen. Ook geluidsinstallaties zijn voorzien van AI-ondersteuning voor meeslependere film- en game-ervaringen.

Daarnaast toonde Hisense een **smart koelkast** met een 21-inch display en ingebouwde AI-assistent die helpt bij koken, en de **U8 S Pro airconditioner**, die via 18 spraakcommando''s kan worden aangestuurd.

### Echte AI of gimmick?
Hoewel Hisense de functies als AI bestempelt, gaat het vaak om slimme automatisering en niet om geavanceerde modellen. Het bedienen van een airco met commando''s is praktisch, maar valt moeilijk onder ''echte AI''. Toch markeert het een trend waarin AI-achtige toepassingen steeds vaker deel uitmaken van consumentenelektronica.

### Vooruitblik
Hisense kondigde ook aan AI buiten de woonkamer te willen inzetten, bijvoorbeeld in verkeer en slimme kantoorgebouwen. Daarmee wil het merk zich profileren als speler die niet alleen consumentenelektronica maar ook bredere toepassingen slimmer en duurzamer maakt.

**Conclusie:** met *AI Your Life* zet Hisense vol in op de hype rond AI, waarbij het onderscheid tussen marketing en werkelijke intelligentie soms diffuus is. Toch geeft het een glimp van hoe AI-producten zich steeds verder nestelen in het dagelijks leven.',
4, 
(SELECT id FROM topics WHERE slug = 'ai-ml' LIMIT 1),
(SELECT id FROM authors WHERE name = 'Sarah Chen' LIMIT 1),
NULL, false, '2025-09-05T08:43:00Z', NULL, '2025-09-05T13:00:00Z', '2025-09-05T13:00:00Z'),

-- Article 2: Dead Internet Theory
('51d5c8eb-8a87-42d6-b405-3f1af5d7acbb', 'dead-internet-theory-mythe-metafoor', 'published',
'Wat is de Dead Internet Theory? Mythe, metafoor of realiteit?',
'- Theorie stelt dat bots en AI sinds 2016-2017 het internet domineren
- Onderzoeken tonen ~50% botverkeer, maar menselijk gebruik blijft essentieel
- Meer metafoor voor digitale vervreemding dan feitelijke dood van het internet',
'De **Dead Internet Theory** is een complottheorie die beweert dat het internet sinds circa 2016 grotendeels wordt gedomineerd door bots en AI-gegenereerde content, waardoor menselijke interactie nauwelijks nog zichtbaar is. De term werd bekend via fora als 4chan, waar de gebruiker *IlluminatiPirate* in 2021 stelde dat het internet al jaren ''dood'' was. Media zoals *The Atlantic* besteedden later aandacht aan de theorie.

De kernclaims:
- **Bots domineren verkeer:** Studies bevestigen dat circa 50% van het internetverkeer van bots komt (Imperva, 2016 en 2023).
- **Menselijke activiteit zou verdwijnen:** Voorstanders zeggen dat echte gebruikers zijn vervangen, maar er zijn nog steeds miljarden actieve accounts.
- **Verborgen agenda''s:** Grote techbedrijven en overheden zouden AI en bots gebruiken voor propaganda, censuur of winstmaximalisatie.
- **Ervaringsdimensie:** Veel gebruikers ervaren dat online interactie minder authentiek is en meer gestuurd door algoritmen.

Experts en onderzoekers nuanceren dit beeld. Hoewel bots en AI een groot aandeel hebben, zijn mensen nog steeds zeer aanwezig. Wel verandert de beleving van het internet: sociale media-feeds worden gevuld met gesponsorde content, SEO-gedreven websites en AI-artikelen overspoelen zoekresultaten, en gemeenschapsplatforms verdwijnen ten gunste van algoritmische interacties.

Sam Altman (OpenAI) merkte recent op dat hij steeds meer LLM-gestuurde accounts ziet rondgaan, wat aansluit bij de zorgen van voorstanders. Toch beschouwen critici de theorie vooral als een **metafoor voor digitale vervreemding**, geen bewijs dat het internet ''dood'' is. Het internet leeft, maar voelt voor velen kunstmatiger en minder menselijk aan dan vroeger.

**Conclusie:** de Dead Internet Theory is grotendeels speculatief, maar raakt een gevoelige snaar. Het internet is niet letterlijk dood, maar de ervaring ervan is ingrijpend veranderd door de opkomst van bots, algoritmen en AI.',
6,
(SELECT id FROM topics WHERE slug = 'ai-ml' LIMIT 1),
(SELECT id FROM authors WHERE name = 'Sarah Chen' LIMIT 1),
NULL, false, '2025-09-04T16:52:00Z', NULL, '2025-09-05T12:45:00Z', '2025-09-05T12:45:00Z'),

-- Article 3: Scale AI lawsuit
('b2c97a10-8f78-4c63-9e4a-d8e9c3d70f9e', 'scale-ai-mercor-rechtszaak-spionage', 'published',
'Scale AI sleept oud-medewerker en concurrent Mercor voor de rechter wegens spionage',
'- Scale AI beschuldigt ex-medewerker Eugene Ling van diefstal van vertrouwelijke documenten
- Mercor ontkent betrokkenheid maar biedt aan de bestanden te vernietigen
- Rechtszaak toont de felle strijd om klanten en talent in de AI-datawereld',
'Scale AI, specialist in datalabeling en gewaardeerd op circa $29 miljard, heeft een rechtszaak aangespannen tegen voormalig medewerker **Eugene Ling** en concurrent **Mercor**. Ling zou meer dan honderd vertrouwelijke documenten hebben gestolen, waaronder klantstrategieën, kort nadat hij contact had met de CEO van Mercor. Volgens Scale probeerde hij actief klantinformatie door te spelen en collega''s te werven voor Mercor.

Een interne communicatie toonde dat Ling een belangrijke klant (''Customer A'') benaderde met de boodschap dat zijn nieuwe bedrijf hen beter kon ondersteunen. Toen hij gevraagd werd of dit om Mercor ging, antwoordde hij suggestief: *"Are you working with Mercor already?"* Ook benaderde hij collega''s met voorstellen om over te stappen.

Mercor ontkent dat het de documenten heeft gebruikt. Het bedrijf stelt dat Ling de bestanden op zijn persoonlijke Google Drive had opgeslagen en bood aan deze te vernietigen. Scale noemt dat juist het vernietigen van bewijsmateriaal en eist dat de documenten worden teruggegeven, dat Mercor ze niet gebruikt en dat er schadevergoeding wordt betaald. Woordvoerder Joe Osborne: *"We won''t allow anyone to take unlawful shortcuts at the expense of our business."*

De zaak belicht de hevige concurrentie in de AI-sector. Bedrijven als Scale, Mercor, OpenAI, Anthropic en Google vechten om data, klanten en talent. Eerder klaagde ook xAI een oud-medewerker aan wegens het doorspelen van bedrijfsgeheimen. De rechtszaken onderstrepen hoe groot de druk is in de snelgroeiende markt voor AI-infrastructuur en ondersteunende diensten.',
5,
(SELECT id FROM topics WHERE slug = 'ai-ml' LIMIT 1),
(SELECT id FROM authors WHERE name = 'Sarah Chen' LIMIT 1),
NULL, false, '2025-09-04T17:00:00Z', NULL, '2025-09-05T12:30:00Z', '2025-09-05T12:30:00Z'),

-- Article 4: OpenAI Xcode acquisition
('63adf52d-9bc2-4c2f-a56e-01b78c6c6fd2', 'openai-neemt-xcode-ai-agent-over', 'published',
'OpenAI neemt AI-agent voor Xcode over om ontwikkelaars te versterken',
'- OpenAI neemt Alex over, de populairste AI-plugin voor Apple''s Xcode
- Integratie in OpenAI''s Codex-team moet ontwikkelaars efficiënter laten werken
- Overname versterkt OpenAI''s positie in AI-codeerhulpmiddelen, met focus op Apple-platforms',
'OpenAI heeft de makers van **Alex** overgenomen, een AI-assistent die diep geïntegreerd is in Apple''s ontwikkelomgeving Xcode. Alex staat bekend als de meest gebruikte Copilot-plugin voor Xcode en fungeert als slimme zijbalk met functies zoals automatische code-aanvulling, inline herstructurering en het oplossen van fouten. Via de macOS-accessibility-interface kan Alex direct in het ontwikkelvenster navigeren en taken uitvoeren, zoals het genereren van testgevallen en herschrijven van code.

Hoewel de gebruikersbasis relatief klein is, wordt Alex hoog gewaardeerd door Mac-ontwikkelaars vanwege de tijdswinst en contextuele hulp. Het volledige Alex-team sluit zich aan bij OpenAI''s **Codex-team**, dat zich richt op AI-coderingsoplossingen.

De overname past in een bredere strategie van OpenAI om zijn aanbod van ontwikkelaarstools uit te breiden. Eerder dit jaar nam het bedrijf ook Windsurf, een AI-IDE-startup, over voor circa $3 miljard. Met Alex haalt OpenAI diepgaande expertise binnen in het Apple-ecosysteem, wat moet leiden tot betere ondersteuning voor iOS- en macOS-programmeurs.

Voor de Apple-community kan de integratie van Alex een belangrijke stap zijn: ontwikkelaars krijgen direct in Xcode toegang tot AI-functionaliteiten die verder gaan dan generieke modellen. Het vergroot de kans dat toekomstige Codex-tools beter aansluiten bij de dagelijkse workflow van Apple-ontwikkelaars.

Kortom, de deal verstevigt OpenAI''s positie als toonaangevende speler in AI-codeassistenten en vergroot de strategische aanwezigheid in het domein van Mac-ontwikkeling.',
4,
(SELECT id FROM topics WHERE slug = 'ai-ml' LIMIT 1),
(SELECT id FROM authors WHERE name = 'Sarah Chen' LIMIT 1),
NULL, false, '2025-09-04T18:00:00Z', NULL, '2025-09-05T12:15:00Z', '2025-09-05T12:15:00Z'),

-- Article 5: Apple Siri AI search
('f61c68d1-0d91-4762-90fc-b5b36d23cb8a', 'apple-siri-ai-zoekmachine', 'published',
'Apple kijkt naar Google voor Siri om te concurreren met OpenAI en Perplexity',
'- Apple ontwikkelt een AI-gestuurde zoekmachine voor Siri, gepland voor 2026
- Google''s Gemini wordt getest naast Apple''s eigen modellen met focus op privacy
- Siri''s vernieuwing moet concurrentie aangaan met OpenAI en Perplexity',
'Apple bereidt de grootste update van Siri sinds de lancering in 2011 voor. In 2026 verschijnt een AI-gestuurde zoekmachine onder de naam **World Knowledge Answers**, geïntegreerd in Siri. Het nieuwe systeem moet Siri omvormen tot een volwaardige ''answer engine'', vergelijkbaar met ChatGPT en Google''s AI Overviews. In plaats van losse feitjes of links zal Siri voortaan volledige antwoorden genereren.

De vernieuwde Siri bestaat uit drie onderdelen: een **Planner** die vragen interpreteert, een **Zoeksysteem** dat zowel internet als persoonlijke data doorzoekt, en een **Samenvatter** die de resultaten in begrijpelijke taal teruggeeft. De uitrol staat gepland voor het voorjaar van 2026, tegelijk met iOS 26.4. Later kan de technologie ook naar Safari en Spotlight komen.

Opvallend is dat Apple naast eigen modellen ook een aangepaste versie van Google''s **Gemini** test om de samenvattingsfunctie te versterken. De verwerking draait op Apple''s **Private Cloud Compute-servers** om privacy te waarborgen. Andere kandidaten zoals Anthropic''s Claude (te duur), OpenAI en Mistral vielen voorlopig af. Tegelijk blijft Apple inzetten op zijn eigen Foundation Models om persoonlijke data lokaal op apparaten te verwerken.

De stap plaatst Apple rechtstreeks in de strijd met **OpenAI** en **Perplexity AI**, de twee snelgroeiende spelers in generatieve zoektechnologie. Siri, ooit baanbrekend, wordt tegenwoordig gezien als verouderd en onbetrouwbaar. Met deze upgrade wil Apple het vertrouwen van gebruikers terugwinnen.

De vernieuwing komt op een moment dat Apple jaarlijks miljarden verdient via de zoekdeal met Google (geschat op $20 miljard). Hoewel een recente Amerikaanse uitspraak deze samenwerking bevestigde, kiest Apple voor een tweesporenbeleid: profiteren van Google''s zoekinkomsten, maar tegelijk werken aan een eigen ecosysteem.

Interne uitdagingen blijven: belangrijke onderzoekers vertrokken naar concurrenten, waardoor Apple extra inzet op samenwerkingen en overnames. De teams onder leiding van Craig Federighi, John Giannandrea en Eddy Cue werken samen met Mike Rockwell om de transformatie van Siri te realiseren.

Naast de zoekfunctie werkt Apple ook aan bredere AI-plannen, zoals een visuele redesign van Siri, een AI-gezondheidsassistent voor een betaalde wellnessdienst en sterkere gespreksvaardigheden voor smart home-apparaten. Daarmee positioneert Apple zich voor een AI-comeback, met Siri opnieuw als middelpunt.',
6,
(SELECT id FROM topics WHERE slug = 'ai-ml' LIMIT 1),
(SELECT id FROM authors WHERE name = 'Sarah Chen' LIMIT 1),
NULL, false, '2025-09-04T17:24:00Z', NULL, '2025-09-05T12:00:00Z', '2025-09-05T12:00:00Z'),

-- Article 6: Google Pixel 10 Pro (with hero image)
('9f15a6d0-cc9d-4b0c-b0f4-fc13f5b9c91b', 'google-pixel-10-pro-review-ai-phone', 'published',
'Google Pixel 10 Pro review: dit A.I.-toestel bespaart tijd, maar kost je data',
'- De Pixel 10 Pro gebruikt A.I. om taken te stroomlijnen via de nieuwe tool Magic Cue
- Efficiëntie gaat gepaard met grote inbreuk op privacy en fouten in dataverwerking
- A.I.-camera-assistent en fotobewerking tonen kracht, maar roepen ethische vragen op',
'De nieuwe Google Pixel 10 Pro, met een prijskaartje van $1.000, presenteert zich als de eerste echte A.I.-smartphone. Het toestel kan automatisch reisdetails uit mails halen, kaarten openen bij suggesties van vrienden en foto''s optimaliseren met een digitale coach. Centraal staat de softwarefunctie **Magic Cue**, die toegang krijgt tot apps zoals e-mail, berichten, contacten en agenda om proactief informatie aan te reiken.

Tijdens tests bleek Magic Cue nuttig bij eenvoudige taken, zoals automatisch een telefoonnummer vinden. Toch waren er grote missers: bij een telefoongesprek met United Airlines haalde het systeem foutieve gegevens uit een financiële e-mail, wat duidelijk maakte hoe invasief en foutgevoelig deze datatoegang kan zijn.

Naast Magic Cue biedt de Pixel een **Camera Coach** die fotocompositie begeleidt en een A.I.-fotobewerker die objecten kan verwijderen of beelden aanpassen via tekstcommando''s. Hoewel dit indrukwekkend is, roept het vragen op over authenticiteit en het gemak waarmee bewerkte beelden worden gedeeld.

Het bredere plaatje: de Pixel 10 Pro legt bloot hoe de sociale ruilverhouding in persoonlijke technologie verschuift. Waar gebruikers vroeger enkel hun locatie deelden voor navigatie, vereist deze A.I.-telefoon vrijwel volledige toegang tot persoonlijke data voor relatief beperkte tijdswinst. Critici, zoals Chris Gilliard van het Critical Internet Studies Institute, waarschuwen dat de ''magie'' in feite neerkomt op diepgaande surveillance.

De Pixel 10 Pro toont zowel de belofte als de risico''s van A.I.-integratie in smartphones: gemak en efficiëntie tegenover privacyverlies en foutgevoeligheid. Of consumenten bereid zijn deze prijs te betalen, zal bepalen of dit type toestel de norm wordt.',
7,
(SELECT id FROM topics WHERE slug = 'ai-ml' LIMIT 1),
(SELECT id FROM authors WHERE name = 'Sarah Chen' LIMIT 1),
'9f15a6d0-cc9d-4b0c-b0f4-fc13f5b9c91c', false, '2025-08-27T00:00:00Z', NULL, '2025-09-05T11:40:00Z', '2025-09-05T11:40:00Z'),

-- Article 7: Google ruling analysis (with hero image)
('3f07bb32-08d8-46a2-b28f-8db9a95d9d57', 'google-ruling-big-tech-analyse', 'published',
'De boodschap voor Big Tech in het Google-vonnis: speel netjes, maar ga door',
'- Rechter Mehta legt Google beperkingen op, maar geen radicale opsplitsing
- Uitspraak weerspiegelt voorzichtige koers van rechters in antitrustzaken
- Signaal naar Amazon, Apple en Meta dat de rechtspraak remt maar niet breekt',
'De uitspraak van rechter Amit P. Mehta in de Amerikaanse antitrustzaak tegen Google markeert een belangrijk moment voor Big Tech. Google moet delen van zijn zoekdata vrijgeven en mag geen exclusieve contracten meer afsluiten om zijn zoekmachine als standaard te verankeren, maar de gevreesde maatregelen zoals de verkoop van Chrome bleven uit. Voor grote techbedrijven is dit een geruststelling: ze worden beperkt, maar niet fundamenteel veranderd.

De gematigde benadering weerspiegelt de terughoudendheid van de rechtspraak om diep in te grijpen in snel veranderende markten zoals zoektechnologie en kunstmatige intelligentie. Rechter Mehta wees expliciet op de onzekerheden rond A.I., dat de manier waarop mensen informatie vinden drastisch kan veranderen. Daardoor koos hij voor een bescheiden pakket maatregelen, dat zes jaar van kracht blijft.

De zaak geldt als een blauwdruk voor andere lopende antitrustprocedures tegen Amazon, Apple en Meta. Net als in de Microsoft-zaak begin jaren 2000 worden contractuele beperkingen opgelegd, maar blijft de kern van de macht van het bedrijf intact. Critici merken op dat consumenten zelden de standaardzoekmachine aanpassen, waardoor Google zijn dominante positie grotendeels behoudt.

Toch kan de uitspraak bredere gevolgen hebben. Hogere rechters, inclusief het Hooggerechtshof, zullen waarschijnlijk terughoudend blijven tegenover agressieve mededingingsmaatregelen. Tegelijk kan de angst voor strengere sancties in de toekomst techbedrijven ertoe brengen voorzichtiger te opereren. Voorlopig is de boodschap duidelijk: speel netjes binnen de regels, maar de marktpositie van de grootste spelers blijft grotendeels onaangetast.',
7,
(SELECT id FROM topics WHERE slug = 'ai-ml' LIMIT 1),
(SELECT id FROM authors WHERE name = 'Sarah Chen' LIMIT 1),
'3f07bb32-08d8-46a2-b28f-8db9a95d9d58', false, '2025-09-03T00:00:00Z', NULL, '2025-09-05T11:20:00Z', '2025-09-05T11:20:00Z'),

-- Article 8: Google monopoly fixes (with hero image)
('8d4b3f5c-5c12-4b8f-9f34-8b20d77b3ae7', 'google-monopolie-fixes-nothingburger', 'published',
'Wat de oplossingen voor Google''s zoekmonopolie voor jou betekenen: een ''nothingburger''',
'- Rechter verplicht Google beperkte datadeling, maar effect voor consumenten is minimaal
- Google blijft standaard zoekmachine op iPhones en andere apparaten
- A.I.-chatbots profiteren nauwelijks van de uitspraak omdat cruciale zoektechnologie buiten schot blijft',
'Toen een federale rechter oordeelde dat Google illegaal zijn zoekmonopolie had behouden, leek dat een kans om de manier waarop we internet gebruiken drastisch te veranderen. Er was sprake van mogelijke maatregelen zoals het verkopen van Chrome of Android, of het dwingen van Google om echte concurrentie toe te laten. Voor consumenten zou dat meer keuze en een ander internetlandschap hebben betekend.

De uiteindelijke uitspraak viel echter veel milder uit. Google moet slechts een deel van zijn zoekdata delen met concurrenten, zoals lijsten met gecrawlde websites. De ''geheime saus'' van Google''s zoekalgoritme blijft buiten bereik. Volgens DuckDuckGo-oprichter Gabriel Weinberg is dit ''een nothingburger''.

Voor gebruikers verandert er nauwelijks iets. Google.com blijft hoogstwaarschijnlijk de standaardzoekmachine op iPhones en andere apparaten, omdat de rechter toestond dat Google Apple en Samsung blijft betalen voor die voorkeurspositie. Apple gaf bovendien aan dat het Google kiest vanwege de kwaliteit van de zoekresultaten.

Ook A.I.-chatbots zoals ChatGPT en Perplexity profiteren weinig, omdat de complexe onderdelen van zoektechnologie – zoals rangschikking en kwaliteitsdata – niet gedeeld hoeven te worden. Bovendien gaat Google in beroep, waardoor eventuele veranderingen nog jaren op zich laten wachten.

Kortom: ondanks de grote verwachtingen betekent deze uitspraak weinig directe verandering voor consumenten. Google blijft voorlopig de dominante zoekspeler, en de alternatieven krijgen nauwelijks meer speelruimte.',
3,
(SELECT id FROM topics WHERE slug = 'ai-ml' LIMIT 1),
(SELECT id FROM authors WHERE name = 'Sarah Chen' LIMIT 1),
'8d4b3f5c-5c12-4b8f-9f34-8b20d77b3ae8', false, '2025-09-02T00:00:00Z', NULL, '2025-09-05T11:00:00Z', '2025-09-05T11:00:00Z'),

-- Article 9: Google antitrust verdict (with hero image)
('4e19f8a6-1c1e-4d6c-8b23-2b58942c7a3b', 'google-antitrust-zoekmonopolie', 'published',
'Google ontloopt strengste straffen in historisch zoekmonopolie-vonnis',
'- Google moet zoekdata delen met concurrenten, maar hoeft zich niet op te splitsen
- Rechter beperkt exclusieve contracten, maar laat betalingen voor voorkeursposities deels toe
- Uitspraak geldt zes jaar en benadrukt impact van generatieve A.I. op zoekmarkt',
'In een baanbrekend mededingingsvonnis heeft een federale rechter bepaald dat Google zoekresultaten en delen van zijn zoekindex moet delen met concurrenten. De rechter weigerde echter de door de Amerikaanse overheid gewenste radicalere maatregelen, zoals het verplicht verkopen van Google Chrome. Daarmee ontloopt Google de strengste straffen in de grootste mededingingszaak tegen een techbedrijf in decennia.

Rechter Amit P. Mehta oordeelde dat Google sommige gegevens moet vrijgeven aan ''gekwalificeerde concurrenten'' om de monopolistische positie te corrigeren. Ook verbood hij exclusieve contracten waarmee Google zijn zoekmachine standaard als optie op browsers en smartphones kon verankeren. Toch mag het bedrijf in veel gevallen nog steeds betalen voor prominente plaatsing.

De zaak, die teruggaat tot 2020, werd gezien als de belangrijkste antitruststrijd sinds Microsoft twintig jaar geleden. Terwijl het ministerie van Justitie pleitte voor een opsplitsing en een totaalverbod op deals met browserfabrikanten, koos Mehta voor een gematigder lijn. Hij verwees naar de snelle opkomst van generatieve A.I., die volgens hem het speelveld voor zoekmachines wezenlijk heeft veranderd.

De uitspraak geldt voor zes jaar en kan gevolgen hebben voor andere lopende zaken tegen grote technologiebedrijven, waaronder Meta, Amazon en Apple. Google''s beurskoers steeg direct met 8% na de uitspraak. Toch waarschuwen critici dat de opgelegde datadeling weinig zal veranderen; concurrent DuckDuckGo noemde het besluit ''een nothingburger''. 

Ondanks de relatief milde sancties is de zaak een belangrijke mijlpaal: het bevestigt dat Google''s dominante positie in online zoeken illegaal is en dwingt het bedrijf tot meer openheid, al blijft de kern van zijn macht grotendeels intact.',
9,
(SELECT id FROM topics WHERE slug = 'ai-ml' LIMIT 1),
(SELECT id FROM authors WHERE name = 'Sarah Chen' LIMIT 1),
'4e19f8a6-1c1e-4d6c-8b23-2b58942c7a3c', false, '2025-09-02T00:00:00Z', NULL, '2025-09-05T10:45:00Z', '2025-09-05T10:45:00Z'),

-- Article 10: Silicon Valley super PACs (with hero image)
('f32cb9a8-6c3b-49f5-a87f-97c13a48b04d', 'silicon-valley-ai-super-pacs', 'published',
'Silicon Valley belooft $200 miljoen aan nieuwe pro-A.I.-super PACs',
'- Grote techbedrijven en investeerders, waaronder Meta en Andreessen Horowitz, investeren zwaar in politieke lobby rond A.I.
- Twee nieuwe super PACs moeten politici onder druk zetten die te weinig steun geven aan de A.I.-industrie.
- De inzet richt zich vooral op Californië, waar tientallen A.I.-gerelateerde wetsvoorstellen in behandeling zijn.',
'Silicon Valley-bedrijven en investeerders hebben tot $200 miljoen toegezegd aan twee nieuwe super PACs die bedoeld zijn om politieke steun voor kunstmatige intelligentie te versterken. De stap volgt op president Trumps steun voor de technologie- en crypto-industrie.

Een van de nieuwe PACs, Meta California, ontvangt tientallen miljoenen van Meta en richt zich specifiek op Californië, waar nieuwe regelgeving rond A.I. in behandeling is. De tweede, Leading the Future, wordt gefinancierd met $50 miljoen van Andreessen Horowitz en $50 miljoen van Greg Brockman, medeoprichter van OpenAI, en zijn vrouw. Ook andere spelers, zoals Perplexity en investeerders Joe Lonsdale en Ron Conway, doen mee.

Deze beweging weerspiegelt een nieuw niveau van politieke betrokkenheid vanuit de A.I.-industrie, die zich eerder grotendeels afzijdig hield. De super PACs nemen een voorbeeld aan Fairshake, een pro-crypto PAC die met succes kandidaten steunde en gunstige wetgeving wist te beïnvloeden.

Meta benadrukt dat Californische regelgeving de innovatie in gevaar kan brengen en zegt daarom een super PAC te starten. In de staat liggen minstens 55 A.I.-gerelateerde wetsvoorstellen op tafel, het hoogste aantal na New York. Leading the Future zal zich daarnaast richten op andere staten zoals New York, Illinois en Ohio, waar politieke discussies rond A.I. gaande zijn.

Hoewel de bedragen bescheiden zijn vergeleken met de kasreserves van techreuzen, is de potentiële invloed enorm. De betrokkenheid van partijen als Meta, Andreessen Horowitz en Greg Brockman maakt duidelijk dat de strijd om de politieke toekomst van A.I. centraal staat in de aanloop naar de Amerikaanse verkiezingen van 2026.',
5,
(SELECT id FROM topics WHERE slug = 'ai-ml' LIMIT 1),
(SELECT id FROM authors WHERE name = 'Sarah Chen' LIMIT 1),
'f32cb9a8-6c3b-49f5-a87f-97c13a48b04e', false, '2025-08-26T00:00:00Z', NULL, '2025-09-05T10:30:00Z', '2025-09-05T10:30:00Z'),

-- Article 11: Nvidia earnings (with hero image)
('b89c12e1-40ad-4f2a-91f6-6a4eab7ef41d', 'nvidia-omzet-ai-boom', 'published',
'Nvidia''s omzet stijgt met 56% door A.I.-hausse',
'- Nvidia behaalt recordomzet dankzij aanhoudende vraag naar A.I.-chips
- Verwachting: nog eens 54% omzetgroei in het komende kwartaal
- Geopolitieke spanningen rond China blijven een risico voor toekomstige verkopen',
'Nvidia, inmiddels het meest waardevolle beursgenoteerde bedrijf ter wereld, rapporteerde dat de verkoop in het tweede kwartaal van 2025 met 56% steeg tot $46,74 miljard. De winst nam zelfs met 59% toe tot $26,42 miljard. De cijfers stellen beleggers gerust dat de wereldwijde investeringsgolf in A.I.-infrastructuur nog lang niet afneemt.

Voor het huidige kwartaal verwacht Nvidia een omzetgroei van 54% tot $54 miljard. Deze voorspelling sluit aan bij de verwachtingen van Wall Street, maar bevat geen inkomsten uit China. Door Amerikaanse restricties kon Nvidia daar geen chips verkopen, ondanks dat Chinese klanten inmiddels gedeeltelijk toestemming hebben gekregen om Nvidia-producten te kopen. Het bedrijf blijft voorzichtig over de vooruitzichten in deze markt.

De sterke groei wordt vooral gedreven door de populariteit van Nvidia''s nieuwste chip, de Blackwell, die circa 72.000 keer per week wordt geleverd voor ongeveer $30.000 per stuk. Grote technologiebedrijven zoals Meta en Google hebben hun uitgaven aan datacenters met miljarden verhoogd om deze chips te kopen.

Toch liggen er risico''s. De Amerikaanse regering verbood eerder de verkoop van de speciaal voor China ontwikkelde H20-chip, uit vrees dat deze het Chinese A.I.- en militaire ecosysteem zou versterken. Hoewel president Trump in augustus alsnog toestemming gaf voor verkoop, ontmoedigde de Chinese overheid bedrijven om de chip te kopen. Hierdoor rapporteerde Nvidia geen omzet uit China in het afgelopen kwartaal.

CEO Jensen Huang benadrukte tijdens een call met analisten dat de markt voor A.I.-infrastructuur de komende jaren zal uitgroeien tot $3 à $4 biljoen. Hij zei dat China voor Nvidia een markt van zo''n $50 miljard vertegenwoordigt, mits politieke toestemming wordt verkregen. Analisten verwachten dat een goedgekeurde, aangepaste versie van de Blackwell-chip enorme vraag zou genereren, omdat China momenteel geen concurrerend product kan produceren.

Ondanks lichte koersdalingen na publicatie van de cijfers, liet Nvidia met een aandeleninkoopplan van $60 miljard zien vertrouwen te hebben in de toekomst. Het bedrijf blijft de drijvende kracht achter de A.I.-hausse die de wereldeconomie en de financiële markten sterk beïnvloedt.',
7,
(SELECT id FROM topics WHERE slug = 'ai-ml' LIMIT 1),
(SELECT id FROM authors WHERE name = 'Sarah Chen' LIMIT 1),
'b89c12e1-40ad-4f2a-91f6-6a4eab7ef41e', false, '2025-08-27T00:00:00Z', NULL, '2025-09-05T10:15:00Z', '2025-09-05T10:15:00Z');

-- Step 4: Create article views with varying counts to simulate realistic traffic
-- Most viewed article gets 427 views, others get varying amounts
INSERT INTO article_views (article_id, viewed_at, session_id, user_agent) 
-- Article 1: Hisense AI (54 views)
SELECT '7e1c2c0a-bfd6-46da-bf4b-6f78f9b3e7c2', 
       now() - (random() * interval '5 days'), 
       encode(gen_random_bytes(16), 'hex'),
       'Mozilla/5.0 (compatible; NewsBot/1.0)'
FROM generate_series(1, 54)
UNION ALL
-- Article 2: Dead Internet Theory (127 views)  
SELECT '51d5c8eb-8a87-42d6-b405-3f1af5d7acbb', 
       now() - (random() * interval '5 days'), 
       encode(gen_random_bytes(16), 'hex'),
       'Mozilla/5.0 (compatible; NewsBot/1.0)'
FROM generate_series(1, 127)
UNION ALL
-- Article 3: Scale AI (203 views)
SELECT 'b2c97a10-8f78-4c63-9e4a-d8e9c3d70f9e', 
       now() - (random() * interval '5 days'), 
       encode(gen_random_bytes(16), 'hex'),
       'Mozilla/5.0 (compatible; NewsBot/1.0)'
FROM generate_series(1, 203)
UNION ALL
-- Article 4: OpenAI Xcode (88 views)
SELECT '63adf52d-9bc2-4c2f-a56e-01b78c6c6fd2', 
       now() - (random() * interval '5 days'), 
       encode(gen_random_bytes(16), 'hex'),
       'Mozilla/5.0 (compatible; NewsBot/1.0)'
FROM generate_series(1, 88)
UNION ALL
-- Article 5: Apple Siri (310 views)
SELECT 'f61c68d1-0d91-4762-90fc-b5b36d23cb8a', 
       now() - (random() * interval '5 days'), 
       encode(gen_random_bytes(16), 'hex'),
       'Mozilla/5.0 (compatible; NewsBot/1.0)'
FROM generate_series(1, 310)
UNION ALL
-- Article 6: Google Pixel (176 views)
SELECT '9f15a6d0-cc9d-4b0c-b0f4-fc13f5b9c91b', 
       now() - (random() * interval '5 days'), 
       encode(gen_random_bytes(16), 'hex'),
       'Mozilla/5.0 (compatible; NewsBot/1.0)'
FROM generate_series(1, 176)
UNION ALL
-- Article 7: Google ruling analysis (245 views)
SELECT '3f07bb32-08d8-46a2-b28f-8db9a95d9d57', 
       now() - (random() * interval '5 days'), 
       encode(gen_random_bytes(16), 'hex'),
       'Mozilla/5.0 (compatible; NewsBot/1.0)'
FROM generate_series(1, 245)
UNION ALL
-- Article 8: Google monopoly fixes (162 views)
SELECT '8d4b3f5c-5c12-4b8f-9f34-8b20d77b3ae7', 
       now() - (random() * interval '5 days'), 
       encode(gen_random_bytes(16), 'hex'),
       'Mozilla/5.0 (compatible; NewsBot/1.0)'
FROM generate_series(1, 162)
UNION ALL
-- Article 9: Google antitrust (427 views - MOST VIEWED)
SELECT '4e19f8a6-1c1e-4d6c-8b23-2b58942c7a3b', 
       now() - (random() * interval '5 days'), 
       encode(gen_random_bytes(16), 'hex'),
       'Mozilla/5.0 (compatible; NewsBot/1.0)'
FROM generate_series(1, 427)
UNION ALL
-- Article 10: Silicon Valley PACs (93 views)
SELECT 'f32cb9a8-6c3b-49f5-a87f-97c13a48b04d', 
       now() - (random() * interval '5 days'), 
       encode(gen_random_bytes(16), 'hex'),
       'Mozilla/5.0 (compatible; NewsBot/1.0)'
FROM generate_series(1, 93)
UNION ALL
-- Article 11: Nvidia earnings (284 views)
SELECT 'b89c12e1-40ad-4f2a-91f6-6a4eab7ef41d', 
       now() - (random() * interval '5 days'), 
       encode(gen_random_bytes(16), 'hex'),
       'Mozilla/5.0 (compatible; NewsBot/1.0)'
FROM generate_series(1, 284);