/**
 * 获取激活码数据
 */
var getActivityList = function() {
	var JSONURL = fbConfig.apiUrl + "/act/list?app_key=" + fbConfig.appKey + "&r=" + facebook.getRandomStr();
	var showLoadingDialog = null;
	$.ajax({
		type: "GET",
		async: true,
		url: JSONURL,
		dataType: "jsonp",
		jsonp: "callbackparam",
		jsonpCallback: "activityList_jsonpCallback",
		beforeSend: function() {
			showLoadingDialog = $.dialog({
				content: i18N.get("code.gettingCode"),
				title: "load",
				lock: false
			});
		},
		success: function(result) {
			showLoadingDialog.close();
			if (result.code == 200) {
				var list = result.data;
				if (list.length == 0) {
					$.dialog({
						content: i18N.get("code.noAnyActivities"),
						title: "alert",
						lock: false
					});
					return;
				}
				renderActivityList(list);
			} else {
				$.dialog({
					content: i18N.get("status." + result.code),
					title: "alert",
					ok: function() {
						window.location.href = 'index.html';
					},
					okText: "Home",
					cancel: function() {

					},
					cancelText: i18N.get("public.closeDialog"),
					lock: false
				});
			}
		},
		error: function() {
			alert("Error！");
		}
	});
};
/**
 * 渲染激活码列表
 * @param {Object} list
 */
var renderActivityList = function(list) {
	var dom = '',
		activity = null;
	$("#card_center_ul").empty();
	for (var i = 0; i < list.length; i++) {
		activity = list[i];
		var title = activity.title;
		var key = activity.key;
		//		var iconUrl = activity.iconUrl;
		var startTime = activity.startTime;
		var endTime = activity.endTime;
		var residuePercent = activity.residuePercent;
		var acitivityUrl = activity.url.replace('//code','/code');
		residuePercent = (residuePercent * 100).toFixed(0);
		dom = dom + '<li data-id="' + key + '"><h4><a href="#">' + title + '</a></h4><div class="gift"><a href="#"><img src="' + fbConfig.iconURL + '" alt="' + title + '" ></a><div class="gift_cont"><div><span>' + i18N.get('code.leave') + ':</span><strong><i style="width:'
		+ residuePercent + '%;"></i></strong><span class="percent">' + residuePercent + '%</span></div><div>  <span>' + i18N.get('code.validity') + ':' + endTime+ '</span></div></div> <a href="' + acitivityUrl + '" class="card_btn ling">' + i18N.get('code.get') + '</a></div></li>';
	}
	$("#card_center_ul").append(dom);
};

/**
 * 获取激活码
 */
function getActivityCode() {
	var JSONURL = fbConfig.apiUrl + "/cdk/get?actKey=" + fbConfig.activityKey + "&tmpId=" + facebook.getTempId();
	var showLoadingDialog = null;
	$.ajax({
		type: "GET",
		async: true,
		url: JSONURL,
		dataType: "jsonp",
		jsonp: "callbackparam",
		beforeSend: function() {
			showLoadingDialog = $.dialog({
				content: i18N.get("code.gettingCode"),
				title: "load",
				lock: false
			});
		},
		success: function(result) {
			showLoadingDialog.close();
			if (result.code == 200 || result.code == 201) {
				$('.show-code span').text(result.data.cdk);
				$('.show-code').show();
				$('.mask').show();
			} else if (result.code == 150) {
				$.dialog({
					content: i18N.get("status." + result.code),
					title: "alert",
					ok: function() {
						window.location.href = 'index.html';
					},
					okText: i18N.get("login.relogin"),
					lock: false

				});

			} else if (result.code == 203) {
				$.dialog({
					content: i18N.get("status." + result.code),
					title: "alert",
					ok: function() {
						window.location.href = fbConfig.pageUrl;
					},
					okText: i18N.get("code.completeActivity"),
					cancel: function() {

					},
					cancelText: 'cancel',
					lock: false
				});
			} else {
				$.dialog({
					content: i18N.get("status." + result.code),
					title: "alert",
					ok: function() {
						window.location.href = 'index.html';
					},
					okText: "Home",
					cancel: function() {

					},
					cancelText: i18N.get("public.closeDialog"),
					lock: false
				});
			}
		},
		error: function() {
			alert("Error！");
		}
	});
};

