if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, controls, scene, renderer;
var canvas_t=[];
var context_t=[];
var clock = new THREE.Clock();
var WIDTH = window.innerWidth , HEIGHT = window.innerHeight

window.onload = function() {
loadData(function() { 
init();
animate();
render();
});
}


function loadData(_callback) {
	// Load Data (hopefully) before the rest of the place loads. 
	var xmlhttp = new XMLHttpRequest();
	var url = "js/atsdata.json";
	
	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	        jsonEmpire = JSON.parse(xmlhttp.responseText);
	        _callback();
	
	    }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
	
}

function reset_view() {  
	camera.position.set(-9300,50,550);
	controls.target.x = jsonEmpire[1]['borders'][0].x;
    	controls.target.y = jsonEmpire[1]['borders'][0].y;
      	controls.target.z = jsonEmpire[1]['borders'][0].z;
}

function init() {
	scene = new THREE.Scene();
        //scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

				container = document.createElement( 'div' );
				document.body.appendChild( container );

        
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1e7);
      /*  controls = new THREE.TrackballControls( camera, renderer.domElement );  // I don't like how the Trackball controls work. 
				controls.rotateSpeed = 1.0;
				controls.zoomSpeed = 1.2;
				controls.panSpeed = 0.8;
				controls.noZoom = false;                   
				controls.noPan = true;
				controls.staticMoving = true;
				controls.dynamicDampingFactor = 0.3;
				controls.keys = [ 65, 83, 68 ];
        camera.position.set(-8500,50,550);
/*        camera.target =  new THREE.Vector3().addVectors(/*new line for readability*/
            //  new THREE.Vector3(-9800,200,0), camera.getWorldDirection()); */
              //camera.target = new THREE.Vector3(-9197,0,0);                                           //  END Trackball controls
      
        controls = new THREE.OrbitControls( camera, renderer.domElement );
				controls.enableDamping = true;
				controls.dampingFactor = 0.25;
				controls.enableZoom = true;
        camera.position.set(-9300,50,550);
  		  controls.addEventListener( 'change', render );
        


var borders=[];
var geometry=[];
var material=[];
var planets=[];
var labels=[];
var bases=[];
var Text2D = THREE_Text.Text2D;
var SpriteText2D = THREE_Text.SpriteText2D;
var textAlign = THREE_Text.textAlign      
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var rays = [];

jsonEmpire = jsonEmpire['ATS_Navcomp_DB']['empires'];
  
for (var key in jsonEmpire) {
  area=jsonEmpire[key]; 
  // Border Generation. If it's not visible, don't generate it, dummy.
  for (var key2 in area['borders']) {
	var border = area['borders'][key2];
	
 	geometry[border.name] = new THREE.SphereGeometry( border.radius, 10, 10 ); 
  	material[border.name] = new THREE.MeshBasicMaterial( { color: area.color, wireframe: true} );
	borders[border.name] = new THREE.Mesh( geometry[border.name], material[border.name] );
  	borders[border.name].position.x = border.x;
  	borders[border.name].position.y = border.y;
  	borders[border.name].position.z = border.z;
  	borders[border.name].name = border.name;
	scene.add( borders[border.name] );
	if (border.radius > 10) {
		var text = new Text2D(border.name, { align: textAlign.center,  font: '25px Arial', fillStyle: '#777' , antialias: false });
		text.material.alphaTest = 0.5;
		text.position.set(border.x,border.y,border.z);
		text.scale.set(0.75,0.75,0.75);
		scene.add(text);
	}
   }
 
  
  
  // Planet Generation
  for (var key in area["planets"]) {
    var planet = area.planets[key];
    geometry[planet.name] = new THREE.SphereGeometry( 1, 10, 10 );
    material[planet.name] = new THREE.MeshBasicMaterial( { color: area.color, wireframe: false} );
    planets[planet.name]= new THREE.Mesh( geometry[planet.name], material[planet.name] );  
    planets[planet.name].position.x=planet.x;
    planets[planet.name].position.y=planet.y;
    planets[planet.name].position.z=planet.z;
    planets[planet.name].name = planet.name;
    var text = new Text2D(planet.name, { align: textAlign.right,  font: '12px Arial', fillStyle: '#FFF' , antialias: false });
        text.material.alphaTest = 0.0;
        text.position.set(planet.x,planet.y,planet.z);
        text.scale.set(0.25,0.25,0.25);
        scene.add(text);
        scene.add( planets[planet.name] );
   }    
  
  // Base Generation
  for (var key in area["stations"]) {
          var base = area.stations[key];
          var TILE_SIZE = 0.5; 
          geometry[base.name] = new THREE.CylinderGeometry( 0.1, TILE_SIZE*3, TILE_SIZE*3, 4 );
          material[base.name] = new THREE.MeshBasicMaterial( { color: area.color, wireframe: false} );
          bases[base.name] = new THREE.Mesh( geometry[base.name], material[base.name] );
          bases[base.name].position.x=base.x;
          bases[base.name].position.y=base.y;
          bases[base.name].position.z=base.z;
	  bases[base.name].name = base.name;
          scene.add( bases[base.name] );
           var text = new Text2D(base.name, { align: textAlign.left,  font: '12px Arial', fillStyle: '#ABABAB' , antialias: false });
               text.material.alphaTest = 0.0;
               text.position.set(base.x,base.y+3,base.z);
               text.scale.set(0.20,0.20,0.20);
               scene.add(text);
               

  }
 }
  
    // Initial Target spot. UFP for convinence. 
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
        renderer.render(scene, camera);
}


function render () {
				
      requestAnimationFrame( animate );
      
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
	for (var type in types){
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
