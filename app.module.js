// app.module.js - STARK INDUSTRIES HOLOGRAM & OPACITY FIXED ENGINE
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ─── Precision Engine State Architecture ─────────────────────────────────────
const CONFIG = {
  opacity: 1.0, // Global dynamic opacity tracer
  holoMode: false,
  splitFactor: 0.0,
  targetSplitFactor: 0.0, 
  
  isDualHandSplitting: false,
  inspectionModeActive: false,
  currentPartIndex: 0,
  gestureCooldown: false,
  currentPartIsolationScale: 1.0,
};

let focusMesh = null; 
let allMeshesPool = [];
let currentModel = null;
let originalPositions = new Map(); 
let originalMaterials = new Map(); 

const mainGroup = new THREE.Group();
const scene = new THREE.Scene();
scene.add(mainGroup);

// ─── UI Layout Elements Safety Bindings ─────────────────────────────────────
const loaderDiv = document.getElementById('loader');
const modeDisplay = document.getElementById('mode-display');
const statusPanel = document.getElementById('status-panel');
const inputVideo = document.getElementById('input-video');
const btnHoloToggle = document.getElementById('btn-holo-toggle');
const fileInputGlb = document.getElementById('file-input-glb');

function hideLoader() {
  if (loaderDiv) { loaderDiv.style.display = 'none'; loaderDiv.style.opacity = '0'; }
}

// ─── Three.js Fluid Environment Setup ───────────────────────────────────────
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace; 
renderer.shadowMap.enabled = true; 
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 1.8)); 
const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
dirLight.position.set(5, 12, 8);
dirLight.castShadow = true;
dirLight.shadow.bias = -0.001; 
scene.add(dirLight);

function clearObjects() {
  while(mainGroup.children.length > 0) mainGroup.remove(mainGroup.children[0]);
  currentModel = null; originalPositions.clear(); originalMaterials.clear(); allMeshesPool = []; focusMesh = null;
  CONFIG.splitFactor = 0.0; CONFIG.targetSplitFactor = 0.0;
  CONFIG.isDualHandSplitting = false; CONFIG.inspectionModeActive = false;
  CONFIG.currentPartIndex = 0; CONFIG.gestureCooldown = false;
  mainGroup.position.set(0, 0, 0);
  mainGroup.rotation.set(0, 0, 0);
  mainGroup.scale.setScalar(1);
}

// ─── Stark Center-Fit Vector Matrix ─────────────────────────────────────────
function isolateFocusMeshFullScreen(targetMesh) {
  if (!targetMesh) return;
  if(statusPanel) statusPanel.textContent = '⚡ ISOLATED INSPECTION: ' + (targetMesh.name || 'PART_' + CONFIG.currentPartIndex);
  
  targetMesh.geometry.computeBoundingBox();
  const box = targetMesh.geometry.boundingBox;
  const size = new THREE.Vector3(); box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  
  const fov = camera.fov * (Math.PI / 180);
  const distance = Math.abs(camera.position.z - mainGroup.position.z);
  const cameraViewHeight = 2 * Math.tan(fov / 2) * distance;
  const cameraViewWidth = cameraViewHeight * camera.aspect;
  
  const targetScale = Math.min(cameraViewWidth / maxDim, cameraViewHeight / maxDim) * 0.85;
  CONFIG.currentPartIsolationScale = targetScale;
}

function cycleToNextIsolatedPart() {
  if (CONFIG.gestureCooldown || allMeshesPool.length === 0) return;
  CONFIG.gestureCooldown = true;

  if (focusMesh) {
    focusMesh.rotation.set(0, 0, 0);
  }

  CONFIG.currentPartIndex = (CONFIG.currentPartIndex + 1) % allMeshesPool.length;
  focusMesh = allMeshesPool[CONFIG.currentPartIndex];
  isolateFocusMeshFullScreen(focusMesh);
  
  setTimeout(() => CONFIG.gestureCooldown = false, 1000); 
}

function initiateSlowMagneticSnapback() {
  CONFIG.targetSplitFactor = 0.0;
  CONFIG.splitFactor = 0.0;
  CONFIG.isDualHandSplitting = false;
  CONFIG.inspectionModeActive = false;
  focusMesh = null;
  
  mainGroup.position.set(0, 0, 0);
  mainGroup.rotation.set(0, 0, 0);
  mainGroup.scale.setScalar(1);

  allMeshesPool.forEach(mesh => {
    mesh.visible = true; 
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });

  if(modeDisplay) modeDisplay.textContent = '🤝 STARK ALGORITHM: FULLY ASSEMBLED';
}

function recordOriginalPositions(model) {
  model.traverse((child) => {
    if (child.isMesh) {
      if (!originalPositions.has(child.uuid)) {
        originalPositions.set(child.uuid, { 
          pos: child.position.clone(), 
          rot: child.rotation.clone(),
          scale: child.scale.clone(),
          direction: child.position.clone().normalize() 
        });
      }
      if (!originalMaterials.has(child.uuid)) {
        originalMaterials.set(child.uuid, child.material.clone());
      }
      child.material.transparent = true;
      child.castShadow = true;
      child.receiveShadow = true;
      allMeshesPool.push(child);
    }
  });
}

