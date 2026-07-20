'use client';

import { useState } from 'react';
import { ContactFormDialog } from './ContactFormDialog';
import { ContactDialog } from './ContactDialog';

interface ProductCTAButtonsProps {
  productId: string;
  productName: string;
  primaryText?: string;
  secondaryText?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
  layout?: 'horizontal' | 'vertical';
}

export function ProductCTAButtons({
  productId,
  productName,
  primaryText = '申请试用',
  secondaryText = '联系我们',
  primaryClassName,
  secondaryClassName,
  layout = 'horizontal',
}: ProductCTAButtonsProps) {
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <div className={`flex ${layout === 'vertical' ? 'flex-col' : 'flex-wrap'} gap-4`}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={primaryClassName || 'inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-500/10 hover:scale-[1.01]'}
        >
          {primaryText}
        </button>
        <button
          type="button"
          onClick={() => setContactOpen(true)}
          className={secondaryClassName || 'inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:border-blue-200 text-gray-700 hover:text-blue-600 font-semibold rounded-xl transition-all cursor-pointer'}
        >
          {secondaryText}
        </button>
      </div>
      <ContactFormDialog
        open={open}
        onClose={() => setOpen(false)}
        productId={productId}
        productName={productName}
      />
      <ContactDialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </>
  );
}