import fs from 'fs/promises';
import path from 'path';
import type { SiteConfig, HeroData, AboutData, AboutPageData, Product, Case, OPCData } from '@/types';

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
  const products = await getAllProducts();
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

// ── OPC创业孵化服务 ──────────────────────────────────────────────────
const defaultOpcData: OPCData = {
  sectionTitle: 'OPC创业孵化服务：让AI创业梦想照进现实',
  sectionDescription: '我们为AI创业者提供从空间、算力、导师到商业化的全链路孵化支持，让每一个AI创业梦想都能在这里扎根成长。',
  platformTitle: '孵化平台',
  platformDescription: '我们搭建了专业的AI创业孵化OPC中心，为怀揣AI梦想的创业者提供一个低成本、高赋能的成长环境，助力初创团队轻装上阵，专注于核心技术与商业模式打磨。',
  cards: [
    { title: '免费技能培训', description: '入驻者可免费参加全栈AI技术与商业化技能培训，快速补齐短板。' },
    { title: '零成本办公', description: '通过评估筛选的优质团队，享受工位、水电及物业费全额减免政策。' },
    { title: '一对一专项辅导', description: '配备经验丰富的创业导师，提供从技术路线到商业变现的全流程指导。' },
    { title: '低成本算力支持', description: '提供极具市场竞争力的高性能AI算力支持方案，大幅降低模型训练成本。' },
  ],
  imageUrl: '/uploads/general/1784015085084-5j5pkemeu6m.jpeg',
  imageAlt: '国智产业城 OPC创业孵化基地',
  bannerHighlight: '核心价值：',
  bannerText: '全方位助力AI项目从0到1落地生根，\n降低门槛与风险',
};

export async function getOpcData(): Promise<OPCData> {
  try {
    return await readJson<OPCData>('opc.json');
  } catch {
    return defaultOpcData;
  }
}

export async function saveOpcData(opc: OPCData): Promise<void> {
  await writeJson('opc.json', opc);
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

// ── 咨询管理（通用立即咨询）──────────────────────────────────────────

export async function getConsultationFormTemplate(): Promise<ContactFormTemplate> {
  return readJson<ContactFormTemplate>('consultation_form.json');
}

export async function saveConsultationFormTemplate(template: ContactFormTemplate): Promise<void> {
  await writeJson('consultation_form.json', template);
}

export async function getConsultationSubmissions(): Promise<ContactSubmission[]> {
  return readJson<ContactSubmission[]>('consultation_submissions.json');
}

export async function saveConsultationSubmissions(submissions: ContactSubmission[]): Promise<void> {
  await writeJson('consultation_submissions.json', submissions);
}
