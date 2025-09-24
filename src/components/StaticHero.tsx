import srcset from "@/assets/images/hero.jpg?w=400;800;1600&format=webp;png&as=srcset";

export default function StaticHero() {
  return (
    <img
      srcSet={srcset}
      sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1600px"
      alt="Hero"
      loading="lazy"
    />
  );
}
