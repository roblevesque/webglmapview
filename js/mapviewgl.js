if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, controls, scene, renderer;
var clock = new THREE.Clock();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(), INTERSECTED;
var mixers = [];
var misc_followers = [];
var MeshLoader = new THREE.GLTFLoader();
var textLabels = [];
var WIDTH = window.innerWidth , HEIGHT = window.innerHeight;
window.currentActiveShips = [];
window.drawnActiveShips = []
window.borders = [];

window.onload = function() {
loadData(function() {
preferences.load();
init();
animate();
populateUserFields();
// updateMUSHData(); // Disable this until implemented properly
});
}

function loadData(_callback) {
	// Load Data (hopefully) before the rest of the place loads.
	var xmlhttp = new XMLHttpRequest();
	var url = "js/atsdata.json";

	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	        jsonEmpire = JSON.parse(xmlhttp.responseText)['ATS_Navcomp_DB']['empires'];
					jsonGate =  JSON.parse(xmlhttp.responseText)['ATS_Navcomp_DB']['gates'];
					jsonConduit = JSON.parse(xmlhttp.responseText)['ATS_Navcomp_DB']['transwarpgates'];
					jsonWormhole = JSON.parse(xmlhttp.responseText)['ATS_Navcomp_DB']['wormholes'];
					jsonNebulas = JSON.parse(xmlhttp.responseText)['ATS_Navcomp_DB']['nebulas'];
	        _callback();

	    }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();

}

function reset_view() {
	camera.position.set(-9300,50,550);
	controls.target.x = scene.getObjectByName("Federation").position.x;
	controls.target.y = scene.getObjectByName("Federation").position.y;
	controls.target.z = scene.getObjectByName("Federation").position.z;
  camera.updateProjectionMatrix();
	render();
}

