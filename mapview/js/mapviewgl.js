// Load Data
var xmlhttp = new XMLHttpRequest();
var url = "js/empiredata.json";
var jsonEmpire;

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        jsonEmpire = JSON.parse(xmlhttp.responseText);

    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();


if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var camera, controls, scene, renderer;
var canvas_t=[];
var context_t=[];
var clock = new THREE.Clock();
var WIDTH = window.innerWidth , HEIGHT = window.innerHeight
init();
animate();

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


  
for (var key in jsonEmpire) {
  area=jsonEmpire[key];
  // Border Generation. If it's not visible, don't generate it, dummy.
  if( area.bordervis) {
  geometry[key] = new THREE.SphereGeometry( area.rad, 10, 10 )
  material[key] = new THREE.MeshBasicMaterial( { color: area.color, wireframe: true} );
  borders[key]= new THREE.Mesh( geometry[key], material[key] );
  borders[key].position.x=area.cenx;
  borders[key].position.y=area.ceny;
  borders[key].position.z=area.cenz;
  scene.add( borders[key] );  
  }
  
  // Planet Generation
  for (var key in area["planets"]) {
    var planet = area.planets[key];
    geometry[key] = new THREE.SphereGeometry( 1, 10, 10 );
    material[key] = new THREE.MeshBasicMaterial( { color: area.color, wireframe: false} );
    planets[key]= new THREE.Mesh( geometry[key], material[key] );  
    planets[key].position.x=planet.X;
    planets[key].position.y=planet.Y;
    planets[key].position.z=planet.Z;
    var text = new Text2D(key, { align: textAlign.right,  font: '12px Arial', fillStyle: '#FFF' , antialias: false });
        text.material.alphaTest = 0.0;
        text.position.set(planet.X,planet.Y,planet.Z);
        text.scale.set(0.25,0.25,0.25);
        scene.add(text);
        scene.add( planets[key] );
   }    
  
  // Base Generation
  for (var key in area["bases"]) {
          var base = area.bases[key];
          var TILE_SIZE = 0.5; 
          geometry[key] = new THREE.CylinderGeometry( 0.1, TILE_SIZE*3, TILE_SIZE*3, 4 );
          material[key] = new THREE.MeshBasicMaterial( { color: area.color, wireframe: false} );
          bases[key] = new THREE.Mesh( geometry[key], material[key] );
          bases[key].position.x=base.X;
          bases[key].position.y=base.Y;
          bases[key].position.z=base.Z;
          scene.add( bases[key] );
           var text = new Text2D(key, { align: textAlign.left,  font: '12px Arial', fillStyle: '#ABABAB' , antialias: false });
               text.material.alphaTest = 0.0;
               text.position.set(base.X,base.Y+3,base.Z);
               text.scale.set(0.20,0.20,0.20);
               scene.add(text);
               

  }
 }
  
    // Initial Target spot. UFP for convinence. 
      controls.target.x = borders['UFP'].position.x;
      controls.target.y = borders['UFP'].position.y;
      controls.target.z = borders['UFP'].position.z;
 
  
}

function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
        
				renderer.setSize( window.innerWidth, window.innerHeight );

				controls.handleResize();

				render();

			}

function animate() {
        var delta = clock.getDelta();
        requestAnimationFrame( animate );
        
				controls.update(delta);
}


function render () {
				
      requestAnimationFrame( animate );
      
      renderer.render( scene, camera );
      
}
			render();



