gsap.registerPlugin(ScrollTrigger);

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5e0c8);

const PIXEL_SCALE = 2;
const w = Math.floor(window.innerWidth / PIXEL_SCALE);
const h = Math.floor(window.innerHeight / PIXEL_SCALE);

const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
camera.position.set(0, 1, 9);

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(w, h);
renderer.setPixelRatio(1);
renderer.setClearColor(0xf5e0c8, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const hemi = new THREE.HemisphereLight(0xf5e0c8, 0xd4a080, 0.7);
scene.add(hemi);

const key = new THREE.DirectionalLight(0xffe8d0, 1.5);
key.position.set(4, 6, 4);
key.castShadow = true;
scene.add(key);

const fill = new THREE.DirectionalLight(0xe8c8a8, 0.5);
fill.position.set(-3, 2, -3);
scene.add(fill);

const back = new THREE.DirectionalLight(0xd4a080, 0.6);
back.position.set(0, 1, -5);
scene.add(back);

const cupGroup = new THREE.Group();
scene.add(cupGroup);

function createCup() {
  const g = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xd4a080, roughness: 0.6, flatShading: true,
  });
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(1.1, 0.85, 2.0, 8, 4, true), bodyMat
  );
  body.castShadow = true;
  g.add(body);

  const innerMat = new THREE.MeshStandardMaterial({
    color: 0x7a5030, roughness: 0.8, flatShading: true, side: THREE.BackSide,
  });
  const inner = new THREE.Mesh(
    new THREE.CylinderGeometry(1.05, 0.8, 1.95, 8, 4, true), innerMat
  );
  g.add(inner);

  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xe8c8a8, roughness: 0.4, flatShading: true,
  });
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.1, 6, 12), rimMat);
  rim.position.y = 1.0;
  rim.rotation.x = Math.PI / 2;
  g.add(rim);

  const bMat = new THREE.MeshStandardMaterial({
    color: 0xc89070, roughness: 0.7, flatShading: true,
  });
  const btm = new THREE.Mesh(new THREE.CircleGeometry(0.85, 8), bMat);
  btm.position.y = -1.0;
  btm.rotation.x = -Math.PI / 2;
  g.add(btm);

  const teaMat = new THREE.MeshStandardMaterial({
    color: 0x6b3a1f, roughness: 0.3, flatShading: true,
  });
  const tea = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 0.9, 1.2, 8, 3), teaMat
  );
  tea.position.y = 0.15;
  g.add(tea);

  const topMat = new THREE.MeshStandardMaterial({
    color: 0x7a4e2e, roughness: 0.2, flatShading: true,
  });
  const top = new THREE.Mesh(new THREE.CircleGeometry(0.95, 8), topMat);
  top.position.y = 0.75;
  top.rotation.x = -Math.PI / 2;
  g.add(top);

  const pearlMat = new THREE.MeshStandardMaterial({
    color: 0x2a1a0a, roughness: 0.8, flatShading: true,
  });
  const pearls = [];
  const pp = [
    [-0.3, -0.1, 0.4], [0.4, -0.15, 0.2], [-0.5, -0.05, -0.2],
    [0.2, -0.2, -0.4], [-0.1, -0.25, 0.0], [0.5, -0.1, -0.3],
    [-0.4, -0.15, -0.4], [0.0, -0.05, 0.5], [0.3, -0.15, -0.5],
    [-0.5, -0.2, 0.2], [0.6, -0.05, 0.1], [-0.2, -0.25, -0.3],
    [0.1, 0.1, 0.3], [-0.3, 0.05, -0.1], [0.0, 0.15, -0.2],
  ];
  pp.forEach(p => {
    const s = 0.08 + Math.random() * 0.06;
    const m = new THREE.Mesh(new THREE.SphereGeometry(s, 6, 6), pearlMat);
    m.position.set(p[0], p[1], p[2]);
    g.add(m);
    pearls.push(m);
  });

  const strawMat = new THREE.MeshStandardMaterial({
    color: 0xf0e0d0, roughness: 0.5, flatShading: true,
  });
  const straw = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 2.2, 6), strawMat
  );
  straw.position.set(0.6, 0.6, 0.6);
  straw.rotation.z = -0.25;
  straw.rotation.x = 0.15;
  g.add(straw);

  const tipMat = new THREE.MeshStandardMaterial({
    color: 0xd47a5a, roughness: 0.5, flatShading: true,
  });
  const tip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.12, 6), tipMat
  );
  tip.position.copy(straw.position);
  const off = new THREE.Vector3(0, 1.1, 0);
  off.applyQuaternion(straw.quaternion);
  tip.position.add(off);
  g.add(tip);

  return { g, pearls };
}

