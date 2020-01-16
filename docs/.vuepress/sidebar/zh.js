/**
 * @desc 左侧目录
 * @author Jo.gel
 * @date 2020年1月16日09:44:53
 * */

const introductionLinks = [
	'getting-started',
];
module.exports = {
	'/v3/': [
		{
			title: '简介',
			collapsable: false,
			link: '/v3/',
			children: introductionLinks
		}
	]
};
