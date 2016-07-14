if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, controls, scene, renderer;
var clock = new THREE.Clock();
var WIDTH = window.innerWidth , HEIGHT = window.innerHeight

window.onload = function() {
loadData(function() {
init();
animate();
});
}


function loadData(_callback) {
	// Load Data (hopefully) before the rest of the place loads.
	var xmlhttp = new XMLHttpRequest();
	var url = "js/atsdata.json";

	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	        jsonEmpire = JSON.parse(xmlhttp.responseText)['ATS_Navcomp_DB']['empires'];
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
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
				container = document.createElement( 'div' );
				document.body.appendChild( container );


        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1e7);

        controls = new THREE.OrbitControls( camera, renderer.domElement );
				controls.enableDamping = true;
				controls.dampingFactor = 0.25;
				controls.enableZoom = true;
  		  controls.addEventListener( 'change', render );







var Text2D = THREE_Text.Text2D;
var SpriteText2D = THREE_Text.SpriteText2D;
var textAlign = THREE_Text.textAlign
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var b_geometry, b_material, b_mesh, p_geometry, p_material, p_mesh, s_geometry, s_material, s_mesh, l_text;




for (var key in jsonEmpire) {
  area=jsonEmpire[key];

  for (var key2 in area['borders']) {
			var border = area['borders'][key2];

		  b_geometry = new THREE.SphereGeometry( border.radius, 10, 10 );
		  b_material = new THREE.MeshBasicMaterial( { color: area.color, wireframe: true} );
			b_mesh = new THREE.Mesh( b_geometry, b_material );b_mesh
		  b_mesh.position.x = border.x;
		  b_mesh.position.y = border.y;
		  b_mesh.position.z = border.z;
		  b_mesh.name = border.name;
			scene.add( b_mesh );
			if (border.radius > 10) {
				l_text = new Text2D(border.name, { align: textAlign.center,  font: '25px Arial', fillStyle: '#777' , antialias: false });
				l_text.material.alphaTest = 0.5;
				l_text.position.set(border.x,border.y,border.z);
				l_text.scale.set(0.75,0.75,0.75);
				scene.add(l_text);
			}
	}



  // Planet Generation
  for (var key in area["planets"]) {
    var planet = area.planets[key];
    p_geometry= new THREE.SphereGeometry( 1, 10, 10 );
    p_material = new THREE.MeshBasicMaterial( { color: area.color, wireframe: false} );
    p_mesh =  new THREE.Mesh( p_geometry, p_material );
    p_mesh.position.x=planet.x;
    p_mesh.position.y=planet.y;
    p_mesh.position.z=planet.z;
    p_mesh.name = planet.name;
		scene.add( p_mesh );
    l_text = new Text2D(planet.name, { align: textAlign.right,  font: '12px Arial', fillStyle: '#FFF' , antialias: false });
    l_text.material.alphaTest = 0.0;
    l_text.position.set(planet.x,planet.y,planet.z);
    l_text.scale.set(0.25,0.25,0.25);
    scene.add(l_text);
  }

  // Base Generation
  for (var key in area["stations"]) {
    var base = area.stations[key];
    s_geometry = new THREE.CylinderGeometry( 0.1, 0.5*3, 0.5*3, 4 );
    s_material = new THREE.MeshBasicMaterial( { color: area.color, wireframe: false} );
    s_mesh = new THREE.Mesh( s_geometry, s_material );
    s_mesh.position.x=base.x;
    s_mesh.position.y=base.y;
    s_mesh.position.z=base.z;
		s_mesh.name = base.name;
    scene.add( s_mesh );
  	l_text = new Text2D(base.name, { align: textAlign.left,  font: '12px Arial', fillStyle: '#ABABAB' , antialias: false });
    l_text.material.alphaTest = 0.0;
    l_text.position.set(base.x,base.y+3,base.z);
		l_text.scale.set(0.20,0.20,0.20);
    scene.add(l_text);
  }

}
    // Set view and camera to point to initial location
		reset_view();

}

window.onresize = function() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );


				render();

}
function animate() {
				var delta = clock.getDelta();
	        requestAnimationFrame( animate );
	        scene.updateMatrixWorld()
					controls.update(delta);
	        render();


			}


function render () {
		//requestAnimationFrame( render );
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

	var types = ['planets','stations'];
	for (var type in types) {
		var objects = listobjects(types[type]);
    for ( var key in objects ) {
			if (escapeHTML(key) == name) {
					var object = objects[key];
					controls.target.x = object.x;
				  controls.target.y = object.y;
				  controls.target.z = object.z;
					var focus = new THREE.Vector3( object.x, object.y, object.z );
					var vantage = new THREE.Vector3( 5, 60 , 150 );
					focus.add(vantage);
					camera.position.set(focus.x,focus.y,focus.z);
					camera.updateProjectionMatrix();
					render();


			}

		}

	}

}


function drawline(name,origin,dest) {
	  var geometry  = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial( { color: '#FFF', });
	  geometry.vertices.push(origin, direction);
    var line = new THREE.Line( geometry, material );
	  ray.name = "test";
	  scene.add(ray);
		animate();

}

function removeEntity(object) {
    var selectedObject = scene.getObjectByName(object);
    scene.remove( selectedObject );
    animate();
}
