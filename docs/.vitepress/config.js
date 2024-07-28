import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "架设个人网站",
  description: "关于架设个人网站的一切...",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
/*    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],*/

    sidebar: [
      {
        text: '作者序',
        items: [
          { text: '想法的由来', link: '/' },
          { text: '关于此博客的搭建', link: '/about-vitepress-create' }
        ]
      },
      {
        text: '第一步：vue3的搭建',
        items: [
          { text: '起因：为了找工作', link: '/vue3/for-jobs' }
        ]
      }
    ],

/*    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]*/
  }
})
