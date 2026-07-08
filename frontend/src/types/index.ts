// ====================================================
// 所有数据类型定义
// ====================================================

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

export type SectionType = 'hero' | 'capabilities' | 'scenarios' | 'architecture' | 'cta' | 'video';

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
}
