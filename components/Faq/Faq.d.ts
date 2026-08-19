export interface FaqItem { q: string; a: string }
export interface FaqProps {
  title?: string;
  items?: FaqItem[];
}
export declare function Faq(props: FaqProps): JSX.Element;
