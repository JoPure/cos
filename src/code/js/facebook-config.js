var fbConfig = {
	// 默认语言
	defaultLang:'vn',
	
	// i18n资源目录URL
	i18nResURL:'http://www.mangasieudang.com/code/i18n/',
	// facebook ID
	appId: 1477217152604736,
	
	// 本地存储 cookie 键值
	cookieKey: 'chang-cookie-key' + this.appId,
	
	// 应用名
	appName: "Manga siêu đẳng",
	
	// 应用Key 由中控提供
	appKey: '9aafb538-51a2-46f1-a0c0-039b52d1beee',
	
	// 活动Key 由中控提供
	//（若非单活动配置，该值会附加在URL中，不需配置，例如FB点赞活动，活动列表中各个活动的URL中含有此值）
	activityKey:'',
	
	// 官网首页
	websiteUrl:"http://www.mangasieudang.com/",
	
	// facebook 活动说明贴URL
	pageUrl:'http://www.facebook.com/mangasieudang/',
	
	// 点赞路径
	likeUrl: 'http://www.facebook.com/mangasieudang/',
	
	// 回调路径，需要在facebook配置该路径(即此页面地址)
	redirectUrl: 'http://www.mangasieudang.com/code/index.html',
	
	// 登录接口
	loginUrl: 'http://cdk.mangasieudang.com/fb/login',
	
	// 其他接口地址
	apiUrl: 'http://cdk.mangasieudang.com',
	
	// 领取规则 数组渲染用换行拼接
	getRules:['Bước 1: LIKE và SHARE bài post này trên tường nhà bạn ở chế độ công khai','Bước 2: Nhấp vào link nhận quà để nhận mã code CB.'],
	
	// 礼包内容   数组渲染用换行拼接
	giftInfo:['Xu*100','Thẻ lực*50', 'Sách kỹ năng. lục*2', 'Rương.Đồng*2','Chià khóa đồng*2'],
	
	// 使用说明  数组渲染用换行拼接
	usage:['Nhập code vào khung đổi quà trong game để đổi quà.'],
	
	// APP下载URL
	downloadURL:{
		ios:'http://apple.co/21U7vaG',
		android:'http://1481044853.rsc.cdn77.org/mangasieudang/mangasieudang.apk'
	},
	// ICON URL
	iconURL:'http://www.mangasieudang.com/static/common/img/icon_c45838f.jpg'
}