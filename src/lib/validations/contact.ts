import { z } from 'zod';
import type { ContactFieldType } from '@/types';

export const ContactFormFieldSchema = z.object({
  id: z.string().min(1, '字段 ID 不能为空').max(50),
  type: z.enum(['text', 'email', 'phone', 'textarea', 'select'] as const),
  label: z.string().min(1, '字段标签不能为空').max(100),
  placeholder: z.string().max(200).optional().default(''),
  required: z.boolean().optional().default(false),
  maxLength: z.number().int().positive().max(2000).optional(),
  options: z.array(z.string().max(200)).optional(),
  defaultValue: z.string().max(500).optional(),
  order: z.number().int().min(0),
}).refine(
  (field) => {
    if (field.type === 'select') {
      return field.options !== undefined && field.options.length > 0;
    }
    return true;
  },
  { message: 'select 类型字段必须提供至少一个选项', path: ['options'] }
);

export const ContactFormTemplateSchema = z.object({
  title: z.string().min(1, '表单标题不能为空').max(200),
  description: z.string().max(500).optional(),
  submitText: z.string().min(1, '提交按钮文字不能为空').max(50),
  successMessage: z.string().min(1, '成功消息不能为空').max(500),
  fields: z.array(ContactFormFieldSchema)
    .min(1, '至少需要一个字段')
    .refine(
      (fields) => {
        const ids = fields.map(f => f.id);
        return new Set(ids).size === ids.length;
      },
      { message: '字段 ID 不能重复' }
    ),
  updatedAt: z.string().optional(),
});

export const ContactSubmissionSchema = z.object({
  productId: z.string().optional(),
  productName: z.string().optional(),
  data: z.record(z.string(), z.string()),
});

export type ContactFormTemplateInput = z.infer<typeof ContactFormTemplateSchema>;
export type ContactSubmissionInput = z.infer<typeof ContactSubmissionSchema>;