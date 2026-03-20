import { motion } from 'framer-motion';
import { 
  Gamepad2, 
  Twitter, 
  Github, 
  Youtube, 
  Mail,
  ChevronRight
} from 'lucide-react';

const footerLinks = {
  product: {
    title: '产品',
    links: [
      { name: '游戏库', href: '#' },
      { name: '社区论坛', href: '#' },
      { name: '排行榜', href: '#' },
      { name: '新闻资讯', href: '#' },
    ]
  },
  support: {
    title: '支持',
    links: [
      { name: '帮助中心', href: '#' },
      { name: '用户协议', href: '#' },
      { name: '隐私政策', href: '#' },
      { name: '联系我们', href: '#' },
    ]
  },
  company: {
    title: '关于',
    links: [
      { name: '关于我们', href: '#' },
      { name: '加入我们', href: '#' },
      { name: '合作伙伴', href: '#' },
      { name: '品牌资源', href: '#' },
    ]
  }
};

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Github', icon: Github, href: '#' },
  { name: 'Youtube', icon: Youtube, href: '#' },
  { name: 'Email', icon: Mail, href: '#' },
];

export function FooterSection() {
  return (
    <footer className="relative bg-foreground text-white overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        {/* 顶部区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
          {/* 左侧：品牌信息 */}
          <div>
            <motion.div 
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-2xl font-bold">GameHub</span>
            </motion.div>
            
            <motion.p 
              className="text-white/60 text-lg mb-8 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              发现好游戏，分享真快乐。加入数百万玩家的社区，探索无限游戏世界。
            </motion.p>

            {/* 订阅表单 */}
            <motion.div 
              className="flex gap-3 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <input
                type="email"
                placeholder="输入邮箱订阅资讯"
                className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors text-sm"
              />
              <motion.button
                className="px-6 py-3 rounded-full bg-white text-foreground text-sm font-medium hover:bg-white/90 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                订阅
              </motion.button>
            </motion.div>
          </div>

          {/* 右侧：链接列表 */}
          <div className="grid grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([key, section], sectionIndex) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * sectionIndex }}
              >
                <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/40">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <motion.a
                        href={link.href}
                        className="group flex items-center gap-1 text-white/70 hover:text-white transition-colors text-sm"
                        whileHover={{ x: 4 }}
                      >
                        <span>{link.name}</span>
                        <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 分隔线 */}
        <div className="h-px bg-white/10 mb-8" />

        {/* 底部区域 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* 版权信息 */}
          <motion.p 
            className="text-white/40 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            © 2024 GameHub. All rights reserved.
          </motion.p>

          {/* 社交媒体 */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.name}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
