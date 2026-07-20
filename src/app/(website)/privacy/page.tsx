import type { Metadata } from 'next';
import { getSiteConfig } from '@/lib/data';

export const revalidate = 3600; // 每小时最多重新生成

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    title: `隐私政策 — ${site.companyName}`,
    description: `${site.companyFullName}隐私政策，说明我们如何收集、使用、储存和保护您的个人信息。`,
  };
}

export default async function PrivacyPage() {
  const site = await getSiteConfig();
  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          隐私政策
        </h1>
        <p className="text-sm text-gray-400 mb-10">最后更新日期：{today}</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">一、信息收集</h2>
            <p>
              {site.companyFullName}（以下简称"我们"）在您访问本网站或使用我们的产品服务时，
              可能收集以下信息：
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-sm">
              <li>您主动提交的联系表单信息（姓名、电话、邮箱、公司名称等）；</li>
              <li>您通过"立即咨询"功能提交的需求描述信息；</li>
              <li>网站访问日志（IP 地址、浏览器类型、访问时间等）。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">二、信息使用目的</h2>
            <p>我们收集您的信息仅用于以下目的：</p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-sm">
              <li>响应您的咨询请求，安排业务人员与您联系；</li>
              <li>改善我们的网站功能与用户体验；</li>
              <li>遵守相关法律法规的要求。</li>
            </ul>
            <p className="mt-3">我们不会将您的个人信息出售、出租或以其他商业方式提供给第三方。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">三、信息存储与安全</h2>
            <p>
              您提交的信息将存储在我们的服务器上，并受到访问控制保护。
              我们采取合理的技术和管理措施防止未经授权的访问、披露或破坏。
              管理后台使用加密 Token 进行身份验证，仅限授权人员访问。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">四、Cookies</h2>
            <p>
              本网站可能使用会话 Cookie 以维持正常的页面交互功能。
              这些 Cookie 不包含个人身份信息，关闭浏览器后即自动清除。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">五、您的权利</h2>
            <p>
              您可随时联系我们，要求查看、更正或删除我们持有的关于您的个人信息。
              请通过以下方式联系我们：
            </p>
            <div className="mt-3 text-sm bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-1">
              {site.contact.email && <p>电子邮件：<a href={`mailto:${site.contact.email}`} className="text-blue-600 hover:underline">{site.contact.email}</a></p>}
              {site.contact.phone && <p>联系电话：{site.contact.phone}</p>}
              {site.contact.address && <p>公司地址：{site.contact.address}</p>}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">六、政策变更</h2>
            <p>
              我们可能会不时更新本隐私政策。更新后的政策将在本页面公布，
              重大变更将通过显著方式通知您。建议您定期查看本页面以了解最新内容。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">七、适用法律</h2>
            <p>
              本隐私政策适用中华人民共和国相关法律法规，包括但不限于
              《个人信息保护法》《网络安全法》等。
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
