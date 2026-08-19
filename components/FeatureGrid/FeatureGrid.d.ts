export interface Feature { icon?: React.ReactNode; title: string; text: string }
export interface Stat { value: string; label: string }
export interface FeatureGridProps {
  title?: string;
  features?: Feature[];
  stats?: Stat[];
  /** Tinted section background (#F4F8FF). Default true. */
  tint?: boolean;
}
export declare function FeatureGrid(props: FeatureGridProps): JSX.Element;
