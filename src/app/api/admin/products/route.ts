import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllProducts, saveProducts } from '@/lib/data';
import { withAdminAuth } from '@/lib/api-auth';
import { ProductSchema } from '@/lib/validations/product';
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
  
  // Zod验证
  const result = ProductSchema.safeParse(body);
  if (!result.success) {
    const errorMessage = result.error.issues[0]?.message || '数据验证失败';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
  
  const products = await getAllProducts();

  const newProduct: Product = {
    id: Date.now().toString(),
    title: result.data.title,
    tagline: result.data.tagline || '',
    category: result.data.category || '',
    description: result.data.description || '',
    features: result.data.features || [],
    imageUrl: result.data.imageUrl || '',
    imageAlt: result.data.imageAlt || '',
    order: products.length + 1,
    showInHome: result.data.showInHome ?? true,
    showInNavbar: result.data.showInNavbar ?? true,
    layout: result.data.layout || 'text-left',
  };

  await saveProducts([...products, newProduct]);
  revalidatePath('/');
  return NextResponse.json(newProduct, { status: 201 });
});