/**
 * 获取存号箱的激活码
 */
function getOwnCode() {
	var JSONURL = fbConfig.apiUrl + "/cdk/query/user?r=" + facebook.getRandomStr() + "&tmpId=" + facebook.getTempId();
	var showLoadingDialog = null;
	$.ajax({
		type: "GET",
		async: true,
		url: JSONURL,
		dataType: "jsonp",
		jsonp: "callbackparam",
		jsonpCallback: "OwnCode_jsonpCallback",
		beforeSend: function() {
			showLoadingDialog = $.dialog({
				content: i18N.get("public.gettingCode"),
				title: "load",
				lock: false
			});
		},
		success: function(result) {
			showLoadingDialog.close();
			if (result.code == 200) {
				renderOwnCode(result.data);
			} else if (result.code == 150) {
				$.dialog({
					content: i18N.get("status." + result.code),
					title: "alert",
					ok: function() {
						window.location.href = 'index.html';
					},
					okText: i18N.get("login.relogin"),
					lock: false

				});

			} else {
				$.dialog({
					content: i18N.get("status." + result.code),
					title: "alert",
					ok: function() {
						window.location.href = 'index.html';
					},
					okText: "Home",
					cancel: function() {},
					cancelText: i18N.get("public.closeDialog"),
					lock: false
				});
			}
		},
		error: function() {
			alert("Error！");
		}
	});
}

/**
 *  存号箱 -渲染已领取的激活码列表
 * @param {Object} list
 */
var renderOwnCode = function(list) {
	var dom = null,
		tmp = null;
	$("#num_box_ul").empty();
	for (var i = 0; i < list.length; i++) {
		temp = list[i];
		var cdk = temp.cdk;
		var activity = temp.activity;
		var title = activity.title;
		var key = activity.key;
		var iconUrl = activity.iconUrl;
		var startTime = activity.startTime;
		var endTime = activity.endTime;
		var cdk = cdk.cdk;
		dom = '<li>  <div class="numbox_game"> <a href="#"><img src="' + iconUrl + '"></a>' + ' <h4>' + title + '</h4>' + '<p>Thời gian：<span>' + startTime + ' - ' + endTime + '</span></p></div>' + '<div class="copy"> <label>Code：</label><input type="text" readonly value="' + cdk + '"><br /></div>'; + '</li>'
		$("#num_box_ul").append(dom);
	}
};

/**
 * 渲染详情页面
 * @param {Object} key
 */
var renderDetailPage = function(key) {
	var JSONURL = fbConfig.apiUrl + "/act/" + key + "/get?r=" + facebook.getRandomStr();
	var showLoadingDialog = null;
	$.ajax({
		type: "GET",
		async: true,
		url: JSONURL,
		dataType: "jsonp",
		jsonp: "callbackparam",
		//		jsonpCallback: "activity_jsonpCallback",
		beforeSend: function() {
			showLoadingDialog = $.dialog({
				content: 'loading',
				title: "load",
				lock: false
			});
		},
		success: function(result) {
			showLoadingDialog.close();
			if (result.code == 200) {
				var activity = result.data;
				$("#residuePercent").text((activity.residuePercent * 100).toFixed(0) + "%");
				$("#random-date").text(activity.startTime + " - " + activity.endTime);
//				$("#endTime").text(i18N.get('code.limitDate') + ':' + activity.endTime);
				$(".activity_title").text(activity.title);
			} else if (result.code == 150) {
				$.dialog({
					content: i18N.get("status." + result.code),
					title: "alert",
					ok: function() {
						window.location.href = 'index.html';
					},
					okText: i18N.get("code.goHomeAndLogoin")
				});
			} else {
				$.dialog({
					content: 'code:' + result.code + ',' + JSON.parse(result.message).error.message,
					title: "alert",
					time: 3000,
					lock: false,
					ok: function() {
						window.location.href = 'index.html';
					},
					okText: i18N.get('public.goHome')
				});
			}
		},
		error: function() {
			alert("Error！");
			reLogin();
		}
	});

	if(facebook.CheckIsLogin()){
		var username = $.fn.cookie(fbConfig.cookieKey + 'username');
		$('#login').text(username);
        $('#login').removeClass('login-not').addClass('login-in');
        $("#no-login-div").hide();
        $("#login-div").show();
        $("#userName").text('Hi,' + username)
	}

	$(".ling.login-in").bind('click', function() {
		ling(key)
	});
	renderGetRules();
	renderGiftInfo();
	renderUsage();
}

