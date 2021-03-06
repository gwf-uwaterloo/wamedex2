export interface BaseArticle {
  id: string;
  abstract: string;
  authors: Array<string>;
  journal: string;
  publish_time: string;
  source: Array<string>;
  title: string;
  url: string;
  coordinates: string;
  purpose: string;
  suppl_info: string;
  topic_category: string;
  keywords: Array<string>;
  recommended_ctiation: string;
  theasurus_name: string;
}


export interface SearchArticle extends BaseArticle {
  highlights: Array<Array<[number, number]>>;
  highlighted_abstract: boolean;
  paragraphs: Array<string>;
  score: number;
  has_related_articles: boolean;
}

export interface RelatedArticle extends BaseArticle {
  distance: number;
}

export interface SearchFilters {
  yearMinMax: number[];
  authors: string[];
  journals: string[];
  sources: string[];
}

export interface SelectedSearchFilters {
  yearRange: number[];
  authors: Set<string>;
  journals: Set<string>;
  sources: Set<string>;
}
