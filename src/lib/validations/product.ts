import { z } from 'zod';

export const ProductSchema = z.object({
  title: z.string()
    .min(1, '产品名称不能为空')
    .max(100, '产品名称过长(最大100字符)'),

  tagline: z.string()
    .max(200, '产品宣传语过长(最大200字符)')
    .optional(),

  category: z.string()
    .max(50, '分类名称过长(最大50字符)')
    .optional(),

  description: z.string()
    .max(5000, '产品描述过长(最大5000字符)')
    .optional(),

  features: z.array(z.string().max(200, '功能特性描述过长'))
    .max(10, '功能特性最多10条')
    .optional(),

  imageUrl: z.string()
    .max(500, 'URL过长(最大500字符)')
    .optional()
    .or(z.literal('')), // 允许空字符串

  imageAlt: z.string()
    .max(200, '图片描述过长(最大200字符)')
    .optional(),

  layout: z.enum(['text-left', 'text-right']).optional(),

  showInHome: z.boolean().optional(),
  showInNavbar: z.boolean().optional(),
});

export type ProductInput = z.infer<typeof ProductSchema>;