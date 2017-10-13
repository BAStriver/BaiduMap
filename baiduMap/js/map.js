/**
 * Created by Administrator on 2017/9/6.
 *
 * <script type="text/javascript"
 * src="http://api.map.baidu.com/api?v=2.0&ak=zEmj4dVtxEI2nDXxeiCge79GNRh6lLtw"></script>
 *
 * <style>body, html{width: 100%;height: 100%;overflow: hidden;margin:0;font-family:"΢���ź�";}
 * {height:100%;overflow: hidden;}</style>
 */

var CustomMap = function () {
	
	var map; // ��ͼ
	var marker; // ��ͼ��ǰλ�ñ��
	
/*��������*/
	var localCityName; // ��ǰ��������
	var localCityPoint; // ��ǰλ������
	var currentLongitude, currentLatitude ; // ��ǰ��������� ��γ��
	
	// 1.�������������߿ؼ�
	var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// ���Ͻǣ���ӱ�����
	var top_left_navigation = new BMap.NavigationControl();  //���Ͻǣ����Ĭ������ƽ�ƿؼ�
	var top_right_navigation = new BMap.NavigationControl(
			{anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}
			); //���Ͻǣ�������ƽ�ƺ����Ű�ť
	/*���ſؼ�type����������:
	 BMAP_NAVIGATION_CONTROL_SMALL��������ƽ�ƺ����Ű�ť��
	 BMAP_NAVIGATION_CONTROL_PAN:������ƽ�ư�ť��BMAP_NAVIGATION_CONTROL_ZOOM�����������Ű�ť*/
	
	// 2.��ͼ���͡�����ͼ�ؼ�
	var mapType1 = new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP]});
	var mapType2 = new BMap.MapTypeControl({anchor: BMAP_ANCHOR_TOP_LEFT});
	
	var overView = new BMap.OverviewMapControl();
	var overViewOpen = new BMap.OverviewMapControl({isOpen:true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT});
	
	// 3.��λ�ؼ�
	// var navigationControl = new BMap.NavigationControl({
	// 	// �����Ͻ�λ��
	// 	anchor: BMAP_ANCHOR_TOP_LEFT,
	// 	// LARGE����
	// 	type: BMAP_NAVIGATION_CONTROL_LARGE,
	// 	// ������ʾ��λ
	// 	enableGeolocation: true
	// }); // ��Ӵ��ж�λ�ĵ����ؼ�
	var geolocationControl = new BMap.GeolocationControl();// ��Ӷ�λ�ؼ�
	
	// 4.��Ӱ�Ȩ�ؼ����޸ĵ�ͼ��Ȩ��ʾ
	var cr = new BMap.CopyrightControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT});   //���ð�Ȩ�ؼ�λ��
	
	// 7.���ȫ��ͼ���
	var panoramaControl = new BMap.PanoramaControl();
	
