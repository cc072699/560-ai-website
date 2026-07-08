import { getSiteConfig, getProducts } from '@/lib/data';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default async function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [site, products] = await Promise.all([getSiteConfig(), getProducts()]);

  return (
    <>
      <Navbar site={site} products={products} />
      {children}
      <Footer site={site} />
    </>
  );
}
