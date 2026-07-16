import { getCases } from '@/lib/data';
import CasesClient from './CasesClient';

export const revalidate = 30;

export default async function CasesPage() {
  const cases = await getCases();

  return <CasesClient initialCases={cases} />;
}

