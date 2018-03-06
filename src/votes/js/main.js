/**
 * Created by jo.chan on 2016/8/24.
 */

$(document).ready(function () {
    if (localStorage.userName && localStorage.token) {
        showMessage();
        voted();
        return true;
    }
    else {
        showLogin();
        return false;
    }
});

function isLogin() {
    if (localStorage.userName && localStorage.token) {
        setNum();
        showMessage();
        return true;
    }
    else {
        showLogin();
        return false;
    }
}

//logout
$(".logout").click(function () {
    localStorage.token = "";
    $(".vote").on("click");
    for (var j = 1; j <= 4; j++) {
        var voteCount = ".vote-" + j + " .vote-count";
        $(voteCount).text("?????");
        var vote = ".vote-" + j;
        $(vote).removeClass("active");
    }
    showLogin();
    $(".userId").text("");
    $(".userMessage").hide();
    $(".login-point").show();

});

$(".closeBtn").click(function () {
    $(".loginDiv").hide();
    $(".blackBg").hide();
});

//显示登录框
function showLogin() {
    $(".blackBg").show();
    $(".loginDiv").show();
}

$(".login-point").click(function () {
    showLogin();
});

$(".btn-more-1").click(function () {
    $(".page1-main").slideToggle();
});

$(".btn-more-2").click(function () {
    $(".page2-main").slideToggle();
});

$(".btn-more-3").click(function () {
    $(".page3-main").slideToggle();
});

$(".nextPage-btn").click(function () {
    $("html,body").animate({scrollTop: $("#page1").offset().top}, 800);
});

$(".scrollTop").click(function () {
    var index = this.title;
    var id = '#' + 'scroll-' + index;
    $("html,body").animate({scrollTop: $(id).offset().top}, 800);
});

$(".backTop-btn").click(function () {
    $("html,body").animate({scrollTop: $("#page").offset().top}, 800);
});

//var url = "http://10.10.18.114:7400";
 var url = "http://54.255.175.55:8680";
var actId = 100068;
var flag = true;

$(".loginBtn").click(function () {
    if (flag) {
        flag = false;
        var username = $('#username').val();
        var password = $('#password').val();
        var gameZone = $('#server').val();
        var playerId = $('#characterID').val();
        if (username == "" | password == "") {
            alert(msg[1]);
        } else if (gameZone == "" | playerId == "") {
            alert(msg[2]);
        } else {
            var hash = hex_md5(password);
            $.ajax({
                type: "POST",
                url: url + "/user/login",
                data: {
                    userName: username,
                    password: hash,
                    version: 'v3'
                },
                dataType: 'jsonp',
                jsonp: "jsonCallback",
                success: function (json) {
                    handleLogin(json);
                    voted();
                    //clean();
                    var myTimer = new Date().getTime();
                    localStorage.loginTime = myTimer;
                },
                complete: function () {
                    flag = true;
                },
                error: function (err) {
                    alert(err);
                }
            });
        }
    }
});

//登陆成功之后
function handleLogin(result) {
    if (result.code == 200) {
        localStorage.userName = result.data.userName;
        localStorage.userId = result.data.userId;
        localStorage.token = result.data.token;
        localStorage.gameZone = result.data.gameZone;
        localStorage.playerId = result.data.playerId;
        localStorage.gameZone = $('#server').val();
        localStorage.playerId = $('#characterID').val();
        $(".blackBg").hide();
        $(".loginDiv").hide();
        showMessage();
    }
    else {
        alert(msg[result.code]);
    }
}


function showMessage() {
    $(".userId").text("S:" + localStorage.gameZone + ',' + "ID:" + localStorage.playerId);
    $(".userMessage").show();
    $(".login-point").hide();
}


//vote method
$(".vote").click(function () {
    if (localStorage.token == "" | localStorage.token == "undefined") {
        alert(msg[403]);
    }
    else {
        var i = $(this).index();
        $(".vote.active").removeClass('active');
        $(".vote").eq(i).addClass("active");
        $(".sure-voteBtn").html("<img src='img/vote-after.png'/>");
        var num = $(this).index();
        num = parseInt(num) + 1;
        localStorage.setItem("num", num);
        num = "10" + num;
        localStorage.setItem("vote", num);
    }
});

//vote method
$(".sure-voteBtn").click(function () {
    if (isLogin()) {
        doVote();
    }
    else {
        showLogin();
    }
});

//不可领状态
function voteOff() {
    $(".sure-voteBtn").html("<img src='img/voted.png'/>");
    $(".sure-voteBtn").off("click");
    $(".vote").off("click");
}

//历史投票记录
function voted() {
    $.ajax({
        type: "GET",
        url: url + "/act/vote/bubbled/voted",
        data: {
            actId: actId,
            token: localStorage.token
        },
        dataType: 'jsonp',
        jsonp: "jsonCallback",
        success: function (result) {
            if (result.code == 200) {
                var data = result.data;
                if (data.length != 0) {
                    var num = data[0] - 100;
                    var voteArea = ".vote-" + num;
                    $(voteArea).addClass("active");
                    voteOff();
                    setNum();
                } else {
                    return false;
                }
            } else {
                alert(msg[result.code]);
            }
        },
        error: function (err) {
            alert(err);
        }
    });
}

//确认投票
function doVote() {
    $.ajax({
        type: "GET",
        url: url + "/act/vote/bubbled/doVote/platform",
        data: {
            actId: actId,
            groupIndex: 1,
            token: localStorage.token,
            objectId: localStorage.vote,
            playerId: localStorage.playerId,
            gameZone: localStorage.gameZone
        },
        dataType: 'jsonp',
        jsonp: "jsonCallback",
        success: function (result) {
            if (result.code == 200) {
                var data = result.data;
                console.log(data);
                for (var j = 1; j <= 4; j++) {
                    var vote = ".vote-" + j + " .vote-count";
                    var voteName = "10" + j;
                    $(vote).text(data[voteName]);
                }
                voteOff();
            } else {
                alert(msg[result.code]);
            }
        },
        error: function (err) {
            alert(err);
        }
    });
}

//查询活动信息
function setNum() {
    $.ajax({
        type: "GET",
        url: url + "/act/vote/bubbled/query",
        data: {
            actId: actId,
            sort: false,
            asc: true
        },
        dataType: 'jsonp',
        jsonp: "jsonCallback",
        success: function (result) {
            if (result.code == 200) {
                var nums = result.data.groups[0];
                var objects = nums.objects;
                console.log(objects);
                for (var i = 0, j = 1; i < 4; i++, j++) {
                    var voteCount = ".vote-" + j + " .vote-count";
                    $(voteCount).text(objects[i].count);
                }
            } else {
                alert(msg[result.code]);
            }
        }
    });
}


function reEdit() {
    var serverId = $("#server").val();
    if (serverId < 1) {
        $("#server").val(1);
    }
}

var msg = {
    "1": "Bắt buộc nhập tài khoản và mật khẩu",
    "2": "Bắt buộc nhập server hoặc ID",
    "3": "Thoát đăng nhập",
    "4": "Đăng nhập thành công",
    "5": "Thoát thành công",
    "403": "Đăng nhập trước",
    "108": "Đã bỏ phiếu",
    "301": "Tài khoản hoặc mật mã sai"
};