function init() {
				scene = new THREE.Scene();
        renderer = new THREE.WebGLRenderer();

				var Text2D = THREE_Text2D.SpriteText2D;
				var SpriteText2D = THREE_Text2D.SpriteText2D;
				var textAlign = THREE_Text2D.textAlign;
				var b_geometry, b_material, b_mesh, p_geometry, p_material, p_mesh, s_geometry, s_material, s_mesh, l_text;

				$.getJSON( 'assets/factionships.json', function( data ) {
						window.factionships = data;
				});

        renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementById("container").appendChild( renderer.domElement );
				container = document.getElementById("container")
				document.body.appendChild( container );


        camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 1e7);
				camera.layers.enable(1);
				camera.layers.enable(2);
				camera.layers.enable(3);
        controls = new THREE.OrbitControls( camera, renderer.domElement );
				controls.enableDamping = true;
				controls.dampingFactor = 0.25;
				controls.enableZoom = true;
  		  controls.addEventListener( 'change', render );
				document.addEventListener( 'mousedown', onCanvasClick, false );


		 var lightsource = new THREE.AmbientLight( 0xFFFFFF, 1500 );
	   // Add the light to the scene
		 scene.add( lightsource );


		for (var key in jsonEmpire) {
		  area=jsonEmpire[key];

		  for (var key2 in area['borders']) {
					var border = area['borders'][key2];

				  b_geometry = new THREE.EdgesGeometry(new THREE.SphereGeometry( border.radius, 10, 10 ));
				  //b_material = new THREE.MeshBasicMaterial( { color: area.color, wireframe: true, fillStyle: area.color} );
					b_material = new THREE.LineBasicMaterial({color: area.color, linewidth: 1, side: THREE.DoubleSide})
					b_material.side = THREE.DoubleSide;
					b_mesh = new THREE.LineSegments( b_geometry, b_material );
				  b_mesh.position.x = border.x;
				  b_mesh.position.y = border.y;
				  b_mesh.position.z = border.z;
				  b_mesh.name = escapeHTML(border.name);
					b_mesh.layers.set(1)
					scene.add( b_mesh );

					// Border detection hack
					b_box_mat = new THREE.MeshBasicMaterial( { color: "#FFF", wireframe: false, transparent: true, opacity: 0.0, alphaTest:0.1 } );
					b_box_mat.side = THREE.DoubleSide;
					b_box_geo = new THREE.SphereGeometry( border.radius, 10, 10);
					b_box_mesh = new THREE.Mesh( b_box_geo, b_box_mat );
					b_box_mesh.layers.set(4)
					b_box_mesh.name = escapeHTML(border.name) + " Border"
					b_box_mesh.position.x = border.x;
					b_box_mesh.position.y = border.y;
					b_box_mesh.position.z = border.z;
					scene.add( b_box_mesh )


					if (border.radius > 10) {
						l_text = new Text2D(border.name, { align: textAlign.center,  font: '75px Arial', color: '#AAA', fillStyle: 'rgba(255,255,255,0.50)', antialias: true, transparent: true});
						l_text.material.alphaTest = 0.2;
						l_text.position.set(border.x,border.y,border.z);
						if (border.radius > 75) {
							l_text.scale.set(0.50,0.50,0.50);
						}
						else {l_text.scale.set(0.30,0.30,0.30); }
						l_text.name = border.name + "_label";
						l_text.layers.set(3);
						scene.add(l_text);
						window.borders.push( border.name )
						placeLightSource(new THREE.Vector3(border.x,border.y,border.z ), border.name+"_light",border.radius*10.0 );
					}
			}



		  // Planet Generation
		  for (var key in area["planets"]) {
		    var planet = area.planets[key];
				var hitbox_geo = new THREE.SphereGeometry( 2.1, 10, 10);
				var hitbox_mat = new THREE.MeshBasicMaterial( { color: "#FFF", wireframe: false, transparent: true, opacity: 0.0, alphaTest:0.1 } );
				var hitbox = new THREE.Mesh( hitbox_geo, hitbox_mat );
				hitbox.layers.set(2)
		    p_geometry= new THREE.SphereGeometry( 1.0, 10, 10 );
		    p_material = new THREE.MeshBasicMaterial( {color: area.color, wireframe: false} );
		    p_mesh =  new THREE.Mesh( p_geometry, p_material );
				p_mesh.layers.enable(2)
		    p_mesh.position.x=planet.x;
		    p_mesh.position.y=planet.y;
		    p_mesh.position.z=planet.z;
		    p_mesh.name = escapeHTML(planet.name);
				p_mesh.add( hitbox );
				scene.add( p_mesh );
				if ( preferences.get("htmlLabels") == 'true' ) {
					l_text = drawLabel();
					l_text.setHTML( escapeHTML(planet.name) );
					l_text.setOffset({x:0, y:-10});
					l_text.setParent( p_mesh );
					textLabels.push( l_text );
					container.appendChild( l_text.element )
				} else {
			    l_text = new Text2D(escapeHTML(planet.name), { align: textAlign.right,  font: '10px Arial', fillStyle: '#FFF' , antialias: true });
			    l_text.material.alphaTest = 0.1;
			    l_text.position.set(planet.x+2, planet.y , planet.z+Math.round(Math.random() * (+3 - -3) + -3) );
			    l_text.scale.set(0.20,0.20,0.20);
					l_text.name = escapeHTML(planet.name + "_label");
					l_text.layers.set(3)
			    scene.add(l_text);
				}
		  }

		  // Base Generation
		  for (var key in area["stations"]) {
		    var base = area.stations[key];
		    s_geometry = new THREE.CylinderGeometry( 0.2, 0.6*3, 0.5*3, 4 );
				s_geometry.computeBoundingSphere();
		    s_material = new THREE.MeshBasicMaterial( {color: area.color, wireframe: false} );
		    s_mesh = new THREE.Mesh( s_geometry, s_material );
		    s_mesh.position.x=base.x;
		    s_mesh.position.y=base.y;
		    s_mesh.position.z=base.z;
				s_mesh.name = escapeHTML(base.name);
				s_mesh.layers.set(2)
		    scene.add( s_mesh );
				if ( preferences.get("htmlLabels") == 'true' ) {
					l_text = drawLabel();
					l_text.setHTML( escapeHTML(base.name) );
					l_text.setParent( s_mesh );
					textLabels.push( l_text );
					container.appendChild( l_text.element )
				} else {
					l_text = new Text2D(escapeHTML(base.name), { align: textAlign.left,  font: '12px Arial', fillStyle: '#FAFAFA' , antialias: true });
					l_text.material.alphaTest = 0.0;
					l_text.position.set(base.x-2,base.y+Math.round(Math.random() * (+3 - -3) + -3),base.z);
					l_text.scale.set(0.20,0.20,0.20);
					l_text.name = escapeHTML(base.name + "_label");
					l_text.layers.enable(3)
					scene.add(l_text);
			}
		  }

		}
		// Nebula Generation
		for ( var key in jsonNebulas) {
			var nebula = jsonNebulas[key];
			if (nebula.radius[1] == "PC") { var radius = nebula.radius[0]; }
			else { var radius = su2pc(nebula.radius[0]); }
			var n_geo = new THREE.SphereGeometry( radius, 10, 10 );
		  var n_mat = new THREE.MeshPhongMaterial( {
				color: 0xAAAAAA,
				flatShading: true,
				polygonOffset: true,
				polygonOffsetFactor: 14, // positive value pushes polygon further away
				polygonOffsetUnits: 1,
				transparent: true,
				opacity: 0.20,
				alphaTest: 0.10,
			} );
		  // var n_mat =  new THREE.MeshBasicMaterial( { color: "#FFF", wireframe: false, transparent: true, opacity: 0.0, alphaTest:0.1 } );
			var n_mesh = new THREE.Mesh( n_geo, n_mat );
			n_mesh.name = nebula.name;
			n_mesh.position.copy( nebula.position );
			var n_geo_wf = new THREE.EdgesGeometry( n_mesh.geometry );
			var n_mat_wf = new THREE.LineBasicMaterial( { color: 0xAAAAAA, linewidth: 1, transparent: true, opacity: 0.20, alphaTest: 0.10  });
			var n_mesh_wf = new THREE.LineSegments(n_geo_wf, n_mat_wf );
			n_mesh.visible = false;
			n_mesh.add( n_mesh_wf );
			scene.add( n_mesh );

			l_text = new Text2D(escapeHTML(nebula.name), { align: textAlign.center,  font: '12px Arial', fillStyle: '#FAFAFA' , antialias: true });
			l_text.material.alphaTest = 0.0;
			l_text.position.set(nebula.position.x,nebula.position.y-5,nebula.position.z);
			l_text.scale.set(0.15,0.15,0.15);
			l_text.name = escapeHTML(nebula.name + "_label");
			l_text.visible = false;
			scene.add(l_text);
		}

    // Set view and camera to point to initial location
		reset_view();

}

