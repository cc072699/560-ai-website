import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllProducts, saveProducts } from '@/lib/data';
import { withAdminAuth } from '@/lib/api-auth';
import type { Product } from '@/types';
import type { NextRequest } from 'next/server';

// GET /api/admin/products - 获取所有产品（含隐藏）
export const GET = withAdminAuth(async () => {
  const products = await getAllProducts();
  return NextResponse.json(products);
});

// POST /api/admin/products - 新增产品
export const POST = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json();
  const products = await getAllProducts();

  const newProduct: Product = {
    id: Date.now().toString(),
    title: body.title || '新产品',
    tagline: body.tagline || '',
    category: body.category || '',
    description: body.description || '',
    features: body.features || [],
    imageUrl: body.imageUrl || '',
    imageAlt: body.imageAlt || '',
    order: products.length + 1,
    showInHome: body.showInHome ?? true,
    showInNavbar: body.showInNavbar ?? true,
    layout: body.layout || 'text-left',
  };

  await saveProducts([...products, newProduct]);
  revalidatePath('/');
  return NextResponse.json(newProduct, { status: 201 });
});
