define(function(require,exports) {
    var jq=require("./jq/1.11.1/jquery");
    var bs=require("./bootstrap/3.3.0/js/bootstrap.min");
    var nav=require("./common_default/nav_add2.0");
    var fun=require("./common_default/com_function");

    var qkycal=require("./plug-in/qky_calendar/qky_calendar2.0");
    var dw=require("./common_cadr/dropdown_havevalue");
    var file=require("./common_cadr/file");
    var rc=require("./common_cadr/radio_checkbox1.2");
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
        fun.showCard(2);    
        $(".tcweek-i").click(function(){
            var types="";
            if($(this).hasClass("left")) types="prv"; else types="next";
            var tsd=fun.getShowDate();
            var csd=fun.changeweek(Number(tsd[0]),Number(tsd[1]),Number(tsd[2]),types);
            fun.jcdist(Number(csd[0]),Number(csd[1]),Number(csd[2])); 
            fun.showCard(2);           
        });
        poptips.poptips_run($("body"),{modalid:"cjAll",modaltitle:"提示",modalcontent:"共催缴账单记录XX条，是否发送催缴通知？"});   
    }

    exports.tcgl_edit=function(){
        opt.navli_j[0].isactive=false;
        opt.navli_j[1].isactive=true;
        $("#qkynav").qkynav(opt);

        fun.jcdistAdd(toy,tom+1,tod); 
        $("tr.old").remove();
        var addid="";//菜品添加到星期几去的缓存指引
        var reid="";//删除那个菜品的缓存指引
        fun.drawAddCp();//把菜品数据渲染到弹窗里

        //加号点击后
        $("body").on("click",".cdul li.add",function(){
            addid=$(this);
            $('#jc-add').modal('show');
            
        });  

       //弹框内交互部分
            //加到选区的交互
            $("body").on("click","#jc-adddraw-box .onc",function(){
                $(this).parent().toggleClass("active").find(".cdul_del").hide();
                $("#jc-adddraw-box .cho .cdul").html("");
                $("#jc-adddraw-box .cdul li.active").each(function(){
                    $("#jc-adddraw-box .cho .cdul").append('<li>'+$(this).html()+'</li>');
                });
            });

            //确定加入
            $(".cp_join").click(function(){
                var newcp=$(".cho .cdul").html();
                addid.before(newcp);
                $(".jc-draw-box .cdul_del").show();
            });

            //删除方面的交互
            $("body").on("click",".jc_delcp",function(){
                var yxid=$("#jc-adddraw-box .cho_option .cdul li:not('.active') .cdul_del");
                if($(this).attr("isc")=="no"){yxid.show();$(this).attr("isc","yes");}
                else{yxid.hide();$(this).attr("isc","no");}
            });
            poptips.poptips_run($("body"),{modalid:"isdel",modaltitle:"提示",modalcontent:"是否确定删除",okeybutton_click:function(){
                reid.remove();
            }});
            poptips.poptips_run($("body"),{modalid:"alldel",modaltitle:"提示",modalcontent:"是否确定删除全部",okeybutton_click:function(){
                $(".jc-draw-box .cdul li:not('.add')").remove();
            }});

            $("body").on("click",".cdul_del",function(){
                $('#isdel').modal('show');
                reid=$(this).parent();
            });

        $(".clearAll").click(function(){
            $('#alldel').modal('show');
        }); 
    }
    exports.tcgl_mang=function(){
        opt.navli_j[0].isactive=false;
        opt.navli_j[1].isactive=true;
        $("#qkynav").qkynav(opt);

        $(".mang-edit").click(function(){
            $(".mang-save").removeClass("yc");
            $(".mangbox").removeClass("ba_f5");
            $("input").removeAttr("disabled");
            rc.radio_run(function(i){});
            qkycal.qkycalendar({boxid:".qkycalendar_box.only_hm.one",isshowtime:"hm",isshowym:false,isinput:true,isdistshowdate:true});
            qkycal.qkycalendar({boxid:".qkycalendar_box.only_hm.two",isshowtime:"hm",isshowym:false,isinput:true,isdistshowdate:true});
            qkycal.qkycalendar({boxid:".qkycalendar_box.only_hm.lone",isshowtime:"hm",isshowym:false,isinput:true,isdistshowdate:true});
            qkycal.qkycalendar({boxid:".qkycalendar_box.only_hm.ltwo",isshowtime:"hm",isshowym:false,isinput:true,isdistshowdate:true});
            qkycal.qkycalendar({boxid:".qkycalendar_box.only_hm.done",isshowtime:"hm",isshowym:false,isinput:true,isdistshowdate:true});
            qkycal.qkycalendar({boxid:".qkycalendar_box.only_hm.dtwo",isshowtime:"hm",isshowym:false,isinput:true,isdistshowdate:true});
            $("#dayorweek label").click(function(){
                var id=$(this).attr("toid");
                $(".dctime_choose").addClass("yc");
                $("#"+id).removeClass("yc");
            });
        });
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