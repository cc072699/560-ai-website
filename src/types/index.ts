// ====================================================
// 所有数据类型定义
// ====================================================

// ── OPC创业孵化服务 ──────────────────────────────────────────
export interface OPCCard {
  title: string;
  description: string;
}

export interface OPCData {
  sectionTitle: string;
  sectionDescription: string;
  platformTitle: string;
  platformDescription: string;
  cards: [OPCCard, OPCCard, OPCCard, OPCCard];
  imageUrl: string;
  imageAlt: string;
  bannerHighlight: string;
  bannerText: string;
}

export interface SiteContact {
  phone: string;
  email: string;
  address: string;
}

export interface SiteSocial {
  wechat: string;
  weibo: string;
  linkedin: string;
}

export interface NavItem {
  name: string;
  href: string;
}

export interface SiteConfig {
  companyName: string;
  companyNameEn: string;
  companyFullName: string;
  copyright: string;
  icp: string;
  contact: SiteContact;
  social: SiteSocial;
  nav: NavItem[];
  wechatQrUrl?: string;
  douyinQrUrl?: string;
}

export interface HeroData {
  headline: string;
  headlineHighlight: string;
  description: string;
}

export interface AboutData {
  title: string;
  description: string;
  tagline: string;
  imageUrl: string;
  imageAlt: string;
  ctaText: string;
  ctaHref: string;
}

export type ProductLayout = 'text-left' | 'text-right';

export type SectionType =
  | 'hero'
  | 'capabilities'
  | 'scenarios'
  | 'architecture'
  | 'cta'
  | 'video'
  | 'timeline'
  | 'features'
  | 'faq'
  | 'comparison'
  | 'testimonials'
  | 'metrics'
  | 'canvas'
  | 'richText'
  | 'partners'
  | 'carousel'
  | 'downloads'
  | 'certificates'
  | 'coverage'
  | 'consultation'
  | 'multiDevice'
  | 'hardwareSpec'
  | 'techStack'
  | 'sandbox'
  | 'signalWave'
  | 'bentoGrid'
  | 'caseOverview'
  | 'caseChallenges'
  | 'caseScenes'
  | 'caseMetrics'
  | 'caseTestimonial'
  | 'caseComparison'
  | 'caseStructure'
  | 'caseFaq';