window.onresize = function() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );


				render();

} // End Init


function onCanvasClick( event ) {

				//event.preventDefault();

				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

							raycaster.setFromCamera( mouse, camera );
							var intersects = raycaster.intersectObjects( scene.children );

							if ( intersects.length > 0 ) {
								if ( INTERSECTED != intersects[ 0 ].object ) {

									INTERSECTED = intersects[ 0 ].object;
									// console.log( INTERSECTED.name );
									if (lastInputBox) {
										document.getElementById(lastInputBox).value = INTERSECTED.name;
									}

								}

							} else {

								INTERSECTED = null;

							}

			}

function animate() {
				var delta = clock.getDelta();
				requestAnimationFrame( animate );
				update_animations();
	      scene.updateMatrixWorld()
				controls.update(delta);
	      render();
}

function update_animations() {
	var delta = clock.getDelta();
	if ( mixers.length > 0 ) {
		for ( var i = 0; i < mixers.length; i ++ ) {
			mixers[ i ].update( delta );
		}
	}
	// Also make any misc things follow camera
	misc_followers.forEach (function(follower) { var obj = scene.getObjectByName(escapeHTML(follower)); obj.lookAt(camera.position)  });

}


function render() {
		//requestAnimationFrame( render );

    if (preferences.get('htmlLabels') == "false") {
			var objectlist = Object.keys(listobjects("stations"));
			objectlist.forEach (function(station) { var obj = scene.getObjectByName(escapeHTML(station + "_label")); obj.lookAt(camera.position)  }) ;
    	objectlist = Object.keys(listobjects("planets"));
    	objectlist.forEach (function(planet) { var obj = scene.getObjectByName(escapeHTML(planet + "_label")); obj.lookAt(camera.position)  }) ;
		}
    objectlist = Object.keys(listobjects("borders"));
    objectlist.forEach (function(border) { var obj = scene.getObjectByName(border + "_label"); if (obj != undefined) { obj.lookAt(camera.position)}  }) ;
		for(var i=0; i<textLabels.length; i++) {
          textLabels[i].updatePosition();
        }
    renderer.render( scene, camera );
 }


function listobjects(type) {
	var objects = {};

	for (var key in jsonEmpire) {
		area=jsonEmpire[key];
		for (var key2 in area[type]) {
			object = area[type][key2];
			objectname = object.name;
			objects[object.name] = object;

		}
	}
	return objects;
}


function zoomfocus(name) {


			var zoomto = grabPositionByName(name.split('@')[name.split('@').length-1]);
			if (zoomto != null) {
					controls.target.x = parseFloat( zoomto.x );
				  controls.target.y = parseFloat( zoomto.y );
				  controls.target.z = parseFloat( zoomto.z );
					var focus = new THREE.Vector3( parseFloat( zoomto.x ), parseFloat( zoomto.y ), parseFloat( zoomto.z ) );
					var vantage = new THREE.Vector3( parseFloat( 5.00 ), parseFloat( 60.00 ), parseFloat( 150.00 ) );
					vantage.add( focus );
					camera.position.set( parseFloat( vantage.x ), parseFloat( vantage.y ), parseFloat( vantage.z ) );
					camera.lookAt( focus );
					camera.updateProjectionMatrix();
					render();
			} else {
					zoomto = grabPositionByName(name);
					if (zoomto != null) {
							controls.target.x = parseFloat( zoomto.x );
						  controls.target.y = parseFloat( zoomto.y );
						  controls.target.z = parseFloat( zoomto.z );
							var focus = new THREE.Vector3( parseFloat( zoomto.x ), parseFloat( zoomto.y ), parseFloat( zoomto.z ) );
							var vantage = new THREE.Vector3( parseFloat( 5.00 ), parseFloat( 60.00 ), parseFloat( 150.00 ) );
							vantage.add( focus );
							camera.position.set( parseFloat( vantage.x ), parseFloat( vantage.y ), parseFloat( vantage.z ) );
							camera.lookAt( focus );
							camera.updateProjectionMatrix();
							render();
					}
					else { return false; }

			}



}


function zoomfocus_point(point, farpoint) {
  if (farpoint && !farpoint.x) {
		farpoint = point
	}
	if (!point.isVector3 ) { render(); return; }
	if ( !( point.equals(farpoint) ) ) {
		if( $('#planpov').is(':checked') && farpoint.isVector3 )  {
				controls.target.set( parseFloat( farpoint.x ), parseFloat( farpoint.y ), parseFloat( farpoint.z ) );
				camera.position.set( parseFloat( point.x ), parseFloat( point.y ), parseFloat( point.z ));
				camera.lookAt(new THREE.Vector3( parseFloat( farpoint.x ), parseFloat( farpoint.y ), parseFloat( farpoint.z )));
		}
		else {
			controls.target.set(parseFloat( point.x ), parseFloat( point.y ), parseFloat( point.z ))
			var focus = new THREE.Vector3( parseFloat( point.x ), parseFloat( point.y ), parseFloat( point.z ) );
			var vantage = new THREE.Vector3( parseFloat( 5.00 ), parseFloat( 60.00 ), parseFloat( 150.00 ) );
			vantage.add( focus );
			camera.position.set( parseFloat( vantage.x ), parseFloat( vantage.y ), parseFloat( vantage.z ) );
			camera.lookAt( focus );
		}
		camera.updateProjectionMatrix();
		render();
	}

}