/**
 * 领取礼包
 */
var ling = function(key) {
	var tempid = facebook.getTempId();
	var JSONURL = fbConfig.apiUrl + "/cdk/get?actKey=" + key + "&r=" + facebook.getRandomStr() + "&tmpId=" + tempid;
	var showLoadingDialog = null;
	$.ajax({
		type: "GET",
		async: true,
		url: JSONURL,
		dataType: "jsonp",
		jsonp: "callbackparam",
		//		jsonpCallback: "cdk_jsonpCallback",
		beforeSend: function() {
			showLoadingDialog = $.dialog({
				content: 'loading',
				title: "load",
				lock: false
			});
		},
		success: function(result) {
			showLoadingDialog.close();
			if (result.code == 200) {
				$("#no-login-div").hide();
				$(".ling_success").show();
				$(".ling_failed").hide();
				$("#cdkCode").text(result.data.cdk);
			} else if (result.code == 201) {
				$("#no-login-div").hide();
				$(".ling_success").show();
				$(".ling_failed").hide();
				$(".ling_success .msg").html("<i>" + i18N.get('code.getSuccess') + "</i>");
				$("#cdkCode").text(result.data.cdk);
			} else if (result.code == 203 || result.code == 202) {
				$.dialog({
					content: i18N.get("status." + result.code),
					title: "alert",
					ok: function() {
						window.open(fbConfig.pageUrl);
					},
					okText: i18N.get("code.completeActivity"),
					cancel:function(){
						
					},
					cancelText:i18N.get('public.cancel')
				});
				$(".ling_success").hide();
				$("#no-login-div").hide();
				$(".ling_failed").show();
			} else if (result.code == 150) {
				$.dialog({
					content: i18N.get("status." + result.code),
					title: "alert",
					ok: function() {
						window.location.href = 'index.html';
					},
					okText: i18N.get("code.goHomeAndLogoin")
				});
			} else {
				$("#ling_failed").show();
				$.dialog({
					content: i18N.get("status." + result.code),
					title: "alert",
					ok: function() {
						window.location.href = 'index.html';
					},
					okText: i18N.get("code.goHomeAndLogoin")
				});
			}
		},
		error: function() {
			alert("Error！");
			//reLogin();
		}
	});
}

/**
 *  渲染领取规则
 */
var renderGetRules = function() {
	var dom = i18N.get('code.getFail') +'<br />';
	for(var i = 0 ; i < fbConfig.getRules.length; i++){
		dom = dom + fbConfig.getRules[i] + "<br />";
	}
	$('#getRules').append(dom);
}
	/**
	 *  渲染礼包内容
	 */
var renderGiftInfo = function() {
	var dom = '<p>';
	for(var i = 0 ; i < fbConfig.giftInfo.length; i++){
		dom = dom + fbConfig.giftInfo[i] + "<br />";
	}
	$('.giftInfo').html(dom +'</p>');
}
	/**
	 * 渲染使用方法
	 */
var renderUsage = function() {
	var dom = '<p>';
	for(var i = 0 ; i < fbConfig.usage.length; i++){
		dom = dom + fbConfig.usage[i] + "<br />";
	}
	$('.useage').html(dom +'</p>');
}