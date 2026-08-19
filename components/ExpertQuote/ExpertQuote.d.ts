export interface ExpertQuoteProps {
  /** First-person recommendation. 2–4 sentences — longer reads as marketing copy. */
  text: string;
  name?: string;
  role?: string;
  avatar?: string;
}
export declare function ExpertQuote(props: ExpertQuoteProps): JSX.Element;
