//插件初始化
    var mySwiper = new Swiper('.swiper-container',{
        loop: true, // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
        },
        autoplay: 3000
    });
    var myIscroll = new IScroll(".content",{
    scrollBar:true,
    fadeScrollbars:true,
    mousewheel:true,
    click:true,
});

//全局变量
    var state = "wait";


//添加事件
//完成未完成按钮
$(".btnbox div").click(function () {
    $(".btnbox div").removeClass("active")
        .filter(this)
        .addClass("active");
    if($(".wait").hasClass("active")){
        state = "wait"
    }else{
        state = "down";
    }
    rewrite();
    myIscroll.scrollTo(0,0,0)
});

//添加
$("#add").click(function () {
    $("#main")
        .css("filter", "blur(7px)");
    $(".shuru").delay(300)
        .queue(function () {
            $(this).addClass("show")
                .dequeue();
            $("#text")[0].focus();
        });

});

//提交
$(".tijiao").click(function(){
    var data = getData();
    var text = $("#text").val();
    $("#text").val("");
    if(text === ""){
        return;
    }
    var time = new Date().getTime();
    var color = getColor();
    data.push({con:text,time,isDone:0,color})
    saveData(data);
    rewrite();
    $(".shuru")
        .removeClass("show")
        .hide()
        .prev()
        .css("filter","")
});

//关闭
$(".cha").click(function () {
    $(".shuru")
        .removeClass("show")
        .hide()
        .prev()
        .css("filter", "")
});



function rewrite() {
    var data=getData();
    $(".content ul").empty();
    data.reverse();
    var str="";
    $.each(data,function (index,val) {
        if(state === "wait") {
            if(val.isDone === 0){
                str += "<li  id="+index+"><div class='time'><span>"+getdate(val.time)+"</span><span>"+getTime(val.time)+"</span></div><span class='sp3'>"+val.con+ "</span><div class='right'></div></li>";
            }
        }else if(state ==="down"){
            if(val.isDone ===1){
                str += "<li style='background:#ccc' id="+index+"><div class='time'><span>"+getdate(val.time)+"</span><span>"+getTime(val.time)+"<br></span></div><span class='sp3'>"+val.con+ "</span><div class='del'></div></li>";
            }
        }
    });
    $(".content ul").html(str);
    addEvent()
}
rewrite();



$(".content").on("click",".right",function(){
        var data = getData();
        var index = $(this).parent().attr("id");
        data.reverse();
        data[index].isDone = 1;
        data.reverse();
        saveData(data);
        rewrite();
    });
$(".content").on("click","i",function(){
        var data = getData();
        var index = $(this).parent().attr("id")
        data.reverse();
        data[index].isStar = data[index].isStar?0:1;
        data.reverse();
        saveData(data);
        rewrite();
    });
$(".content").on("click","p",function(){
    var text = $(this).html();
    $("#mian")
        .css("filter","blur(2px)")
        .delay(1000)
        .queue(function () {
            $(this).addClass("show").dequeue();
            $(this).html(text)
        })

});
$(".content").on("click",".del",function(){
        var data = getData();
        var index = $(this).parent().attr("id");
        data.reverse();
        data.splice(index,1);
        data.reverse();
        saveData(data);
        rewrite();
    });



//工具函数
function getData() {
    return localStorage.todo?JSON.parse(localStorage.todo):[];
}
function saveData(data) {
        localStorage.todo = JSON.stringify(data);
    }

function getdate(ms) {
    var date=new Date();
    date.setTime(ms);
    var year=date.getFullYear();
    var month=addZero(date.getMonth());
    var day=addZero(date.getDay());
    return year+"-"+month+"-"+day;
}
function addZero(num) {
    return num<10?"0"+num:num
}
function getTime(ms) {
    var date=new Date();
    date.setTime(ms);
    var hours=addZero(date.getHours());
    var fen=addZero(date.getMinutes());
    var miao=addZero(date.getSeconds());
    return hours+":"+fen+":"+miao
}

var max = $(window).width()/3;
function addEvent(){
        $(".content li").each(function(index,ele){
            var hummer = new Hammer(ele);
            var mx;
            var state = "start";
            hummer.on("panstart",function(e){
                $(ele).css("transition","none");
                sx=e.srcEvent.clientX;
            });
            hummer.on("pan",function(e){
                mx = e.deltaX;
                if(state === "start"){
                    if(mx > 0){
                        return;
                    }
                } else if(state === "end"){
                    if(mx < 0){
                        return;
                    }
                    mx = mx - max;
                }
                if(Math.abs(mx) > max){
                    return;
                }
                $(ele).css("transform","translate3d("+mx+"px,0,0)")
            });
            //拖动结束
            hummer.on("panend",function(){
                $(ele).css("translate","all .5s");
                $(ele).css("transition","all 0.5s");
                if(Math.abs(mx)>max/2){
                    state="end";
                    $(ele).css("transform","translate3d("+(-max)+"px,0,0)");
                }else{
                    state="start";
                    $(ele).css("transform","translate3d(0,0,0)");
                }

            })
        })

    }
function clear(){
    var data = getData();
    $.grep(data,function(ele,index){
        return ele.isDown === 0
    });
    saveData(data);
    rewrite();

}
function getColor() {
    var str = "#";
    var colorArr=[0,3,6,9,"c"];
    for(var i=0;i<3;i++){
        var pos=Math.floor(Math.random()*colorArr.length);
        str+=colorArr[pos];
    }
    return str;
}