function drawline(origin,dest) {
		var direction = dest.clone().sub(origin);
		var length = origin.distanceTo(dest);
	  var arrowHelper = new THREE.ArrowHelper(direction.normalize(),origin,length,0xffffff,10,5);
		arrowHelper.name = "arrow";
		arrowHelper.cone.material.transparent = true;
		arrowHelper.cone.material.opacity = 0.25;
		arrowHelper.line.material.linewidth = 2;
		arrowHelper.layers.enable(3)

		scene.add( arrowHelper );
}

function drawcircleindicator(center, name="Beacon") {
	var Text2D = THREE_Text2D.SpriteText2D;
	var SpriteText2D = THREE_Text2D.SpriteText2D;
	var textAlign = THREE_Text2D.textAlign;
	var indicator
	var label = new Text2D(name, { align: textAlign.center,  font: '12px Arial', fillStyle: '#ABABAB', antialias: false });
	//var loader = new THREE.GLTFLoader();

	MeshLoader.load("./assets/indicate.gltf", function(object) {
		var model = object.scene;
		scene.add(object.scene);
		object.scene;
		object.scenes;
		object.scene.name = name;
		var mixer = new THREE.AnimationMixer(model);
		mixers.push(mixer);
		var clips = object.animations;
    var clip = THREE.AnimationClip.findByName( clips, 'animation_0' );
		var action = mixer.clipAction( clip );
		action.play();
		object.scene.scale.set(10,10,10);
		object.scene.position.set(center.x,center.y,center.z);
	},
	function (xhr) { console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ); },
	function ( error ) {console.log( 'An error happened: ' + error );}
	);

	label.material.alphaTest = 0.0;
	label.position.set(center.x, center.y+12, center.z);
	label.scale.set(0.25,0.25,0.25);
	label.name = name + "_label";
	misc_followers.push(label.name);
	scene.add( label );
}

function placeLightSource(center,name="ExtraLight", radius=0) {
		var light = new THREE.PointLight( 0xffffff, 1, radius );
		light.position.set( center.x, center.y, center.z );
		light.name = name
		light.power = 10;
		light.castShadow = false;
	  scene.add( light );
}


function drawShip(center,name="PlayerShip",faction="Unknown",labelText=name) {  // Load Main model
	var Text2D = THREE_Text.Text2D;
	var SpriteText2D = THREE_Text.SpriteText2D;
	var textAlign = THREE_Text.textAlign
  var label = new Text2D(labelText, { align: textAlign.center,  font: '12px Arial', fillStyle: '#ABABAB', antialias: false });
	var shipGroup = new THREE.Group();
	var shipMesh = "assets/" +  factionShipFile( faction );
	MeshLoader.load(shipMesh, function(object) {
		var model = object.scene;
		shipGroup.add(object.scene);
		object.scene;
		object.scenes;
		object.scene.name = name + "_ship";
		object.scene.scale.set(0.5,0.5,0.5);
		//object.scene.position.set(center.x,center.y,center.z);

	},
	function (xhr) { console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ); },
	function ( error ) {console.log( 'An error happened: ' + error );}
);
	MeshLoader.load("./assets/spincircle.gltf", function(object) { // Load spinning circle
		var model = object.scene;
		shipGroup.add(object.scene);
		object.scene;
		object.scenes;
		object.scene.name = name + "_circle";
		var mixer = new THREE.AnimationMixer(model);
		mixers.push(mixer);
		var clips = object.animations;
    var clip = THREE.AnimationClip.findByName( clips, 'animation_0' );
		var action = mixer.clipAction( clip );
		action.play();
		object.scene.scale.set(0.5,0.5,0.5);
	//	object.scene.position.set(center.x,center.y,center.z);
	},
	function (xhr) { console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ); },
	function ( error ) {console.log( 'An error happened: ' + error );}
);
	label.material.alphaTest = 0.0;
	label.position.set(center.x, center.y+5, center.z);
	label.scale.set(0.20,0.20,0.20);
	label.name = name + "_label";
	misc_followers.push(label.name);
	scene.add( label );


	shipGroup.name = name;
	shipGroup.position.set(center.x,center.y,center.z);
	scene.add( shipGroup );


}

function removeEntity(object) {
		var selectedObject;
		while ( selectedObject = scene.getObjectByName(object) ) {
    scene.remove( selectedObject );
	}
	while ( selectedObject = scene.getObjectByName(object+"_label") ) {
	scene.remove( selectedObject );
}

}

// Calculates SU/s with given warp factor
function calcSUpS(warpfactor) {
	// 14.0*29.979246*1298.737508 = 257494817.55 SU/s
	// Velocity = WF^3.333333*lightspeed*cochranes
	// 3087467836.3256578445 = 1 Parsec
	var cochranes = 1298.737508; // Average cochranes
	var lightspeed = 29.979246; // Lightspeed constant
	var exponent = 3.333333;

	var sus =  Math.pow(warpfactor,exponent) * lightspeed * cochranes ;
	return sus;
}

function su2pc ( su ) {
	return su / 3087467836.3256578445;
}

function pc2su ( pc ) {
	return pc * 3087467836.3256578445;
}

