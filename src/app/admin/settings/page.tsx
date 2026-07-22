'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Check,
  Loader2,
  X,
  Settings as SettingsIcon,
  Globe,
  MapPin,
  Save,
  Sparkles,
  Building2,
  Rocket,
} from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';

const defaultConfig: any = {
  companyName: '',
  companyNameEn: '',
  companyFullName: '',
  copyright: '',
  icp: '',
  contact: { phone: '', email: '', address: '' },
  social: { wechat: '', weibo: '', linkedin: '' },
  nav: [],
  hero: { headline: '', headlineHighlight: '', description: '' },
  about: { title: '', description: '', tagline: '', imageUrl: '', imageAlt: '', ctaText: '', ctaHref: '' },
  wechatQrUrl: '',
  douyinQrUrl: '',
  opc: {
    sectionTitle: 'OPC创业孵化服务：让AI创业梦想照进现实',
    sectionDescription: '我们为AI创业者提供从空间、算力、导师到商业化的全链路孵化支持，让每一个AI创业梦想都能在这里扎根成长。',
    platformTitle: '孵化平台',
    platformDescription: '我们搭建了专业的AI创业孵化OPC中心，为怀揣AI梦想的创业者提供一个低成本、高赋能的成长环境，助力初创团队轻装上阵，专注于核心技术与商业模式打磨。',
    cards: [
      { title: '免费技能培训', description: '入驻者可免费参加全栈AI技术与商业化技能培训，快速补齐短板。' },
      { title: '零成本办公', description: '通过评估筛选的优质团队，享受工位、水电及物业费全额减免政策。' },
      { title: '一对一专项辅导', description: '配备经验丰富的创业导师，提供从技术路线到商业变现的全流程指导。' },
      { title: '低成本算力支持', description: '提供极具市场竞争力的高性能AI算力支持方案，大幅降低模型训练成本。' },
    ],
    imageUrl: '/uploads/general/1784015085084-5j5pkemeu6m.jpeg',
    imageAlt: '国智产业城 OPC创业孵化基地',
    bannerHighlight: '核心价值：',
    bannerText: '全方位助力AI项目从0到1落地生根，\n降低门槛与风险',
  },
};

