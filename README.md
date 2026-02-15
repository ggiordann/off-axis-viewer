---
title: Off-Axis Viewer
---

# Off-Axis Viewer

> Real-world–scaled 3D previews, rendered with off-axis projection — no headset required.

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

- **Real-world scaling** — compute model scale from scan metadata and calibrated screen dimensions.
- **Off-axis projection** — adjust camera frustum from estimated eye position for correct parallax.
- **LiDAR import** — glTF/GLB friendly: use iPhone Scan exports or other photogrammetry outputs.
- **Camera-driven controls** — MediaPipe hand-tracking maps finger separation to rotation/scale.
- **Calibration wizard** — enter screen width and viewing distance for accuracy.
- **Lightweight API** — upload endpoints and preview transforms for quick integration.

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

## Mathematics

This section summarizes the core math used for scaling and off-axis projection. Equations use meters for physical units.

- Model scale: if the real-world width is $W_{real}$ and the model's bounding width is $W_{model}$, the uniform scale factor is

$$
s = \frac{W_{real}}{W_{model}}.
$$

- Off-axis frustum (screen-centered coordinates): let the eye position relative to the screen center be $(e_x,e_y,e_z)$, the near plane distance be $n$, and the half-width/half-height of the screen in meters be $w, h$. Then the frustum planes at the near plane are

$$
\begin{aligned}
l &= \frac{-w - e_x}{e_z} \; n, \quad &r &= \frac{w - e_x}{e_z} \; n,\\
b &= \frac{-h - e_y}{e_z} \; n, \quad &t &= \frac{h - e_y}{e_z} \; n.
\end{aligned}
$$

- Projection matrix: given $l,r,b,t,n,f$ (far plane $f$), the off-axis projection matrix $P$ (column-major) is

$$
P = \begin{pmatrix}
\frac{2n}{r-l} & 0 & \frac{r+l}{r-l} & 0 \\
0 & \frac{2n}{t-b} & \frac{t+b}{t-b} & 0 \\
0 & 0 & -\frac{f+n}{f-n} & -\frac{2fn}{f-n} \\
0 & 0 & -1 & 0
\end{pmatrix}.
$$

- Mapping finger distance to control values: given a measured finger separation $d$, a neutral distance $d_0$, and sensitivity constants $k_{rot}, k_{scale}$:

Inline rotation angle and scale mapping:

$$
	heta = k_{rot} (d - d_0), \qquad s_{ctrl} = \mathrm{clamp}\big(1 + k_{scale}\frac{d - d_0}{d_0},\; s_{min},\; s_{max}\big).
$$

These formulas are intentionally simple and easy to tweak in `src/utils/offAxisCamera.ts` and the hand-tracking hook.

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
