import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { RightRailItem } from '../types';

interface RightRailProps {
  netBinnenItems: RightRailItem[];
  meestGelezenItems: RightRailItem[];
}

export function RightRail({
  netBinnenItems,
  meestGelezenItems
}: RightRailProps) {
  const [activeTab, setActiveTab] = useState<'netBinnen' | 'meestGelezen'>('netBinnen');
  const currentItems = activeTab === 'netBinnen' ? netBinnenItems : meestGelezenItems;

  return (
    <aside className="bg-card border border-border rounded-lg overflow-hidden xl:max-h-[calc(100vh-160px)] xl:flex xl:flex-col xl:h-fit">
      {/* Tab Headers */}
      <div className="flex border-b border-border xl:min-h-[44px]" role="tablist">
        <button 
          role="tab" 
          aria-selected={activeTab === 'netBinnen'} 
          className={`flex-1 px-2 xl:py-2.5 py-3 text-xs xl:text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'netBinnen' 
              ? 'border-accent text-accent bg-accent/5' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`} 
          onClick={() => setActiveTab('netBinnen')}
        >
          <span className="whitespace-nowrap">Net binnen</span>
        </button>
        <button 
          role="tab" 
          aria-selected={activeTab === 'meestGelezen'} 
          className={`flex-1 px-2 xl:py-2.5 py-3 text-xs xl:text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'meestGelezen' 
              ? 'border-accent text-accent bg-accent/5' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`} 
          onClick={() => setActiveTab('meestGelezen')}
        >
          <span className="whitespace-nowrap">Meest gelezen</span>
        </button>
      </div>

      {/* Tab Content Container */}
      <div role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="xl:flex xl:flex-col xl:flex-1 xl:min-h-0">
        {/* Scrollable List Area */}
        <div className="xl:flex-1 xl:overflow-y-auto xl:px-3 xl:pt-2 p-4 py-0">
          <ul className="xl:space-y-1.5 space-y-4">
            {currentItems.slice(0, 5).map((item, index) => (
              <li key={index}>
                <a 
                  href={item.url} 
                  className="block hover:bg-hover-bg xl:-mx-1 xl:px-1 xl:py-1.5 -mx-2 px-2 rounded-md transition-colors group py-0"
                >
                  <div>
                    <div className="text-xs text-muted-foreground font-mono mb-0.5">
                      {activeTab === 'meestGelezen' ? `#${index + 1}` : item.time}
                      {item.category && (
                        <span className="ml-1 text-[11px] text-accent font-semibold normal-case not-italic">
                          • {item.category}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium leading-snug group-hover:underline line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                </a>
                {index < 4 && (
                  <hr className="xl:my-2 mt-4 border-border" />
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Fixed CTA at Bottom - Only show for Net binnen */}
        {activeTab === 'netBinnen' && (
          <div className="xl:shrink-0 xl:border-t xl:border-border xl:px-3 xl:py-3 xl:h-[44px] xl:flex xl:items-center mt-6 pt-4 border-t border-border p-4">
            <a href="/net-binnen" className="inline-flex items-center text-sm font-medium text-accent hover:underline">
              Alles weergeven
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </aside>
  );
}