// Calculates ETA for given distance and velocity.
// Velocity should be supplied as an array of speed and unit
function calcETA(velocity,distance) {
			var speed = velocity.speed;
			var unit = velocity.unit;
			var seconds;
			switch (unit) {
					case 'SU/s':
						seconds = new Decimal(  distance / su2pc(speed)  );
						break;
					case 'PC/s':
						seconds = new Decimal( distance /  speed  );
						break;
					case 'WF':
						seconds = distance / su2pc(calcSUpS(speed));
						break;
					default:
						throw "Invalid unit of speed."
			}

			return seconds;

}

// Calculate the distance between two named points ( Stations or Bases )
function calcDist(pointa, pointb) {
		var obj_A = scene.getObjectByName(pointa);
		var obj_B = scene.getObjectByName(pointb);
		var distance =  obj_A.position.distanceTo(obj_B.position);
		return distance;
}

function grabPositionByName(name) { return scene.getObjectByName(name.split('@')[name.split('@').length-1]).position;  }


function calcEndpointByHeading(heading,startvec = new THREE.Vector3(0,0,0)) {
		// heading.x = azimuth
		// heading.y = inclination
		// heading.z = radius (distance)
		var calcvec = new THREE.Vector3();
		calcvec.x = Math.cos(heading.x / 180 * Math.PI ) * Math.cos(heading.y / 180 * Math.PI ) * heading.z;
		calcvec.x = Number(calcvec.x.toFixed(6));
		if (Math.sign(calcvec.x) == -1 && calcvec.x == 0) { calcvec.x=0; }   // A dirty hack to fix negative zero situations.
		calcvec.y = Math.sin(heading.x / 180 * Math.PI ) * Math.cos(heading.y / 180 *  Math.PI ) * heading.z;
		calcvec.y = Number(calcvec.y.toFixed(6));
		if (Math.sign(calcvec.y) == -1 && calcvec.y == 0) { calcvec.y=0; }   // A dirty hack to fix negative zero situations.
		calcvec.z = Math.sin(heading.y / 180 * Math.PI) * heading.z;
		calcvec.z = Number(calcvec.z.toFixed(6));
		if (Math.sign(calcvec.z) == -1 && calcvec.z == 0) { calcvec.z=0; }   // A dirty hack to fix negative zero situations.
		var finalvec = new THREE.Vector3();
		calcvec.add(startvec);
		return calcvec;
}

