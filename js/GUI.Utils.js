var lastInputBox;
var netDB;
$.widget("ui.resizable", $.ui.resizable, {
resizeBy: function(newSize) {
		this._mouseStart($.Event("mousedown", { pageX: 0, pageY: 0 }));
		this.axis = 'se';
		var end = $.Event("mouseup", {
				pageX: newSize.width,
				pageY: newSize.height
		});
		this._mouseDrag(end);
		this._mouseStop(end);
}
});
String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};
function radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}
$(document).ready(function() {

		setInterval(update_animations, 100);

		 // Controls menu hide/show
		$('#hotdog').click(function(){
                        $('#controls').toggleClass("active");
    });

		// Reset view
    $('.reset-container').click(function(){ reset_view();});
		$('#submitfindbyname').click(function() {
		      var selected = $('#findbyselect option:selected').text();
					var object = findObjectInfo(selected);
					zoomfocus(selected);
					// Populate information area about target
					//console.log(object)
					var objdata = "<b>Name: </b>" + object.name;
					objdata += "</br /><b>Classification: </b>" + object.type;
					objdata += "<br /><b>Owning Faction:</b>" + object.parent.name;
					objdata += "<br /><b>Location (Galactic Ref.)</b><br /><b>X</b>: " + object.x + "<br/><b>Y</b>: " + object.y + "<br /><b>Z</b>: " + object.z;
					$('#findbydata').html(objdata)
		});
		$('#route_output').change(function() {
			 var stop=$('#route_output :selected').parent().attr('label');
			 var next=$('#route_output :selected').parent().data('nextpoint');
			 if(next && (next != stop)) {
				 zoomfocus_point(grabPositionByName( stop ), grabPositionByName( next ));
				 console.log(here)
			 } else {
			 	zoomfocus(stop);
			}
		});
		$('#fbc_output').change(function() {
			 var beacon=$('#fbc_output :selected').val();
			 zoomfocus("FBC_" + beacon);
		});
		$('#swapab').click(function() {
			var swap=$('#pointa').val();
			$("#pointa").val($("#pointb").val());
			$("#pointb").val(swap);
		});
		$('#calctnd').click(function() {
			removeEntity('arrow');
			lastInputBox = null;
			$('#route_output').html("No route calculated");
			var speed = {'speed': $('#speed').val(), 'unit':$('#speedunit option:selected').val() };
			populateRoutePlan( $('#pointa  option:selected').text() , $('#pointb  option:selected').text(),speed );
		});
		$('#submitfindcoord').click(function() {
			 cleanupFBC();
			 execFBC( $('#fbc-x').val(), $('#fbc-y').val(), $('#fbc-z').val(), $('#fbc_frame option:selected').val() );
		});
		$('rpcoord').keyup(function(e) {
	    if(e.keyCode == 32 || e.keycode == 188 || e.keycode == 13 || e.keycode == 77) {
	        $(this).next().focus();
	    }
		});
		$('.plan_inputs').bind('input', function() {
			var coords = $(this).val().split(" ");
			if ( coords.length > 1 ) {
	 			$('#fbc-z').val( coords[2] );
				$('#fbc-y').val( coords[1] );
				$('#fbc-x').val( coords[0] );
			}
		});
		$('.intel_inputs_coord').bind('input', function() {
			var coords = $(this).val().split(" ");
			if ( coords.length > 1 ) {
				$('#z').val( coords[2] );
				$('#y').val( coords[1] );
				$('#x').val( coords[0] );
			}
		});
		$('.intel_inputs_a_dpp').bind('input', function() {
			var coords = $(this).val().split(" ");
			if ( coords.length > 1 ) {
				$('#dpp_a_z').val( coords[2] );
				$('#dpp_a_y').val( coords[1] );
				$('#dpp_a_x').val( coords[0] );
			}
		});
		$('.intel_inputs_b_dpp').bind('input', function() {
			var coords = $(this).val().split(" ");
			if ( coords.length > 1 ) {
				$('#dpp_b_z').val( coords[2] );
				$('#dpp_b_y').val( coords[1] );
				$('#dpp_b_x').val( coords[0] );
			}
		});
		$('.intel_inputs_heading').bind('input', function() {
			var heading = $(this).val().split(" ");
			if ( heading.length > 1 ) {
				$('#inclination').val( heading[1] );
				$('#azmuth').val( heading[0] );
			} else {
					var heading = $(this).val().split("m");
					if ( heading.length > 1 ) {
						$('#inclination').val( heading[1] );
						$('#azmuth').val( heading[0] );
					}
			 }

		});

		$('#submitfbcclear').click(function() {
					cleanupFBC();
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
		$('.rpcoord').blur(function() {
			 if(!$(this).val()) { $(this).val( $(this).attr("id") ) }

		});
		$('.rpcoord').focus(function() {
			if($(this).val() == $(this).attr("id")) { $(this).val("") }
		});
		$('#calcpredict').click(function() {
				$('#intel_predicted').html("");
				var predicted = predictDestination(new THREE.Vector3(Number($('#x').val()),Number($('#y').val()),Number($('#z').val())),new THREE.Vector2(Number($('#azmuth').val()),Number($('#inclination').val())),$('#intel_frame option:selected').val());
				$('#intel_predicted').html(predicted);
		});
		$('#dpppredict').click(function() {

				var html = "<span> Projected points: </span><br />"
				var predictions = dualPointPredict( new THREE.Vector3(Number($('#dpp_a_x').val()),Number($('#dpp_a_y').val()),Number($('#dpp_a_z').val())), $('#dpp_a_frame option:selected').val(),
					new THREE.Vector3(Number($('#dpp_b_x').val()),Number($('#dpp_b_y').val()),Number($('#dpp_b_z').val())), $('#dpp_b_frame option:selected').val() );
				predictions.forEach(function( o ){
					html += `${o} <br />`;
				});

				$('#dpppredictions').html( html )

		});
		$('#client-bar-control').click(function() {
			$('#client-term-container').toggleClass("hidden");
			$('#client-ico-down').toggleClass("hidden");
			$('#client-ico-up').toggleClass("hidden");
		});
		$('#client-login').click(function() { reconnect();})
		$(".vertical-resize").resizable({
        handles: {
            'n': '.handle'
        },
				alsoResize: "#client-term-output",
				minWidth: "100%",
				maxWidth: "100%",
				maxHeight: ($(window).height() * 0.95),
				stop: function(event, ui) {
        $(this).css("width", '');
				$('#client-term-output').css("width",'');
				}
		});

		$(".preference_input").change(function() {
				if($(this).attr('type') == 'checkbox') {
					preferences.set( this.id.split("_")[1]  , $(this).is(":checked")  );
				} else {
					preferences.set( this.id.split("_")[1]  ,$(this).val() );
				}

				if ( this.id.split("_")[1] == "showNebulas") {
					setNebulaVisibility(  $(this).is(":checked") );
				}
		});

		$(".client-term-container").resize(function() { width = $(this).width(); $("#client").css({'width' : '100%'});   $("#client-term-output").css({'margin-right' : '0px !important', 'padding-right' : '0 !important'})  })
		$.ajax({
			url: 'CHANGELOG.md',
			type: 'get',
			async: 'true',
			success: function(text) {
				var converter = new showdown.Converter();
				var options = converter.getOptions();
				options.strikethrough = true;
				html = converter.makeHtml(text);

				$("#changelog_container").html(html);
			}
		});

		$(window).resize(function() {
				$('.vertical-resize').resizable( "option", "maxHeight", ($(window).height() * 0.95) );
				if($('.vertical-resize').height() > ($(window).height() * 0.95) )  	{
						$('.vertical-resize').resizable("resizeBy", {height: '95%', width:'100%'});
				}
		});

		// Websocket client startup
		startup();

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

	// Populate list of borders for intel frame selection
	option = $('.frame_list').html();
	var borderlist = listobjects("borders");

	for (var border in borderlist) {
		if(borderlist[border].radius > 10) {
			option += '<option value="'+ escapeHTML(border) + '">' + escapeHTML(border) + '</option>';
		}
	}
		$('.frame_list').html(option);
		$('#fbc_frame').html("<option val=\"UNK\"> Unknown </option>" + option);
		$('.frame_list').val( preferences.get( "defaultFrame" ) );


		// Populate preferences pane
		preferences.list().forEach(function( pref ) {
			  if ($('#pref_' + pref).attr('type') == "checkbox") {
					$('#pref_' + pref).prop("checked", (preferences.get( pref )) == "true"? true:false)
				} else  {
					$('#pref_' + pref).val( preferences.get( pref ) );
				}

				// Special cases
				setNebulaVisibility($('#pref_showNebulas').is(":checked")? true:false)

		});

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
	if (typeof(secs) == 'undefined') { secs = 0; }
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

			var route = calcBestRoute(pointa,pointb, speed,  $('#directonly').is(':checked') );
			var dist = route.distance;
			var eta = route.eta
			$('#cal_eta').html( timeformat(eta) );
			$('#cal_dist').html( dist.toFixed(2) + " PC");

			// Populate the route plan select area
			lastWaypoint = {'name': pointa, gate:false};
			var routeplan;

			route.stops.forEach(function(waypoint,index,self) {
				if ( (route.stops.length - 1) > index  ) {
					nextWaypoint = route.stops[index+1];
				}
				else { nextWaypoint = route.stops[ route.stops.length -1 ]; }
				lookvectors = {}
				lookvectors['last'] = grabPositionByName( lastWaypoint.name )
				lookvectors['current'] = grabPositionByName( waypoint.name )
				if ( nextWaypoint != null ) {
					lookvectors['next'] = grabPositionByName( nextWaypoint.name )
				} else { lookvectors['next'] = {'x': null, 'y': null, 'z': null } }

				routeplan += `<optgroup label="${waypoint.name}" nextpoint="${nextWaypoint.name}">`;
				if(typeof self[index+1] != 'undefined' ) {
					if(waypoint.gate && self[index+1].gate) {routeplan += '<option>^---- Gate From</option>';
					routeplan += `<option>---> Set course for  ${nextWaypoint.name} </option>`; }
				}
				if(waypoint.gate && lastWaypoint.gate) {
					routeplan += `<option>^---- Gate Exit</option>`;
					routeplan += `<option>ETA:`  +  timeformat( waypoint.eta ) + '</option>';
				}

				if(!waypoint.gate || (!lastWaypoint.gate && waypoint.gate)) {
					var bordercrossings = listBorderCrossings(grabPositionByName( lastWaypoint.name.split('@')[lastWaypoint.name.split('@').length-1] ),grabPositionByName(waypoint.name.split('@')[waypoint.name.split('@').length-1] ));
					for ( var border in bordercrossings) {
						routeplan += `<option onClick='zoomfocus_point(new THREE.Vector3(${bordercrossings[border].x},${bordercrossings[border].y} ,${bordercrossings[border].z} ), new THREE.Vector3(${lookvectors['next'].x},${lookvectors['next'].y},${lookvectors['next'].z})    );'> WARNING!: Border crossing: ${border} </option>`;

					}
					routeplan += '<option>Distance:' + waypoint.distance.toFixed(2) + '</option>'
					if ( waypoint.eta == undefined ) {
						routeplan += '<option>ETA: ' + timeformat(calcETA(speed,waypoint.distance)) + '</option>';
					} else {
						routeplan += '<option>ETA: ' + timeformat( waypoint.eta ) + '</option>';
					}

					drawline(grabPositionByName(lastWaypoint.name.split('@')[lastWaypoint.name.split('@').length-1] ),grabPositionByName(waypoint.name.split('@')[waypoint.name.split('@').length-1]  ));
				}
				lastWaypoint = waypoint;
			});
				$('#route_output').html(routeplan);
			//drawline(grabPositionByName($('#pointa  option:selected').text()),grabPositionByName($('#pointb  option:selected').text()));
	}
}


function execFBC(x,y,z,frame) {
			var optionoutput = "";
			var zoomto = "";
			var borderlist = listobjects("borders");

			if(frame === "Unknown") {
				// The stupid bumblefuck located at the chair/computer interface
				// doesn't know where it is so we gotta draw all the places!

				// Galactic frame. The easiest so we do it first on account that i'm stupid
				drawcircleindicator(new THREE.Vector3(x,y,z), "FBC_Galactic");
				optionoutput += '<option> Galactic </option>';

				// Now chooch each border/frame
				for (var border in borderlist) {
					if(borderlist[border].radius > 10) {
						var inputvector = new THREE.Vector3(parseFloat( x ),parseFloat( y ),parseFloat( z ));
						var framevector = new THREE.Vector3(parseFloat( borderlist[border].x ), parseFloat( borderlist[border].y ), parseFloat( borderlist[border].z ));
						var outputvector = framevector.add(inputvector);
						drawcircleindicator(outputvector,"FBC_" + borderlist[border].name);
						optionoutput += '<option>' + borderlist[border].name + '</option>';
					}
				}
			}  // Borders done got chooched. End bumblefuckery
			else if (frame === "Galactic") {
							drawcircleindicator(new THREE.Vector3(x,y,z), "FBC_Galactic");
							optionoutput += '<option> Galactic </option>';
			}
			else {
				border = borderlist[frame];
				var inputvector = new THREE.Vector3(parseFloat( x ),parseFloat( y ),parseFloat( z ));
				var framevector = new THREE.Vector3(parseFloat( border.x ), parseFloat( border.y ), parseFloat( border.z ));
				var outputvector = framevector.add(inputvector);
				drawcircleindicator(outputvector,"FBC_" + frame);
				optionoutput += '<option>' + frame + '</option>';
			}

			$('#fbc_output').html(optionoutput);
}


function cleanupFBC() {
	var borderlist = listobjects("borders");
	for (var border in borderlist) {
		if(borderlist[border].radius > 10) {
				removeEntity("FBC_" + borderlist[border].name);
				removeEntity("FBC_" + borderlist[border].name + "_label");
				removeEntity("FBC_" + borderlist[border].name + "_light");
				var index = misc_followers.indexOf("FBC_" + borderlist[border].name + "_label")
				if (index > -1 ) { misc_followers.splice(index, 1);}
		}
		removeEntity("FBC_Galactic");
		removeEntity("FBC_Galactic_light");
		removeEntity("FBC_Galactic_label");
		var index = misc_followers.indexOf("FBC_Galactic_label")
		if (index > -1 ) { misc_followers.splice(index, 1);}


	}
	$('#fbc_output').html("");
}

function cleanupFollowers() {
	misc_followers.forEach(function(obj) {
		removeEntity(obj);

	});

}

function netNewContact(data,su=false){
			var contactPos = new THREE.Vector3;
			var deltaPos = new THREE.Vector3;
			var detectingBase = data[2];
			if ( su == true) { var distance = pc2su(  data[7] ); }
			else { var distance = data[7]; }
			detectingBase = detectingBase.replaceAll('<','[');
			detectingBase = detectingBase.replaceAll('>',']');
			var detectingObject = scene.getObjectByName(detectingBase);
			var azmuth_rad = radians( data[5] );
			var pitch_rad = radians( data[6] );

			deltaPos.x = distance * Math.cos( azmuth_rad ) * Math.cos( pitch_rad );
			deltaPos.y = distance * Math.cos( pitch_rad ) * Math.sin(azmuth_rad);
			deltaPos.z = distance * Math.sin( pitch_rad );
			contactPos = deltaPos.add( detectingObject.position );

			if ( data[3] !== "Unknown" ) { shipName = data[3]  } else { shipName =  detectingBase+"_" + data[5] }
			if ( scene.getObjectByName( shipName ) == undefined ) {
				drawShip(contactPos,detectingBase+"_" + data[5]);
			} else {
				var ship = scene.getObjectByName( shipName );
				ship.position.set( parseFloat( contactPos.x ), parseFloat( contactPos.y ), parseFloat( contactPos.z ) );
				animate();
			}

			setTimeout(function() {
				removeEntity(detectingBase+"_" + data[5]);
			},60000);
			return detectingBase + "_" + data[5];
}

function parseSenNetData(data, text) {
	var contact_1 = /<(.+)\|(.+)> (\w+) contact (\w+) \((\d+)\) B: (\d+) (\d+) @: \[(\d+.+)\]/g;
	var contact_2 = /<(.+)\|(.+)> New contact (.+) \((\d+)\) B: (\d+) (\d+) @: \[(\d+.+)\]/g;
	var contact_3 = /<(.+)\|(.+)> New contact (.+) \((\d+)\) B: (\d+) (\d+) @: (\d+.+)/g;
	var contact_4 = /<(.+)\|(.+)> (\w+) contact (\w+) \((\d+)\) B: (\d+) (\d+) @: (\d+.+)/g;
	var unkcontact = contact_1.exec( data[0] );
	var newcontact = contact_2.exec( data[0] );
	var newcontact_su = contact_3.exec( data[0] );
	var unkcontact_su = contact_4.exec( data[0] );

	if( newcontact !== null ) {
		var shipobject = netNewContact( newcontact );

	} else if ( unkcontact !== null ) {
		var shipobject = netNewContact ( unkcontact );

	} else if ( newcontact !== null ){
		var shipobject = netNewContact ( newcontact_su, true);

	} else if ( unkcontact_su !== null ){
		var shipobject = netNewContact ( unkcontact_su, true);

	}

	if (  shipobject !== undefined ) {
			var linkElement = document.createElement('a');
			linkElement.innerHTML = "[" + data[1] + "|" + data[2] + "] " + data[3]
			linkElement.setAttribute('onClick','zoomfocus("' + shipobject  + '")');
			return linkElement;
	}
}

function handleInboundJSON( obj ) {
		if( obj['type'] !== undefined ) { // Placeholder to allow for specific things to get done
			console.log(obj['type'])

		} else {  // Generic ship update
				if ( scene.getObjectByName( obj['name'] ) == undefined ) {
						drawShip( new THREE.Vector3( obj.x, obj.y, obj.z ), obj.name, "Federation" );
				} else {
					var ship = scene.getObjectByName( obj.name );
					ship.position.set( parseFloat( obj.x ), parseFloat( obj.y ), parseFloat( obj.z ) );
					animate();
				}
				//var rval = `<a onClick=\"zoomfocus('${obj.name}')\">  Ship Position Updated -  Click to focus </a>`;
				var linkElement = document.createElement('a');
				linkElement.innerHTML = `${obj.name} position updated. - Click to focus`;
				linkElement.setAttribute('onClick',`zoomfocus('${obj.name}')`);
				return linkElement;


		}

}

function refreshActiveShips() {
	$.getJSON("http://ats.trekmush.org:1701/active_ships", function( response ) {
      window.currentActiveShips = response;
			redrawActiveShips();
    });

}

function updateMUSHData() {
	refreshActiveShips();
	setTimeout(updateMUSHData, 60*1000 );
}


function redrawActiveShips() {
		if( window.drawnActiveShips.length > 0 ) {
			window.drawnActiveShips.forEach(function( ship ) {
				removeEntity(`Contact:${ship.id}`);
			});
			window.drawnActiveShips = [];
			}

				window.currentActiveShips.forEach(function( ship ) {
						var shipModel = findPointBorder(new THREE.Vector3( ship.x, ship.y, ship.z ));
						drawShip( new THREE.Vector3( ship.x, ship.y, ship.z ), `Contact:${ship.id}`, shipModel );
						window.drawnActiveShips[ship.id] = ship;
				});

}


function factionShipFile( faction="Unknown" ) {
				return window.factionships[faction][Math.floor(Math.random() * window.factionships[faction].length)].file
}
