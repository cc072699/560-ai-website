import Link from 'next/link';
import type { SiteConfig } from '@/types';

interface FooterProps {
  site: SiteConfig;
}

export function Footer({ site }: FooterProps) {
  return (
    <footer id="contact" className="border-t border-gray-200/40 bg-transparent relative z-10 pt-10 pb-8">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-10 text-left">
          {/* Column 1: Logo and Introduction */}
          <div className="md:col-span-5 flex flex-col justify-start space-y-6">
            <Link href="/" className="flex items-center gap-3.5 group shrink-0 w-fit">
              <div className="text-blue-600 transition-transform duration-300 group-hover:scale-105">
                <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.9" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-gray-900 leading-tight transition-colors group-hover:text-blue-600">
                  {site.companyName}
                </span>
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.18em] uppercase leading-none mt-0.5">
                  {site.companyNameEn}
                </span>
              </div>
            </Link>
            <p className="text-gray-605 text-base leading-relaxed max-w-md font-semibold">
              驱动企业数字化的新一代生产力引擎，<br className="hidden lg:inline" />通过大模型与机器视觉技术，赋能实体产业智能化升级。
            </p>
          </div>

          {/* Column 2: Contact Info */}
          <div className="md:col-span-4 flex flex-col justify-start">
            <h4 className="text-gray-900 text-lg font-black mb-6">联系我们</h4>
            <ul className="flex flex-col gap-4 text-base text-gray-650 font-semibold">
              {site.contact.phone && (
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 font-bold shrink-0">电话：</span>
                  <span>{site.contact.phone}</span>
                </li>
              )}
              {site.contact.email && (
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 font-bold shrink-0">邮箱：</span>
                  <a href={`mailto:${site.contact.email}`} className="hover:text-blue-650 transition-colors">{site.contact.email}</a>
                </li>
              )}
              {site.contact.address && (
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 font-bold shrink-0">地址：</span>
                  <span className="leading-snug">{site.contact.address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Follow Us (QR Codes) */}
          <div className="md:col-span-3 flex flex-col justify-start">
            {(site.wechatQrUrl || site.douyinQrUrl) && (
              <>
                <h4 className="text-gray-900 text-lg font-black mb-6">关注我们</h4>
                <div className="flex flex-wrap gap-8">
                  {site.wechatQrUrl && (
                    <div className="flex flex-col items-center">
                      <div className="w-28 h-28 bg-white border border-gray-200/80 rounded-2xl p-2 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center">
                        <img
                          src={site.wechatQrUrl}
                          alt="微信公众号二维码"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-500 mt-2.5">微信公众号</span>
                    </div>
                  )}
                  {site.douyinQrUrl && (
                    <div className="flex flex-col items-center">
                      <div className="w-28 h-28 bg-white border border-gray-200/80 rounded-2xl p-2 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center">
                        <img
                          src={site.douyinQrUrl}
                          alt="抖音官方号二维码"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-500 mt-2.5">抖音官方号</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-150 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400 font-medium">
          <p>{site.copyright}</p>
          {site.icp && <p className="hover:text-gray-600 transition-colors">{site.icp}</p>}
          <div className="flex gap-6">
            <Link href="#" className="hover:text-gray-900 transition-colors">隐私政策</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">服务条款</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