const boba = createCup();
boba.g.scale.set(1.3, 1.3, 1.3);
cupGroup.add(boba.g);

// --- Spill particles ---
const spillCount = 30;
const spillPool = [];
const spillMat = new THREE.MeshStandardMaterial({
  color: 0x2a1a0a, roughness: 0.8, flatShading: true,
});

for (let i = 0; i < spillCount; i++) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), spillMat.clone());
  m.visible = false;
  m.userData = { vel: new THREE.Vector3(), life: 0, maxLife: 0, active: false };
  scene.add(m);
  spillPool.push(m);
}

function emitSpill(origin, dir, force) {
  const count = 3 + Math.floor(force * 8);
  for (let i = 0; i < count; i++) {
    const p = spillPool.find(p => !p.userData.active);
    if (!p) break;
    p.position.copy(origin);
    p.position.x += (Math.random() - 0.5) * 0.3;
    p.position.y += (Math.random() - 0.5) * 0.3;
    p.position.z += (Math.random() - 0.5) * 0.3;
    const speed = 0.02 + Math.random() * 0.04;
    p.userData.vel.set(
      dir.x * speed + (Math.random() - 0.5) * 0.03,
      Math.abs(dir.y) * speed + 0.02 + Math.random() * 0.03,
      dir.z * speed + (Math.random() - 0.5) * 0.03,
    );
    p.userData.maxLife = 1 + Math.random() * 1.5;
    p.userData.life = p.userData.maxLife;
    p.userData.active = true;
    p.visible = true;
    p.material.opacity = 1;
    p.material.transparent = true;
  }
}

function updateSpill(dt) {
  spillPool.forEach(p => {
    if (!p.userData.active) return;
    p.userData.life -= dt;
    if (p.userData.life <= 0) {
      p.userData.active = false;
      p.visible = false;
      return;
    }
    p.userData.vel.y -= 0.015;
    p.position.x += p.userData.vel.x;
    p.position.y += p.userData.vel.y;
    p.position.z += p.userData.vel.z;
    p.material.opacity = Math.min(1, p.userData.life / p.userData.maxLife);
  });
}

// --- Drag ---
let isDragging = false;
let prevMouse = { x: 0, y: 0 };

function getCupOrigin() {
  const p = new THREE.Vector3();
  boba.g.getWorldPosition(p);
  p.y += 0.8;
  return p;
}

function getDragDir(dx, dy) {
  const d = new THREE.Vector3(-dx * 0.5, dy * 0.5, -dx * 0.3);
  d.normalize();
  return d;
}

renderer.domElement.addEventListener('mousedown', e => {
  isDragging = true;
  prevMouse.x = e.clientX;
  prevMouse.y = e.clientY;
});

window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  const dx = e.clientX - prevMouse.x;
  const dy = e.clientY - prevMouse.y;
  cupGroup.rotation.y += dx * 0.01;
  cupGroup.rotation.x += dy * 0.008;
  cupGroup.rotation.x = Math.max(-0.5, Math.min(0.5, cupGroup.rotation.x));

  const speed = Math.sqrt(dx * dx + dy * dy);
  if (speed > 5) {
    const origin = getCupOrigin();
    const dir = getDragDir(dx, dy);
    emitSpill(origin, dir, speed / 20);
  }

  prevMouse.x = e.clientX;
  prevMouse.y = e.clientY;
});

window.addEventListener('mouseup', () => { isDragging = false; });

renderer.domElement.addEventListener('touchstart', e => {
  const t = e.touches[0];
  isDragging = true;
  prevMouse.x = t.clientX;
  prevMouse.y = t.clientY;
});

window.addEventListener('touchmove', e => {
  if (!isDragging) return;
  const t = e.touches[0];
  const dx = t.clientX - prevMouse.x;
  const dy = t.clientY - prevMouse.y;
  cupGroup.rotation.y += dx * 0.01;
  cupGroup.rotation.x += dy * 0.008;
  cupGroup.rotation.x = Math.max(-0.5, Math.min(0.5, cupGroup.rotation.x));

  const speed = Math.sqrt(dx * dx + dy * dy);
  if (speed > 5) {
    const origin = getCupOrigin();
    const dir = getDragDir(dx, dy);
    emitSpill(origin, dir, speed / 20);
  }

  prevMouse.x = t.clientX;
  prevMouse.y = t.clientY;
}, { passive: true });