export interface PageSection {
  id: string;
  type: SectionType;
  hero?: {
    title: string;
    subtitle?: string;
    bgType: 'image' | 'video';
    bgUrl: string;
  };
  capabilities?: Array<{
    title: string;
    description: string;
    imageUrl: string;
  }>;
  scenarios?: {
    title: string;
    items: Array<{
      title: string;
      imageUrl: string;
      description?: string;
    }>;
  };
  architecture?: {
    title: string;
    imageUrl: string;
    description?: string;
  };
  cta?: {
    title: string;
    description: string;
    primaryText: string;
    secondaryText: string;
  };
  video?: {
    title: string;
    subtitle?: string;
    videoUrl: string;
    coverUrl?: string;
  };
  timeline?: {
    title: string;
    subtitle?: string;
    steps: Array<{
      title: string;
      description: string;
      duration?: string;
    }>;
  };
  features?: {
    title: string;
    subtitle?: string;
    items: Array<{
      title: string;
      description: string;
      highlightText?: string;
    }>;
  };
  faq?: {
    title: string;
    subtitle?: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  comparison?: {
    title: string;
    subtitle?: string;
    headers: string[];
    rows: Array<{
      label: string;
      values: string[];
      highlightIndex?: number;
    }>;
  };
  testimonials?: {
    title: string;
    subtitle?: string;
    items: Array<{
      quote: string;
      author: string;
      role: string;
      company: string;
      logoUrl?: string;
      avatarUrl?: string;
    }>;
  };
  metrics?: {
    title: string;
    subtitle?: string;
    items: Array<{
      value: string;
      label: string;
      description?: string;
    }>;
  };
  canvas?: {
    title: string;
    subtitle?: string;
    imageUrl: string;
    imageAlt?: string;
    description?: string;
    features: Array<{
      title: string;
      description: string;
    }>;
  };
  richText?: {
    title: string;
    subtitle?: string;
    content: string;
    align?: 'left' | 'center';
    imageUrl?: string;
    imagePosition?: 'left' | 'right';
  };
  partners?: {
    title: string;
    subtitle?: string;
    items: Array<{
      name: string;
      logoUrl: string;
    }>;
  };
  carousel?: {
    title: string;
    subtitle?: string;
    items: Array<{
      imageUrl: string;
      caption?: string;
      description?: string;
    }>;
  };
  downloads?: {
    title: string;
    subtitle?: string;
    items: Array<{
      title: string;
      fileSize?: string;
      fileUrl: string;
      fileType?: string;
    }>;
  };
  certificates?: {
    title: string;
    subtitle?: string;
    items: Array<{
      name: string;
      imageUrl: string;
      issuingBody?: string;
      date?: string;
    }>;
  };
  coverage?: {
    title: string;
    subtitle?: string;
    items: Array<{
      region: string;
      address?: string;
      phone?: string;
      email?: string;
    }>;
  };
  consultation?: {
    title: string;
    subtitle?: string;
    ctaText: string;
    benefits: string[];
  };
  multiDevice?: {
    title: string;
    subtitle?: string;
    desktopUrl: string;
    tabletUrl: string;
    mobileUrl: string;
    features: Array<{ title: string; desc: string }>;
  };
  hardwareSpec?: {
    title: string;
    subtitle?: string;
    imageUrl: string;
    annotations: Array<{
      x: number;
      y: number;
      title: string;
      desc: string;
    }>;
  };
  techStack?: {
    title: string;
    subtitle?: string;
    items: Array<{
      name: string;
      logoUrl: string;
      status: string;
      version?: string;
    }>;
  };
  sandbox?: {
    title: string;
    subtitle?: string;
    tabs: Array<{
      label: string;
      language: string;
      code: string;
      description: string;
    }>;
  };
  signalWave?: {
    title: string;
    subtitle?: string;
    leftLabel: string;
    rightLabel: string;
    description: string;
    leftValue: string;
    rightValue: string;
  };
  bentoGrid?: {
    title: string;
    subtitle?: string;
    items: Array<{
      size: 'small' | 'large' | 'tall';
      title: string;
      subtitle?: string;
      imageUrl?: string;
      colorBg?: string;
    }>;
  };
  caseOverview?: {
    title: string;
    subtitle?: string;
    clientName: string;
    industry: string;
    location?: string;
    date?: string;
    scale?: string;
    summary: string;
  };
  caseChallenges?: {
    title: string;
    subtitle?: string;
    challenges: Array<{
      index: string;
      title: string;
      description: string;
      footerText?: string;
    }>;
  };
  caseScenes?: {
    title: string;
    subtitle?: string;
    scenes: Array<{
      id: string;
      tabName: string;
      painPointTitle: string;
      painPointDesc: string;
      solutionTitle: string;
      solutionItems: string[];
      metricsTitle?: string;
      metrics: Array<{
        value: string;
        label: string;
      }>;
    }>;
  };
  caseMetrics?: {
    title: string;
    subtitle?: string;
    items: Array<{
      value: string;
      label: string;
      description?: string;
      highlight?: boolean;
    }>;
  };
  caseTestimonial?: {
    title: string;
    subtitle?: string;
    quote: string;
    author: string;
    role: string;
    company: string;
  };
  caseComparison?: {
    title: string;
    subtitle?: string;
    beforeTitle: string;
    afterTitle: string;
    items: Array<{
      label: string;
      beforeValue: string;
      afterValue: string;
      highlight?: boolean;
    }>;
  };
  caseStructure?: {
    title: string;
    subtitle?: string;
    steps: Array<{
      stepNumber: string;
      title: string;
      description: string;
      duration?: string;
    }>;
  };
  caseFaq?: {
    title: string;
    subtitle?: string;
    faqs: Array<{
      question: string;
      answer: string;
      tag?: string;
    }>;
  };
}

export interface Product {
  id: string;
  title: string;
  tagline: string;
  category: string;
  description: string;
  features: string[];
  imageUrl: string;
  imageAlt: string;
  order: number;
  showInHome: boolean;
  showInNavbar: boolean;
  layout: ProductLayout;
  detailSections?: PageSection[];
}

export interface Case {
  id: string;
  industry: string;
  title: string;
  client: string;
  description: string;
  stat: string;
  statLabel: string;
  deliverables: string[];
  imageUrl: string;
  imageAlt: string;
  order: number;
  visible: boolean;
  showInHome?: boolean;
  homeDescription?: string;
  detailSections?: PageSection[];
}

export interface AboutSlide {
  category: string;
  title: string;
  description: string;
  image: string;
}

export interface PhilosophyItem {
  title: string;
  description: string;
  image: string;
}

export interface CultureTimelineItem {
  tag: string;
  title: string;
  description: string;
  image: string;
  node: string;
}

export interface AboutPageData {
  hero: {
    title: string;
    description: string;
    imageUrl: string;
  };
  slides: AboutSlide[];
  philosophy: {
    title: string;
    left: PhilosophyItem;
    right: PhilosophyItem;
  };
  culture: {
    title: string;
    subtitle: string;
    description: string;
    heading: string;
    timeline: CultureTimelineItem[];
  };
}

// ── 申请表单 ────────────────────────────────────────────────
export type ContactFieldType = 'text' | 'email' | 'phone' | 'textarea' | 'select';

export interface ContactFormField {
  id: string;
  type: ContactFieldType;
  label: string;
  placeholder: string;
  required: boolean;
  maxLength?: number;
  options?: string[];
  defaultValue?: string;
  order: number;
}

export interface ContactFormTemplate {
  title: string;
  description?: string;
  submitText: string;
  successTitle?: string;
  successMessage?: string;
  fields: ContactFormField[];
  updatedAt?: string;
}

export type SubmissionStatus = 'new' | 'read' | 'replied' | 'archived';

export interface ContactSubmission {
  id: string;
  submittedAt: string;
  productId?: string;
  productName?: string;
  data: Record<string, string>;
  status: SubmissionStatus;
  ip?: string;
  userAgent?: string;
}