function calcBestRoute(pointa,pointb,speed,direct=false) {
	var route = [{}];
	delete route['0']; // WTF? We shouldn't need to do this. I hate JS....
	// Calculate direct route.

	route['Direct'] =  { 'stops': [{'name':pointb, 'gate': false, 'distance':calcDist(pointa,pointb)}], 'distance': calcDist(pointa, pointb), 'eta': calcETA( speed, calcDist( pointa, pointb ) ) };
	if ( direct ) { return route['Direct']; }
	// Thats it! Direct is easy stuff


	// Find route via stargate. !!! NO LONGER FUNCTIONAL BECAUSE THE ADMINS HATE THE UNITY PEOPLE   !!!
	var distance_a = {};     // !!! This code stays though, just in case there is a change of heart !!!
	var distance_b = {};
	var viawormhole = {};
	var distance_wb = {};
	var near_a,near_b;
	// Find gate closest to point a
	//jsonGate.forEach(function(name) { distance_a[name.name] = calcDist(pointa,name.name);});
	//var dist_a_sorted = Object.keys(distance_a).sort(function(a,b) {return distance_a[a]-distance_a[b]});
	//var near_a = dist_a_sorted[0];

	// Find gate closest to point b
	//jsonGate.forEach(function(name) { distance_b[name.name] = calcDist(pointb,name.name) ;});
	//var dist_b_sorted = Object.keys(distance_b).sort(function(a,b) {return distance_b[a]-distance_b[b]});
	//var near_b = dist_b_sorted[0];

	// Dump out right now if it's the same fucking gate.
	//if( near_a != near_b) {
	// Assemble the gate travel plan. With our powers unite, we are shitty code!
	//gate_distance = distance_a[near_a] + distance_b[near_b];
  // Shit man?! Gates got shutdown! What the fuck are we going to do!?
	// route['Gate'] = {'stops': [{'name':near_a, 'gate':true, 'distance': calcDist(pointa,near_a)} ,{'name': near_b, 'gate': true, 'distance':0},{'name': pointb, 'gate':false, 'distance':calcDist(near_b,pointb)}], 'distance':gate_distance}

	//} // End gate work...


	// Transwarp Conduit Gate network. New hotness
	var distance_ca = {};
	var distance_cb = {};
	var near_key = {};
	var near_a,near_b;
  // Calculate distance to all TWC gates from point a, and from point b
	jsonConduit.forEach(function(gate) { near_key[gate.name] = gate.location; distance_ca[gate.name] = calcDist( pointa, gate.location );});
	jsonConduit.forEach(function(gate) { distance_cb[gate.name] = calcDist( pointb, gate.location );});
	// Sort them by assending distance
	var dist_a_sorted = Object.keys(distance_ca).sort(function(a,b) {return distance_ca[a]-distance_ca[b]});
	var dist_b_sorted = Object.keys(distance_cb).sort(function(a,b) {return distance_cb[a]-distance_cb[b]});
	// Grab the closest ones for each point a and b
	near_ca = dist_a_sorted[0];
	near_cb = dist_b_sorted[0];

	// Check to see if the universe hates us and they are the the same god damn gates
	if ( near_ca != near_cb ) { // Skookum as frig man! Different gates!
		var conduit_distance = calcDist( near_key[near_ca], near_key[near_cb] );
		var conduit_eta =  conduit_distance / ( 0.75 * 29.979246 ) ;  // 29.979246 is the lightspeed constant that I only need in two places.
		var twc_distance = distance_ca[near_ca] + distance_cb[near_cb];
		var total_eta = conduit_eta + calcETA( speed, calcDist( pointa, near_key[near_ca] ) )  + calcETA( speed, calcDist( pointb, near_key[near_cb] ) );
		route['TWC'] = {'stops': [{'name':near_key[near_ca], 'gate':true, 'distance': calcDist(pointa, near_key[near_ca])} ,{'name': near_key[near_cb], 'gate': true, 'distance':conduit_distance, 'eta': conduit_eta },
									{'name': pointb, 'gate':false, 'distance':calcDist( near_key[near_cb] ,pointb)}], 'distance':twc_distance,  'eta': total_eta}
	}




  // Calculate wormhole route
	// Qon does this by quadrant. Frey does this by brute force. The following may be really scary.
	jsonWormhole.forEach(function(wh) { distance_wb[wh.enda.location] = calcDist(pointb,wh.enda.location); distance_wb[wh.endb.location] = calcDist(pointb,wh.endb.location);    });
	var dist_wb_sorted = Object.keys(distance_wb).sort(function(a,b) {return distance_wb[a]-distance_wb[b]});
	var near_wb;
	jsonWormhole.forEach(function(wh) {if(wh.enda.location == dist_wb_sorted[0]) { near_wb = wh.enda; } else if (wh.endb.location == dist_wb_sorted[0] ) {near_wb = wh.endb; }  })
	//var near_wb = dist_wb_sorted[0];
	jsonWormhole.forEach(function(wh) {if(wh.enda.location == near_wb.location || wh.endb.location == near_wb.location) { viawormhole = wh } });
	var via_wh_dista ={}
	via_wh_dista["enda"] = calcDist(pointa,viawormhole.enda.location);
	via_wh_dista["endb"] = calcDist(pointa,viawormhole.endb.location);
	var via_wh_dista_sorted = Object.keys(via_wh_dista).sort(function(a,b) {return via_wh_dista[a]-via_wh_dista[b]});
	var near_wa = viawormhole[via_wh_dista_sorted[0]];
	// Build Wormhole route.
	if(near_wa.location != near_wb.location ) {
		    var temproute_a = calcBestRoute(pointa,near_wa.location,speed);
				temproute_a['stops'][temproute_a['stops'].length-1]['gate'] = true;
				temproute_a['stops'][temproute_a['stops'].length-1]['name'] = near_wa.displayname + "@" + near_wa.location;
				temproute_a['stops'][temproute_a['stops'].length] = {'name': near_wa.oppsiteexit + "@" + near_wb.location, 'gate': true};
				var temproute_b = calcBestRoute(near_wb.location,pointb, speed);
				var stops=temproute_a['stops'];
				for (var obj in temproute_b['stops']) { stops[stops.length] = temproute_b['stops'][obj]}
				stops.forEach(function(s, idx, array) {if(s && s.gate !=true && stops[idx-1] != undefined && stops[idx-1].gate !=true) { stops[idx].distance = calcDist(s.location,stops[idx-1].location); }
						else if(idx == 0)  {stops[idx].distance = calcDist(pointa,s.name.split('@')[s.name.split('@').length-1]    );  } else if(s.gate == true && array[idx-1].gate == true) {stops[idx].distance = 0;}
						else if(stops[idx-1].name.split('@')[stops[idx-1].name.split('@').length-1] == s.name.split('@')[s.name.split('@').length-1]) {stops[idx].distance=0;}
						else { stops[idx].distance = calcDist(stops[idx-1].name.split('@')[stops[idx-1].name.split('@').length-1],s.name.split('@')[s.name.split('@').length-1]); }});
				var wh_dist = 0;
			  stops.forEach(function(s) { wh_dist += s.distance; });

				route['Wormhole'] = {'stops': stops, 'distance':wh_dist, 'eta': calcETA( speed, wh_dist ) }

	}



	// Sort all routes by distance traveled. Index of zero should be the fastest, in theory any way
	var route_keys_sorted = Object.keys(route).sort(function(a,b) {return route[a].distance-route[b].distance});

	return route[route_keys_sorted[0]];
}

