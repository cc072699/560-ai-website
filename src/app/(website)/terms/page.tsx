import type { Metadata } from 'next';
import { getSiteConfig } from '@/lib/data';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    title: `服务条款 — ${site.companyName}`,
    description: `${site.companyFullName}服务条款，规定您使用本网站及相关服务时需遵守的规则与条件。`,
  };
}

export default async function TermsPage() {
  const site = await getSiteConfig();
  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          服务条款
        </h1>
        <p className="text-sm text-gray-400 mb-10">最后更新日期：{today}</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">一、接受条款</h2>
            <p>
              欢迎访问{site.companyFullName}（以下简称"我们"）官方网站。
              通过访问或使用本网站，您即表示同意遵守本服务条款。
              如您不同意本条款，请立即停止使用本网站。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">二、网站使用规范</h2>
            <p>在使用本网站时，您同意：</p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-sm">
              <li>仅将本网站用于合法目的，不从事任何违反中国法律法规的活动；</li>
              <li>不试图未经授权访问本网站的管理后台或服务器；</li>
              <li>不以任何方式干扰或破坏本网站的正常运行；</li>
              <li>不复制、修改、分发或创作本网站内容的衍生作品，除非获得我们的书面许可。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">三、知识产权</h2>
            <p>
              本网站的所有内容，包括但不限于文字、图片、商标、Logo、产品方案说明及技术文档，
              均受中国及国际知识产权法律的保护，版权归{site.companyFullName}所有。
              未经书面授权，禁止任何形式的转载、复制或商业使用。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">四、免责声明</h2>
            <p>
              本网站内容仅供参考，我们尽力保持信息的准确性，但不对以下情况承担责任：
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-sm">
              <li>因网络故障、技术原因等导致的网站访问中断或数据损失；</li>
              <li>因您依赖本网站信息作出决策所产生的任何损失；</li>
              <li>第三方网站的内容和隐私实践（本网站可能包含第三方链接）。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">五、咨询与商务合作</h2>
            <p>
              通过本网站提交的咨询表单属于初步沟通意向，不构成任何具有法律约束力的合同。
              正式合作关系的建立须通过签署书面协议确认。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">六、条款变更</h2>
            <p>
              我们保留随时修改本服务条款的权利，修改后的条款将在本页面公布并即时生效。
              建议您定期访问本页面以了解最新条款。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">七、适用法律与争议解决</h2>
            <p>
              本服务条款受中华人民共和国法律管辖。因本条款引发的任何争议，
              双方应首先友好协商解决；协商不成的，提交{site.companyFullName}注册地有管辖权的人民法院裁决。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">八、联系我们</h2>
            <div className="text-sm bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-1">
              <p className="font-semibold text-gray-900 mb-2">{site.companyFullName}</p>
              {site.contact.email && <p>电子邮件：<a href={`mailto:${site.contact.email}`} className="text-blue-600 hover:underline">{site.contact.email}</a></p>}
              {site.contact.phone && <p>联系电话：{site.contact.phone}</p>}
              {site.contact.address && <p>公司地址：{site.contact.address}</p>}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
