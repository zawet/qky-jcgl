

//公用函数

define(function(require,exports) {
	var jq=require("../jq/1.11.1/jquery");
	var Data=require("../tcdata");
	var myDate = new Date();
    var toy=myDate.getFullYear();    //获取完整的年份(4位,1970-????)
    var tom=myDate.getMonth();       //获取当前月份(0-11,0代表1月)
	var tod=myDate.getDate();        //获取当前日(1-31)
	var th=myDate.getHours();       //获取当前小时数(0-23)
	var tm=myDate.getMinutes();     //获取当前分钟数(0-59)
	var ts=myDate.getSeconds();     //获取当前秒数(0-59)
    var dayNames = new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");  
	
	//异步获取html
	exports.htmlajax=function(url,sucfun){
		var urlhtml="";
		$.ajax({
		  url: url,
		  cache: false,
		  success: function(html){
			 sucfun(html);
		  }
		});	
	}
	//判断某字符串是否为空
	exports.isNull=function (data){ 
    	return (data == "" || data == undefined || data == null) ? "kong" : data; 
	}
	//计时器
	exports.getTimes=function(){
        setInterval(function(){
            $(".jc-dcover-time").html(th+":"+tm+":"+ts);
            ts++;if(ts>=60){ts=0;tm++;if(tm>=60){tm=0;th++;if(th>=24)th=0;}}
        },1000);
	}
	
	//初始化周期，渲染初始表格和添加初始化数据
     exports.jcdist=function(y,m,d){
        exports.setShowDate(y,m,d);//设置默认显示周的日期
        var sd=exports.getShowDate();//获取此周开始日期（由星期一开始算一周）
        var tweeks=exports.getoneweek(Number(sd[0]),Number(sd[1]),Number(sd[2]),7);//获取一周的所有日期；
        exports.drawWeek(tweeks,$(".jc-draw-box"));//渲染表格
        exports.drawTc(Data.tcdata);//渲染数据    
	}  
	
	//宣染数据
	exports.drawTc= function (data){
        $(".jc-draw-box tr").each(function(i){  
			var td=$(this).attr("date");
			var keys=[];
            for(var key in data){
				keys.push(key);
                if($.inArray(td,keys)!=-1){
					if(key==td){
						$(this).addClass("hasdata");
						joinTc(data[key].lunch,$(this).find(".lunch"),true);
						joinTc(data[key].dinner,$(this).find(".dinner"),true);
					}
                }else{
					$(this).find(".lunch").html("未添加套餐");
					$(this).find(".dinner").html("未添加套餐");					
				}
			}	
        });
		exports.showCard(1);
	}

	function joinTc(tcdata,id,type){
		var liHtml="";
		var src="images/";
		var az=["A","B","C","D","E","F","G"]
		for(var i=0;i<tcdata.length;i++){
			var act="";
			if(type) if(tcdata[i].isActive) act="active";
			liHtml+='<li class="'+act+'">'+
			'<img src="'+src+tcdata[i].tcimg+'">'+
			'<span class="cdname">'+az[i]+"-"+tcdata[i].tcname+'<b>'+tcdata[i].tcprice+'元</b></span>'+
			'<i class="qkyicon_14 onchoose">&#xe619;</i>'+
			'</li>';
		}
		id.html(liHtml);
	}


	//编辑页初始化渲染
	exports.jcdistAdd=function(y,m,d){
        exports.setShowDate(y,m,d);//设置默认显示周的日期
        var sd=exports.getShowDate();//获取此周开始日期（由星期一开始算一周）
        var tweeks=exports.getoneweek(Number(sd[0]),Number(sd[1]),Number(sd[2]),7);//获取一周的所有日期；
        exports.drawWeek(tweeks,$(".jc-draw-box"));//渲染表格
        exports.drawTcAdd(Data.tcdata);//渲染数据    
	}  
	
	//宣染数据
	exports.drawTcAdd= function (data){
        $(".jc-draw-box tr").each(function(i){  
			var td=$(this).attr("date");
			var keys=[];
            for(var key in data){
				keys.push(key);
                if($.inArray(td,keys)!=-1){
					if(key==td){
						$(this).addClass("hasdata");
						$(this).find(".lunch").html(joinTc_r(data[key].lunch,false));
						$(this).find(".dinner").html(joinTc_r(data[key].dinner,false));
					}
                }	
			}
			var addHtml='<li class="add"><i class="qkyicon_14">&#xe616;</i></li>';
			$(this).find(".lunch").append(addHtml);
			$(this).find(".dinner").append(addHtml);	
        });
	}
	//渲染菜品列表（弹窗里的）
	exports.drawAddCp= function (){
		var id=$("#jc-adddraw-box");
		var addTypeHtml='<tr class="cho"><td class="week">已选菜品</td><td class="ul"><ul class="cdul clear"></ul></td></tr>';
		var addliHtml="";
		for(var key in Data.cpdata){
			for(var i=0;i<Data.cpdata[key].length;i++){
				addliHtml=joinTc_r(Data.cpdata[key],true);
			}
			addTypeHtml+='<tr class="cho_option" cptype="'+key+'"><td class="week">'+Data.cpTypeName[key]+'</td><td class="ul"><ul class="cdul clear">'+addliHtml+'</ul></td></tr>';
		}
		id.html(addTypeHtml);
	}

	function joinTc_r(tcdata,type){
		var liHtml="";
		var src="images/";
		var az=["A","B","C","D","E","F","G"]
		for(var i=0;i<tcdata.length;i++){
			var act="";
			if(type) if(tcdata[i].isActive) act="active";
			liHtml+='<li class="'+act+'"><div class="onc">'+
			'<img src="'+src+tcdata[i].tcimg+'">'+
			'<span class="cdname">'+az[i]+"-"+tcdata[i].tcname+'<b>'+tcdata[i].tcprice+'元</b></span>'+
			'<i class="qkyicon_14 onchoose">&#xe619;</i></div><a class="cdul_del"><i class="qkyicon_14">&#xe618;</i></a>'+
			'</li>';
		}
		return liHtml;
	}

	//判断显示哪个模块
	exports.showCard= function (type){
		if(type==1){
			//判断此周是不是全没数据，没有就显示未发布
			if($(".hasdata").length<=0){
				$(".jc-tctab").hide();
				$(".jc-unsend.one").show();

			}else{
				$(".jc-tctab").show();
				$(".jc-unsend").hide();
			}
		}else{
			$(".jc-unsend").hide();
			if($(".old").length==7){
				$(".jc-tctab").hide();
				$(".jc-unsend.two").show();

			}else if($(".hasdata").length<=0&&$(".old").length<7){
				$(".jc-tctab").hide();
				$(".jc-unsend.one").show();
			}else{
				$(".jc-tctab").show();
				$(".jc-unsend").hide();
			}
		}
	}

//渲染表格
    exports.drawWeek= function (data,id){
        var dayHtml="";
        for(var i=0;i<data.length;i++){
            var tdate=data[i].split("-");
            var tdates = new Date(Number(tdate[0]),Number(tdate[1])-1,Number(tdate[2]));
            var weeks=tdates.getDay();
            var isOld="new";
            if (tdates<myDate) isOld="old";
            if (Number(tdate[0])==toy&&Number(tdate[1])==(tom+1)&&Number(tdate[2])==tod) isOld="today";
            dayHtml+=
            '<tr class='+isOld+' date="'+data[i]+'">'+
            '<td class="week"><span>'+dayNames[weeks]+'</span><b>'+data[i]+'</b></td>'+
            '<td class="ul"><ul class="cdul wus clear lunch"></ul></td>'+
            '<td class="ul"><ul class="cdul wus clear dinner"></ul></td>'+
            '</tr>';
        }
		id.html(dayHtml);
		$("tr.today").addClass("new");
    }


	exports.setShowDate=function (y,m,d){
        $(".tcweek-date label").html("("+exports.week_seday(y,m,d,"s")+"~"+exports.week_seday(y,m,d,"e")+")").attr("sdate",exports.week_seday(y,m,d,"s"));
    }
    exports.getShowDate= function (){
        return $(".tcweek-date label").attr("sdate").split("-");
    }

    //指定一周开始日期改变周数据
	exports.changeweek= function (y,m,d,type){
        var sd=[];
		var thisy,thism,thisd;
		thisy=y;thism=m;thisd=d;
		if(type=="prv"){
					thisd=thisd-7;
					if(thisd<1){
						thism--;	
						if(thism<1){thisy--;thism=12;}else{thisy=thisy;thism=thism;}
						thisd=DayNumOfMonth(thisy,thism)+thisd;	
					}else{
						thisd=thisd;thisy=thisy;thism=thism;
					}
					
		}else if(type=="next"){
					thisd=thisd+7;
					if(thisd>DayNumOfMonth(thisy,thism)){
						thisd=thisd-DayNumOfMonth(thisy,thism);
						thism++;if(thism>12){thisy++;thism=1;}else{thisy=thisy;thism=thism;}	
					}else{
						thisd=thisd;thisy=thisy;thism=thism;
					}		
        }else{
			thisd=thisd;thisy=thisy;thism=thism;
		}
        sd[0]=thisy;sd[1]=thism;sd[2]=thisd;
		return sd;
	}
	
	//获取指定日当周的起始日期
	exports.week_seday= function (y,m,d,se){
		//执行获取一周数据起始日期
		var thisy,thism,thisd;
		thisy=y;thism=m;thisd=d;
		
		var tweek_sd=tweek_sm=tweek_sy=tweek_ed=tweek_em=tweek_ey=0;
		var week=new Date(thisy,thism-1,thisd).getDay();	
		tweek_sd=thisd-week+1;
		if(tweek_sd<1){
			tweek_sm=thism-1;
			if(tweek_sm<1){tweek_sy=thisy-1;tweek_sm=12;}else{tweek_sy=thisy}
			tweek_sd=DayNumOfMonth(tweek_sy,tweek_sm)+tweek_sd;
		}else{tweek_sm=thism;tweek_sy=thisy;}
		
		tweek_ed=thisd+(6-week)+1;
		if(tweek_ed>DayNumOfMonth(thisy,thism)){
			tweek_ed=tweek_ed-DayNumOfMonth(thisy,thism);
			tweek_em=thism+1;
			if(tweek_em>12){tweek_ey=thisy+1;tweek_em=1;}else{tweek_ey=thisy;}	
		}else{
			tweek_em=thism;tweek_ey=thisy;
	    }
		
		if(se=="s")return tweek_sy+"-"+tweek_sm+"-"+tweek_sd;
		else return tweek_ey+"-"+tweek_em+"-"+tweek_ed;
    }
    
    //获取当前日的一周日期
	exports.getoneweek =function (sy,sm,sd,days){
		var thisweek=[];
		
		var tmpd=sd;var tmpm=sm; var tmpy=sy;
		for(var i=0;i<days;i++){
			if(tmpd>DayNumOfMonth(tmpy,tmpm)){
				tmpd=tmpd-DayNumOfMonth(tmpy,tmpm);
				//console.log(DayNumOfMonth(tmpy,tmpm),tmpd);
				tmpm=tmpm+1;
				if(tmpm>12){
					tmpy=tmpy+1;tmpm=1;
				}else{
					tmpy=tmpy;
				}			
		    }else{
				tmpm=tmpm;tmpy=tmpy;tmpd=tmpd
			}
			thisweek[i]=tmpy+"-"+tmpm+"-"+tmpd;
			tmpd=tmpd+1;
		}
		return thisweek;
    }
    
    //获取指定年月的天数
	function DayNumOfMonth(Year,Month){
		var d = new Date(Year,Month,0);
		return d.getDate();
	}
	
});