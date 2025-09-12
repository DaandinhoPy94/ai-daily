import { Ticker, NewsArticle, RightRailItem, TopicSection } from '../types';
import heroDatacenter from '../assets/hero-ai-datacenter.jpg';
import heroTeam from '../assets/hero-ai-team.jpg';
import neuralNetwork from '../assets/ai-neural-network.jpg';
import robotInterface from '../assets/ai-robot-interface.jpg';
import chipMacro from '../assets/ai-chip-macro.jpg';
import controlRoom from '../assets/ai-control-room.jpg';

export const tickers: Ticker[] = [
  { symbol: "AEX", value: "896.62", delta: "-0.76%", isDown: true },
  { symbol: "AMX", value: "921.47", delta: "-1.01%", isDown: true },
  { symbol: "BTC", value: "108,658", delta: "-3.03%", isDown: true },
  { symbol: "S&P FUT", value: "6,474.00", delta: "-0.69%", isDown: true },
  { symbol: "EUR/USD", value: "1.1686", delta: "+0.05%", isUp: true },
  { symbol: "OIL", value: "67.45", delta: "-0.74%", isDown: true }
];

export const heroArticles: NewsArticle[] = [
  {
    id: "1",
    imageUrl: heroDatacenter,
    readTimeMinutes: 9,
    category: "Reportage",
    title: "OpenAI lanceert revolutionaire AGI-architectuur: 'Dit verandert alles voor de AI-industrie'",
    summary: "Na maanden van speculatie onthult OpenAI eindelijk hun doorbraak in kunstmatige algemene intelligentie. De nieuwe architectuur combineert multimodale capaciteiten met ongekende redeneervermogens."
  },
  {
    id: "2",
    imageUrl: heroTeam,
    readTimeMinutes: 6,
    category: "Analyse",
    title: "De AI-race tussen big tech en startups: wie wint uiteindelijk?",
    summary: "Terwijl grote techbedrijven miljarden investeren in AI, vechten kleine spelers terug met innovatieve benaderingen. Een analyse van de huidige krachtsverhoudingen."
  }
];

export const gridArticles: NewsArticle[] = [
  {
    id: "3",
    imageUrl: neuralNetwork,
    readTimeMinutes: 5,
    category: "Wetgeving",
    title: "EU AI Act treedt vandaag officieel in werking",
    summary: "Bedrijven krijgen twee jaar om te voldoen aan de nieuwe regelgeving."
  },
  {
    id: "4",
    imageUrl: robotInterface,
    readTimeMinutes: 3,
    category: "Startup",
    title: "Nederlandse AI-startup haalt €50M op voor medische diagnostiek",
    summary: "Het Amsterdamse bedrijf ontwikkelt AI voor vroege kankerdetectie."
  },
  {
    id: "5",
    imageUrl: chipMacro,
    readTimeMinutes: 7,
    category: "Onderzoek",
    title: "MIT-onderzoekers doorbreken barrière in quantumcomputing voor AI",
    summary: "Nieuwe algoritmes kunnen AI-training 1000x sneller maken."
  },
  {
    id: "6",
    imageUrl: controlRoom,
    readTimeMinutes: 4,
    category: "Privacy",
    title: "Apple kondigt on-device AI aan zonder cloudverwerking",
    summary: "Privacyvriendelijke AI-features komen naar alle Apple-apparaten."
  },
  {
    id: "7",
    imageUrl: neuralNetwork,
    readTimeMinutes: 8,
    category: "Ethiek",
    title: "AI-experts waarschuwen voor nieuwe deepfake-technologie",
    summary: "De technologie wordt zo geavanceerd dat detectie bijna onmogelijk wordt."
  },
  {
    id: "8",
    imageUrl: heroDatacenter,
    readTimeMinutes: 6,
    category: "Business",
    title: "Microsoft investeert $10 miljard extra in AI-infrastructuur",
    summary: "De investering is gericht op nieuwe datacenters en GPU-capaciteit."
  }
];

export const netBinnenItems: RightRailItem[] = [
  {
    time: "10:24",
    category: "Binnenland",
    title: "Nederlandse regering kondigt nationaal AI-beleid aan",
    url: "#"
  },
  {
    time: "07:00",
    category: "Leveringsreacties",
    title: "NVIDIA maakt Q4-resultaten bekend: AI-chip verkoop stijgt 400%",
    url: "#"
  },
  {
    time: "05:00",
    category: "Podcast",
    title: "Interview met DeepMind CEO over de toekomst van AGI",
    url: "#"
  },
  {
    time: "04:00",
    category: "Personalia",
    title: "Voormalig Tesla AI-directeur start nieuwe robotica startup",
    url: "#"
  },
  {
    time: "00:30",
    category: "Analyse",
    title: "ChatGPT-gebruik daalt voor het eerst sinds lancering",
    url: "#"
  }
];

export const meestGelezenItems: RightRailItem[] = [
  {
    time: "1.",
    title: "Waarom Elon Musk zijn AI-plannen geheim houdt",
    url: "#"
  },
  {
    time: "2.",
    title: "De verborgen kosten van AI: energieverbruik explodeert",
    url: "#"
  },
  {
    time: "3.",
    title: "Google Gemini vs ChatGPT: welke AI wint de strijd?",
    url: "#"
  },
  {
    time: "4.",
    title: "Nederlandse universiteiten banneren AI-detectiesoftware",
    url: "#"
  },
  {
    time: "5.",
    title: "Hoe AI de arbeidsmarkt de komende 5 jaar zal veranderen",
    url: "#"
  }
];

