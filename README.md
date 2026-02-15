# Head-Coupled Perspective Viewer

A real-time head-tracking 3D viewer that creates an immersive "Johnny Chung Lee" style head-coupled perspective effect. The application uses MediaPipe face tracking to adjust the Three.js camera perspective based on your head position, making 3D objects appear to exist in physical space behind your screen.

<img src="public/media/demo-shot.png" alt="Demo" width="800" />

[Live Link](joshantony.sigma)

## Features

- 👁️ Real-time head tracking using MediaPipe Face Mesh

# Off-Axis Viewer

Off-Axis Viewer is a small web API and demo viewer that turns real-world 3D scans (for example, iPhone LiDAR exports) into correctly scaled, off-axis projections in the browser. The goal is simple: when you load a scan it should appear the same physical size it would be in front of your screen, and you should be able to inspect it using natural off-axis rotation controls.

What this project does

- Displays uploaded glTF/GLB scans at real-world scale relative to screen size and viewing distance.
- Provides an off-axis projection pipeline so the model’s perspective matches the viewer position.
- Uses MediaPipe hand tracking (finger distance) as a lightweight, camera-driven control for rotating and scaling the model.
- Includes a calibration flow to measure screen size and viewing distance so rendered scale is accurate.

Why it matters

Off-axis projection makes on-screen models feel anchored in physical space instead of floating at arbitrary scales. By combining LiDAR scans, a simple calibration step, and camera-based controls, this project makes realistic AR-like previews accessible from a laptop browser—no headset required.

Features

- Real-world scaling: uses screen dimensions and scan metadata to compute model size.
- Off-axis projection math: custom camera/frustum adjustments for viewer-relative perspective.
- LiDAR import: glTF/GLB friendly — bring exports from iPhone Scan or other photogrammetry tools.
- Camera controls: MediaPipe hand landmarks drive rotation/scale via measured finger separation.
- Calibration wizard: quickly enter screen and viewing measurements for accurate results.
- Lightweight API: endpoints for uploading scans and requesting preview-ready transforms.

Quick start

```bash
npm install
npm run dev
```

Open the app, allow camera access, follow the calibration wizard, then upload a GLB to preview it at real-world scale.

How it works (short)

1. You upload a GLB (or provide a link). The viewer reads size metadata or bounding box.
2. The app uses your calibrated screen width and viewing distance to compute a scale factor so the model’s rendered size matches real life.
3. The off-axis camera projection matrix is adjusted from the estimated eye position so parallax and perspective are correct.
4. MediaPipe hand tracking measures finger distance; that value maps to a rotation/scale control for intuitive interaction.

Authors

- Giordan Masen
- Josh Antony


Acknowledgements

- [MediaPipe](https://developers.google.com/mediapipe) — for powerful ML models
- [Three.js](https://threejs.org/) — for 3D rendering capabilities
- [Johnny Chung Lee](http://johnnylee.net/) — for pioneering head-coupled perspective
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) — for modern development tools
- Original off-axis-projection repository: [icurtis1](https://github.com/icurtis1)

Want to help?

Contributions, bug reports, and better calibration data are welcome. Open an issue or PR and tag Giordan or Josh on GitHub.
