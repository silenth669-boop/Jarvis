# HARIS AI - GESTURE CONTROL ENGINE

Advanced browser-based hologram viewer with gesture recognition, GLB model loading, and Iron Man-style interactive controls using hand gestures and webcam.

## 🚀 Features

- **Gesture Recognition**: Fist, open hand, victory sign, three-finger pose, and pinch gestures
- **GLB/GLTF Support**: Load any 3D model file
- **3D Depth Effects**: Enable depth-based animations
- **Holographic Mode**: Apply neon glow effects with color customization
- **Real-time Hand Tracking**: MediaPipe Hands for accurate gesture detection
- **Opacity Control**: Adjust transparency with slider
- **Color Picker**: Blue, Green, Red, Purple, or Multi-color holographic modes
- **Live Webcam Preview**: See your hand tracking in real-time

## 🎮 Gesture Controls

| Gesture | Action | Description |
|---------|--------|-------------|
| ✊ Fist Hold | Drag & Reposition | Move the model around the 3D space |
| 🖐 Full Open Hand | Manual Rotate | Rotate model by hand position |
| ✌️ Victory Sign (2 fingers) | Horizontal Spin | Spin the model left/right |
| 🤟 Three Fingers Up | Vertical Spin | Spin the model up/down |
| 👌 Pinch (3 fingers closed) | Precise Zoom | Scale the model in/out |

## 🛠️ Installation & Usage

### Run from Python

1. Open terminal and navigate to the project folder:
   ```powershell
   cd "c:\Users\silen\Desktop\HARIS AI - GESTURE CONTROL ENGINE_files"
   python server.py
   ```
   
   Or simply double-click `run.bat`

2. Your browser will open automatically at `http://127.0.0.1:8000/index.html`
3. Click **⚙️ SHOW CONTROLS** to expand the menu
4. Allow webcam access when prompted
5. Load a GLB model using **🎲 Load 3D Model**
6. Use your hand gestures to control the hologram!

### Manual Browser Launch

If `server.py` doesn't open the browser:
- Open `http://127.0.0.1:8000` manually in your browser
- Or open `index.html` directly (limited file access support)

## 🎨 UI Controls

- **Load Images**: Upload image files for visual effects
- **Enable 3D Depth**: Add depth-based rotation animations
- **Holographic Mode**: Toggle neon glow and color effects
- **GHOST OPACITY**: Adjust model transparency (0-100%)
- **Color Palette**: Choose holographic color: Blue, Green, Red, Purple, or Multi

## ⚙️ System Requirements

- Modern browser (Chrome, Edge, Firefox with WebGL support)
- Webcam with permission to access
- Good lighting for better hand detection

## 📁 Project Files

- `index.html` - Advanced UI with neon styling
- `app.module.js` - Gesture detection, 3D rendering, model loading
- `server.py` - Local Python HTTP server for serving the app
- `run.bat` - Quick launch shortcut (Windows)
- `style.css` - Legacy styles (can be removed)
- `app.js` - Legacy JavaScript (can be removed)

## 🔮 Advanced Features

- **Real-time Hand Landmark Detection**: 21-point hand skeleton tracking
- **Multiple Gesture Recognition**: Detects up to 5 different hand poses
- **Smooth Animation**: Interpolated 3D transforms for fluid motion
- **Lighting & Fog**: Three.js scene with ambient, directional, and point lights
- **Model Normalization**: Automatically scales any GLB model to fit viewport

## 🎯 Tips

- Use well-lit environments for best hand detection accuracy
- Keep your hand clearly visible to the webcam
- The gesture detection works best at 30-60cm distance from camera
- Reload page if gestures become unresponsive

## 📝 Notes

- No server installation needed beyond Python (usually pre-installed on Windows)
- All processing happens in the browser (client-side only)
- WebGL is required for 3D rendering
