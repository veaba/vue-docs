/**
 * @desc VuePress Config.js
 * */
module.exports = {
	title: 'Vue.js 3 docs',
	author: 'veaba',
	description: 'Vue.js 3 ，最新前瞻中文文档',
	displayAllHeaders: true,
	scss: {},
	head:[
		['link', { rel: 'shortcut icon',type: 'image/x-icon', href: '/favicon.ico' }]
	],
	plugins: [["vuepress-plugin-editable"]],
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
				'',
			]
		}
	]
}

function getPluginSidebar() {

}
