import { motion } from 'framer-motion';
import { Twitter, Github, Youtube, Mail, Gamepad2, ChevronRight } from 'lucide-react';

const LINKS = {
  product: { title: '产品', items: ['游戏库','社区论坛','排行榜','新闻资讯'] },
  support: { title: '支持', items: ['帮助中心','用户协议','隐私政策','联系我们'] },
  company: { title: '关于', items: ['关于我们','加入我们','合作伙伴','品牌资源'] },
};
const SOCIALS = [
  { label: 'Twitter', Icon: Twitter },
  { label: 'Github',  Icon: Github  },
  { label: 'Youtube', Icon: Youtube },
  { label: 'Email',   Icon: Mail    },
];

export function FooterSection() {
  return (
    <footer className="relative overflow-hidden" style={{ background: 'var(--c-ink)', color: 'var(--c-bg)' }}>
      {/* subtle orbs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-20">
        {/* Top grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <Gamepad2 className="w-4.5 h-4.5" style={{ color: 'var(--c-bg)' }} />
              </div>
              <span className="text-xl font-semibold tracking-tight">NEXUS</span>
            </div>
            <p className="text-sm leading-relaxed mb-8 max-w-xs" style={{ color: 'rgba(249,248,247,0.5)' }}>
              发现好游戏，分享真快乐。加入数百万玩家的社区，探索无限游戏世界。
            </p>
            {/* Email sub */}
            <div className="flex gap-2 max-w-sm">
              <input type="email" placeholder="输入邮箱订阅资讯"
                className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: 'var(--c-bg)',
                }} />
              <motion.button
                className="px-5 py-2.5 rounded-full text-sm font-medium flex-shrink-0"
                style={{ background: 'var(--c-bg)', color: 'var(--c-ink)' }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                订阅
              </motion.button>
            </div>
          </motion.div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-8">
            {Object.entries(LINKS).map(([key, { title, items }], si) => (
              <motion.div key={key}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.7, delay: si * 0.08 }}>
                <h4 className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: 'rgba(249,248,247,0.35)' }}>
                  {title}
                </h4>
                <ul className="space-y-2.5">
                  {items.map(name => (
                    <li key={name}>
                      <motion.a href="#"
                        className="group flex items-center gap-1 text-sm transition-colors duration-200"
                        style={{ color: 'rgba(249,248,247,0.55)' }}
                        whileHover={{ x: 4, color: 'rgba(249,248,247,1)' } as never}>
                        {name}
                        <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-8" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.p className="text-xs" style={{ color: 'rgba(249,248,247,0.35)' }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            © 2025 NEXUS Gaming. All rights reserved.
          </motion.p>
          <motion.div className="flex items-center gap-1.5"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            {SOCIALS.map(({ label, Icon }) => (
              <motion.a key={label} href="#" aria-label={label}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(249,248,247,0.5)' }}
                whileHover={{ scale: 1.12, y: -2, backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(249,248,247,1)' } as never}
                whileTap={{ scale: 0.93 }}>
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