/*
 * ��ʼ��
 */
	// ��ʼ�� ��ͼ
	function initAllMap(placeholder = 'allmap') {
		map = new BMap.Map(placeholder);
		// map.centerAndZoom(new BMap.Point(116.331398, 39.897445), 11);
		setCurrentPositionByIp();
		map.enableScrollWheelZoom(true); // ���ù��ַŴ���С��Ĭ�Ͻ���
		map.enableInertialDragging(); // ���õ�ͼ������ק��Ĭ�Ͻ���
		map.enableContinuousZoom(); // ������������Ч����Ĭ�Ͻ���
		
		map.setMapStyle({style:'bluish'});
		/*
		 *<option value="normal">Ĭ�ϵ�ͼ��ʽ</option>
		 * <option value="light">���������</option>
		 * <option value="dark">��ҹ���</option>
		 * <option value="redalert">��ɫ������</option>
		 * <option value="googlelite">������</option>
		 * <option value="grassgreen">��Ȼ�̷��</option>
		 * <option value="midnight">��ҹ�����</option>
		 * <option value="pink">�����۷��</option>
		 * <option value="darkgreen">�ഺ�̷��</option>
		 * <option value="bluish">�������̷��</option>
		 * <option value="grayscale">�߶˻ҷ��</option>
		 * <option value="hardedge">ǿ�߽���</option>
		 */
		
		// console.log('map.getCenter() ', map.getCenter());
		initControls();
		bindCurrentPointByClickEvent();
		bindCurrentMapStyleBySelectEvent();
		bindCurrentPositionByInputPlaceEvent();
		bindCurrentPositionByInputPointEvent();
	}
	
	// ��ʼ�� �ؼ�
	function initControls() {
		addControl_ToolBarAndScale();
		addControl_MaptypeAndThumbnail();
		addControl_Location();
		addControl_Copyright();
		// addControl_CustomControl();
		addControl_Citylist();
		addControl_Panorama();
	}
	// �����ʰȡ����ʱ��
	function bindCurrentPointByClickEvent() {
		map.addEventListener("click",function(e){
			currentLongitude = e.point.lng;
			currentLatitude = e.point.lat;
			// alert(e.point.lng + "," + e.point.lat);
			$('#searchLongitude').val(e.point.lng);
			$('#searchLatitude').val(e.point.lat);
		});
	}
	// ���û���ѡ�������ͼ��ʽ
	function bindCurrentMapStyleBySelectEvent() {
		$('#mapStyle').change(function() {
			map.setMapStyle({style:$(this).val()});
		});
	}
	// ���û�����ĵ������ݲ�ѯλ���¼�
    function bindCurrentPositionByInputPlaceEvent() {

        var ac = new BMap.Autocomplete(    //����һ���Զ���ɵĶ���
            {
                "input": "searchPlace"
                , "location": map
            });

        ac.addEventListener("onhighlight", function (e) {  //�����������б��ϵ��¼�
            var str = "";
            var _value = e.fromitem.value;
            var value = "";
            if (e.fromitem.index > -1) {
                value = _value.province + _value.city + _value.district + _value.street + _value.business;
            }
            str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

            value = "";
            if (e.toitem.index > -1) {
                _value = e.toitem.value;
                value = _value.province + _value.city + _value.district + _value.street + _value.business;
            }
            str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
            document.getElementById("searchResultPanel").innerHTML = str;
        });

        var myValue;
        ac.addEventListener("onconfirm", function (e) {    //����������б����¼�
            var _value = e.item.value;
            myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
            document.getElementById("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

			(function(){
                map.clearOverlays();    //�����ͼ�����и�����

                var local = new BMap.LocalSearch(map, { //��������
                    onSearchComplete: function () {
                        var pp = local.getResults().getPoi(0).point;    //��ȡ��һ�����������Ľ��
                        map.centerAndZoom(pp, 18);
                        map.addOverlay(new BMap.Marker(pp));    //��ӱ�ע
                    }
                });
                local.search(myValue);
			})()
        });
    }
    // ���û�����������ѯ�ص��¼�
    var currentMarker ;
    function bindCurrentPositionByInputPointEvent() {
		$('#searchLongitude, #searchLatitude').change(function() {
			var lng = $('#searchLongitude').val();
			var lat = $('#searchLatitude').val();
			if (lng != '' && lat != '') {
				if(currentMarker){
					// ɾ��ԭ����marker
					map.removeOverlay(currentMarker);
				}
				
				map.panTo(new BMap.Point(lng, lat));
				currentMarker = setMarker(lng, lat, false, "����~",true);
			}
		});
    }
    
/*
 * �������ԡ��ؼ�����
 */
	// ��ȡ ��ǰ������Ϣ
	function setLocalProperty(name, point) {
		localCityName = name;
		localCityPoint = point;
		// console.log('name = ', name, 'point', point);
		
		// ��ӱ�עͼ��
		marker = new BMap.Marker(point);
		marker.setLabel(new BMap.Label("��ǰ����",{offset:new BMap.Size(20,-10)}));
		map.addOverlay(marker);
		
		// ��ʾ��ǰ����
		$('#currentPoint').text('��ǰ���꣺'+parseInt(point.lng)+':'+parseInt(point.lat));
	}
	
	// 1.��� �������������߿ؼ���
	// �ڵ�ͼ�����ϡ����Ϸֱ�չʾ������������ʽ������ƽ�ƿؼ���ͬʱ�ڵ�ͼ�����Ϸ�չʾ�����߿ؼ��������ť�鿴Ч��
	function addControl_ToolBarAndScale() {
		map.addControl(top_left_control);
		map.addControl(top_left_navigation);
		// map.addControl(top_right_navigation);
	}
	// 2.��� ��ͼ���͡�����ͼ�ؼ���
	// �����ͼ���Ϳؼ��л���ͨ��ͼ������ͼ����άͼ�����ͼ������ͼ+·���������½�������ͼ�������ť�鿴Ч��
	function addControl_MaptypeAndThumbnail() {
		map.addControl(mapType1);          //2Dͼ������ͼ
		// map.addControl(mapType2);          //���Ͻǣ�Ĭ�ϵ�ͼ�ؼ�
		// map.setCurrentCity(localCityName);        //������3Dͼ����Ҫ���ó���Ŷ
		map.addControl(overView);          //���Ĭ�����Ե�ͼ�ؼ�
		// map.addControl(overViewOpen);      //���½ǣ���
	}
	// 3.��Ӷ�λ�ؼ��������λ��־�����ֶ���λ
	function addControl_Location() {
		// map.addControl(navigationControl);
		
		geolocationControl.addEventListener("locationSuccess", function(e){
			// ��λ�ɹ��¼�
			var address = '';
			address += e.addressComponent.province;
			address += e.addressComponent.city;
			address += e.addressComponent.district;
			address += e.addressComponent.street;
			address += e.addressComponent.streetNumber;
			// alert("��ǰ��λ��ַΪ��" + address);
		});
		geolocationControl.addEventListener("locationError",function(e){
			// ��λʧ���¼�
			alert(e.message);
		});
		
		map.addControl(geolocationControl);
	}
	// 4.��Ӱ�Ȩ�ؼ����޸ĵ�ͼ��Ȩ��ʾ
	function addControl_Copyright() {
		// TODO
		map.addControl(cr); //��Ӱ�Ȩ�ؼ�
		var bs = map.getBounds();   //���ص�ͼ��������
		cr.addCopyright({id: 1, content: "<a href='#' style='font-size:20px;'>@Copyright Hato</a>", bounds: bs});
	}
	// 5.����Զ���ؼ����ڵ�ͼ���Ͻ����"�Ŵ�2��"�Զ���ؼ���˫���Ŵ��ͼ2��
	function addControl_CustomControl() {
		// TODO
	}
	// 6.��ӳ����б�ؼ�
	function addControl_Citylist() {
		var size = new BMap.Size(10, 20);
		map.addControl(new BMap.CityListControl({
			anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
			offset: size,
			// �л�����֮���¼�
			// onChangeBefore: function(){
			//    alert('before');
			// },
			// �л�����֮���¼�
			// onChangeAfter:function(){
			//   alert('after');
			// }
		}));
	}
	// 7.���ȫ��ͼ�ؼ�
	function addControl_Panorama() {
        panoramaControl.setOffset(new BMap.Size(20, 50));
        map.addControl(panoramaControl);//���ȫ���ؼ�
	}
	
/*
 *	��λ����
 */
	// �����������λ����ȡ��ǰλ������
	function setCurrentPositionByBrowser() {
		var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function (r) {
			if (this.getStatus() == BMAP_STATUS_SUCCESS) {
				marker = new BMap.Marker(r.point);
				map.addOverlay(marker);
				map.panTo(r.point);
				// alert('����λ�ã�' + r.point.lng + ',' + r.point.lat);
			}
			else {
				alert('failed' + this.getStatus());
			}
		}, {enableHighAccuracy: true})
		//����״̬��
		//BMAP_STATUS_SUCCESS	�����ɹ�����Ӧ��ֵ��0����
		//BMAP_STATUS_CITY_LIST	�����б���Ӧ��ֵ��1����
		//BMAP_STATUS_UNKNOWN_LOCATION	λ�ý��δ֪����Ӧ��ֵ��2����
		//BMAP_STATUS_UNKNOWN_ROUTE	�������δ֪����Ӧ��ֵ��3����
		//BMAP_STATUS_INVALID_KEY	�Ƿ���Կ����Ӧ��ֵ��4����
		//BMAP_STATUS_INVALID_REQUEST	�Ƿ����󡣶�Ӧ��ֵ��5����
		//BMAP_STATUS_PERMISSION_DENIED	û��Ȩ�ޡ���Ӧ��ֵ��6����(�� 1.1 ����)
		//BMAP_STATUS_SERVICE_UNAVAILABLE	���񲻿��á���Ӧ��ֵ��7����(�� 1.1 ����)
		//BMAP_STATUS_TIMEOUT	��ʱ����Ӧ��ֵ��8����(�� 1.1 ����)
	}
	
	// ����ip��λ
	function setCurrentPositionByIp() {
		var myCity = new BMap.LocalCity();
		myCity.get( function(result) {
			var cityName = result.name;
			map.centerAndZoom(result.center, 15);
			// console.log('result.center ', result.center);
			map.setCenter(cityName);
			setLocalProperty(cityName, result.center);
			// alert("��ǰ��λ����:" + cityName);
			currentLongitude = result.center.lng;
			currentLatitude = result.center.lat;
		} );
	}
	
	// ���ݳ������ƶ�λ
	function setCurrentPositionByLocation(locationName) {
		if (locationName != "") {
			map.centerAndZoom(locationName, 11);      // �ó��������õ�ͼ���ĵ�
		}
	}
	
	// ���ݾ�γ�ȶ�λ
	function setCurrentPositionByPoint(longitude, latitude) {
		if (longitude != "" && latitude != "") {
			map.clearOverlays();
			var new_point = new BMap.Point(longitude, latitude);
			var marker = new BMap.Marker(new_point);  // ������ע
			map.addOverlay(marker);              // ����ע��ӵ���ͼ��
			map.panTo(new_point);
		}
	}
	
