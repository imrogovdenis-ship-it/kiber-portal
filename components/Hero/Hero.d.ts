export interface HeroAction { label: string; href: string }
export interface HeroProps {
  eyebrow?: string;
  title?: string;
  text?: string;
  /** Full-bleed background photo. Always paired with the ink scrim. */
  image?: string;
  primary?: HeroAction | null;
  secondary?: HeroAction | null;
  /** Default '50vh'. Use '100vh' only on the site's front page. */
  height?: string;
}
export declare function Hero(props: HeroProps): JSX.Element;
