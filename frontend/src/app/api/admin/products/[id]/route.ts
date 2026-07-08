import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllProducts, saveProducts } from '@/lib/data';
import { withAdminAuth } from '@/lib/api-auth';
import type { NextRequest } from 'next/server';

type RouteParams = { params: Promise<{ id: string }> };

// PUT /api/admin/products/[id] - 更新产品
export const PUT = withAdminAuth(async (req: NextRequest, ...args: unknown[]) => {
  const { params } = args[0] as RouteParams;
  const { id } = await params;
  const body = await req.json();
  const products = await getAllProducts();
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json({ error: '产品不存在' }, { status: 404 });
  }

  products[index] = { ...products[index], ...body, id };
  await saveProducts(products);
  revalidatePath('/');
  revalidatePath('/products');
  revalidatePath(`/products/${id}`);
  return NextResponse.json(products[index]);
});

// DELETE /api/admin/products/[id] - 删除产品
export const DELETE = withAdminAuth(async (_req: NextRequest, ...args: unknown[]) => {
  const { params } = args[0] as RouteParams;
  const { id } = await params;
  const products = await getAllProducts();
  const filtered = products.filter((p) => p.id !== id);

  if (filtered.length === products.length) {
    return NextResponse.json({ error: '产品不存在' }, { status: 404 });
  }

  await saveProducts(filtered);
  revalidatePath('/');
  revalidatePath('/products');
  revalidatePath(`/products/${id}`);
  return NextResponse.json({ success: true });
});
