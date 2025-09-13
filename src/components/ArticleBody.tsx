interface ArticleBodyProps {
  content: string;
}

export function ArticleBody({ content }: ArticleBodyProps) {
  return (
      <div 
        className="font-serif prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:text-foreground prose-p:font-serif prose-p:leading-relaxed prose-p:mb-4 prose-a:text-primary prose-a:underline-offset-4 hover:prose-a:underline prose-strong:text-foreground prose-em:text-foreground first:prose-p:first-letter:text-5xl first:prose-p:first-letter:font-serif first:prose-p:first-letter:font-bold first:prose-p:first-letter:float-left first:prose-p:first-letter:mr-2 first:prose-p:first-letter:mt-1"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}