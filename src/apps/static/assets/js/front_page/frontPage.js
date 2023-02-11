
  const spotsNum = 4;
  const annNum = 15;

  const clickNumber={
    annotation1:0,
    annotation2:0,
    annotation3:0,
    annotation4:0,
    annotation5:0,
    annotation6:0,
    annotation7:0,
    annotation8:0,
    annotation9:0,
    annotation10:0,
    annotation11:0,
    annotation12:0,
    annotation13:0,
    annotation14:0,
    annotation15:0,

  
  }


  let camera;
  let controls;
  let scene;
  let renderer;
  let sprite, sprite1, sprite2, sprite3, sprite4,sprite5, sprite6, sprite7, sprite8, sprite9,sprite10, sprite11, sprite12, sprite13, sprite14,sprite15, sprite16, sprite17;
  let mesh;
  let spriteBehindObject;
  var annotation1 = document.getElementById("annotation1");//document.querySelector(".annotation");
  var annotation2 = document.getElementById("annotation2");
  var annotation3 = document.getElementById("annotation3");
  var annotation4 = document.getElementById("annotation4");
  var annotation5 = document.getElementById("annotation5");//document.querySelector(".annotation");
  var annotation6 = document.getElementById("annotation6");
  var annotation7 = document.getElementById("annotation7");
  var annotation8 = document.getElementById("annotation8");
  var annotation9 = document.getElementById("annotation9");//document.querySelector(".annotation");
  var annotation10 = document.getElementById("annotation10");
  var annotation11 = document.getElementById("annotation11");
  var annotation12 = document.getElementById("annotation12");
  var annotation13 = document.getElementById("annotation13");//document.querySelector(".annotation");
  var annotation14 = document.getElementById("annotation14");
  var annotation15 = document.getElementById("annotation15");
  var annotation;
  var vector;

  var sphere, sphere1, sphere2, sphere3, sphere4,sphere5, sphere6, sphere7, sphere8, sphere9,sphere10, sphere11, sphere12, sphere13, sphere14,sphere15, sphere16, sphere17;

  // the hotspots flicker
  var clock = new THREE.Clock;
  var mixers = [];
  var sphereList = [];

  // detect intersection
  var raycaster = new THREE.Raycaster();
  var mouse= new THREE.Vector2(1,1);
  var intersects=[];
  var intersectedSphere;


  init();
  animate();

  function init() {
      
      // Camera

      camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100000);
      camera.position.x = 750;
      camera.position.y = 500;
      camera.position.z = 1250;

      // Scene

      scene = new THREE.Scene();

      // Lights

      const lights = [];
      lights[0] = new THREE.PointLight(0xffffff, 1, 0);
      lights[1] = new THREE.PointLight(0xffffff, 1, 0);
      lights[2] = new THREE.PointLight(0xffffff, 1, 0);

      lights[0].position.set(0, 2000, 0);
      lights[1].position.set(1000, 2000, 1000);
      lights[2].position.set(-1000, -2000, -1000);

      scene.add(lights[0]);
      scene.add(lights[1]);
      scene.add(lights[2]);

      // Mesh

      const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);

      mesh = new THREE.Mesh(
          cubeGeometry,
          new THREE.MeshPhongMaterial({
              color: 0x156289,
              emissive: 0x072534,
              side: THREE.DoubleSide,
              shading: THREE.FlatShading
          })
      );

      let objects = [];

      var loader = new THREE.GLTFLoader();
      loader.load( model_path, function ( gltf ) {
          /* Set metalness to 0 so the object is visable */
          gltf.scene.traverse( child => {
              if ( child.material ) child.material.metalness = 0;
          } );

          scene.add(gltf.scene);
          gltf.scene.position.set(-7,-7,-3);

      }, undefined, function ( error ) {
          console.error( error )
      } );

      scene.scale.set(60,60,60);

      const line = new THREE.LineSegments(
          new THREE.WireframeGeometry(cubeGeometry),
          new THREE.LineBasicMaterial({
              color: 0xffffff,
              linewidth: 1,
              opacity: 0.25,
              transparent: true
          })
      );

      //scene.add(mesh);
      const numberTexture1 = new THREE.CanvasTexture(
          document.querySelector("#number1")
      );

      const spriteMaterial1 = new THREE.SpriteMaterial({
          map: numberTexture1,
          alphaTest: 0.5,
          transparent: true,
          depthTest: false,
          depthWrite: false
      });

      sprite1 = new THREE.Sprite(spriteMaterial1);
      sprite1.position.set(5, 5, 5);
      sprite1.scale.set(1, 1, 1);

      scene.add(sprite1);

      const numberTexture2 = new THREE.CanvasTexture(
          document.querySelector("#number2")
      );

      const spriteMaterial2 = new THREE.SpriteMaterial({
          map: numberTexture2,
          alphaTest: 0.5,
          transparent: true,
          depthTest: false,
          depthWrite: false
      });

      sprite2 = new THREE.Sprite(spriteMaterial2);
      sprite2.position.set(-5, 5, 5);
      sprite2.scale.set(1, 1, 1);
      
      scene.add(sprite2);

      const numberTexture3 = new THREE.CanvasTexture(
          document.querySelector("#number3")
      );

      const spriteMaterial3 = new THREE.SpriteMaterial({
          map: numberTexture3,
          alphaTest: 0.5,
          transparent: true,
          depthTest: false,
          depthWrite: false
      });

      sprite3 = new THREE.Sprite(spriteMaterial3);
      sprite3.position.set(5, -5, 5);
      sprite3.scale.set(1, 1, 1);

      scene.add(sprite3);

      const numberTexture4 = new THREE.CanvasTexture(
          document.querySelector("#number4")
      );

      const spriteMaterial4 = new THREE.SpriteMaterial({
          map: numberTexture4,
          alphaTest: 0.5,
          transparent: true,
          depthTest: false,
          depthWrite: false
      });

      sprite4 = new THREE.Sprite(spriteMaterial4);
      sprite4.position.set(5, 5, -5);
      sprite4.scale.set(1, 1, 1);

      scene.add(sprite4);

      //sphere
      const sphereGeometry1 = new THREE.SphereGeometry(0.5,10,10);
      const sphereMaterial1 = new THREE.MeshStandardMaterial({
          color: 0xfffff,
          transparent: true
      });

      const sphereGeometry2 = new THREE.SphereGeometry(0.5,10,10);
      const sphereMaterial2 = new THREE.MeshStandardMaterial({
          color: 0xfffff,
          transparent: true
      });

      const sphereGeometry3 = new THREE.SphereGeometry(0.5,10,10);
      const sphereMaterial3 = new THREE.MeshStandardMaterial({
          color: 0xfffff,
          transparent: true
      });

      const sphereGeometry4 = new THREE.SphereGeometry(0.5,10,10);
      const sphereMaterial4 = new THREE.MeshStandardMaterial({
          color: 0xfffff,
          transparent: true
      });

      const sphereGeometry5 = new THREE.SphereGeometry(0.5,10,10);
      const sphereMaterial5 = new THREE.MeshStandardMaterial({
          color: 0xfffff,
          transparent: true
      });

      const sphereGeometry6 = new THREE.SphereGeometry(0.5,10,10);
      const sphereMaterial6 = new THREE.MeshStandardMaterial({
          color: 0xfffff,
          transparent: true
      });

      const sphereGeometry7 = new THREE.SphereGeometry(1,10,10);
      const sphereMaterial7 = new THREE.MeshStandardMaterial({
          color: 0xfffff,
          transparent: true
      });

      const sphereGeometry8 = new THREE.SphereGeometry(0.5,10,10);
      const sphereMaterial8 = new THREE.MeshStandardMaterial({
          color: 0xfffff,
          transparent: true
      });

      const sphereGeometry9 = new THREE.SphereGeometry(0.5,10,10);
      const sphereMaterial9 = new THREE.MeshStandardMaterial({
          color: 0xfffff,
          transparent: true
      });

      const sphereGeometry10 = new THREE.SphereGeometry(0.5,10,10);
      const sphereMaterial10 = new THREE.MeshStandardMaterial({
          color: 0xfffff,
          transparent: true
      });

      const sphereGeometry11 = new THREE.SphereGeometry(0.5,10,10);
      const sphereMaterial11 = new THREE.MeshStandardMaterial({
          color: 0xfffff,
          transparent: true
      });

      const sphereGeometry12 = new THREE.SphereGeometry(0.5,10,10);
      const sphereMaterial12 = new THREE.MeshStandardMaterial({
          color: 0xfffff,
          transparent: true
      });

      const sphereGeometry13 = new THREE.SphereGeometry(0.5,10,10);
      const sphereMaterial13 = new THREE.MeshStandardMaterial({
          color: 0xfffff,
          transparent: true
      });

      const sphereGeometry14 = new THREE.SphereGeometry(0.5,10,10);
      const sphereMaterial14 = new THREE.MeshStandardMaterial({
          color: 0xfffff,
          transparent: true
      });

      const sphereGeometry15 = new THREE.SphereGeometry(0.5,10,10);
      const sphereMaterial15 = new THREE.MeshStandardMaterial({
          color: 0xfffff,
          transparent: true
      });

      const sphereGeometry16 = new THREE.SphereGeometry(0.5,10,10);
      const sphereMaterial16 = new THREE.MeshStandardMaterial({
          color: 0xfffff,
          transparent: true
      });

      const sphereGeometry17 = new THREE.SphereGeometry(0.5,10,10);
      const sphereMaterial17 = new THREE.MeshStandardMaterial({
          color: 0xfffff,
          transparent: true
      });

      sphere1 = new THREE.Mesh(sphereGeometry1, sphereMaterial1);
      sphere1.position.set(-18.5,-0.5,1);
      var mixer = new THREE.AnimationMixer(sphere1);
      var action = mixer.clipAction(getClip());
      action.timeScale = 1;
      action.loop = THREE.LoopPingPong;
      action.play();
      mixers.push(mixer);    
      sphereList.push(sphere1);
      scene.add(sphere1) ;

      sphere2 = new THREE.Mesh(sphereGeometry2, sphereMaterial2);
      sphere2.position.set(-18.4,1,0.8);
      var mixer2 = new THREE.AnimationMixer(sphere2);
      var action2 = mixer2.clipAction(getClip());
      action2.timeScale = 1;
      action2.loop = THREE.LoopPingPong;
      action2.play();
      mixers.push(mixer2);    
      sphereList.push(sphere2);
      scene.add(sphere2) ;

      sphere3 = new THREE.Mesh(sphereGeometry3, sphereMaterial3);
      sphere3.position.set(-20.5,2,1);   
      var mixer3 = new THREE.AnimationMixer(sphere3);
      var action3 = mixer3.clipAction(getClip());
      action3.timeScale = 1;
      action3.loop = THREE.LoopPingPong;
      action3.play();
      mixers.push(mixer3);    
      sphereList.push(sphere3);
      scene.add(sphere3) ;

      sphere4 = new THREE.Mesh(sphereGeometry4, sphereMaterial4);
      sphere4.position.set(-37,1.6,1.5);  
      var mixer4 = new THREE.AnimationMixer(sphere4);
      var action4 = mixer4.clipAction(getClip());
      action4.timeScale = 1;
      action4.loop = THREE.LoopPingPong;
      action4.play();
      mixers.push(mixer4);    
      sphereList.push(sphere4);
      scene.add(sphere4) ;

      sphere5 = new THREE.Mesh(sphereGeometry1, sphereMaterial1);
      sphere5.position.set(-24.5,-5.5,-0.5);
      var mixer5 = new THREE.AnimationMixer(sphere5);
      var action5 = mixer5.clipAction(getClip());
      action5.timeScale = 1;
      action5.loop = THREE.LoopPingPong;
      action5.play();
      mixers.push(mixer5);    
      sphereList.push(sphere5);
      scene.add(sphere5) ;

      sphere6 = new THREE.Mesh(sphereGeometry2, sphereMaterial2);
      sphere6.position.set(-24.5,-5.5,-5.8);
      var mixer6 = new THREE.AnimationMixer(sphere6);
      var action6 = mixer6.clipAction(getClip());
      action6.timeScale = 1;
      action6.loop = THREE.LoopPingPong;
      action6.play();
      mixers.push(mixer2);    
      sphereList.push(sphere6);
      scene.add(sphere6) ;

      sphere7 = new THREE.Mesh(sphereGeometry7, sphereMaterial7);
      sphere7.position.set(7.5,-4,-3);  
      var mixer7 = new THREE.AnimationMixer(sphere7);
      var action7 = mixer7.clipAction(getClip());
      action7.timeScale = 1;
      action7.loop = THREE.LoopPingPong;
      action7.play();
      mixers.push(mixer7);    
      sphereList.push(sphere7);
      scene.add(sphere7) ;

      sphere8 = new THREE.Mesh(sphereGeometry8, sphereMaterial8);
      sphere8.position.set(2,2,-1);  
      var mixer8 = new THREE.AnimationMixer(sphere8);
      var action8 = mixer8.clipAction(getClip());
      action8.timeScale = 1;
      action8.loop = THREE.LoopPingPong;
      action8.play();
      mixers.push(mixer8);    
      sphereList.push(sphere8);
      scene.add(sphere8) ;

      sphere9 = new THREE.Mesh(sphereGeometry9, sphereMaterial9);
      sphere9.position.set(2,2,-2);  
      var mixer9 = new THREE.AnimationMixer(sphere9);
      var action9 = mixer9.clipAction(getClip());
      action9.timeScale = 1;
      action9.loop = THREE.LoopPingPong;
      action9.play();
      mixers.push(mixer9);    
      sphereList.push(sphere9);
      scene.add(sphere9) ;

      sphere10 = new THREE.Mesh(sphereGeometry10, sphereMaterial10);
      sphere10.position.set(2,2,-3);  
      var mixer10 = new THREE.AnimationMixer(sphere10);
      var action10 = mixer10.clipAction(getClip());
      action10.timeScale = 1;
      action10.loop = THREE.LoopPingPong;
      action10.play();
      mixers.push(mixer10);    
      sphereList.push(sphere10);
      scene.add(sphere10) ;

      sphere11 = new THREE.Mesh(sphereGeometry11, sphereMaterial11);
      sphere11.position.set(-3.5,5,-3);  
      var mixer11 = new THREE.AnimationMixer(sphere11);
      var action11 = mixer11.clipAction(getClip());
      action11.timeScale = 1;
      action11.loop = THREE.LoopPingPong;
      action11.play();
      mixers.push(mixer11);    
      sphereList.push(sphere11);
      scene.add(sphere11) ;

      sphere12 = new THREE.Mesh(sphereGeometry12, sphereMaterial12);
      sphere12.position.set(-5.5,11,-3);  
      var mixer12 = new THREE.AnimationMixer(sphere12);
      var action12 = mixer12.clipAction(getClip());
      action12.timeScale = 1;
      action12.loop = THREE.LoopPingPong;
      action12.play();
      mixers.push(mixer12);    
      sphereList.push(sphere12);
      scene.add(sphere12) ;

      sphere13 = new THREE.Mesh(sphereGeometry13, sphereMaterial13);
      sphere13.position.set(-3.5,5,-1);  
      var mixer13 = new THREE.AnimationMixer(sphere13);
      var action13 = mixer13.clipAction(getClip());
      action13.timeScale = 1;
      action13.loop = THREE.LoopPingPong;
      action13.play();
      mixers.push(mixer13);    
      sphereList.push(sphere13);
      scene.add(sphere13) ;

      sphere14 = new THREE.Mesh(sphereGeometry14, sphereMaterial14);
      sphere14.position.set(-3.5,5,-5);  
      var mixer14 = new THREE.AnimationMixer(sphere14);
      var action14 = mixer14.clipAction(getClip());
      action14.timeScale = 1;
      action14.loop = THREE.LoopPingPong;
      action14.play();
      mixers.push(mixer14);    
      sphereList.push(sphere14);
      scene.add(sphere14) ;

      sphere15 = new THREE.Mesh(sphereGeometry15, sphereMaterial15);
      sphere15.position.set(-317,1.6,1.5);  
      var mixer15 = new THREE.AnimationMixer(sphere15);
      var action15 = mixer15.clipAction(getClip());
      action15.timeScale = 1;
      action15.loop = THREE.LoopPingPong;
      action15.play();
      mixers.push(mixer15);    
      sphereList.push(sphere15);
      scene.add(sphere15) ;


      // Sprite
      document.addEventListener( 'click', onDocumentMouseMove, false );
      // Renderer

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0xD4F2E7, 1);
      document.body.appendChild(renderer.domElement);

      // Controls

      controls = new THREE.OrbitControls(camera, renderer.domElement);
      //controls.enableZoom = false;
    
      window.addEventListener("resize", onWindowResize, false);
      window.onload
  }

  function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
  }


  function animate() {
      const delta = clock.getDelta();
      mixers.forEach((mixer) => mixer.update(delta));
      requestAnimationFrame(render);

      requestAnimationFrame(animate);
      controls.update();
      render();
  }

  function getClip(){
      const times=[0,1];
      const values = [1,0];
      const opacTrack = new THREE.VectorKeyframeTrack('sphere.material.opacity',times,values);
      const duration = 1;
      return new THREE.AnimationClip('sphere1OpacClip',duration,[opacTrack]);

  }

  function render() {

      
      renderer.render(scene, camera);
      sprite = sprite1;
      annotation = annotation1;
      vector = new THREE.Vector3(-1000, 150, 100);
      updateAnnotationOpacity();
      updateScreenPosition();
      sprite = sprite2;
      annotation = annotation2;
      vector = new THREE.Vector3(-1100, 250, 100);
      updateAnnotationOpacity();
      updateScreenPosition();
      sprite = sprite3;
      annotation = annotation3;
      vector = new THREE.Vector3(-1300, 250, 100);
      updateAnnotationOpacity();
      updateScreenPosition();
      sprite = sprite4;
      annotation = annotation4;
      vector = new THREE.Vector3(-2300, 250, 100);
      updateAnnotationOpacity();
      updateScreenPosition();
      annotation = annotation5;
      sprite = sprite2;
      vector = new THREE.Vector3(-1800,-100,-250);
      updateAnnotationOpacity();
      updateScreenPosition();
      annotation = annotation6;
      sprite = sprite2;
      vector = new THREE.Vector3(-1800,-100,-250);
      updateAnnotationOpacity();
      updateScreenPosition();
      annotation = annotation7;
      sprite = sprite3;
      vector = new THREE.Vector3(100, 0, 100);
      updateAnnotationOpacity();
      updateScreenPosition();
      annotation = annotation8;
      sprite = sprite4;
      vector = new THREE.Vector3(-100,200,0);
      updateAnnotationOpacity();
      updateScreenPosition();
      annotation = annotation9;
      sprite = sprite4;
      vector = new THREE.Vector3(-100,200,0);
      updateAnnotationOpacity();
      updateScreenPosition();
      annotation = annotation10;
      sprite = sprite4;
      vector = new THREE.Vector3(-100,200,0);
      updateAnnotationOpacity();
      updateScreenPosition();
      annotation = annotation11;
      sprite = sprite4;
      vector = new THREE.Vector3(-100,200,0);
      updateAnnotationOpacity();
      updateScreenPosition();
      annotation = annotation12;
      sprite = sprite4;
      vector = new THREE.Vector3(-100,200,0);
      updateAnnotationOpacity();
      updateScreenPosition();
      annotation = annotation13;
      sprite = sprite4;
      vector = new THREE.Vector3(-100, 200, 0);
      updateAnnotationOpacity();
      updateScreenPosition();
      annotation = annotation14;
      sprite = sprite4;
      vector = new THREE.Vector3(-100, 200, 0);
      updateAnnotationOpacity();
      updateScreenPosition();
      sprite = sprite4;
      annotation = annotation15;
      vector = new THREE.Vector3(-100, 200, 0);
      updateAnnotationOpacity();
      updateScreenPosition();
  }

  function updateAnnotationOpacity() {
      const meshDistance = camera.position.distanceTo(mesh.position);
      var spriteDistance = camera.position.distanceTo(sprite.position);
      spriteBehindObject = spriteDistance > meshDistance;
      sprite.material.opacity = spriteBehindObject ? 0.25 : 1;

  }

  function updateScreenPosition() {
      // alert(vector.x)
      const canvas = renderer.domElement;

      vector.project(camera);

      vector.x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio));
      vector.y = Math.round((0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio));
  }

  function onDocumentMouseMove( event ) 
{
  
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(sphereList,true);	
  
    if (intersects.length != 0) {
        let obj=intersects[0].object;
        for (var i=0;i<sphereList.length;i++){

            if(sphereList[i]==obj){
                var annotationNum = "annotation"+(i+1);
                sphereList[i].material.color.set(0xffff00);
                if(clickNumber[annotationNum]==0){clickNumber[annotationNum]=1}
                else{clickNumber[annotationNum]=0}

            }
        }     
    } 

    blockList=[];
    heightSum = 15;

    for (var i=0;i<Object.keys(clickNumber).length;i++){
      var annotationNum = "annotation"+(i+1);
      if(clickNumber[annotationNum]==0){
        document.getElementById(annotationNum).style.display = "none";
        sphereList[i].material.color.set(0xfffff);
      }
      else{
        tempBlock=document.getElementById(annotationNum)
        
        sphereList[i].material.color.set(0xffff00);

        tempStr = heightSum+"px"
        document.getElementById(annotationNum).style.top = tempStr;
        document.getElementById(annotationNum).style.display = "block";
        heightSum += document.getElementById(annotationNum).offsetHeight+5;

        }
    }
}