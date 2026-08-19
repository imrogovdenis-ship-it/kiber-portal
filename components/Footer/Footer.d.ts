export interface FooterLink { label: string; href: string }
export interface FooterColumn { title: string; links: FooterLink[] }
export interface FooterProps {
  logo?: string;
  phone?: string;
  columns?: FooterColumn[];
}
export declare function Footer(props: FooterProps): JSX.Element;
