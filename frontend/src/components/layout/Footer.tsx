import Link from 'next/link';
import type { SiteConfig } from '@/types';

interface FooterProps {
  site: SiteConfig;
}

export function Footer({ site }: FooterProps) {
  return (
    <footer id="contact" className="border-t border-gray-200/40 bg-transparent relative z-10 pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-16">
          <div className="flex flex-col justify-start">
            <Link href="/" className="flex items-center gap-3.5 mb-6 group shrink-0 w-fit">
              <div className="text-blue-600 transition-transform duration-300 group-hover:scale-105">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.9" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[17px] font-extrabold tracking-tight text-gray-900 leading-tight transition-colors group-hover:text-blue-600">
                  {site.companyName}
                </span>
                <span className="text-[9px] font-bold text-gray-400 tracking-[0.18em] uppercase leading-none mt-0.5">
                  {site.companyNameEn}
                </span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
              驱动企业数字化的新一代生产力引擎，<br className="hidden lg:inline" />通过大模型与机器视觉技术，赋能实体产业智能化升级。
            </p>
          </div>
          <div className="md:pl-12 flex flex-col justify-start">
            <h4 className="text-gray-900 font-semibold mb-6">联系我们</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-500">
              {site.contact.phone && <li>电话：{site.contact.phone}</li>}
              {site.contact.email && <li>邮箱：{site.contact.email}</li>}
              {site.contact.address && <li>地址：{site.contact.address}</li>}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>{site.copyright}</p>
          {site.icp && <p>{site.icp}</p>}
          <div className="flex gap-6">
            <Link href="#" className="hover:text-gray-900 transition-colors">隐私政策</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">服务条款</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
