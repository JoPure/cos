/*
 * facebook常用功能集成
 * 1、登录
 */

// 检查是否支持cookie
if (!navigator.cookieEnabled) {
	alert("Your browser does not support cookie, please change your browser settings after use!");
};

var tempId = null;
var facebook = {
	// 获取URL参数
	getParameterByName: function(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	},
	getTempId: function() {
		tempId = tempId ? tempId : $.fn.cookie(fbConfig.cookieKey + 'token');
		return tempId;
	},
	setTempId: function(tempId) {
		tempId = tempId;
		$.fn.cookie(fbConfig.cookieKey + 'token', tempId);
	},
	// 获取随机数
	getRandomStr: function() {
		var sRnd;
		sRnd = "-" + Math.random();
		sRnd = sRnd.replace("-0.", "");
		return sRnd;
	},
	// 根据cookie判断是否已经登录
	CheckIsLogin: function() {
		var fbname = $.fn.cookie(fbConfig.cookieKey + 'username');
		if (fbname != "" && typeof(fbname) != "undefined" && fbname != "null" && fbname) {
			return true;
		}
		return false;
	},
	// 判断是否是FB登录后回调请求
	CheckFBCallback: function() {
		var _this = this;
		var FB_CODE = $.trim(_this.getParameterByName("code"));
		if (FB_CODE == "") {
			return;
		}
		var URL = fbConfig.loginUrl + "?code=" + FB_CODE + "&client_id=" + fbConfig.appId + "&redirect_uri=" + fbConfig.redirectUrl + "&r=" + _this.getRandomStr();
		var showLoadingDialog = null;

		$.ajax({
			type: "GET",
			async: true,
			url: URL,
			dataType: "jsonp",
			jsonp: "callbackparam",
			beforeSend: function() {
				showLoadingDialog = $.dialog({
					content: 'loading',
					title: "load",
					lock: false
				});
			},
			success: function(result) {
				showLoadingDialog.close();
				if (result.code === 200) {
					var username = result.data.user.name;
					$.fn.cookie(fbConfig.cookieKey + 'username', result.data.user.name);
					_this.setTempId(result.data.tmpId);

				} else if (result.code == 150) {
					$.dialog({
						content: i18N.get("status." + result.code),
						title: "alert",
						ok: function() {
							window.location.href = 'index.html';
						},
						okText: i18N.get("code.goHomeAndLogoin")
					});
				} else if (result.code == 1) {
					$.dialog({
						content: 'code:' + result.code + ',' + JSON.parse(result.message).error.message,
						title: "alert",
						time: 3000,
						lock: false
					});

					window.location.href = 'index.html';
				} else {

					$.dialog({
						content: 'code:' + result.code + ',' + JSON.parse(result.message).error.message,
						title: "alert",
						time: 3000,
						lock: false
					});
				}

			},
			error: function() {
				$.dialog({
					content: i18N.get('login.LoginFail'),
					title: "alert",
					time: 2000,
					lock: false
				});

			}
		});


	},
	/**
	 * FB登录事件
	 * @param {Object} loginDom 监听登录事件
	 * @param {Object} callback 如果已经登录，调用回调
	 */
	bindLoginDom: function(loginDom, callback) {
		var _this = this;
		$(loginDom).click(function() {
			if (_this.CheckIsLogin() && _this.getParameterByName('code') !== '') {
				callback();
			} else {
				var loginURL = "";
				LoginURL = "https://www.facebook.com/v2.2/dialog/oauth?client_id=" + fbConfig.appId + "&redirect_uri=" + encodeURIComponent(fbConfig.redirectUrl) + "&state=" + _this.getRandomStr() + "&scope=public_profile,email,read_stream,user_likes";
				window.location.href = LoginURL;
			}

		});

	},
	downloadApp: function(){
		
		if(!fbConfig.downloadURL.ios  && !fbConfig.downloadURL.android){
			window.open(fbConfig.websiteUrl);
			return;
		}
		var browser = {
			versions: function() {
				var u = navigator.userAgent,
					app = navigator.appVersion;
				return {
					presto: u.indexOf('Presto') > -1,
					webKit: u.indexOf('AppleWebKit') > -1,
					gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
					ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
					iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
					iPad: u.indexOf('iPad') > -1,
					webApp: u.indexOf('Safari') == -1
				};
			}(),
		}

		if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
			if(fbConfig.downloadURL.ios){
				window.open(fbConfig.downloadURL.ios);
			}else{
				$.dialog({
					content: i18N.get('public.stayTuned'),
					title: "alert",
					time: 2000,
					lock: false
				});
			}
			
		} else{
			if(fbConfig.downloadURL.android){
				window.open(fbConfig.downloadURL.android);
			}else{
				$.dialog({
					content: i18N.get('public.stayTuned'),
					title: "alert",
					time: 2000,
					lock: false
				});
			}
		} 
	}
};