function updateExplodePhysics(model, factor) {
  model.traverse((child) => {
    if (child.isMesh && originalPositions.has(child.uuid) && !CONFIG.inspectionModeActive) {
      const data = originalPositions.get(child.uuid);
      child.position.x = data.pos.x + (data.direction.x * factor * 1.8);
      child.position.y = data.pos.y + (data.direction.y * factor * 1.8);
      child.position.z = data.pos.z + (data.direction.z * factor * 1.8);
    }
  });
}

// ─── CRITICAL FIX: STARK HOLOGRAM INJECTOR MATRICES ──────────────────────────
if (btnHoloToggle) {
  btnHoloToggle.addEventListener('click', () => {
    CONFIG.holoMode = !CONFIG.holoMode;
    if(modeDisplay) modeDisplay.textContent = CONFIG.holoMode ? '🌐 HOLOGRAM MODE: CYAN ACTIVE' : '🎨 VISUALS: REALISTIC MODE';
    
    allMeshesPool.forEach(mesh => {
      if (CONFIG.holoMode) {
        // FORCE RE-RENDER WITH TRUE CYAN GLOW WIREFRAME
        mesh.material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(0x00ffff), // Solid Stark Neon Cyan Blue
          wireframe: true,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide
        });
        mesh.material.needsUpdate = true; // Tell WebGL to flush cache instantly
      } else {
        // RESTORE ORIGINAL TEXTURE INSTANTLY
        if (originalMaterials.has(mesh.uuid)) {
          mesh.material = originalMaterials.get(mesh.uuid).clone();
          mesh.material.transparent = true;
          mesh.material.needsUpdate = true;
        }
      }
    });
  });
}

// ─── Precision Gesture Analyzer ─────────────────────────────────────────────
function analyzeAdvancedGestures(landmarks) {
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const thumbTip = landmarks[4], indexTip = landmarks[8], middleTip = landmarks[12], ringTip = landmarks[16], pinkyTip = landmarks[20];
  const indexPip = landmarks[6], middlePip = landmarks[10], ringPip = landmarks[14], pinkyPip = landmarks[18], wrist = landmarks[0];
  
  const isIndexUp = dist(indexTip, wrist) > dist(indexPip, wrist);
  const isMiddleUp = dist(middleTip, wrist) > dist(middlePip, wrist);
  const isRingUp = dist(ringTip, wrist) > dist(ringPip, wrist);
  const isPinkyUp = dist(pinkyTip, wrist) > dist(pinkyPip, wrist);

  if (thumbTip.y < indexPip.y && !isIndexUp && !isMiddleUp && !isRingUp && !isPinkyUp) return 'thumbs_up';
  if (isIndexUp && isMiddleUp && !isRingUp && !isPinkyUp && dist(indexTip, middleTip) <= 0.05) return 'two_finger_move';
  
  if (!isRingUp && !isPinkyUp) {
    const pinchDist = dist(thumbTip, indexTip);
    if (pinchDist < 0.04) return 'pinch_close';
    if (pinchDist > 0.08 && isIndexUp) return 'pinch_open';
  }

  if (isIndexUp && isMiddleUp && isRingUp && isPinkyUp) return 'open_hand';
  
  return 'none'; 
}

