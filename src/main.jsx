import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  Raycaster,
  Vector2,
  Mesh,
  MeshBasicMaterial,
  Vector4,
  TextureLoader,
} from "three";
import { TweenMax, Power2 } from "gsap";
const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
scene.add(camera);
camera.zoom;
camera.position.set(0, 5, 7);

/*const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 10); // Işık kaynağının pozisyonunu ayarlayın
scene.add(directionalLight);

// Yönlendirilmiş ışık göstericisi oluşturun
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
scene.add(directionalLightHelper); // Işık göstericisini sahnede gösterin
*/
// Nokta ışık oluşturun
const spotLight = new THREE.SpotLight( 0xffffff, 150,1000 );
spotLight.position.set( 0, 6, 7 );
scene.add( spotLight );

//const spotLightHelper = new THREE.SpotLightHelper( spotLight );
//scene.add( spotLightHelper );


window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}


const loader = new GLTFLoader();

let model;
loader.load("components/cmylmz.glb", (glb) => {


  
  model = glb.scene;
  model.position.set(1.2, 2.65, 0.2);
  camera.lookAt(model.position);
  const modelData = glb.parser; // JSON verileri
glb.scene.traverse((child) => {
  if (child.isLight) {
    child.visible = false; // Işıkları görünmez yapın
  }
});
  console.log(modelData);
  scene.add(model);
});



let model2;

loader.load("components/desk.glb", (desk) => {
  model2 = desk.scene;
  model2.position.set(15, -5,0);
  model2.scale.set(0.1,0.1,0.1);
  model2.rotateX(0);
  model2.rotateY(210.5);
  model2.rotateZ(0);
  scene.add(model2);

});
function getObjectNameOnClick(event) {
  // Fare pozisyonunu normalleştirerek -1 ile 1 arasında bir değere dönüştürün
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Raycaster oluşturun
  raycaster.setFromCamera(mouse, camera);

  // Tıklamayı gerçekleştirin ve çarpışmaları alın
  const intersects = raycaster.intersectObject(model, true);

  if (intersects.length > 0) {
    // Tıklamayı gerçekleştirdiğiniz nesne burada
    const selectedObject = intersects[0].object;

    // Nesnenin adını döndürün
    return selectedObject.name;
  }

  // Tıklanmış nesne yoksa null döndürün
  return null;
}


// Tıklama olayını dinleyin ve tıklanan nesnenin adını alın
let isLatheRaised = false; // Lathe yukarıda mı aşağıda mı kontrolü
const raiseDuration = 1; // Kaldırma süresi (saniye)
const initialPosition = { y: -0.8 }; // Başlangıç pozisyonu





renderer.domElement.addEventListener("click", (event) => {
  const clickedObjectName = getObjectNameOnClick(event);

  if (clickedObjectName === "Lathe") {
    const selectedObject = model.getObjectByName("Lathe");

    if (selectedObject) {
      if (!isLatheRaised) {
        // Kaldırma animasyonu
        TweenMax.to(selectedObject.position, raiseDuration, {
          y: selectedObject.position.y + 2,
          ease: Power2.easeOut, // Animasyon eğrisi
          onComplete: () => {
            isLatheRaised = true;
          },
        });
      } else {
        // İndirme animasyonu
        TweenMax.to(selectedObject.position, raiseDuration, {
          y: initialPosition.y,
          ease: Power2.easeIn, // Animasyon eğrisi
          onComplete: () => {
            isLatheRaised = false;
          },
        });
      }
    }
  }
});



const geometry = new THREE.BoxGeometry( 500, 0, 500 ); 
const material = new THREE.MeshToonMaterial({
  color: 0xffffff, // İstediğiniz rengi ayarlayabilirsiniz
  roughness: 10,   // Yüzeyin pürüzsüzlüğü
  metalness: 20,   // Metaliklik
  envMap: scene.background,
});

const cube = new THREE.Mesh( geometry, material ); 
cube.position.set(0,-5,0)
scene.add( cube );



function render() {
  

  renderer.render(scene, camera);
}
let rotationAngle = 0;
function animate() {
  requestAnimationFrame(animate);
  if (model) {
    model.rotation.y = rotationAngle;
    rotationAngle += 0.01; // Dönme hızı
  }

  renderer.render(scene, camera);

  controls.update();

  render();
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;
controls.enablePan = false;
controls.enableRotate = false;

animate();


const root = ReactDOM.createRoot(document.getElementById("root"));