/*
* ��Ϣ���ڡ��ص��ע
*/
	function setInfoWindow(title, content, longitude, latitude, iconUrl, isAnimation=false) {
		var point = new BMap.Point(longitude, latitude);
		var marker = new BMap.Marker(point);  // ������ע
		map.addOverlay(marker);              // ����ע��ӵ���ͼ��
		map.centerAndZoom(point, 15);
		var opts = {
			width : 200,     // ��Ϣ���ڿ��
			height: 150,     // ��Ϣ���ڸ߶�
			title : title , // ��Ϣ���ڱ���
			enableMessage:true,//����������Ϣ�����Ͷ�Ϣ
			enableAutoPan : true, //�Զ�ƽ��
		};
		var infoWindow = new BMap.InfoWindow(content, opts);  // ������Ϣ���ڶ���
		marker.addEventListener("click", function(){
			map.openInfoWindow(infoWindow,point); //������Ϣ����
		});
		if(iconUrl) {
			var myIcon=new BMap.Icon(iconUrl, new BMap.Size(45,45));
			marker.setIcon(myIcon);
		}
		if(isAnimation)
			marker.setAnimation(BMAP_ANIMATION_BOUNCE); //�����Ķ���
	}
	function setMarker(longitude, latitude, iconUrl, label, isAnimation=false) {
		var point = new BMap.Point(longitude, latitude);
		var marker = new BMap.Marker(point);  // ������ע
		map.addOverlay(marker);               // ����ע��ӵ���ͼ��
		
		if(isAnimation)
			marker.setAnimation(BMAP_ANIMATION_BOUNCE); //�����Ķ���
		
		if(iconUrl) {
			var myIcon=new BMap.Icon(iconUrl, new BMap.Size(45,45));
			marker.setIcon(myIcon);
		}
		if(label) {
			marker.setLabel(new BMap.Label(label,{offset:new BMap.Size(20,-10)}));
		}
		return marker;
	}
	function setCircle(longitudeR, latitudeR, longitudeL, latitudeL, option = {strokeOpacity:0.1,fillColor:'#ffe6ce',strokeWeight:1}) {
		// ���Ͻǵĵ�
		let point_right = new BMap.Point(longitudeR, latitudeR);
		// ���½ǵĵ�
		let point_left = new BMap.Point(longitudeL, latitudeR);
		// ȡԲ��
		let center = new BMap.Point( (longitudeR+longitudeL)/2, (latitudeR+latitudeL)/2);
		// ȡ��������/2Ϊ�뾶���ף�
		let distance = getPointDistence(point_right, point_left)/2;
		
		var circle = new BMap.Circle(center, distance, option);
		map.addOverlay(circle);            //����Բ
//		var polyline = new BMap.Polyline([point_right,point_left], {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5});  //��������
//		map.addOverlay(polyline);     //������ߵ���ͼ��
		return circle;
	}
	