export const topicSections: TopicSection[] = [
  {
    heading: "AI Startups",
    articles: [
      {
        id: "9",
        imageUrl: robotInterface,
        readTimeMinutes: 5,
        category: "Startup",
        title: "Anthropic haalt $4 miljard op van Amazon",
        summary: "De AI-safety startup bereikt recordwaardering van $18 miljard."
      },
      {
        id: "10",
        imageUrl: chipMacro,
        readTimeMinutes: 4,
        category: "Startup",
        title: "Perplexity AI wordt uitgedaagd door Google in rechtszaak",
        summary: "Google beschuldigt de AI-zoekmachine van copyright-inbreuk."
      },
      {
        id: "11",
        imageUrl: neuralNetwork,
        readTimeMinutes: 6,
        category: "Startup",
        title: "Hugging Face lanceert open-source alternatief voor ChatGPT",
        summary: "Het Franse bedrijf wil AI democratiseren met gratis toegang."
      },
      {
        id: "12",
        imageUrl: controlRoom,
        readTimeMinutes: 3,
        category: "Startup",
        title: "Stability AI krijgt nieuwe CEO na turbulente periode",
        summary: "De maker van Stable Diffusion zoekt nieuwe richting."
      }
    ]
  },
  {
    heading: "Model Releases",
    articles: [
      {
        id: "13",
        imageUrl: heroDatacenter,
        readTimeMinutes: 7,
        category: "Research",
        title: "Meta lanceert Llama 3: claims beter dan GPT-4",
        summary: "Het nieuwe open-source model presteert beter op benchmarks."
      },
      {
        id: "14",
        imageUrl: heroTeam,
        readTimeMinutes: 5,
        category: "Research",
        title: "OpenAI kondigt GPT-5 aan voor begin 2025",
        summary: "Het model zou 100x krachtiger zijn dan de huidige versie."
      },
      {
        id: "15",
        imageUrl: neuralNetwork,
        readTimeMinutes: 4,
        category: "Research",
        title: "Google Gemini krijgt nieuwe videoverwerkingscapaciteiten",
        summary: "AI kan nu uur-lange video's analyseren en samenvatten."
      },
      {
        id: "16",
        imageUrl: robotInterface,
        readTimeMinutes: 6,
        category: "Research",
        title: "Anthropic's Claude krijgt computervisiefuncties",
        summary: "De AI-assistent kan nu screenshots en afbeeldingen begrijpen."
      }
    ]
  },
  {
    heading: "Policy & Regulation",
    articles: [
      {
        id: "17",
        imageUrl: controlRoom,
        readTimeMinutes: 8,
        category: "Beleid",
        title: "Biden ondertekent executive order voor AI-veiligheid",
        summary: "Nieuwe regels voor AI-testing en transparantie in de VS."
      },
      {
        id: "18",
        imageUrl: chipMacro,
        readTimeMinutes: 5,
        category: "Beleid",
        title: "China verscherpt controle op AI-modellen voor consumenten",
        summary: "Nieuwe licentievereisten voor AI-services in China."
      },
      {
        id: "19",
        imageUrl: neuralNetwork,
        readTimeMinutes: 6,
        category: "Beleid",
        title: "VK lanceert AI Safety Institute met £100M budget",
        summary: "Onderzoeksinstituut moet risico's van superintelligentie monitoren."
      },
      {
        id: "20",
        imageUrl: robotInterface,
        readTimeMinutes: 4,
        category: "Beleid",
        title: "UNESCO publiceert ethische richtlijnen voor AI in onderwijs",
        summary: "Internationale standaarden voor verantwoord AI-gebruik."
      }
    ]
  },
  {
    heading: "Industry Analysis",
    articles: [
      {
        id: "21",
        imageUrl: chipMacro,
        readTimeMinutes: 9,
        category: "Analyse",
        title: "De AI-chip oorlog: NVIDIA vs de concurrentie",
        summary: "Hoe nieuwe spelers proberen NVIDIA's dominantie te doorbreken."
      },
      {
        id: "22",
        imageUrl: heroTeam,
        readTimeMinutes: 7,
        category: "Analyse",
        title: "AI in de gezondheidszorg: hype of revolutie?",
        summary: "Onderzoek naar daadwerkelijke impact van AI in medische sector."
      },
      {
        id: "23",
        imageUrl: controlRoom,
        readTimeMinutes: 5,
        category: "Analyse",
        title: "Waarom AI-bedrijven worstelen met winstgevendheid",
        summary: "Hoge kosten en concurrentie drukken marges in AI-sector."
      },
      {
        id: "24",
        imageUrl: neuralNetwork,
        readTimeMinutes: 6,
        category: "Analyse",
        title: "De toekomst van werk in het AI-tijdperk",
        summary: "Welke banen verdwijnen en welke nieuwe ontstaan door AI."
      }
    ]
  }
];