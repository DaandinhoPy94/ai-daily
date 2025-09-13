import { Linkedin, Youtube, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { FacebookIcon } from '@/components/FacebookIcon';
import { XIcon } from '@/components/XIcon';
import { RSSIcon } from '@/components/RSSIcon';
import { Link } from 'react-router-dom';

const topicColumns = [
  {
    title: 'Technologie & Modellen',
    href: '/technologie-modellen',
    items: [
      { title: 'Text-to-Text (LLMs)', href: '/topic/text-to-text-llms' },
      { title: 'Text-to-Image', href: '/topic/text-to-image' },
      { title: 'Text-to-Speech / Speech-to-Text', href: '/topic/text-to-speech-speech-to-text' },
      { title: 'Text-to-Video / 3D', href: '/topic/text-to-video-3d' },
      { title: 'Robotics & Embodied AI', href: '/topic/robotics-embodied-ai' }
    ]
  },
  {
    title: 'Toepassingen',
    href: '/toepassingen',
    items: [
      { title: 'Gezondheidszorg', href: '/topic/gezondheidszorg' },
      { title: 'Financiën & Business', href: '/topic/financien-business' },
      { title: 'Creatieve industrie', href: '/topic/creatieve-industrie' },
      { title: 'Onderwijs & Training', href: '/topic/onderwijs-training' },
      { title: 'Overheid & Publieke sector', href: '/topic/overheid-publieke-sector' }
    ]
  },
  {
    title: 'Onderzoek & Ontwikkeling',
    href: '/onderzoek-ontwikkeling',
    items: [
      { title: 'AI-onderzoekslabs', href: '/topic/ai-onderzoekslabs' },
      { title: 'Academische publicaties', href: '/topic/academische-publicaties' },
      { title: 'Modeldoorbraken', href: '/topic/modeldoorbraken' }
    ],
    secondarySection: {
      title: 'Cultuur & Samenleving',
      href: '/cultuur-samenleving',
      items: [
        { title: 'Publiek debat & cultuur', href: '/topic/publiek-debat-cultuur' }
      ]
    }
  },
  {
    title: 'Bedrijven & Markt',
    href: '/bedrijven-markt',
    items: [
      { title: 'Big Tech', href: '/topic/big-tech' },
      { title: 'Startups & Scale-ups', href: '/topic/startups-scale-ups' },
      { title: 'Chipmakers & Infrastructuur', href: '/topic/chipmakers-infrastructuur' }
    ],
    secondarySection: {
      title: 'Economie & Werk',
      href: '/economie-werk',
      items: [
        { title: 'Arbeidsmarkt & Skills', href: '/topic/arbeidsmarkt-skills' },
        { title: 'Productiviteit & Automatisering', href: '/topic/productiviteit-automatisering' }
      ]
    }
  },
  {
    title: 'Geografie & Politiek',
    href: '/geografie-politiek',
    items: [
      { title: 'Verenigde Staten', href: '/topic/verenigde-staten' },
      { title: 'Europa', href: '/topic/europa' },
      { title: 'Azië', href: '/topic/azie' }
    ],
    secondarySection: {
      title: 'Veiligheid & Regelgeving',
      href: '/veiligheid-regelgeving',
      items: [
        { title: 'AI Safety & Alignment', href: '/topic/ai-safety-alignment' },
        { title: 'Ethiek & Bias', href: '/topic/ethiek-bias' },
        { title: 'Militair & Cyber', href: '/topic/militair-cyber' }
      ]
    }
  },
  {
    title: 'Over AI Dagelijks',
    href: null,
    items: [
      { title: 'Over ons', href: '/over-ons' },
      { title: 'Nieuwsbrief', href: '/nieuwsbrief' },
      { title: 'AI Cursussen', href: '/ai-cursussen' },
      { title: 'AI Jobs', href: '/ai-jobs' },
      { title: 'LM Arena', href: '/lm-arena' }
    ]
  }
];

const socialLinks = [
  { icon: FacebookIcon, label: 'Facebook', href: 'https://www.facebook.com/aidagelijks' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/company/ai-dagelijks' },
  { icon: XIcon, label: 'X', href: 'https://x.com/AI_Dagelijks' },
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/ai.dagelijks' },
  { icon: RSSIcon, label: 'RSS', href: '/rss-feeds' }
];

export function Footer() {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="bg-secondary border-t border-border">
      {/* Footer Top - Topics Navigation (Web only, ≥1024px) */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-10">
          <nav aria-label="Topics">
            <div className="grid grid-cols-6 gap-8">
              {topicColumns.map((column) => (
                <div key={column.title}>
                  {/* Main topic heading */}
                  {column.href ? (
                    <Link
                      to={column.href}
                      className="font-serif font-semibold text-sm mb-4 block hover:text-foreground hover:underline"
                    >
                      {column.title}
                    </Link>
                  ) : (
                    <h3 className="font-serif font-semibold text-sm mb-4 block">{column.title}</h3>
                  )}
                  
                  {/* Main topic items */}
                  <ul className="space-y-2 mb-6">
                    {column.items.map((item) => (
                      <li key={item.title}>
                        <Link
                          to={item.href}
                          className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {/* Secondary section if exists */}
                  {column.secondarySection && (
                    <>
                      <Link
                        to={column.secondarySection.href}
                        className="font-serif font-semibold text-sm mb-4 block hover:text-foreground hover:underline"
                      >
                        {column.secondarySection.title}
                      </Link>
                      <ul className="space-y-2">
                        {column.secondarySection.items.map((item) => (
                          <li key={item.title}>
                            <Link
                              to={item.href}
                              className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Footer Bottom - Social, Theme, Legal */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-muted-foreground hover:text-foreground transition-colors hover:scale-105"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Thema:</span>
              <div className="flex rounded-md border border-border overflow-hidden">
                {(['light', 'dark', 'system'] as const).map((themeOption) => (
                  <Button
                    key={themeOption}
                    variant={theme === themeOption ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-none text-xs px-3 py-1"
                    onClick={() => setTheme(themeOption)}
                  >
                    {themeOption === 'light' ? 'Licht' : 
                     themeOption === 'dark' ? 'Donker' : 'Systeem'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>© 2024 AI Dagelijks</span>
              <a href="#" className="hover:text-foreground hover:underline">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground hover:underline">
                Algemene voorwaarden
              </a>
              <a href="#" className="hover:text-foreground hover:underline">
                Cookie beleid
              </a>
              <span>KvK: 12345678</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}