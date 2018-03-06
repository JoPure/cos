/**
 * Created by karl.zheng on 2016/5/18.
 */

var url = "http://10.10.18.114:7400";
var actId = 100063;
var flag = true;


//init
function init(){
    localStorage.setItem("vote",0);
    if(localStorage.token!="" & localStorage.token!="undefined"){
        var active = new Date().getTime();
        active -=1800000;
        if(active < parseInt(localStorage.loginTime)){
            $(".playerId").text(localStorage.playerId).css("line-height","30px").css("font-size","18px");
            $(".gameZone").text("Server: "+localStorage.gameZone).css("line-height","30px").css("font-size","18px");
            query();
        }else{
            localStorage.setItem("token","");
            $(".login").trigger("click");
        }
    }else{
        $(".login").trigger("click");
    }
}


$(function(){

     //login method
    $(".login").click(function(){
        if(localStorage.token=="" | localStorage.token=="undefined"){
            $(".wrap").css("display","block");
            $(".loginWindow").css("display","block");
        }else{
            alert(msg[3]);
        }
    });

    $(".close").click(function(){
        $(".wrap").css("display","none");
        $(".loginWindow").css("display","none");
        clean();
    });

    $(".loginButton").click(function(){
        if(flag){
            flag = false;
            var username = $('#username').val();
            var password = $('#password').val();
            var gameZone = $('#server').val();
            var playerId = $('#characterID').val();

            //alert(username+password+server+characterID);

            if(username=="" | password==""){
                alert(msg[1]);
            }else if(gameZone=="" | playerId==""){
                alert(msg[2]);
            }else{
                var hash = hex_md5(password);

                $.ajax({
                    type: "POST",
                    url: url+"/user/login",
                    data: {
                        userName: username,
                        password: hash,
                        version: 'v3'
                    },
                    dataType: 'jsonp',
                    jsonp: "jsonCallback",

                    success: function(result){
                        if(result.code==200){
                            alert(msg[4]);
                            //record
                            localStorage.setItem("username",username);
                            localStorage.setItem("password",hash);
                            localStorage.setItem("gameZone",gameZone);
                            localStorage.setItem("playerId",playerId);
                            localStorage.setItem("token",result.data.token);
                            $(".close").trigger("click");
                            $(".playerId").text(playerId).css("line-height","30px").css("font-size","18px");
                            $(".gameZone").text("Server: "+gameZone).css("line-height","30px").css("font-size","18px");

                            //record login time
                            var myTimer = new Date().getTime();
                            localStorage.loginTime = myTimer;

                            clean();
                            query();
                        }else{
                            alert(msg[result.code]);
                        }
                    },

                    complete: function(){
                       flag = true;
                    },

                    error: function(err){
                        alert(err);
                    }
                });
            }
        }

    });

    //logout
    $(".logout").click(function(){
       localStorage.token = "";
        for(var j=1; j<=4; j++ ){
            var str = ".character"+j+" .voteNum p";
            $(str).text("?????");
            var str2 = "character"+j;
            $("."+str2).css("background","url(img/"+str2+".png)  13px 14px no-repeat");
        }
        $(".playerId").text("LOGIN").css("line-height","89px").css("font-size","28px");
        $(".gameZone").text("").css("line-height","0");
        alert(msg[5]);
    });

    //vote method
    $(".vote").click(function(){
        if(localStorage.token=="" | localStorage.token=="undefined"){
            alert(msg[403]);
            $(".login").trigger("click");
        }else{
            $(".wrap").css("display","block");
            $(".sureWindow").css("display","block");

            var num = $(this).parent().index();
                num = parseInt(num)+1;
            localStorage.setItem("num",num);
                num = "10"+num;
            localStorage.setItem("vote",num);
        }
    });

    $(".sureButton").click(function(){
        $(".wrap").css("display","none");
        $(".sureWindow").css("display","none");

        $.ajax({
            type: "GET",
            url: url+"/act/vote/bubbled/doVote/platform",
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

            success: function(result){
                if(result.code==200){
                    var data = result.data;
                    console.log(data);
                    for(var j=1; j<=4; j++){
                        var str = ".character"+j+" .voteNum p";
                        var str2 = "10"+j;
                        $(str).text(data[str2]);
                    }

                    var str = "character"+localStorage.num;
                    $("."+str).css("background","url(img/"+str+localStorage.num+".png)  13px 14px no-repeat");

                }else{
                    alert(msg[result.code]);
                }
            },

            complete: function(){
                 $(".sureButton").css("disabled","none");
            },

            error: function(err){
                alert(err);
            }
        });
    });

    $(".close2").click(function(){
        $(".wrap").css("display","none");
        $(".sureWindow").css("display","none");
    });

    $(".cancelButton").click(function(){
        $(".wrap").css("display","none");
        $(".sureWindow").css("display","none");
    });
});

function clean(){
    //clean
    $('#username').val("");
    $('#password').val("");
    $('#server').val("");
    $('#characterID').val("");
}

//query history vote
function query(){
    $.ajax({
        type: "GET",
        url: url+"/act/vote/bubbled/voted",
        data: {
            actId: actId,
            token: localStorage.token
        },
        dataType: 'jsonp',
        jsonp: "jsonCallback",

        success: function(result){
            if(result.code==200){
                var data = result.data;
                if(data.length!=0){
                    var num = data[0]-100;
                    var str = "character"+num;
                    $("."+str).css("background","url(img/"+str+num+".png)  13px 14px no-repeat");
                    setNum();
                }
            }else{
                alert(msg[result.code]);
            }
        },

        error: function(err){
            alert(err);
        }
    });
}

//set vote nums
function setNum(){
    $.ajax({
        type: "GET",
        url: url+"/act/vote/bubbled/query",
        data: {
            actId: actId,
            sort: false,
            asc: true
        },
        dataType: 'jsonp',
        jsonp: "jsonCallback",

        success: function(result){
            if(result.code==200){
                var nums = result.data.groups[0];
                var objects = nums.objects;
                console.log(objects);
                for(var i= 0,j=1; i<4; i++,j++ ){
                    var str = ".character"+j+" .voteNum p";
                    $(str).text(objects[i].count);
                }
            }else{
                alert(msg[result.code]);
            }
        }
    });
}

function reEdit(){
    var serverId = $("#server").val();
    if(serverId<1){
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