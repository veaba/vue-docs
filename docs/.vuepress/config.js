/**
 * @desc VuePress Config.js
 * */
module.exports = {
	base:'/vue-docs/',
	title: 'Vue.js 3 docs',
	author: 'veaba',
	description: 'Vue.js 3 ，最新前瞻中文文档笔记, 非官方，仿Vue README.md 文档',
	displayAllHeaders: true,
	scss: {},
	themeConfig: {
		repo: 'veaba/vue-docs',
		logo: '/images/logo.png',
		locales: {
			// 主站是中文
			'/': {
				label: '简体中文',
				selectText: '选择语言',
				editLinkText: '在Github编辑此页',
				nav: require('./nav/zh'),
				sidebar: {
					'/guide/': getGuideSidebar(),
				}
			}
		}
	},
	// vuepress-plugin-container 容器
	plugins: [
		// tip
		['container', {
			type: 'tip',
			before: title => `<div class="tip custom-block"> <p class="title">${title}</p>`,
			after: '</div>'
		}],
		['container', {
			type: 'warning',
			before: title => `<div class="warning custom-block"> <p class="title">${title}</p>`,
			after: '</div>'
		}],
		['container', {
			type: 'danger',
			before: title => `<div class="danger custom-block"> <p class="title">${title}</p>`,
			after: '</div>'
		}],
	],
	extraWatchFiles: [
		// '.vuepress/nav/en.js',
		'.vuepress/nav/zh.js',
	]
};

function getApiSidebar() {
	return [
		'cli',
		'node'
	]
}
function getGuideSidebar () {
	return [
		{
			title: '基础',
			collapsable: false,
			children: [
				'getting-started',
			]
		}
	]
}

function getPluginSidebar() {

}
