import fs from 'fs/promises';
import path from 'path';
import type { SiteConfig, HeroData, AboutData, AboutPageData, Product, Case } from '@/types';

const dataDir = path.join(process.cwd(), 'data');

async function readJson<T>(filename: string): Promise<T> {
  const filePath = path.join(dataDir, filename);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (error) {
    // 文件不存在或JSON格式错误时抛出明确错误
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`数据文件不存在: ${filename}`);
    }
    throw new Error(`数据文件读取失败: ${filename}`);
  }
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(dataDir, filename);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw new Error(`数据文件写入失败: ${filename}`);
  }
}

// ── 读取函数 ──────────────────────────────────────────

export async function getSiteConfig(): Promise<SiteConfig> {
  return readJson<SiteConfig>('site.json');
}

export async function getHeroData(): Promise<HeroData> {
  return readJson<HeroData>('hero.json');
}

export async function getAboutData(): Promise<AboutData> {
  return readJson<AboutData>('about.json');
}

export async function getAboutPageData(): Promise<AboutPageData> {
  return readJson<AboutPageData>('about_page.json');
}

export async function getProducts(): Promise<Product[]> {
  const products = await readJson<Product[]>('products.json');
  return products
    .filter((p) => p.showInHome || p.showInNavbar)
    .sort((a, b) => a.order - b.order);
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}

export async function getAllProducts(): Promise<Product[]> {
  const products = await readJson<Product[]>('products.json');
  return products.sort((a, b) => a.order - b.order);
}

export async function getCases(): Promise<Case[]> {
  const cases = await readJson<Case[]>('cases.json');
  return cases
    .filter((c) => c.visible)
    .sort((a, b) => a.order - b.order);
}

export async function getAllCases(): Promise<Case[]> {
  const cases = await readJson<Case[]>('cases.json');
  return cases.sort((a, b) => a.order - b.order);
}

// ── 写入函数（供 API Routes 使用）────────────────────

export async function saveProducts(products: Product[]): Promise<void> {
  await writeJson('products.json', products);
}

export async function saveCases(cases: Case[]): Promise<void> {
  await writeJson('cases.json', cases);
}

export async function saveSiteConfig(config: SiteConfig): Promise<void> {
  await writeJson('site.json', config);
}

export async function saveAboutData(about: AboutData): Promise<void> {
  await writeJson('about.json', about);
}

export async function saveAboutPageData(aboutPage: AboutPageData): Promise<void> {
  await writeJson('about_page.json', aboutPage);
}

export async function saveHeroData(hero: HeroData): Promise<void> {
  await writeJson('hero.json', hero);
}

// ── 申请表单模板 ──────────────────────────────────────────
import type { ContactFormTemplate, ContactSubmission } from '@/types';

export async function getContactFormTemplate(): Promise<ContactFormTemplate> {
  return readJson<ContactFormTemplate>('contact_form.json');
}

export async function saveContactFormTemplate(template: ContactFormTemplate): Promise<void> {
  await writeJson('contact_form.json', template);
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  return readJson<ContactSubmission[]>('contact_submissions.json');
}

export async function saveContactSubmissions(submissions: ContactSubmission[]): Promise<void> {
  await writeJson('contact_submissions.json', submissions);
}
