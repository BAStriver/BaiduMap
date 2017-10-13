/**
 * Created by Administrator on 2017/9/6.
 */

var wechatMap = function () {
	
	let map; // 地图对象
	let walking; // 规划线路对象
	
	// 规划线路
	let $searchStart; // 搜索起点
	let $searchEnd; // 搜索终点
	
	function init() {
		
		map = CustomMap.getMap();
		
		$searchStart = $('#searchStart');
		$searchEnd = $('#searchEnd');
		
		walking = new BMap.WalkingRoute(map, {renderOptions: {map: map, panel: "result", autoViewport: true}});
		
		$('#searchWay').click(function () {
			if($searchStart.val().trim() === '') {
				toastr.warning('请输入起点!');
				return false;
			}
			if($searchEnd.val().trim() === '') {
				toastr.warning('请输入终点!');
				return true;
			}
			
			walking.search($searchStart.val(), $searchEnd.val());
		});
		
	}
	
	return {
		init: () => {
			init();
		}
	}
}();
