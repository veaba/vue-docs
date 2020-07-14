/***********************
 * @name JS
 * @author Jo.gel
 * @date 2020年1月16日09:34:52
 * @status todo
 ***********************/
module.exports = [
	{
		text: '前瞻TODO',
		items: [
			{
				text: '源码解读@vue', link: '/source/',
			},
			{
				text: '  ->@vue/compile-dom', link: '/source/compile-dom',
			},
			{
				text: '  ->@vue/compile-core', link: '/source/compile-core',
			},
			{
				text: '  ->@vue/compile-sfc', link: '/source/compile-sfc',
			},
			{
				text: '  ->@vue/runtime-core', link: '/source/runtime-core',
			},
			{
				text: '  ->@vue/runtime-dom', link: '/source/runtime-dom',
			},
			{
				text: '  ->@vue/reactivity', link: '/source/reactivity',
			},
			{
				text: '  ->@vue/server-render', link: '/source/server-render',
			},
			{
				text: '  ->@vue/shared', link: '/source/shared',
			},
			{
				text: '生态圈兼容情况', link: '/ecosystems/compatible/',
			}
		]
	},
	{
		text: '学习TODO',
		link: 'https://github.com/veaba/vue-docs/',
		ariaLabel: 'Learn Menu',
		items: [
			{
				text: '文档',
				items: [
					{text: '教程', link: '/guide/'},
					{text: 'vue-router-next', link: '/router/'},
					{text: 'transition',link:'/guide/transition/'},
					{text: 'API', link: '/api/'},
					{text: '风格指南', link: '/style-guide/'},
					{text: '示例', link: '/examples/'},
					{text: 'Cookbook', link: '/cookbook/'},
				]
			}
		]
	},
	{
		text: '生态系统TODO',
		items: [
			{
				text: '帮助', items: [
					{text: '论坛',link:'https://forum.vuejs.org/'},
					{text: '聊天室',link:'https://chat.vuejs.org/'},
					{text: '聚会',link:'https://events.vuejs.org/meetups/'}
				]
			},
			
			
			{
				text: '工具', items: [
					{text: 'Devtools',link:'https://github.com/vuejs/vue-devtools'},
					{text: 'Vue CLI',link:'https://cli.vuejs.org/zh/'},
					{text: 'Vue Loader',link:'https://vue-loader.vuejs.org/zh/'}
				]
			},
			
			
			{
				text: '核心插件', items: [
					{text: 'Vue Router',link:'https://router.vuejs.org/zh/'},
					{text: 'Vuex',link:'https://vuex.vuejs.org/zh/'},
					{text: 'Vue 服务端渲染',link:'https://ssr.vuejs.org/zh/'},
				]
			},
			
			
			{
				text: '信息', items: [
					{text: '周刊',link:'https://news.vuejs.org/'},
				]
			},
		
		]
	},
	{
		text: '团队',
		link:'/team/'
	},
	{
		text: '资源列表',
		ariaLabel: 'Language Menu',
		items: [
			{text: '合作伙伴',link:'https://cn.vuejs.org/resources/partners.html'},
			{text: '主题',link:'https://cn.vuejs.org/resources/themes.html'},
			{text: 'Awesome Vue',link:'https://github.com/vuejs/awesome-vue'},
			{text: '浏览和Vue 相关的包',link:'https://awesomejs.dev/for/vue/'},
		]
	},
	{
		text: '支持Vue',
		ariaLabel: 'Language Menu',
		items: [
			{text: '一次性赞助',link:'https://cn.vuejs.org/support-vuejs/#One-time-Donations'},
			{text: '周期性赞助',link:'https://cn.vuejs.org/support-vuejs/#Recurring-Pledges'},
			{text: '贴纸',link:'https://www.smallsticker.com/%E8%B4%B4%E7%BA%B8/vue.html'},
			{text: '周边',link:'https://osholic.com/?utm_source=vue&utm_medium=dropdown'},
			{text: 'T恤商店',link:'https://vue.threadless.com/'},
		]
	},
	{
		text: '多语言TODO',
		ariaLabel: 'Language Menu',
		items: [
			{text: 'English',link:'https://vuejs.org/index.html'},
			{text: '中文简体',link:'https://cn.vuejs.org/index.html'},
		]
	},
	{
		text: '关于',
		link: '/about'
	}
];