window.addEventListener('touchend', () => { isDragging = false; });

// --- Floor ---
const floorMat = new THREE.MeshStandardMaterial({
  color: 0xd4a080, transparent: true, opacity: 0.1, flatShading: true,
});
const floor = new THREE.Mesh(new THREE.CircleGeometry(3, 8), floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.5;
scene.add(floor);

// --- BG dots ---
const dotMat = new THREE.PointsMaterial({
  color: 0xd4a080, size: 0.03, transparent: true, opacity: 0.2,
});
const dotGeo = new THREE.BufferGeometry();
const dotPos = new Float32Array(200 * 3);
for (let i = 0; i < 200 * 3; i++) dotPos[i] = (Math.random() - 0.5) * 16;
dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPos, 3));
const dots = new THREE.Points(dotGeo, dotMat);
scene.add(dots);

// --- Per-section cup moods ---
const moods = [
  { spin: 0.3, tilt: 0.05, bob: 0.3, bounce: 0, stretch: 0 },
  { spin: 0.6, tilt: 0.15, bob: 0.4, bounce: 0, stretch: 0 },
  { spin: 1.2, tilt: 0.1, bob: 0.7, bounce: 0.15, stretch: 0.08 },
  { spin: 0.2, tilt: 0.03, bob: 0.2, bounce: 0, stretch: 0 },
];

let currentMood = moods[0];
let prevMood = moods[0];
let moodBlend = 0;

// --- Snap scroll ---
const sections = document.querySelectorAll('.section');
const snapStep = 1 / (sections.length - 1);

ScrollTrigger.create({
  trigger: 'body',
  start: 'top top',
  end: 'bottom bottom',
  snap: snapStep,
  scrub: 1.2,
  onUpdate: self => {
    const idx = Math.round(self.progress / snapStep);
    prevMood = currentMood;
    currentMood = moods[idx];
    moodBlend = 0;

    sections.forEach((sec, i) => {
      const wrap = sec.querySelector('.overlay');
      if (wrap) {
        wrap.style.opacity = i === idx ? 1 : 0;
        wrap.style.transition = 'opacity 0.6s ease';
      }
    });
  },
});

window.addEventListener('resize', () => {
  const nw = Math.floor(window.innerWidth / PIXEL_SCALE);
  const nh = Math.floor(window.innerHeight / PIXEL_SCALE);
  camera.aspect = nw / nh;
  camera.updateProjectionMatrix();
  renderer.setSize(nw, nh);
});

const clock = new THREE.Clock();

function lerp(a, b, t) { return a + (b - a) * t; }

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  const dt = 0.016;

  moodBlend = Math.min(1, moodBlend + dt * 2);

  const m = {
    spin: lerp(prevMood.spin, currentMood.spin, moodBlend),
    tilt: lerp(prevMood.tilt, currentMood.tilt, moodBlend),
    bob: lerp(prevMood.bob, currentMood.bob, moodBlend),
    bounce: lerp(prevMood.bounce, currentMood.bounce, moodBlend),
    stretch: lerp(prevMood.stretch, currentMood.stretch, moodBlend),
  };

  // Cup always centered — it moves IN PLACE (alive animations)
  boba.g.position.x = Math.sin(t * m.spin * 0.5) * 0.3 * m.bob;
  boba.g.position.y = Math.sin(t * m.spin * 1.2) * 0.15 * m.bob + m.bounce * Math.abs(Math.sin(t * 2)) * 0.3;
  boba.g.position.z = Math.cos(t * m.spin * 0.3) * 0.2 * m.bob;

  boba.g.rotation.y = t * m.spin * 0.3;
  boba.g.rotation.x = Math.sin(t * 0.5) * m.tilt;
  boba.g.rotation.z = Math.cos(t * 0.7) * m.tilt * 0.5;

  const s = 1 + m.stretch * Math.sin(t * 2) * 0.1;
  boba.g.scale.set(s, 1 / (1 + (s - 1) * 0.3), s);

  boba.pearls.forEach((p, i) => {
    p.position.y += Math.sin(t * 1.5 + i * 2) * 0.0008;
  });

  updateSpill(dt);

  dots.rotation.y += 0.0008;

  if (!isDragging) {
    cupGroup.rotation.y += (0 - cupGroup.rotation.y) * 0.02;
    cupGroup.rotation.x += (0 - cupGroup.rotation.x) * 0.02;
  }

  camera.position.x = Math.sin(t * 0.04) * 0.3;

  renderer.render(scene, camera);
}

animate();
