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
	init();
	function init(){
		initDate();
		//初始化行程列表
		initDayList(5);
		//初始化主模块高度
		var height = $(window).height()-143;
		$('.flexslider').height(height);
		//初始化搜索框位置
		if($('.flexslider').length){
			var left =$('.flexslider').offset().left;
			//$('.sidebar,#accordion').css('left', left-50);
			$('.gotop').css('left', left+1205);
		}
	}
	function initDate (){
		var newDate = new Date();
		var start = newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate();
		$('#datepicker').val(start);
		$('#clender').val(GetDateStr(start,5));
	}
	//搜索景点
	$('#search,#edit').click(function(event) {
		$('.flexslider').animate({scrollTop:0});
		search();
	});
	//加载更多景点
	$(".flexslider").scroll(
	function() {
		if ($(".flexslider").scrollTop() >= ($("#search-list").height() - $(".flexslider").height()) && $('#search-list').is(":visible")){
		search();
	}
	});
	//清空列表景点
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
	function hover(){
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
				setTimeout(200);
				if ($('#origin-add-menu :hover').length === 0) {
					$('#origin-add-menu').hide();
				}
			});
		});
	}
	$('#origin-add-menu').hover(function() {}, function() {
		$(this).hide();
	});
	//加入行程
	$('#origin-add-menu dd').on('click', function(event) {
		event.preventDefault();
		var day = $(this).index();
		var destination = addParent.find('.sight_item_caption a').text();
		var address = addParent.find('.address  span').text();
		var img = addParent.find('.show img').attr('src');
		var thisDay = $(".day-list:eq("+day+")");
		var count = thisDay.find('li').length;
		var depCity = $('#homecity_name').val();
		var arrCity = $('#getcity_name').val();
		if (addParent.attr('class').indexOf('sight_item_detail')>-1) {
			thisDay.append('<li class="sight"> <span class="destination-name"><em class="ball ball-red">'+count+'</em><a href="javascript:;" class="item-name"data-address="'+address+'" data-img="'+img+'">'+destination+'</a></span></li>');
		} else {
			thisDay.append('<li class="sight flight"><span class="depCity">'+depCity+'</span><img class="plane" src="/images/plan/edit/airportblue2.png"><span class="arrCity">'+arrCity+'</span><span class="time-msg">06:40</span></li>');
		}
		$('#origin-add-menu').hide();
		thisDay.find('.count').text(count);
	});
	//生成行程列表
	$('#create-list').click(function(event) {
		var trip = {};
		$('.day-container').each(function(index, el) {
			var dayId = 'day'+(index+1);
			var dayTrip = {};
			$(this).find('li.sight').each(function(index, el) {
				var tripId = 'trip'+(index+1);
				var des = {};
				des.num = (index+1);
				if ($(this).attr('class').indexOf('flight') < 0){
					des.sight = $(this).find('a').text();
					des.address = $(this).find('a').attr('data-address');
					des.img = $(this).find('a').attr('data-img');
				}else{
					des.depCity = $(this).find('.depCity').text();
					des.arrCity = $(this).find('.arrCity').text();
				}
				dayTrip[tripId] = des;
			});
			trip[dayId] = dayTrip;
		});
		$(this).data('trip',trip);
		console.log(trip);
		renderList(trip);
	});
	//保存行程至数据库
	$('#save').click(function(event) {
		var username = $('#user-detail').text(),
			trip = $('#create-list').data('trip');
		var data = {
			"uname": username,
			"trip": trip
		};
		$.ajax({
			url: '/save',
			type: 'POST',
			data: data,
			success: function(data, status) {
				if (status == 'success') {
					alert('已保存');
				}
			},
			error: function(data, status) {
				if (status == "error") {
					alert('保存失败，请重试');
				}
			}
		});
	});
   /**
     * [renderList description]
     * @author suanning
     * @param  {[object]} trip [行程列表生成的对象，也可以数据库导入的对象]
     * @return
     */
	function renderList(trip){
		var contentList = $('.content-bd.tripList');
		contentList.find('.everyday-box').remove();
		for (var day in trip) {
			var appendDiv = '<div class="everyday-box"><div class="stock-day"><em><b>'+day+'</b></em><h2 class="stocklist">';
				for (var des in trip[day]){
					var sight = trip[day][des].sight?trip[day][des].sight:'飞行抵达';
					appendDiv += '<span>'+sight+'</span> <img src="/images/plan/show/right-arrow.png">';
				}
				appendDiv +='</h2></div><div class="stock">';
				for (var des in trip[day]){
					if(!trip[day][des].depCity){
						appendDiv += '<div class="stock-info"><span class="index">'+trip[day][des].num+'</span><div class="row"><div class="title mleft60"><img src="'+trip[day][des].img+'"><div class="summary"><h3 class="name"><span class="spot-name">'+trip[day][des].sight+'</span></h3><div class="address"> '+trip[day][des].address+'</div></div></div></div></div>';
					}else{
						appendDiv += '<div class="stock-info"><span class="index">'+trip[day][des].num+'</span><span class="depCity">'+trip[day][des].depCity+'</span><img class="plane" src="/images/plan/edit/airportblue2.png"><span class="arrCity">'+trip[day][des].arrCity+'</span></div>';
					}
				}
				appendDiv +='</div></div>';
      			contentList.append(appendDiv);
    	}
    	$('.flight-list,#search-list,.content-bd.myList').hide();
		$('.content-bd.tripList').show();
	}
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
		//初始化行程添加列表的天数
		initAddList();
	}
	//初始化加入行程列表的天数
	function initAddList() {
		var add_menu = $('#origin-add-menu');
		add_menu.empty();
		$('.day-container').each(function(index, el) {
			index++;
			add_menu.append('<dd><a class="add-day" href="javascript:;">第' + index + '天</a></dd>')
		});
	}
	//清空行程列表
	function clearDayList (){
		$(".day-list li:not('.title')").remove();
	}
	//景点搜索
	function search() {
		var destination = encodeURI($('#Descity').val());
		$('#search-list').empty();
		var page = $('.sight_item_detail ').length > 0 ? $('.sight_item_detail ').length/15+1:1;
		var data = {
			"destination": destination,
			"page":page
		};
		$.ajax({
			url: '/search',
			type: 'POST',
			data: data,
			dataType: "json",
			success: function(data, status) {
				if (status == 'success') {
					for (var i = 0; i < data.data.sightList.length; i++) {
						$('#search-list').append('<div class = "sight_item_detail clrfix"><div class="sight_item_show"><div class="show loading"><div class="imgshadow"></div ><a data - click - type = "l_pic"target = "_blank"hidefocus = "true"title = "广州长隆旅游度假区" ><img class = "img_opacity load"src="'+data.data.sightList[i].sightImgURL+'"></a></div></div><div class="sight_item_about"><h3 class="sight_item_caption"><a data-click-type="l_title" class="name"  target="_blank" hidefocus="true">'+data.data.sightList[i].sightName+'</a></h3><div class="sight_item_info"><div class="clrfix"><span class="level">'+data.data.sightList[i].star+'</span><span class = "area"> [<a target = "_blank"hidefocus = "true"> '+data.data.sightList[i].districts+'</a>]</span ><div class = "sight_item_hot" ><span class = "product_star_level" ><em title = "热度3.5/5" ><span style = "width:70%;" > 热度3.5 / 5</span></em ></span><span class="sight_item_hot_text">热度：</span ></div></div><p class = "address color999" ><span> '+data.data.sightList[i].address+'</span><a href="javascript:void(0)" hidefocus="true" class="map_address blue" data-sightid="371131297">地图</a></p><div class="intro color999" >'+data.data.sightList[i].intro+'</div></div></div><div class="sight_item_pop"><table><tbody><tr><td><span class="sight_item_price"><i>￥</i><em>'+data.data.sightList[i].qunarPrice+'</em>&nbsp;起</span></td></tr><tr><td><span class="sight_item_discount">'+data.data.sightList[i].discount+'</span>&nbsp;&nbsp;&nbsp;<span class="sight_item_source">'+data.data.sightList[i].marketPrice+'</span></td></tr><tr><td><a  target="_blank" hidefocus="true" data-click-type="l_title" class="sight_item_do">加入行程&nbsp;<span>»</span></a></td></tr></tbody></table></div></div>');
					}
					hover();
					$('.content-bd,.flight-list').hide();
					$('#search-list').show();
				}
			},
			error: function(data, err) {
				//alert(12);
			}
		});
	}
	//航班搜索
	function searchFlight() {
		var homecity_name = encodeURI($('#homecity_name').val());
		var getcity_name = encodeURI($('#getcity_name').val());
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
					for (var i = 0; i < data.result.length; i++) {
						$('#J_FlightListBox').append('<div class="flight-list-item clearfix J_FlightItem" data-origin-no="0"><table><tbody><tr class="flight-item-tr"><td class="flight-line"><div class="pi-flightlogo-nl pi-flightlogo-nl-KN"><p class="airline-name"><span class="J_line J_TestFlight">'+data.result[i].complany+'</span></p><p class="line-name">'+data.result[i].name+'</p></div></td><td class="flight-time"><p class="flight-time-deptime">'+data.result[i].DepTime+'</p><p><span class="s-time">'+data.result[i].ArrTime+'</span></p></td><td class="flight-port"><div class="port-detail"><p class="port-dep">'+data.result[i].startAirport+'</p><p class="port-arr">'+data.result[i].endAirport+'</p></div></td><td class="flight-ontime-rate"><p>'+data.result[i].OnTimeRate+'</p></td><td class="flight-price "><p>'+data.result[i].FlyTime+'</p></td><td class="flight-operate"><a target="_blank" hidefocus="true" data-click-type="l_title" class="sight_item_do">加入行程&nbsp;<span>»</span></a></td></tr></tbody></table></div>');
					}
				}
				hover();
				$('.content-bd,#search-list,.content-bd.myList').hide();
				$('.flexslider').animate({scrollTop:0});
				$('.flight-list').show();
			},
			error: function(data, err) {
				alert('查询失败，请输入正确城市');
			}
		});

	}
	//日期格式化
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
       if(start ===null||start.lengt===0||end===null||end.length===0){
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