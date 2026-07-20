import type { Metadata } from 'next';
import { getCases, getSiteConfig } from '@/lib/data';
import CasesClient from './CasesClient';

export const revalidate = 30;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    title: `客户案例 — ${site.companyName}`,
    description: `${site.companyName}深入智慧物业、智慧农业、智慧政务、智能制造等多个行业，与标杆客户联合取得突破性成效。查看真实落地案例。`,
  };
}

export default async function CasesPage() {
  const cases = await getCases();

  return <CasesClient initialCases={cases} />;
}

