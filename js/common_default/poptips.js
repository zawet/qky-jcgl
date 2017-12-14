

//提示性一句话的弹窗js模块

define(function(require,exports) {
	
	var com=require("./com_function");
	
	exports.poptips_run=function(id,options){
		//弹窗默认参数
		var opts={
		"modalid":"save",
		"modalsize":"modal-xs",
		"modaltitle":"保存页面",
		"modalcontent":"日程已经创建成功",
		"modalcontent_color":"mian_color",
		"buttons":true,
		"buttons_name":["确定","取消"],
		"okeybutton_click":function(i){},
		"modalsrc":	"./mould_html/poptips_mould.html"	
	     }
		if (!isValid(options))return this;
		opts = $.extend({}, opts, options);//有传值进来后，进行对默认覆盖
		
		com.htmlajax(opts.modalsrc,function(pophtml){//异步过来html主体
			id.append("<div class='yc' id='poptips_hc'></div>");
			$("#poptips_hc").html(pophtml);
			$("#poptips_hc .modal").attr("id",opts.modalid);
			$("#poptips_hc .modal-dialog").addClass(opts.modalsize);
			$("#poptips_hc .modal-title").html(opts.modaltitle);
			$("#poptips_hc .modal-body").html(opts.modalcontent).addClass(opts.modalcontent_color);
			
			if(opts.buttons){
				//console.log(opts.buttons_name);
				if(opts.buttons_name.length>1){
					$("#poptips_hc .btn").eq(0).html(opts.buttons_name[0]);
					$("#poptips_hc .btn").eq(1).html(opts.buttons_name[1]).show();
				}else{
					$("#poptips_hc .btn").eq(0).html(opts.buttons_name[0]);
					$("#poptips_hc .btn").eq(1).hide();
				}
				$("body").on("click","#"+opts.modalid+" .okeybtn",function(){
					opts.okeybutton_click($(this));
				});
			}else{
				$("#poptips_hc .modal-footer").addClass("yc");
			}
			id.append($("#poptips_hc").html());
			$("#poptips_hc").remove();
		});
	}
	
	//私有方法，检测参数是否合法
	function isValid(options) {
		return !options || (options && typeof options === "object") ? true : false;
	}
});