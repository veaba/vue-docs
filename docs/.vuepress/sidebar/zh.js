/**
 * @desc 左侧目录
 * @author Jo.gel
 * @date 2020年1月16日09:44:53
 * */

const introductionLinks = [
	{title: "Overview", type: "group", link: "/v3/guide/team"},
];
module.exports = {
	'/v3/': [
		{
			title: '简介',
			collapsable: false,
			children: introductionLinks
		}
	]
};
