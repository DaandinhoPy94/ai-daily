interface SummaryBoxProps {
  summary: string;
}

export function SummaryBox({ summary }: SummaryBoxProps) {
  // Generate 3 bullet points from the summary
  const generateBullets = (text: string) => {
    const sentences = text.split('.').filter(s => s.trim().length > 20);
    return sentences.slice(0, 3).map(s => s.trim() + '.');
  };

  const bullets = generateBullets(summary);

  return (
    <aside 
      className="bg-card border border-border rounded-lg p-4 lg:p-5 mb-6"
      aria-labelledby="summary-heading"
    >
      <h2 id="summary-heading" className="text-sm font-semibold mb-3 uppercase tracking-wide">
        In het kort
      </h2>
      <ul className="space-y-2">
        {bullets.map((bullet, index) => (
          <li key={index} className="flex items-start gap-2 text-sm leading-relaxed">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}