export default function SettingsPage() {
  const [config, setConfig] = useState<any>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    fetch('/api/admin/site')
      .then((r) => r.json())
      .then((data) => {
        // Ensure sub-objects are initialized
        const merged = {
          ...defaultConfig,
          ...data,
          contact: { ...defaultConfig.contact, ...(data.contact || {}) },
          hero: { ...defaultConfig.hero, ...(data.hero || {}) },
          about: { ...defaultConfig.about, ...(data.about || {}) },
          opc: {
            ...defaultConfig.opc,
            ...(data.opc || {}),
            cards: (data.opc?.cards || defaultConfig.opc.cards).map((c: any, i: number) => ({
              ...defaultConfig.opc.cards[i],
              ...c,
            })),
          },
        };
        setConfig(merged);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error();
      showToast('配置已保存，官网将在 30 秒内自动更新并生效');
    } catch {
      showToast('配置保存失败，请检查网络重试', 'error');
    } finally {
      setSaving(false);
    }
  };

  const setContact = (key: string, val: string) =>
    setConfig({ ...config, contact: { ...config.contact, [key]: val } });

  const setHero = (key: string, val: string) =>
    setConfig({ ...config, hero: { ...config.hero, [key]: val } });

  const setAbout = (key: string, val: string) =>
    setConfig({ ...config, about: { ...config.about, [key]: val } });

  const setOpc = (key: string, val: any) =>
    setConfig({ ...config, opc: { ...config.opc, [key]: val } });

  const setOpcCard = (idx: number, key: string, val: string) => {
    const cards = [...config.opc.cards];
    cards[idx] = { ...cards[idx], [key]: val };
    setConfig({ ...config, opc: { ...config.opc, cards } });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-xs font-semibold">获取全局配置数据中...</span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-8 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2.5 transition-all duration-300 animate-slide-in ${
          toast.type === 'success'
            ? 'bg-emerald-500 text-white shadow-emerald-500/10'
            : 'bg-rose-500 text-white shadow-rose-500/10'
        }`}>
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="pb-4 border-b border-slate-200/50">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-blue-600" />
          全局配置
        </h1>
        <p className="text-xs text-slate-400 mt-1">更新官网基础信息、页脚版权、ICP 备案号、首页首屏口号以及企业简介区块</p>
      </div>

      <div className="space-y-6">
        {/* Company Info */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">公司基本元数据</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Field label="公司简称 (显示于导航栏)">
              <input
                id="settings-company-name"
                type="text"
                value={config.companyName}
                onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                className={inputCls}
                placeholder="如：五六零人工智能科技"
              />
            </Field>
            <Field label="英文简称 (显示于导航栏副标)">
              <input
                type="text"
                value={config.companyNameEn}
                onChange={(e) => setConfig({ ...config, companyNameEn: e.target.value })}
                className={inputCls}
                placeholder="如：560 AI TECHNOLOGY"
              />
            </Field>
            <Field label="公司法定全称">
              <input
                type="text"
                value={config.companyFullName}
                onChange={(e) => setConfig({ ...config, companyFullName: e.target.value })}
                className={inputCls}
                placeholder="如：五六零人工智能科技（北海）有限公司"
              />
            </Field>
            <Field label="版权所有声明 (页脚呈现)">
              <input
                type="text"
                value={config.copyright}
                onChange={(e) => setConfig({ ...config, copyright: e.target.value })}
                className={inputCls}
                placeholder="如：© 2026 560 AI Technology Co., Ltd. 保留所有权利。"
              />
            </Field>
            <Field label="工信部 ICP 备案号 (可选)">
              <input
                type="text"
                value={config.icp}
                onChange={(e) => setConfig({ ...config, icp: e.target.value })}
                placeholder="例：桂ICP备xxxxxxxx号-1"
                className={inputCls}
              />
            </Field>
          </div>
        </section>

        {/* Homepage Hero Settings */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">首页首屏大屏 (Hero) 配置</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Field label="标语主文本 (Headline)">
              <input
                type="text"
                value={config.hero.headline}
                onChange={(e) => setHero('headline', e.target.value)}
                className={inputCls}
                placeholder="如：大模型时代的企业"
              />
            </Field>
            <Field label="标语高亮词 (Headline Highlight - 蓝色渐变呈现)">
              <input
                type="text"
                value={config.hero.headlineHighlight}
                onChange={(e) => setHero('headlineHighlight', e.target.value)}
                className={inputCls}
                placeholder="如：新一代智能引擎"
              />
            </Field>
            <Field label="标语副文本/描述 (Description)">
              <textarea
                value={config.hero.description}
                onChange={(e) => setHero('description', e.target.value)}
                rows={3}
                className={`${inputCls} resize-none`}
                placeholder="如：专注于为大中型企业提供私有化部署、高安全性的 AI 大模型系统及机器视觉引擎..."
              />
            </Field>
          </div>
        </section>

        {/* Company About Section Settings */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">企业简介模块配置</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Field label="简介区块大标题">
              <input
                type="text"
                value={config.about.title}
                onChange={(e) => setAbout('title', e.target.value)}
                className={inputCls}
                placeholder="如：五六零人工智能科技（北海）有限公司"
              />
            </Field>
            <Field label="产品核心使命宣传语 (Tagline)">
              <input
                type="text"
                value={config.about.tagline}
                onChange={(e) => setAbout('tagline', e.target.value)}
                className={inputCls}
                placeholder="如：驱动企业数字化的新一代生产力引擎..."
              />
            </Field>
            <Field label="详细描述介绍 (Description)">
              <textarea
                value={config.about.description}
                onChange={(e) => setAbout('description', e.target.value)}
                rows={3}
                className={`${inputCls} resize-none`}
                placeholder="如：我们致力于前沿算法在工业制造、协同办公及智慧政务等核心领域的场景化落地..."
              />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="行动按钮文字 (CTA Text)">
                <input
                  type="text"
                  value={config.about.ctaText}
                  onChange={(e) => setAbout('ctaText', e.target.value)}
                  className={inputCls}
                  placeholder="如：了解我们的核心价值观"
                />
              </Field>
              <Field label="行动按钮链接 (CTA Href)">
                <input
                  type="text"
                  value={config.about.ctaHref}
                  onChange={(e) => setAbout('ctaHref', e.target.value)}
                  className={inputCls}
                  placeholder="如：/#contact 或 /about"
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="展示大楼配图 (ImageUrl)">
                <ImageUpload
                  label="上传企业配图"
                  value={config.about.imageUrl}
                  onChange={(url) => setAbout('imageUrl', url)}
                />
              </Field>
              <Field label="配图替换文本 (ImageAlt)">
                <input
                  type="text"
                  value={config.about.imageAlt}
                  onChange={(e) => setAbout('imageAlt', e.target.value)}
                  className={inputCls}
                  placeholder="如：560 AI Corporate Headquarter"
                />
              </Field>
            </div>
          </div>
        </section>

        {/* WeChat and Douyin QR Code Settings */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">关注我们 & 社交平台配置</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="微信公众号二维码 (微信扫码关注)">
              <ImageUpload
                label="上传微信二维码"
                value={config.wechatQrUrl || ''}
                onChange={(url) => setConfig({ ...config, wechatQrUrl: url })}
              />
            </Field>
            <Field label="抖音官方号二维码 (抖音扫码关注)">
              <ImageUpload
                label="上传抖音二维码"
                value={config.douyinQrUrl || ''}
                onChange={(url) => setConfig({ ...config, douyinQrUrl: url })}
              />
            </Field>
          </div>
        </section>

        {/* Contact info */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">联系方式配置</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Field label="服务热线电话">
              <input
                id="settings-phone"
                type="text"
                value={config.contact.phone}
                onChange={(e) => setContact('phone', e.target.value)}
                placeholder="如：400-880-0560"
                className={inputCls}
              />
            </Field>
            <Field label="官方联络邮箱">
              <input
                type="email"
                value={config.contact.email}
                onChange={(e) => setContact('email', e.target.value)}
                placeholder="如：contact@560ai.com"
                className={inputCls}
              />
            </Field>
            <Field label="企业办公地址">
              <input
                type="text"
                value={config.contact.address}
                onChange={(e) => setContact('address', e.target.value)}
                placeholder="如：广西北海市银海区高新技术产业园"
                className={inputCls}
              />
            </Field>
          </div>
        </section>

        {/* OPC创业孵化服务配置 */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Rocket className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">OPC创业孵化服务配置</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {/* 大标题 */}
            <Field label="Section 大标题">
              <input type="text" value={config.opc.sectionTitle} onChange={(e) => setOpc('sectionTitle', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Section 描述文字">
              <textarea rows={2} value={config.opc.sectionDescription} onChange={(e) => setOpc('sectionDescription', e.target.value)} className={`${inputCls} resize-none`} />
            </Field>

            {/* 孵化平台大卡片 */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">左侧 · 孵化平台大卡片</p>
              <div className="grid grid-cols-1 gap-3">
                <Field label="卡片标题">
                  <input type="text" value={config.opc.platformTitle} onChange={(e) => setOpc('platformTitle', e.target.value)} className={inputCls} />
                </Field>
                <Field label="卡片描述">
                  <textarea rows={2} value={config.opc.platformDescription} onChange={(e) => setOpc('platformDescription', e.target.value)} className={`${inputCls} resize-none`} />
                </Field>
              </div>
            </div>

            {/* 4 个小卡片 */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">左侧 · 4 个小模块卡片</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.opc.cards.map((card: any, idx: number) => {
                  const iconLabels = ['免费技能培训', '零成本办公', '一对一专项辅导', '低成本算力支持'];
                  return (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl space-y-2">
                      <p className="text-[11px] font-bold text-slate-400 uppercase">{iconLabels[idx]}</p>
                      <Field label="标题">
                        <input type="text" value={card.title} onChange={(e) => setOpcCard(idx, 'title', e.target.value)} className={`${inputCls} text-sm py-2`} />
                      </Field>
                      <Field label="描述">
                        <textarea rows={2} value={card.description} onChange={(e) => setOpcCard(idx, 'description', e.target.value)} className={`${inputCls} text-sm py-2 resize-none`} />
                      </Field>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 右侧配图 */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">右侧 · 建筑配图</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="配图地址 (ImageUrl)">
                  <ImageUpload label="上传建筑配图" value={config.opc.imageUrl} onChange={(url) => setOpc('imageUrl', url)} />
                </Field>
                <Field label="配图替换文本 (ImageAlt)">
                  <input type="text" value={config.opc.imageAlt} onChange={(e) => setOpc('imageAlt', e.target.value)} className={inputCls} />
                </Field>
              </div>
            </div>

            {/* 蓝色横幅 */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">右侧 · 蓝色价值横幅</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="高亮前缀 (如：核心价值：)">
                  <input type="text" value={config.opc.bannerHighlight} onChange={(e) => setOpc('bannerHighlight', e.target.value)} className={inputCls} />
                </Field>
                <Field label="横幅正文 (换行用 \\n)">
                  <textarea rows={2} value={config.opc.bannerText} onChange={(e) => setOpc('bannerText', e.target.value)} className={`${inputCls} resize-none`} />
                </Field>
              </div>
            </div>
          </div>
        </section>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            id="save-settings-btn"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/15 transition-all duration-200 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Save className="w-4.5 h-4.5" />}
            {saving ? '正在写入系统配置...' : '保存全局设置'}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  'w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 transition-all bg-white';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
      {children}
    </div>
  );
}
