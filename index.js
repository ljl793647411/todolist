var mySwiper = new Swiper ('.swiper-container', {
    loop: true,
    autoplay:3000,
    // 如果需要分页器
    pagination: {
        el: '.swiper-pagination',
    },
});
var myIscroll = new IScroll(".content",{
    scrollBar:true,
    fadeScrollbars:true,
    mousewheel:true,
    click:true,
});


// var state = "wait";
$("#bottomBar i").click(function () {
    $("#bottomBar i").removeClass("active").filter(this).addClass("active")
    // if($(".wait").hasClass("active")){
    //     state = "wait";
    // }else{
    //     state = "done";
    //     // reWrite();
    //     myIscroll.scrollTo(0,0,0);
    // }
});



$("#add").click(function () {
    $("#main")
        .css("filter","blur(2px)")
        .next()
        .show()
        .find("#editarea")
        .delay(500)
        .queue(function () {
            $(this).addClass("show").dequeue();
            $("#text")[0].focus(); //将jQuery对象转化为原生对象
            // $("#text").get(0).focus();

        });


});

$("#close").click(function () {
    $("#text")
        .val("")
        .parent()
        .removeClass("show")
        .parent()
        .hide()
        .prev()
        .css("filter","")
});

$("#submit").click(function () {
    var data = getData();
    var text = $("#text").val();
    if(text === ""){
        return;
    }
    var time = new Date().getTime();//转化为毫秒数
    var color = getColor();
    data.push({con:text,time,isStar:0,isDone:0,color});
    saveData(data);
    // $("#text").val("");
    reWrite();
    $("#text")
        .val("")
        .parent()
        .removeClass("show")
        .parent()
        .hide()
        .prev()
        .css("filter","")
});

var state = "wait";
$(".wait,.done").click(function () {
    $(this)
        .addClass("active")
        .siblings()
        .removeClass("active");
    if($(".wait").hasClass("active")){
        state = "wait";
        $(".trash").hide();
    }else{
        state = "done";
        $(".trash").show();
    }
    reWrite();
    IScroll.refresh();

})

function reWrite() {
    var data = getData();
    $(".content ul").empty();
    // data.reverse();//顺序颠倒
    var str = "";
    $.each(data,function (index,val) {
        if (state === "wait") {
            if (val.isDone === 0) {
                val.className=val.isStar?"active":"";
                str += "<li style = 'background: "+val.color+"' id='"+index+"'><input type='checkbox' id='check'><div class='wenben'>  <time><span>"+getData(val.time)+"</span><span>"+getTime(val.time)+"</span></time><br> <p>"+val.con+"</p> <i class='"+className+"'>0</i> </div><div class='right'>完成</div></li>"
            }
        }
        else if(state==="done"){
            if(val.isDone===1){
                val.className=val.isStar?"active":"";
                str += "<li style = 'background: #ccc' id='"+index+"'><input type='checkbox' id='check'><div class='wenben'>  <time><span>"+getData(val.time)+"</span><span>"+getTime(val.time)+"</span></time><br> <p>"+val.con+"</p> <i class='"+className+"'>0</i> </div><div class='delete'>完成</div></li>"
            }
        }
    });
    $(".content ul").html(str);
    addEvent();
    myIscroll.refresh();
}
reWrite();

// 加星标
$(".content").on("click","i",function () {
    var data = getData();
    data.reverse();
    var index = $(this).parent().attr("id");
    data[index].isStar=data[index].isStar?0:1;
    data.reverse();
    saveData(data);
    reWrite();
});

// 删除
$(".content").on("click",".right",function () {
    var data = getData();
    var index = $(this).parent().attr("id");
    date.reverse();//倒序
    data[index].isDone=1;
    data.reverse();
    saveData();
    reWrite();
});


$(".content").on("click",".delete",function () {
    var data = getData();
    var index = $(this).parent().attr("id");
    data.reverse();
    data.splice(index,1);
    data.reverse();
    saveData(data);
    reWrite();
});

//清空
function clear() {
    var data = getData();
    data = $.grep(data,function (ele,index) {
        //过滤
        return ele.isDone===0;
    });
    saveData(data);
    reWrite();
}

// 内容处理
$(".content").on("click","p",function () {
    var text = $(this).html();
    $("#main")
        .css("filter","blur(2px)")
        .next()
        .show()
        .find("#showarea")
        .delay(1000)
        .queue(function () {
            $(this).addClass("show").dequeue();
            $(this).html(text);
        })
})


// 拖拽函数
// var max = $(window).width()/750*100*2.5;
var max = $(window).width()/3;
function addEvent() {
    var lis = $(".content ul li");
    var state = "start";
    lis.each(function (index,ele) {
        var hammer = new Hammer(ele);
        var mx;
        hammer.on("panstart",function (e) {//开始拖动
            $(ele).css("transition","none");
            sx=e.srcEvent.clientX;
        });
        hammer.on("pan",function (e) {
            mx=e.deltaX;
            if(state==="start"){
                if(mx>0){
                    return;
                }
            }else if(state==="end"){
                if(mx<0){
                    return;
                }
                mx=mx-max;
            }
            if(Math.abs(mx)>max){
                return;
            }
            $(ele).css("transform","translate3d("+mx+"px,0,0)");
        });
        // 拖动结束
        hammer.on("panend",function () {
            $(ele).css("transition","all 0.5s");
            if(Math.abs(ms)>max/2){
                state="end";
                $(ele).css("transform","translate3d("+(-max)+"px,0,0)");
            }else{
                state="start";
                $(ele).css("transform","translate3d(0,0,0)");
            }
        })
    })
}


// 工具函数
function getData() {
    return localStorage.todo?JSON.parse(localStorage.todo):[];
}
function saveData(data) {
    localStorage.todo=JSON.stringify(data);
}
// 获取时间
function getData(ms) {
    var date = new Date();
    date.setTime(ms);
    var year = date.getFullYear();
    var month = addzero(date.getMonth()+1);
    var day = addzero(date.getDate());
    return year+"-"+month+"-"+day;
}
function getTime(ms) {
    var date = new Date();
    date.setTime(ms);
    var hour = addzero(date.getHours());
    var minute = addzero(date.getMinutes());
    var second = addzero(date.getSeconds());
    return hour+":"+minute+":"+second;
}
//时间前加0
function addzero(num) {
    return num<10?0+num:num;
}
// 安全色
function getColor() {
    var str = "#";
    var colorArr=[0,3,6,9,"c"];
    for(var i=0;i<3;i++){
        var pos=Math.floor(Math.random()*colorArr.length);
        str+=colorArr[pos];
    }
    return str;
}

