// BIU
// Author: 熊猫小A
// Link: https://imalan.cn

console.log(` %c Theme RAW 0.6 %c https://blog.imalan.cn/archives/163/ `, `color: #fadfa3; background: #23b7e5; padding:5px;`, `background: #1c2b36; padding:5px;`);

$(document).scroll(function(){
    if($(window).width()>767) return;
	var before = $(document).scrollTop();
    $(document).scroll(function() {
        if($(document).scrollTop()+$(window).height()>=$("#footer-info").offset().top){
            $(".nav-links").css("transform","translateY(0)");
            return;
        }
        var after = $(document).scrollTop();
        if (before<after && after>40 ) {
            $(".nav-links").css("transform","translateY(calc(100% + 5px))");
            before = after;
        };
        if (before>after || after<=40) {
            $(".nav-links").css("transform","translateY(0)");
            before = after;
        };
    });
});

nextUrl="";
function loadMorePosts(){
    if(nextUrl==null) return;
    var target;
    if(nextUrl=="") target=$(".next").attr("href");
    else target=nextUrl;
    if(target!="" && typeof(target)!="undefined"){
        $("#index-loadmore-btn").html(`<div class="idot"></div><div class="idot"></div><div class="idot"></div>`);
        $.ajax({
            url:target,
            async:true,
            success:function(data){
                nextUrl=$(data).find(".next").attr("href");
                $("#post-list").append($(data).find("#post-list").html());
                if(typeof(nextUrl)=="undefined"){
                    $("#index-loadmore-btn").html("没有了");
                    nextUrl=null;
                }else{
                    $("#index-loadmore-btn").html("加载更多");
                }
                
            },
            error:function(){
                alert('加载失败！');
            }
        });
    }else{
        $("#index-loadmore-btn").html("没有了");
    }
}

function parseURL(){
    var domain=document.domain;
    $(`a:not(a[href^="#"]):not('.post-like')`).each(function(i,item){
        if((!$(item).attr("target") || (!$(item).attr("target")=="" && !$(item).attr("target")=="_self" ))){
            if(item.host!=domain){
                $(item).attr("target","_blank");
            }
        }
    })
}

function fixItem(item,fix,offset){
    if(fix){
        $(item).css("top",String(offset)+"px");
        $(item).css("left",$(item).offset().left);
        $(item).addClass("fixed");
    }else{
        $(item).removeClass("fixed");
        $(item).css("top","unset");
        $(item).css("left","unset");
    }
}

var ctrler_offset;
var toc_offset;
function registerFixedCtrler(){
    ctrler_offset=0;
    $(document).scroll(function(){
        if($("#ctrler").length<1) return;
        if(!ctrler_offset){
            ctrler_offset=$("#ctrler").offset().top;
            return;
        }
        var top=$("#ctrler").offset().top-$(document).scrollTop();
        if(top<=1 && $("#ctrler").offset().top>=ctrler_offset){
            fixItem("#ctrler",true,0);
        }
        else{
            fixItem("#ctrler",false,0);
            ctrler_offset=$("#ctrler").offset().top;
        } 
    })
}

function registerFixedTOC(){     
    toc_offset=0;
    $(document).scroll(function(){
        if($("#TOC").length < 1) return;
        $("#TOC").css("max-width",$("aside").width()+"px");
        if(!toc_offset){
            toc_offset=$("#TOC").offset().top;
            return;
        }
        var top=$("#TOC").offset().top-$(document).scrollTop();
        if(top<=61 && $("#TOC").offset().top>=toc_offset){
            fixItem("#TOC",true,60);
        }
        else{
            fixItem("#TOC",false,60);
            toc_offset=$("#TOC").offset().top;
        } 
    })
}

function parsedPhotos(){
    var nPhotos=$("article .photos img").length;
    var parsedPhotos=0;
    $.each($("article .photos"),function(i,item){
        var MinHeight=10000000000000;
        $.each($(item).find("img"),function(ii,iitem){
            var theImage = new Image(); 
            theImage.onload=function(){
                $(iitem).parent().attr("data-height",String(theImage.height));
                $(iitem).parent().attr("data-width",String(theImage.width));
                MinHeight=MinHeight<theImage.height?MinHeight:theImage.height;
                $(item).attr("data-min-h",String(MinHeight));
                parsedPhotos++;
                if(parsedPhotos>=nPhotos){
                    $.each($("article .photos a"),function(i,item){
                        $(item).css("flex",String(parseFloat($(item).parent().attr("data-min-h"))/parseFloat($(item).attr("data-height"))));
                    })
                }
            }
            theImage.src = $(iitem).attr( "src"); 
        })
    })
}

$(document).ready(function(){
    parsedPhotos();
    parseURL();
    $.each($(".nav-link"),function(i,item){
        if($(item).attr("href")==window.location.pathname) $(item).addClass("current");
    })
    registerFixedCtrler();
    registerFixedTOC();
    hljs.initHighlightingOnLoad();
})

function switchNightMode(){
    var night = document.cookie.replace(/(?:(?:^|.*;\s*)night\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '0';
    if(night == '0'){
        $("html").addClass("night");
        document.cookie = "night=1;path=/"
        console.log('夜间模式开启');
    }else{
        $("html").removeClass("night");
        document.cookie = "night=0;path=/"
        console.log('夜间模式关闭');
    }
}

(function(){
    if($("html").hasClass("night")) return;
    if($("html").hasClass("day")){
        $("html").removeClass("night");
        return;
    }
    if(document.cookie.replace(/(?:(?:^|.*;\s*)night\s*\=\s*([^;]*).*$)|^.*$/, "$1") === ''){
        if(new Date().getHours() > 21 || new Date().getHours() < 7){
            $("html").addClass("night");
            document.cookie = "night=1;path=/";
            console.log('夜间模式开启');
        }else{
            $("html").removeClass("night");
            document.cookie = "night=0;path=/";
            console.log('夜间模式关闭');
        }
    }else{
        var night = document.cookie.replace(/(?:(?:^|.*;\s*)night\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '0';
        if(night == '0'){
            $("html").removeClass("night");
        }else if(night == '1'){
            $("html").addClass("night");
        }
    }
})();