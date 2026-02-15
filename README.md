# Off-Axis Viewer


> Real-world–scaled 3D previews, rendered with off-axis projection, no headset required.

[![live](https://img.shields.io/badge/live-demo-brightgreen)](joshantony.sigma) [![vite](https://img.shields.io/badge/built%20with-Vite-646cff)](https://vitejs.dev/) [![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

![Demo snapshot](public/media/demo-shot.png)

A compact web API and demo that turns iPhone LiDAR / glTF scans into correctly scaled off-axis projections in the browser. Upload a GLB, run a quick calibration, and the model will appear the size it would be in front of your screen.

---

## Quick start

```bash
npm install
npm run dev
```

Open the app, allow camera access, follow the calibration wizard, then upload a GLB to preview it at real-world scale.

---

## Core features

| Feature | What it does |
| --- | --- |
| **Real-world scaling** | Compute model scale from scan metadata and calibrated screen dimensions |
| **Off-axis projection** | Adjust camera frustum from estimated eye position for correct parallax |
| **LiDAR / glTF import** | Drop in iPhone Scan exports or other photogrammetry outputs |
| **Camera-driven controls** | MediaPipe hand-tracking maps finger separation to rotation/scale |
| **Calibration wizard** | Quickly enter screen width and viewing distance for accurate rendering |
| **Lightweight API** | Upload endpoints and preview transforms for easy integration |

---

## Why it matters

Off-axis projection anchors models to physical space so they read as realistic scale and depth. This makes browser previews feel closer to real-world AR, while staying accessible on laptops.

---

## How it works (short)

1. Read model bounds or metadata from the uploaded GLB.
2. Use calibrated screen size + viewing distance to compute a scale factor.
3. Adjust the camera projection matrix from an estimated eye position for off-axis rendering.
4. Use MediaPipe hand landmarks (finger distance) to provide intuitive rotation/scale controls.

---
---

## Authors

- Giordan Masen
- Josh Antony

---

## Acknowledgements

- [MediaPipe](https://developers.google.com/mediapipe) — for powerful ML models
- [Three.js](https://threejs.org/) — for 3D rendering capabilities
- [Johnny Chung Lee](http://johnnylee.net/) — for pioneering head-coupled perspective
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) — for modern development tools
- [Tailwind CSS](https://tailwindcss.com/) — for UI utilities used in the demo
- [glTF / Khronos Group](https://www.khronos.org/gltf/) — for the interoperable 3D model format
- [Hack Club](https://hackclub.com/) — for community support and motivation
- Original off-axis-projection repository: [icurtis1](https://github.com/icurtis1)

---

## Contributing

Contributions, bug reports, and calibration data improvements are welcome — open an issue or PR and tag Giordan or Josh on GitHub.