try {
  if (typeof Hands !== 'undefined' && typeof Camera !== 'undefined') {
    const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
    hands.setOptions({ maxNumHands: 2, modelComplexity: 1, minDetectionConfidence: 0.82, minTrackingConfidence: 0.82 });
    
    hands.onResults((results) => {
      const detectedHands = results.multiHandLandmarks;
      
      if (detectedHands && detectedHands.length > 0) {
        if (detectedHands.length === 2) {
          const g1 = analyzeAdvancedGestures(detectedHands[0]);
          const g2 = analyzeAdvancedGestures(detectedHands[1]);
          
          if (g1 === 'thumbs_up' && g2 === 'thumbs_up') {
            initiateSlowMagneticSnapback();
            return;
          }
          
          if (!CONFIG.inspectionModeActive) {
            CONFIG.isDualHandSplitting = true;
            const h1 = detectedHands[0][9], h2 = detectedHands[1][9];
            const distance = Math.hypot(h1.x - h2.x, h1.y - h2.y);
            
            CONFIG.targetSplitFactor = THREE.MathUtils.clamp(THREE.MathUtils.mapLinear(distance, 0.15, 0.55, 0.0, 4.5), 0.0, 5.0);
            
            if (distance > 0.45 && allMeshesPool.length > 0) {
              CONFIG.inspectionModeActive = true;
              CONFIG.currentPartIndex = 0;
              focusMesh = allMeshesPool[0];
              isolateFocusMeshFullScreen(focusMesh);
            }
          }
          return;
        }

        if (detectedHands.length === 1) {
          const primaryHand = detectedHands[0];
          const gesture = analyzeAdvancedGestures(primaryHand);

          if (gesture === 'thumbs_up' && CONFIG.inspectionModeActive) {
            cycleToNextIsolatedPart();
            return;
          }

          let activeTarget = (CONFIG.inspectionModeActive && focusMesh) ? focusMesh : mainGroup;

          if (gesture === 'open_hand') {
            if(modeDisplay) modeDisplay.textContent = '🖐️ ORBIT ROTATION';
            let targetRotY = (0.5 - primaryHand[9].x) * Math.PI * 2; 
            let targetRotX = (primaryHand[9].y - 0.5) * Math.PI * 2;
            activeTarget.rotation.y += (targetRotY - activeTarget.rotation.y) * 0.12; 
            activeTarget.rotation.x += (targetRotX - activeTarget.rotation.x) * 0.12;
          }
          else if (gesture === 'two_finger_move') {
            if(modeDisplay) modeDisplay.textContent = '✌️ MOVING POSITION';
            const targetX = (0.5 - primaryHand[9].x) * 8;
            const targetY = (primaryHand[9].y - 0.5) * 6;
            activeTarget.position.x += (targetX - activeTarget.position.x) * 0.15; 
            activeTarget.position.y += (targetY - activeTarget.position.y) * 0.15;
          } 
          // Pinch Hand Controls Opacity and Scale Sync
          else if (gesture === 'pinch_close') {
            if(modeDisplay) modeDisplay.textContent = '👌 ZOOM OUT';
            activeTarget.scale.setScalar(THREE.MathUtils.lerp(activeTarget.scale.x, Math.max(activeTarget.scale.x - 0.06, 0.15), 0.3));
          }
          else if (gesture === 'pinch_open') {
            if(modeDisplay) modeDisplay.textContent = '☝️ ZOOM IN';
            activeTarget.scale.setScalar(THREE.MathUtils.lerp(activeTarget.scale.x, Math.min(activeTarget.scale.x + 0.06, 4.5), 0.3));
          }
        }
      }
    });

    if (inputVideo) {
      const cameraUtils = new Camera(inputVideo, { 
        onFrame: async () => { await hands.send({ image: inputVideo }); }, 
        width: 640, height: 480 
      });
      cameraUtils.start();
    }
  } else {
    hideLoader();
  }
} catch (err) {
  hideLoader();
}

if(fileInputGlb) {
  fileInputGlb.addEventListener('change', (e) => {
    clearObjects();
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if(loaderDiv) { loaderDiv.style.display = 'flex'; loaderDiv.style.opacity = '1'; }
    
    new GLTFLoader().load(url, (gltf) => {
      currentModel = gltf.scene;
      const box = new THREE.Box3().setFromObject(currentModel);
      const center = box.getCenter(new THREE.Vector3());
      currentModel.position.sub(center); 
      
      mainGroup.add(currentModel);
      recordOriginalPositions(currentModel);
      hideLoader();
      URL.revokeObjectURL(url);
    }, undefined, () => { hideLoader(); });
  });
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

hideLoader();

// ─── Mathematical Fluid Rendering Loops ─────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);

  if (currentModel && !CONFIG.inspectionModeActive) {
    CONFIG.splitFactor += (CONFIG.targetSplitFactor - CONFIG.splitFactor) * 0.08; 
    updateExplodePhysics(currentModel, CONFIG.splitFactor);
  }

  if (allMeshesPool.length > 0) {
    allMeshesPool.forEach((mesh) => {
      if (CONFIG.inspectionModeActive) {
        if (mesh === focusMesh) {
          mesh.visible = true; 
          
          // CRITICAL FIXED: Dynamic Opacity Flush Engine
          if (CONFIG.holoMode) {
            mesh.material.opacity = 0.85; // Solid clear glowing cyan opacity
          } else {
            mesh.material.opacity = 1.0;  // Realistic mode me pure 100% full opacity clear visibility
          }
          mesh.material.needsUpdate = true; // Forcing pipeline redraw
          
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          
          mesh.position.lerp(new THREE.Vector3(0, 0, 0), 0.14);
          const targetScaleVec = new THREE.Vector3(CONFIG.currentPartIsolationScale, CONFIG.currentPartIsolationScale, CONFIG.currentPartIsolationScale);
          mesh.scale.lerp(targetScaleVec, 0.14);
        } else {
          // Absolute system level invisible culling
          mesh.visible = false; 
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        }
      } else {
        // ASSEMBLE RESTORATION LOOP
        mesh.visible = true; 
        if (originalPositions.has(mesh.uuid)) {
          const orig = originalPositions.get(mesh.uuid);
          
          if (CONFIG.targetSplitFactor === 0.0) { 
            mesh.position.lerp(orig.pos, 0.15);
            mesh.scale.lerp(orig.scale, 0.15);
            mesh.rotation.x += (orig.rot.x - mesh.rotation.x) * 0.15;
            mesh.rotation.y += (orig.rot.y - mesh.rotation.y) * 0.15;
            mesh.rotation.z += (orig.rot.z - mesh.rotation.z) * 0.15;
          }
          
          if (CONFIG.holoMode) {
            mesh.material.opacity = 0.5;
          } else {
            mesh.material.opacity = 1.0;
          }
          mesh.material.needsUpdate = true;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      }
    });
  }

  renderer.render(scene, camera);
}

animate();