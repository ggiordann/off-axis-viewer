import { FaceMesh } from '@mediapipe/face_mesh';

// DOM
const video = document.getElementById('video');
const canvas = document.getElementById('overlay');
const infoHeader = document.getElementById('infoHeader');
const coordsEl = document.getElementById('coords');
const ctx = canvas.getContext('2d');

// resize the overlay canvas to match the CSS viewport size while accounting for device pixel ratio (rendering on high-DPI displays).
function resizeOverlay() {
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  // scale drawing operations so 1 unit = 1 css pixel
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
  video.srcObject = stream;
  await video.play();
  // overlay must match viewport after stream starts
  resizeOverlay();
}

// initialize MediaPipe FaceMesh. `locateFile` tells the library where to load
// its wasm/worker/code files from; here we use the jsdelivr CDN. the options
// below are conservative defaults that detect a single face and enable
// refined landmarks for features like the eyes and lips.
const faceMesh = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });
faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

// holds the most recent inference results from FaceMesh
// object contains `multiFaceLandmarks` (array of landmark arrays) and other metadata
let lastResults = null;

// when FaceMesh produces new results, store them and request a redraw of the
// overlay. `draw()` reads `lastResults` and paints landmarks to the canvas.
faceMesh.onResults((results) => { lastResults = results; draw(); });

// update overlay sizing when video metadata or window size changes
video.addEventListener('loadedmetadata', resizeOverlay);
window.addEventListener('resize', resizeOverlay);

// convert normalized FaceMesh coordinates (x,y in [0,1]) into CSS pixel
// coordinates on the overlay canvas.

// the video element uses an 'object-fit: cover' style in order to fill the
//   viewport; this means the raw video frame may be scaled and cropped

// compute the scale required to cover the viewport and the offsets that
//   produce letterboxing/cropping so we can map normalized coordinates to the
//   displayed region

// because the camera preview is presented in selfie (mirrored) mode, we
//   mirror the X coordinate so the overlay landmarks line up with the visual
//   video. (this why i was getting rgked)

function videoToPixels(normX, normY) {
  const vw = video.videoWidth || 1280;
  const vh = video.videoHeight || 720;
  const w = window.innerWidth;
  const h = window.innerHeight;
  // scale video to cover viewport
  const scale = Math.max(w / vw, h / vh);
  const dispW = vw * scale;
  const dispH = vh * scale;
  const offsetX = (w - dispW) / 2;
  const offsetY = (h - dispH) / 2;
  let px = offsetX + normX * dispW;
  const py = offsetY + normY * dispH;
  // mirror x for selfie view so overlay matches mirrored video
  px = w - px;
  return [px, py];
}

// paint the latest landmarks to the overlay canvas and update the UI text
// showing the nose coordinates in pixel space.
function draw() {
  // clear whole canvas (uses css-scaled transform)
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!lastResults) return;

  // `multiFaceLandmarks` is an array of faces; we only handle the first face
  // in this example. Each `landmarks` array contains many points describing
  // facial features (e.g. eyes, nose, mouth). Points are in normalized
  // coordinates relative to the source video frame.
  if (lastResults.multiFaceLandmarks && lastResults.multiFaceLandmarks.length) {
    const landmarks = lastResults.multiFaceLandmarks[0];
    // draw small white dots for each landmark. Because `ctx.setTransform`
    // was configured in `resizeOverlay`, these coordinates are in CSS pixels.
    ctx.fillStyle = '#fff';
    for (let i = 0; i < landmarks.length; i++) {
      const lm = landmarks[i];
      const [x, y] = videoToPixels(lm.x, lm.y);
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // pick a nose landmark for simple coordinate reporting. FaceMesh provides
    // multiple candidate indices for nose/tip depending on model settings,
    // so we fall back through a few indices.
    const nose = landmarks[1] || landmarks[4] || landmarks[5];
    const [nx, ny] = videoToPixels(nose.x, nose.y);
    if (coordsEl) coordsEl.innerText = `(${nx.toFixed(0)}, ${ny.toFixed(0)})`;
    if (infoHeader) infoHeader.textContent = 'nose(px):';
  } else {
    // no face detected clear landmarks displaay placeholder text
    if (coordsEl) coordsEl.innerText = '(x, y)';
    if (infoHeader) infoHeader.textContent = 'nose(px):';
  }
}

async function loop() {
  if (video.readyState >= 2) await faceMesh.send({ image: video });
  requestAnimationFrame(loop);
}

(async () => {
  try {
    await startCamera();
    loop();
  } catch (err) {
    console.error(err);
    // the original code wrote to `info` which may not exist in the DOM; guard
    // against that to avoid error when showing the message
    if (typeof info !== 'undefined' && info) info.innerText = 'Camera error: ' + err.message;
  }
})();