function dualPointPredict( pointa, framea , pointb, frameb ) {
		cleanupFBC();
		removeEntity( "arrow" );

		if(framea != "Galactic") {  // Find frame coordinates for point a
			var aFrame = grabPositionByName( framea );
		} else {
				var aFrame = new THREE.Vector3( 0, 0, 0 );
		}
		if(frameb != "Galactic") { // Find frame coordinates for point b
			var bFrame = grabPositionByName( frameb );
		} else {
				var bFrame = new THREE.Vector3( 0, 0, 0 );
		}
		pointa.add( aFrame );
		pointb.add( bFrame );

		var direction = pointb.clone().sub( pointa ).normalize();
		var adjustedPointA = pointa.clone().sub( pointb ).divide(new THREE.Vector3( 2, 2, 2 )).add( pointa );
		var adjustedPointB = pointb.clone().sub( pointa ).divide(new THREE.Vector3( 2, 2, 2 )).add( pointb );
		var length = adjustedPointA.clone().distanceTo( adjustedPointB ) ;
	  var arrowHelper = new THREE.ArrowHelper( direction, adjustedPointA, length, 0xffffff, 10, 5 );
		arrowHelper.name = "arrow";
		arrowHelper.cone.material.transparent = true;
		arrowHelper.cone.material.opacity = 0.25;
		arrowHelper.line.material.linewidth = 2;
		arrowHelper.layers.enable(3)
		scene.add( arrowHelper );

		var directionvector = adjustedPointB.clone().sub( adjustedPointA );
		var ray = new THREE.Raycaster( adjustedPointA, directionvector.clone().normalize() );
		ray.layers.enable(1);
		ray.layers.enable(2);
		ray.camera = camera;
		var object_intersects = [];
		ray.linePrecision = 10;
		scene.updateMatrixWorld();
		var intersects = ray.intersectObjects( scene.children, false );
		if (intersects[0]) {
				intersects.forEach(function(obj) {
					if (obj.object.geometry.boundingSphere.radius != 'undefined' &&  obj.object.geometry.boundingSphere.radius < 4 ) {
							object_intersects.push(obj.object.name);
					}
				});
		}


		return object_intersects;
}

function predictDestination(loc,heading,frame) {
		cleanupFBC();
		removeEntity( "arrow" );
		if(frame != "Galactic") {
			var objFrame = grabPositionByName(frame);
		} else {
				var objFrame = new THREE.Vector3(0,0,0);
		}

		var adjLoc = loc.clone();
		adjLoc = adjLoc.add(objFrame);
		var headingvec = new THREE.Vector3( heading.x, heading.y, parseFloat( preferences.get("predictDistance") ) );
		var farpoint = calcEndpointByHeading(headingvec,adjLoc);
		var directionvector = farpoint.clone().sub(adjLoc);
		var ray = new THREE.Raycaster(adjLoc, directionvector.clone().normalize());
		ray.camera = camera
		ray.layers.enable(1);
		ray.layers.enable(2);
		ray.params.Line.threshold = 1;
		ray.far = parseFloat( preferences.get("predictDistance") );
		scene.updateMatrixWorld();
		var intersects = ray.intersectObjects(scene.children,true);
		drawline(adjLoc,farpoint);
		var correctedintersections=[];
		if (intersects[0]) {
				intersects.forEach(function(obj) {

					if (obj.object.geometry.boundingSphere.radius != 'undefined' &&  obj.object.geometry.boundingSphere.radius < 4 ) {
							if ( obj.object.name == "" ) {
								correctedintersections.push( obj.object.parent.name );
							} else {
								correctedintersections.push(obj.object.name);
							}
					}
				});

				return correctedintersections[0];
			}
			return "Unable to predict"

}

function listBorderCrossings( startVector, endVector ) {
		var raycast = new THREE.Raycaster( startVector, endVector.clone().sub( startVector ).normalize());
		raycast.far = startVector.distanceTo(endVector)
		raycast.params.Line.threshold = 1;
		raycast.params.Mesh.threshold = 1;
		raycast.params.Points.threshold = 1;
		raycast.camera = camera
		raycast.layers.set(4)
		scene.updateMatrixWorld();
		var intersects = raycast.intersectObjects( scene.children, true );
		var borderCrossings = Object();
		if( intersects  !== undefined ) {
			intersects.forEach(function(obj) {
				if ( obj.object.geometry.boundingSphere &&  ( obj.object.geometry.boundingSphere.radius > 3 ) ) {
					if ( Object.keys(borderCrossings).length < 1 ) {
							// Calculate reverse border crossing to catch any outbounds from the start
							var raycast_rev = new THREE.Raycaster( obj.point, startVector.clone().sub(obj.point).normalize() );
							raycast_rev.far = obj.point.distanceTo(startVector)
							raycast_rev.params.Line.threshold = 1;
							raycast_rev.params.Mesh.threshold = 1;
							raycast_rev.params.Points.threshold = 1;
							raycast_rev.camera = camera
							raycast_rev.layers.set(4)
							scene.updateMatrixWorld();
							var intersects_rev = raycast_rev.intersectObjects( scene.children, true );
							if ( intersects_rev.length > 0 && intersects_rev[0].object.geometry.boundingSphere.radius > 3  ) { borderCrossings[intersects_rev[0].object.name] = intersects_rev[0].point; }
					}
						borderCrossings[obj.object.name]  = obj.point;
				}
			});
			if ( Object.keys(borderCrossings).length == 0 ) { // If it found nothing, still check for reverse
				var raycast_rev = new THREE.Raycaster( endVector, startVector.clone().sub( endVector ).normalize() );
				raycast_rev.far = endVector.distanceTo(startVector)
				raycast_rev.params.Line.threshold = 1;
				raycast_rev.params.Mesh.threshold = 1;
				raycast_rev.params.Points.threshold = 1;
				raycast_rev.camera = camera
				raycast_rev.layers.set(4)
				scene.updateMatrixWorld();
				var intersects_rev = raycast_rev.intersectObjects( scene.children, true );
				if ( intersects_rev.length > 0 &&  intersects_rev[0].object.geometry.boundingSphere  && intersects_rev[0].object.geometry.boundingSphere.radius > 3  ) { borderCrossings[intersects_rev[0].object.name] = intersects_rev[0].point; }

			}
			return borderCrossings;

		}
}

function boundingSphereGrab(name){
	return scene.getObjectByName(name)
}


