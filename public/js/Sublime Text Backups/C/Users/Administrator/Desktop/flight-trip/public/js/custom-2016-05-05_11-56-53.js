/*
 *	Author: Pixel Art Inc.
 *	URL:	http://www.pixelartinc.com
 */


jQuery(document).ready(function() {

	$ = jQuery;

	//Flex Slider
	$('.flexslider').flexslider({
		animation: "slide"
	});
	//Accordions
	$("#accordion").accordion();
	$("#widget_accordion").accordion();
	$("#slider_tabs").tabs();
	// //For Reservation form
	$("#datepicker").datepicker();
	$("#clender").datepicker();
	$('.scrollbar1').tinyscrollbar();
	//初始化日期
	initDate();
	function initDate (){
		var newDate = new Date();
		var start = newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate();
		$('#datepicker').val(start);
		$('#clender').val(GetDateStr(start,5));
	}
	//初始化行程列表
	initDayList(5);
	//初始化行程添加列表的天数
	initAddList();
	//搜索景点
	$('#search').click(function(event) {
		search();
	});
	//清空景点
	$('#clear-list').click(function(event) {
		clearDayList();
	});
	//搜索航班
	$('#searchFlight').click(function(event) {
		searchFlight();
	});
	$('#searchBack').click(function(event) {
		var homecity_name = $('#homecity_name').val();
		var getcity_name = $('#getcity_name').val();
		$('#homecity_name').val(getcity_name);
		$('#getcity_name').val(homecity_name);
		searchFlight();
	});
	//日期计算
	$('#clender,#datepicker').change(function(event) {
		var start = formatDate($('#datepicker').val());
		var end = formatDate($('#clender').val());
		//start = formatDate(start);
		//end = formatDate(end);
		$('#datepicker').val(start);
		$('#clender').val(end);
		var days = compareDate(start,end);
		if(days >= 0){
			initDayList(days);
		}else{
			$('#clender').val(GetDateStr(start,5));
			initDayList(5);
		}
	});

	//显示添加列表的位置
	var addParent = '';
	$('.sight_item_do').each(function(index, el) {
		$(this).hover(function() {
			addParent = $(this).parents('.sight_item_detail').length>0 ? $(this).parents('.sight_item_detail') : $(this).parents('.flight-item-tr');
			var add_menu = $('#origin-add-menu');
			var top = $(this).offset().top + 33;
			var left = $(this).offset().left;
			add_menu.show();
			add_menu.offset({
				top: top,
				left: left
			});
		}, function() {
			if ($('#origin-add-menu :hover').length === 0) {
				$('#origin-add-menu').hide();
			}
		});
	});
	$('#origin-add-menu').hover(function() {}, function() {
		$(this).hide();
	});
	//加入行程
	$('#origin-add-menu dd').on('click', function(event) {
		event.preventDefault();
		var day = $(this).index()-1;
		var destination = addParent.find('.sight_item_caption a').text();
		var address = addParent.find('.address  span').text();
		var thisDay = $(".day-list:eq("+day+")");
		var count = thisDay.find('li').length;
		thisDay.append('<li class="sight"> <span class="destination-name"><em class="ball ball-red">'+count+'</em><a href="javascript:;" class="item-name"data-address="'+address+'">'+destination+'</a></span></li>')
		$('#origin-add-menu').hide();
		thisDay.find('.count').text(count);
	});
	//生成行程列表
	$('#create-list').click(function(event) {
		var contentList = $('.content-bd');
		contentList.empty();
		$('.day-container').each(function(index, el) {
			var appendDiv = '<div class="everyday-box"> <div class="stock-day"> <em><b>D'+(index+1)+'</b></em> <h2 class="stocklist">';
			$(this).find('li.sight').each(function(index, el) {
				var sight = $(this).find('a').text();
				appendDiv += '<span>'+sight+'</span><img src="/images/plan/show/right-arrow.png">';
			});
			appendDiv += '</h2></div></div>';
			contentList.append(appendDiv);
			//contentList.append('<div class="everyday-box"> <div class="stock-day"> <em><b>D'+(index+1)+'</b></em> <h2 class="stocklist"> </h2> </div> </div>')
		});
	});
	//根据日期间隔天数，生成行程规划列表
		/**
	     * [initDayList description]
	     * @author suanning
	     * @param  {[number]} days [日期间隔天数]
	     * @return
	     */
	function initDayList (days){
		var startDate = formatDate($('#datepicker').val());
		$('.day-container').remove();
		for (var i = days - 1; i >= 0; i--) {
			var dateMsg = GetDateStr(startDate,(days-i));
			$('.added-oneday').before('<div class="destination day-container" id="'+(days-i)+'"> <i class="u1 ui-circle-green fn-click-empty"></i> <ul class="list destination-list day-list ui-sortable"> <li class="title"> <h3 class="bg-green clearfix"> <span class="convert-block"> 第<span class="day-sequence">'+(days-i)+'</span>天 <em> (<span class="count">0</span>) </em> </span> <strong class="date-msg">'+dateMsg+' </strong> </h3> </li></ul></div>');
		}
		initAddList();
	}
	//初始化加入行程列表的天数
	function initAddList() {
		var add_menu = $('#origin-add-menu');
		$('.day-container').each(function(index, el) {
			index++;
			add_menu.append('<dd><a class="add-day" href="javascript:;">第' + index + '天</a></dd>')
		});
	}
	//清空行程列表
	function clearDayList (){
		$(".day-list li:not('.title')").remove();
	}
	//登录函数
	function login() {
		var username = $('#username').val(),
			password = $('#password').val();
		var data = {
			"uname": username,
			"upwd": password
		};
		$.ajax({
			url: '/login',
			type: 'POST',
			data: data,
			success: function(data, status) {
				if (status == 'success') {
					location.href = 'home';
				}
			},
			error: function(data, status) {
				if (status == "error") {
					location.href = 'login';
				}
			}
		});
	}
	//注册函数

	function register() {
		var name = $('#username').val(),
			password = $('#password').val();
		var data = {
			"uname": name,
			upwd: password
		};
		$.ajax({
			url: '/register',
			type: 'POST',
			data: data,
			success: function(data, status) {
				if (status == 'success') {
					location.href = 'login';
				}
			},
			error: function(data, err) {
				location.href = 'register';
			}
		});
	};

	function search() {
		var destination = encodeURI($('#Descity').val());
		var data = {
			"destination": destination
		};
		$.ajax({
			url: '/search',
			type: 'POST',
			data: data,
			dataType: "json",
			success: function(data, status) {
				if (status == 'success') {
					//console.log(data.data);
					$('#search-list .sight_item_detail').each(function(index, el) {
						$(this).find('.sight_item_caption a').text(data.data.sightList[index].sightName);
						$(this).find('.level').text(data.data.sightList[index].star);
						$(this).find('.address.color999 span').text(data.data.sightList[index].address);
						$(this).find('.area a').text(data.data.sightList[index].districts);
						$(this).find('.sight_item_price em').text(data.data.sightList[index].qunarPrice);
						$(this).find('.sight_item_discount').text(data.data.sightList[index].discount);
						$(this).find('.sight_item_source').text(data.data.sightList[index].marketPrice);
						$(this).find('.intro.color999').text(data.data.sightList[index].intro);
						$(this).find('.show.loading .img_opacity ').attr('src', data.data.sightList[index].sightImgURL);
						clearDayList();
					});
				}
			},
			error: function(data, err) {
				//alert(12);
			}
		});
	}

	function searchFlight() {
		var homecity_name = encodeURI($('#homecity_name').val());
		var getcity_name = encodeURI($('#getcity_name').val());
		//var datepicker =encodeURI(formatDate($('#datepicker').val()));
		//var clender =encodeURI(formatDate($('#clender').val()));
		//var data = { "homecity_name": homecity_name,"getcity_name": getcity_name,"datepicker": datepicker,"clender": clender};
		var data = {
			"homecity_name": homecity_name,
			"getcity_name": getcity_name
		};
		$.ajax({
			url: '/searchFlight',
			type: 'POST',
			data: data,
			dataType: "json",
			success: function(data, status) {
				//data = JSON.parse(data.slice(15, -3));
				console.log(data);
				if (status == 'success') {
					$('.flight-item-tr').each(function(index, el) {
						$(this).find('.J_line.J_TestFlight').text(data.result[index].complany);
						$(this).find('.line-name').text(data.result[index].name);
						$(this).find('.flight-time-deptime').text(data.result[index].DepTime);
						$(this).find('.s-time').text(data.result[index].ArrTime);
						$(this).find('.port-dep').text(data.result[index].startAirport);
						$(this).find('.port-arr').text(data.result[index].endAirport);
						$(this).find('.flight-ontime-rate p').text(data.result[index].OnTimeRate);
						$(this).find('.flight-price p').text(data.result[index].FlyTime);
					});
				}
			},
			error: function(data, err) {
				alert(12);
			}
		});

	}

	function formatDate(date) {
		if (date && date.indexOf('/')>-1) {
			var arr = date.split('/');
			return arr[2] + '-' + arr[0] + '-' + arr[1];
		}else{
			return date;
		}
	}
	//计算两个日期间隔
	/**
     * [compareDate description]
     * @author suanning
     * @param  {[string]} start [日期，格式为2016-05-04]
     * @param  {[string]} end [日期，格式为2016-05-04]
     * @return {[number]} Inter_Days [两日期间隔天数]
     */
	function compareDate(start,end){
       if(start==null||start.length==0||end==null||end.length==0){
           return 0;
       }
       var arr=start.split("-");
       var starttime=new Date(arr[0],parseInt(arr[1]-1),arr[2]);
       var starttimes=starttime.getTime();
       var arrs=end.split("-");
       var endtime=new Date(arrs[0],parseInt(arrs[1]-1),arrs[2]);
       var endtimes=endtime.getTime();
       var intervalTime = endtimes-starttimes;//两个日期相差的毫秒数 一天86400000毫秒
       var Inter_Days = ((intervalTime).toFixed(2)/86400000)+1;//加1，是让同一天的两个日期返回一天
       return Inter_Days;
   }
   //获取某个日期，过n天后的日期
   /**
     * [GetDateStr description]
     * @author suanning
     * @param  {[string]} date [日期，格式为2016-05-04]
     * @param  {[number]} AddDayCount    [想获取AddDayCount天后的日期]
     * @return {[string]}        [日期，格式为2016-05-04]
     */
    function GetDateStr(date,AddDayCount) {
    	if(date){
	    	var arrs = date.split("-");
		    var dd=new Date(arrs[0],parseInt(arrs[1]-1),arrs[2]);
		    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
		    var y = dd.getFullYear();
		    var m = dd.getMonth()+1;//获取当前月份的日期
		    var d = dd.getDate()-1;
		    return y+"-"+m+"-"+d;
    	}
	}
});