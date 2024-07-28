import { defineConfig } from 'vitepress'
import nav from './nav.js'
import sidebar from './sidebar.js'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Lwrong·博客",
  description: "关于Lwrong网站的故事...",
  base: '/vite-press/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav,
    sidebar: sidebar,
    outline: [2, 3],
    outlineTitle: '目录',
    docFooter: {
      prev: '上一章',
      next: '下一章',
    },
/*    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]*/
  },
  markdown: {
    container: {
      // tipLabel: 'tip',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: ' ',
      // detailsLabel: '详细信息'
    }
  }
})
