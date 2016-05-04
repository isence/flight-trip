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
	//初始化加入行程列表的天数
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
		var thisDay = $(".day-list:eq("+day+")");
		var count = thisDay.find('li').length;
		thisDay.append('<li> <span class="destination-name"><em class="ball ball-red">'+count+'</em><a href="javascript:;" class="item-name">'+destination+'</a></span></li>')
		$('#origin-add-menu').hide();
	});
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
		if (date !== '') {
			var arr = date.split('/');
			return arr[2] + '-' + arr[1] + '-' + arr[0];
		}
	}

});