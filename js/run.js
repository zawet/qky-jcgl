define(function(require,exports) {
    var jq=require("./jq/1.11.1/jquery");
    var bs=require("./bootstrap/3.3.0/js/bootstrap.min");
    var jq=require("./common_default/nav_add2.0");
    var fun=require("./common_default/com_function");

    var qkycal=require("./plug-in/qky_calendar/qky_calendar2.0");
    var dw=require("./common_cadr/dropdown_havevalue");
    var poptips=require("./common_default/poptips");
    var weekname = new Array("周日","周一","周二","周三","周四","周五","周六");  

    var myDate = new Date();
    var toy=myDate.getFullYear();    //获取完整的年份(4位,1970-????)
    var tom=myDate.getMonth();       //获取当前月份(0-11,0代表1月)
    var tod=myDate.getDate();        //获取当前日(1-31)

    
    exports.index=function(){
        $("#qkynav").qkynav(opt);
        fun.jcdist(toy,tom+1,tod);
        $(".tcweek-i").click(function(){
            var types="";
            if($(this).hasClass("left")) types="prv"; else types="next";
            var tsd=fun.getShowDate();
            var csd=fun.changeweek(Number(tsd[0]),Number(tsd[1]),Number(tsd[2]),types);
            fun.jcdist(Number(csd[0]),Number(csd[1]),Number(csd[2]));            
        })   
    }

    exports.dc=function(){
        $("#qkynav").qkynav(opt);
        fun.getTimes();
        fun.jcdist(toy,tom+1,tod);
        $("tr.old").remove();
        $(".tcweek-i").click(function(){
            var types="";
            if($(this).hasClass("left")&&!$(this).hasClass("none")) types="prv"; else if($(this).hasClass("right")) types="next"; else types="other";
            var tsd=fun.getShowDate();
            var csd=fun.changeweek(Number(tsd[0]),Number(tsd[1]),Number(tsd[2]),types);
            fun.jcdist(Number(csd[0]),Number(csd[1]),Number(csd[2]));   
            var tweeks=fun.getoneweek(Number(csd[0]),Number(csd[1]),Number(csd[2]),7);
            var today=toy+"-"+(tom+1)+"-"+tod;
            if($.inArray(today,tweeks)!=-1){//判断此周是否在当前周
                $(".tcweek-i.left").addClass("none");
            }else{
                $(".tcweek-i.left").removeClass("none");
            }
            $("tr.old").remove();              
        });

        $(".jc-draw-box").on("click","tr.new .cdul li",function(){
            $(this).toggleClass("active").siblings().removeClass("active");
        });

        $(".clearchoose").click(function(){
            $("tr.new .cdul,tr.today .cdul").find("li").removeClass("active");
        })
        $(".surechoose").click(function(){
            $(".jc-motc").html("");
            $(".jc-draw-box tr.new").each(function(){
                var weekd=$(this).find(".week").html();
                var lt=$(this).find(".ul ul.lunch li.active .cdname").html();
                var dt=$(this).find(".ul ul.dinner li.active .cdname").html();
                if(fun.isNull(lt)=="kong") lt="未订餐";
                if(fun.isNull(dt)=="kong") dt="未订餐";
                $(".jc-motc").append('<tr><td>'+weekd+'</td><td>'+lt+'</td><td>'+dt+'</td></tr>');
            });
        })
    }

    exports.his=function(){
        $("#qkynav").qkynav(opt);
        qkycal.qkycalendar({boxid:".qkycalendar_box.default"});
    }

    exports.tcgl=function(){
        opt.navli_j[0].isactive=false;
        opt.navli_j[1].isactive=true;
        $("#qkynav").qkynav(opt);
        
        fun.jcdist(toy,tom+1,tod);
        $(".tcweek-i").click(function(){
            var types="";
            if($(this).hasClass("left")) types="prv"; else types="next";
            var tsd=fun.getShowDate();
            var csd=fun.changeweek(Number(tsd[0]),Number(tsd[1]),Number(tsd[2]),types);
            fun.jcdist(Number(csd[0]),Number(csd[1]),Number(csd[2]));            
        })   
    }
    
    exports.tj=function(){
        opt.navli_j[0].isactive=false;
        opt.navli_j[2].isactive=true;
        $("#qkynav").qkynav(opt);
        qkycal.qkycalendar({boxid:".qkycalendar_box.default",isdistshowdate:true,clickday:function(id,istime,isym,isday){
            howWeek();
        }});
        $(".jc-today-date").val(toy+"-"+(tom+1)+"-"+tod);
        howWeek();
        $(".tj-today").click(function(){
            $(".jc-today-date").val(toy+"-"+(tom+1)+"-"+tod);
            howWeek();
        });
        $(".tj-tomorrow").click(function(){
            var day3 = new Date();
            day3.setTime(day3.getTime()+24*60*60*1000);
            var s3 = day3.getFullYear()+"-" + (day3.getMonth()+1) + "-" + day3.getDate();
            $(".jc-today-date").val(s3);
            howWeek();
        });
        function howWeek(){
            var td=$(".jc-today-date").val().split("-");
            var tweek=new Date(Number(td[0]),(Number(td[1])-1),Number(td[2]));
            $(".tweek").html(weekname[tweek.getDay()]);
        } 
    }
    exports.cfgl=function(){
        opt.navli_j[0].isactive=false;
        opt.navli_j[3].isactive=true;
        $("#qkynav").qkynav(opt);       
    }
    exports.cfgl_jy=function(){
        opt.navli_j[0].isactive=false;
        opt.navli_j[3].isactive=true;
        $("#qkynav").qkynav(opt); 
        poptips.poptips_run($("body"),{modalid:"cjAll",modaltitle:"提示",modalcontent:"共催缴账单记录XX条，是否发送催缴通知？"});
        poptips.poptips_run($("body"),{modalid:"cjChack",modaltitle:"提示",modalcontent:"共查出要催缴账单记录XX条，是否发送催缴通知？"});
        poptips.poptips_run($("body"),{modalid:"cjSig",modaltitle:"提示",modalcontent:"是否对关小女 2017/12/11-2017/12/17 的餐费，发送催缴通知？"});
    }
    exports.cfgl_dz=function(){
        opt.navli_j[0].isactive=false;
        opt.navli_j[3].isactive=true;
        $("#qkynav").qkynav(opt); 
        qkycal.qkycalendar({boxid:".qkycalendar_box.default"});      
    }
    
 
});