# 🔮 MJ AI - NEXT-GEN GESTURE CONTROL HOLOGRAM ENGINE

[![Three.js](https://img.shields.io/badge/Three.js-r156-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Hands-0078d4?style=for-the-badge)](https://google.github.io/mediapipe/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/)

An advanced, browser-based 3D Hologram Viewer featuring high-fidelity hand gesture recognition, dynamic GLTF/GLB assembly breaking, and Iron Man-style spatial interaction driven by your webcam.

---

## 🚀 Key Upgrades & Features

### ⚡ Binary Part Isolation (Inspection Mode)
- **True Culling/Visibility Lock:** Engaging inspection mode instantly triggers a complete rendering-level visibility shutoff (`visible = false`) for all non-focused components. No ghost artifacts, no shadow remnants—just absolute 100% solo part isolation.
- **Auto-Fit View Scaling:** Isolated parts compute bounding box vectors in real-time to perfectly fit and center-scale within the viewport frame seamlessly.

### 🌐 Stark Hologram Overwrite Engine
- **Cached Vector Flusher:** Dynamically replaces complex embedded textures with high-tech glowing wireframe materials instantly via pipeline memory flushes (`needsUpdate = true`).
- **Dynamic Hex Color Palette Sync:** Seamlessly switch between solid **Neon Red, Cyber Green, Laser Blue, Deep Purple**, or custom spectrum hex codes without rendering freeze or shading interference.
- **Live Opacity Shifting:** Direct state linking between UI transparency sliders and WebGL buffers for instant fade and glowing density control.

### 🤖 Core Capabilities
- **Dual-Hand Assembly Explode:** Pull hands apart to organically dissemble the model pieces across 3D space based on vector physics.
- **Magnetic Snapback Re-Assembly:** A dual-hand custom gesture command to instantly attract all scattered parts back to their original local transformation vectors.
- **Model Normalization Engine:** Automatically re-centers and scales any uploaded `.glb` files to prevent out-of-bounds rendering.

---

## 🎮 Gesture Matrix Controls

| Mode | Gesture Pose | System Action | Engineering Description |
| :--- | :--- | :--- | :--- |
| **Global/Isolated** | 🖐️ Full Open Hand | **Orbit Rotation** | Rotates the model/active component smoothly based on hand's center coordinates. |
| **Global/Isolated** | ✌️ Two Fingers Move | **Spatial Translation** | Drags and repositions the target mesh fluidly along X and Y axes. |
| **Global/Isolated** | 👌 Pinch Close | **Zoom Out** | Linearly shrinks and scales down the 3D entity. |
| **Global/Isolated** | ☝️ Pinch Open / Extend | **Zoom In** | Linearly expands and scales up the 3D entity. |
| **Assembly breaking** | 👐 Dual Hands Apart | **Explode Parts** | Triggers distance-based multi-part structural separation. |
| **Assembly breaking** | 👍 Double Thumbs Up | **Magnetic Assembly** | Instantly snaps all broken components back to 100% factory positions. |
| **Inspection Mode** | 👍 Single Thumbs Up | **Cycle Isolated Mesh** | Toggles forward through each individual culled part in full-screen view. |

---

## 🛠️ UI Controls Panel

- **🎲 Load 3D Model:** Safely uploads any industrial or custom `.glb` / `.gltf` asset directly into the runtime group.
- **🌐 Holographic Mode:** Toggles between heavy realistic physical textures and high-contrast cyber wireframe modes.
- **🎨 Color Picker:** Updates the hologram color real-time across **Blue, Green, Red, Purple**, and custom values.
- **🎚️ Ghost Opacity Slider:** Real-time alpha blend adjustment ranging from `0.0` (invisible wireframe) to `1.0` (solid glow).

---

## 📦 Installation & Local Architecture

### Fast Launch (Windows)
Simply double-click the setup file in your root folder:
```powershell
run.bat
