var lastInputBox;

$(document).ready(function() {
                // Controls menu hide/show
		$('#hotdog').click(function(){
                        $('#controls').toggleClass("active");
                        });

		// Reset view
    $('.reset-container').click(function(){ reset_view(); });
		$('#submitfindbyname').click(function() {
		      var selected = $('#findbyselect option:selected').text();
		      zoomfocus(selected);
		});
		$('#route_output').change(function() {
			 var stop=$('#route_output :selected').parent().attr('label');
			 zoomfocus(stop);
		});
		$('#calctnd').click(function() {

			removeEntity('arrow');
			lastInputBox = null;
			var speed = {'speed': $('#speed').val(), 'unit':$ ('#speedunit option:selected').val() };
			populateRoutePlan( $('#pointa  option:selected').text() , $('#pointb  option:selected').text(),speed );


		});
		$('#cbs').click(function() {populateFBSelect(); });
		$('#cbp').click(function() {populateFBSelect(); });
		$("#pointa").focus(function() {
			lastInputBox = "pointa";
		//	console.log('Updating last touched box to : ' + lastInputBox)
		});
		$("#pointb").focus(function() {
			lastInputBox = "pointb";
		//	console.log('Updating last touched box to : ' + lastInputBox)
		});
		String.prototype.capitalize = function(lower) {
    return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
		};


});


function populateUserFields() {
	// Populate findby box
	populateFBSelect();
  // Populate pointa and pointb dropdowns
	var types = ['planets','stations'];
	option = "";
	for (var type in types){
			var keys = Object.keys(listobjects(types[type]));
			var captype = types[type];
			captype = captype.capitalize()
			option += '<optgroup label="'+ captype + '">';
			keys.sort().forEach(function(element, index, array){
				 option += '<option value="'+ escapeHTML(element) + '">' + escapeHTML(element) + '</option>';
			 });
			 option += '</optgroup>';

 	}

 	$('#pointa').html(option);
	$('#pointb').html(option);

}
function populateFBSelect() {
	//Populate find by select dropdown
	 var types = [];
	 var checkboxes = document.getElementsByName("objtype");
	 for (var type in checkboxes) {
	 if(checkboxes[type].checked) {
			types[type] = checkboxes[type].value;
		}

	 }
	 var option = '';
	 for (var type in types) {
		 				var captype = types[type];
		 				captype = captype.capitalize()
		 				option += '<optgroup label="'+ captype + '">';
						var keys = Object.keys(listobjects(types[type]));
						keys.sort().forEach(function(element, index, array){
							 option += '<option value="'+ escapeHTML(element) + '">' + escapeHTML(element) + '</option>';
						 });
						  option += '</optgroup>';

	}

	$('#findbyselect').html(option);

}

function openTab(evt,tabName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("wvg-tools");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("wvg-tablink");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" wvg-tab-active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " wvg-tab-active";
}

function escapeHTML(text) {
       var chr = { '"': '"', '&': '&', '<': '[', '>': ']' };
       function abc(a)
       {
          return chr[a];
       }
       return text.replace(/[\"&<>]/g, abc);
}

function timeformat(secs) {
	  var s = new Decimal(secs);
    var hours = new Decimal(secs / 3600);
		var h = hours.floor(); //Get whole hours
		s = s - (h * 3600);
		var m = new Decimal(s / 60); //Get remaining minutes
		m = m.floor();
    s = s - (m * 60 );
		s = Math.round(s,0)
	//	console.log("Hours :"+ h);
	//	console.log("Minutes :"+ m);
	//	console.log("Seconds :"+ s);
	//	console.log("Input :"+ secs);
		return h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
}

function populateRoutePlan(pointa,pointb,speed) {
		if ( pointa != pointb ) {
			// Populate legacy (trip total) fields with route info
			$('#cal_start').html( pointa );
			$('#cal_end').html( pointb );
			$('#cal_speed').html( speed.speed + " " + speed.unit );
			var route = calcBestRoute(pointa,pointb);
			console.log(route)
			var dist = route.distance;
			var eta = calcETA(speed,dist);
			$('#cal_eta').html( timeformat(eta) );
			$('#cal_dist').html( dist.toFixed(2) + " PC");

			// Populate the route plan select area
			lastWaypoint = {'name': pointa, gate:false};
			var routeplan;
			route.stops.forEach(function(waypoint,index,self) {
				routeplan += '<optgroup label="' + waypoint.name + '">';
				if(typeof self[index+1] != 'undefined' ) {
					if(waypoint.gate && self[index+1].gate) {routeplan += '<option>^---- Gate From</option>'; }
					console.log(waypoint.gate)
				}
				if(waypoint.gate && lastWaypoint.gate) {routeplan += '<option>^---- Gate Exit</option>'; }

				if(!waypoint.gate || (!lastWaypoint.gate && waypoint.gate)) {
					routeplan += '<option>Distance:' + calcDist(lastWaypoint.name,waypoint.name) + '</option>'
					routeplan += '<option>ETA: ' + timeformat(calcETA(speed,calcDist(lastWaypoint.name,waypoint.name))) + '</option>';
					drawline(grabPositionByName(lastWaypoint.name),grabPositionByName(waypoint.name));
				}
				lastWaypoint = waypoint;
			});
				$('#route_output').html(routeplan);
			//drawline(grabPositionByName($('#pointa  option:selected').text()),grabPositionByName($('#pointb  option:selected').text()));
	}
}
