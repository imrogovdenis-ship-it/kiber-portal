export interface LeadFormProps {
  title?: string;
  text?: string;
  submitLabel?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  /** Ink background instead of tint. Use once per page at most. */
  dark?: boolean;
}
export declare function LeadForm(props: LeadFormProps): JSX.Element;