function setNebulaVisibility(visible) {
	for ( var key in jsonNebulas) {
			var neb_name = jsonNebulas[key].name;
			var neb_ob = scene.getObjectByName( neb_name );
			var neb_label = scene.getObjectByName( neb_name + "_label" );

			if(visible) {
				neb_ob.visible = true;
				neb_label.visible = true;
			}
			else {
				neb_ob.visible = false;
				neb_label.visible = false;
			}

	}
}

function findObjectInfo(name) {
	var object = {};
	var types = ["stations","planets","borders"];
	types.forEach(function(type) {
	for (var key in jsonEmpire) {
		area=jsonEmpire[key];
		for (var key2 in area[type]) {

				if(escapeHTML(area[type][key2].name) == name) {
				object = area[type][key2];
				object.parent = jsonEmpire[key];
				switch(type) {
					case 'planets':
						object.type = "Planet";
						break;
				  case 'borders':
						object.type = "Territory";
						break;
					case 'stations':
						object.type = "Starbase/Base/Station";
						break;
					default:
						object.type = "Currently Unknown"
				}

		}

		}
	}});
	return object;
	}


function findPointBorder( point=new THREE.Vector3(0,0,0) ) {
	   var insideborder = "Unknown"
		 window.borders.forEach(function(border) {
			 				var box = scene.getObjectByName( border );
							box.geometry.computeBoundingSphere();
							var boxMatrixInverse = new THREE.Matrix4().getInverse(box.matrixWorld);
							var inverseBox = box.clone();
							var inversePoint = point.clone();
							inverseBox.applyMatrix(boxMatrixInverse);
							inversePoint.applyMatrix4(boxMatrixInverse);
							var bb = new THREE.Box3().setFromObject(inverseBox);
							var isInside = bb.containsPoint(inversePoint);
							if( isInside ) { insideborder = border }

		 });
		 	return insideborder;
}



var drawLabel = function() {
	var div = document.createElement('div');
	var visibleText = document.createElement('span');
	var hoverText = document.createElement('span');
	var offset = {x:10,y:15};
	hoverText.className = "label-hover-text";
	div.className = 'label-text';
	div.style.position = 'fixed';
	div.style.width = 100;
	div.style.height = 100;
	div.innerHTML = "";
	div.style.top = -1000;
	div.style.left = -1000;

	var _this = this;

	div.appendChild( visibleText );
	div.appendChild( hoverText )

	return {
		element: div,
		hover: hoverText,
		visible: visibleText,
		parent: false,
		position: new THREE.Vector3(0,0,0),
		setHTML: function(html) {
			this.visible.innerHTML = html;
		},
		setHover: function(html) {
			this.hover.innerHTML = html;
		},
		setParent: function(threejsobj) {
			this.parent = threejsobj;
		},
		setOffset: function(given_offset){
			offset = given_offset;
		},
		updatePosition: function() {
			if(parent) {
				this.position.copy(this.parent.position);
			}

			var coords2d = this.get2DCoords(this.position, camera);
			//var coords2d = _this.toScreenXY(this.position,camera,container)
			//var coords2d = this.getScreenPosition(this.parent, camera);
			this.element.style.left = coords2d.x + 'px';
			this.element.style.top = coords2d.y + 'px';

			this.updateVisibility(); // Don't display outside of the radar box
		},
		updateVisibility: function() {
			var containerloc = container.getBoundingClientRect();
			var radarLoc = this.element.getBoundingClientRect();
			var top = radarLoc.top;
			var bottom = radarLoc.bottom;
			var left = radarLoc.left;
			var right = radarLoc.right;


			var distance = camera.position.distanceTo(this.parent.position)
			if((top < containerloc.top || bottom > containerloc.bottom || left < containerloc.left || right > containerloc.right) ) {
				this.element.style.zIndex = "-100"
			} else {
				this.element.style.zIndex = "1"
				var size = Math.min(1.0, Math.max(0.5 ,(600/distance)));
				this.element.style.fontSize = `${size}em`;

				}
		}, /* End updateVisibility */
		get2DCoords: function(position, fcamera) {
			//  var vector = position.project( fcamera );
			//  vector.x = (vector.x + 1)/2 * container.clientWidth;
			//  vector.y = -(vector.y - 1)/2 * container.clientHeight;
			var vector = new THREE.Vector3();
			vector = vector.setFromMatrixPosition( this.parent.matrixWorld );
			vector.project( fcamera );
			var widthHalf = WIDTH / 2;
			var heightHalf = HEIGHT / 2;
			var containerloc = container.getBoundingClientRect();
			vector.x = ( (vector.x * widthHalf) + widthHalf )  + containerloc.left - offset.x ;
			vector.y =  ( - (vector.y * heightHalf) + heightHalf ) + containerloc.top - offset.y;

			return vector;
		}, /* End get2DCoord */
		getScreenPosition: function(obj, camera)    {
			var vector = new THREE.Vector3();

			var widthHalf = 0.5*renderer.context.canvas.width;
			var heightHalf = 0.5*renderer.context.canvas.height;

			obj.updateMatrixWorld();
			vector.setFromMatrixPosition(obj.matrixWorld);
			vector.project(camera);

			vector.x = ( vector.x * widthHalf ) + widthHalf;
			vector.y = - ( vector.y * heightHalf ) + heightHalf;

			return {
					x: vector.x,
					y: vector.y
			};

		},
	};


} /* End drawLabel */
