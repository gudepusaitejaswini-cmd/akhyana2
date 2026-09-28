export type AajCategory =
  | 'Battles'
  | 'Movements'
  | 'Reforms & Laws'
  | 'Political History'
  | 'Culture & Heritage'
  | 'Discoveries'
  | 'Historical Figures'
  | 'Treaties & Agreements'
  | 'Archaeology'
  | 'Other';

export interface ApprovedSource {
  id: string;
  name: string;
  organization: string;
  url: string;
  type: 'government' | 'academic' | 'museum' | 'archive' | 'curated';
  description?: string;
}

export interface AajKaAkhyanaEvent {
  id: string;
  /** Format: MM-DD, e.g. '09-28' */
  date: string;
  /** Display label for the date, e.g. '28 September' */
  displayDate: string;
  year: number;
  title: string;
  category: AajCategory;
  shortDescription: string;
  significance: string;
  fullExplanation?: string;
  location?: string;
  people?: string[];
  sourceId: string;
  sourceName: string;
  sourceUrl?: string;
  sourceCitation?: string;
  /** Internal Akhyana route if an exhibit or article exists */
  akhyanaExhibitRoute?: string;
  tags?: string[];
}
