export interface NavLink { label: string; href: string }
export interface NavProps {
  links?: NavLink[];
  cta?: NavLink;
  logo?: string;
}
export declare function Nav(props: NavProps): JSX.Element;
