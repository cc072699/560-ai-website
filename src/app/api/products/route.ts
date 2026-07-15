import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/data';

export async function GET() {
  try {
    const products = await getProducts();
    const list = products.map((p) => ({ id: p.id, title: p.title }));
    return NextResponse.json(list, {
      headers: {
        'Cache-Control': 'no-cache, private, max-age=0',
      },
    });
  } catch {
    return NextResponse.json(
      { error: '获取产品列表失败' },
      { status: 500 }
    );
  }
}