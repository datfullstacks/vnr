export type ParagraphSection = {
  type: "paragraphs";
  heading: string;
  items: string[];
};

export type QuoteSection = {
  type: "quote";
  quote: string;
  author: string;
};

export type RoleCardItem = {
  title: string;
  description: string;
};

export type RoleCardsSection = {
  type: "roleCards";
  heading: string;
  items: RoleCardItem[];
};

export type EvidenceImage = {
  caption: string;
  alt: string;
  src?: string;
};

export type EvidenceSection = {
  type: "evidence";
  heading: string;
  label: "LICH SU" | "HIEN DAI" | "THUC TIEN";
  text: string;
  images: EvidenceImage[];
};

export type CarouselItem = {
  title: string;
  detail: string;
};

export type CarouselSection = {
  type: "carousel";
  heading: string;
  items: CarouselItem[];
};

export type TopicSection =
  | ParagraphSection
  | QuoteSection
  | RoleCardsSection
  | EvidenceSection
  | CarouselSection;

export type TopicPageData = {
  slug: string;
  title: string;
  lead: string;
  sections: TopicSection[];
};

export type ReferenceGroup = {
  title: string;
  items: {
    label: string;
    href: string;
  }[];
};

export type ReferenceData = {
  title: string;
  description: string;
  groups: ReferenceGroup[];
};

export type AiToolCard = {
  name: string;
  role: string;
  usage: string;
  verification: string;
};

export type TimelineStep = {
  step: string;
  title: string;
  description: string;
};

export type AiUsageData = {
  title: string;
  description: string;
  tools: AiToolCard[];
  timeline: TimelineStep[];
};