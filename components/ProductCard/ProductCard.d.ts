export interface ProductCardProps {
  image?: string;
  title: string;
  text?: string;
  /** Rendered in brand blue, e.g. 'от 45 000 руб.' */
  price?: string;
  tag?: string;
  href?: string;
  variant?: 'outline' | 'tint' | 'dark';
}
export declare function ProductCard(props: ProductCardProps): JSX.Element;

export interface ProductGridProps {
  children?: React.ReactNode;
  /** 3 on desktop, 2 on tablet, 1 on mobile. */
  columns?: number;
}
export declare function ProductGrid(props: ProductGridProps): JSX.Element;