/*
* ���÷���
*/
	function getMap() {
		return map;// ��ͼ
	}
	function getMarker() {
		return this.marker;// ��ͼ��ǰλ�ñ��
	}
	function getLocalCityName() {
		return localCityName; // ��ǰ��������
	}
	function getLocalCityPoint() {
		return localCityPoint; // ��ǰλ������
	}
	function getCurrentLongitude() {
		return currentLongitude; // ��ǰ��������� ��γ��
	}
	function getCurrentLatitude() {
		return currentLatitude;
	}
	function getPointDistence(left, right) {
		// ��������
		return (map.getDistance(left,right)).toFixed(0);
	}
	
	return {
	/*��ʼ��*/
		// ��ʼ�� ��ͼ
		initAllMap: function (placeholder) {
			initAllMap(placeholder);
		},
		
	/*��λ*/
		// �����������λ����ȡ��ǰλ������
		setCurrentPositionByBrowser: function () {
			setCurrentPositionByBrowser();
		},
		// ����ip��λ
		setCurrentPositionByIp: function () {
			setCurrentPositionByIp();
		},
		// ���ݳ������ƶ�λ
		setCurrentPositionByLocation: function (locationName) {
			setCurrentPositionByLocation(locationName);
		},
		// ���ݾ�γ�ȶ�λ
		setCurrentPositionByPoint: function (longitude, latitude) {
			setCurrentPositionByPoint(longitude, latitude);
		},
		
	/*������Ϣ���ڡ��ص��ע*/
		setInfoWindow: function (title, content, longitude, latitude, iconUrl, isAnimation) {
			setInfoWindow(title, content, longitude, latitude, iconUrl, isAnimation);
		},
		setMarker: function (longitude, latitude,iconUrl, label, isAnimation) {
			return setMarker(longitude, latitude,iconUrl, label, isAnimation);
		},
		setCircle: function (longitudeR, latitudeR, longitudeL, latitudeR, option) {
			return setCircle(longitudeR, latitudeR, longitudeL, latitudeR, option);
		},
		
	/*��ȡ��������*/
		getMap: function () {
			return getMap();
		},
		getMarker: function () {
			return getMarker();
		},
		getLocalCityName: function () {
			return getLocalCityName();
		},
		getLocalCityPoint: function () {
			return getLocalCityPoint();
		},
		getCurrentLongitude: function () {
			return getCurrentLongitude();
		},
		getCurrentLatitude: function () {
			return getCurrentLatitude();
		},
		getPointDistence: function (left, right) {
			return getPointDistence(left, right);
		}
	}
}();

// CustomMap.initAllMap();
 
