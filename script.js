gsap.registerPlugin(ScrollTrigger);

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2d1b00);

const PIXEL_SCALE = 3;
const w = Math.floor(window.innerWidth / PIXEL_SCALE);
const h = Math.floor(window.innerHeight / PIXEL_SCALE);

const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
camera.position.set(0, 1.5, 6);

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(w, h);
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const hemi = new THREE.HemisphereLight(0xe8a87c, 0x2d1b00, 0.6);
scene.add(hemi);

const key = new THREE.DirectionalLight(0xffd4a3, 1.8);
key.position.set(4, 6, 4);
key.castShadow = true;
scene.add(key);

const fill = new THREE.DirectionalLight(0xe8a87c, 0.6);
fill.position.set(-3, 2, -3);
scene.add(fill);

const back = new THREE.DirectionalLight(0xc97b5a, 0.8);
back.position.set(0, 1, -5);
scene.add(back);

const cupGroup = new THREE.Group();
scene.add(cupGroup);

function createCup() {
  const g = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xd4a080,
    roughness: 0.6,
    flatShading: true,
  });

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(1.1, 0.85, 2.0, 8, 4, true),
    bodyMat
  );
  body.castShadow = true;
  g.add(body);

  const innerMat = new THREE.MeshStandardMaterial({
    color: 0x5a3a20,
    roughness: 0.8,
    flatShading: true,
    side: THREE.BackSide,
  });

  const inner = new THREE.Mesh(
    new THREE.CylinderGeometry(1.05, 0.8, 1.95, 8, 4, true),
    innerMat
  );
  g.add(inner);

  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xe8a87c,
    roughness: 0.4,
    flatShading: true,
  });

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(1.1, 0.1, 6, 12),
    rimMat
  );
  rim.position.y = 1.0;
  rim.rotation.x = Math.PI / 2;
  g.add(rim);

  const bottomMat = new THREE.MeshStandardMaterial({
    color: 0xc08060,
    roughness: 0.7,
    flatShading: true,
  });

  const bottom = new THREE.Mesh(
    new THREE.CircleGeometry(0.85, 8),
    bottomMat
  );
  bottom.position.y = -1.0;
  bottom.rotation.x = -Math.PI / 2;
  g.add(bottom);

  const teaMat = new THREE.MeshStandardMaterial({
    color: 0x6b3a1f,
    roughness: 0.3,
    flatShading: true,
  });

  const tea = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 0.9, 1.2, 8, 3),
    teaMat
  );
  tea.position.y = 0.15;
  g.add(tea);

  const topMat = new THREE.MeshStandardMaterial({
    color: 0x7a4e2e,
    roughness: 0.2,
    flatShading: true,
  });

  const top = new THREE.Mesh(
    new THREE.CircleGeometry(0.95, 8),
    topMat
  );
  top.position.y = 0.75;
  top.rotation.x = -Math.PI / 2;
  g.add(top);

  const pearlMat = new THREE.MeshStandardMaterial({
    color: 0x2a1a0a,
    roughness: 0.8,
    flatShading: true,
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
    color: 0xf0e0d0,
    roughness: 0.5,
    flatShading: true,
  });

  const straw = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 2.2, 6),
    strawMat
  );
  straw.position.set(0.6, 0.6, 0.6);
  straw.rotation.z = -0.25;
  straw.rotation.x = 0.15;
  g.add(straw);

  const tipMat = new THREE.MeshStandardMaterial({
    color: 0xd47a5a,
    roughness: 0.5,
    flatShading: true,
  });

  const tip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.12, 6),
    tipMat
  );
  tip.position.copy(straw.position);
  const off = new THREE.Vector3(0, 1.1, 0);
  off.applyQuaternion(straw.quaternion);
  tip.position.add(off);
  g.add(tip);

  return { g, pearls };
}

const boba = createCup();
cupGroup.add(boba.g);

const glowMat = new THREE.ShaderMaterial({
  uniforms: { time: { value: 0 } },
  vertexShader: `
    varying vec3 vN; varying vec3 vP;
    void main() {
      vN = normalize(normalMatrix * normal);
      vP = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    varying vec3 vN; varying vec3 vP;
    void main() {
      vec3 c = vec3(1.0, 0.77, 0.56);
      vec3 d = normalize(-vP);
      float r = 1.0 - max(0.0, dot(d, vN));
      r = pow(r, 2.0);
      float p = 0.6 + 0.4 * sin(time * 0.8 + vP.y * 3.0);
      gl_FragColor = vec4(c * r * p, r * 0.5);
    }
  `,
  transparent: true,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
  depthWrite: false,
});

const glow = new THREE.Mesh(
  new THREE.CylinderGeometry(1.15, 0.9, 2.1, 8, 4, true),
  glowMat
);
glow.position.y = 0;
boba.g.add(glow);

const floorMat = new THREE.MeshStandardMaterial({
  color: 0xc97b5a,
  transparent: true,
  opacity: 0.12,
  flatShading: true,
});

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(2.5, 8),
  floorMat
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.2;
cupGroup.add(floor);

const dotMat = new THREE.PointsMaterial({
  color: 0xe8a87c,
  size: 0.04,
  transparent: true,
  opacity: 0.3,
});

const dotGeo = new THREE.BufferGeometry();
const dotPos = new Float32Array(200 * 3);
for (let i = 0; i < 200 * 3; i++) dotPos[i] = (Math.random() - 0.5) * 16;
dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPos, 3));
const dots = new THREE.Points(dotGeo, dotMat);
scene.add(dots);

const sections = document.querySelectorAll('.section');
const snapStep = 1 / (sections.length - 1);

ScrollTrigger.create({
  trigger: 'body',
  start: 'top top',
  end: 'bottom bottom',
  snap: snapStep,
  scrub: 1.2,
  onUpdate: self => {
    const p = self.progress;
    const idx = Math.round(p / snapStep);

    boba.g.rotation.y = p * Math.PI * 4;

    if (idx === 0) {
      boba.g.position.y = 0;
      boba.g.position.x = 0;
      boba.g.position.z = 0;
      boba.g.scale.set(1, 1, 1);
    } else if (idx === 1) {
      boba.g.position.y = 0.3;
      boba.g.position.x = 0.8;
      boba.g.position.z = 0.2;
      boba.g.scale.set(1.05, 1.05, 1.05);
    } else if (idx === 2) {
      boba.g.position.y = 0.6;
      boba.g.position.x = -0.7;
      boba.g.position.z = -0.3;
      boba.g.scale.set(1.1, 1.1, 1.1);
    } else if (idx === 3) {
      boba.g.position.y = 0.2;
      boba.g.position.x = 0.4;
      boba.g.position.z = 0.5;
      boba.g.scale.set(0.95, 0.95, 0.95);
    }
  },
});

document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 0.2;
  const y = (e.clientY / window.innerHeight - 0.5) * 0.15;
  cupGroup.rotation.y += (x - cupGroup.rotation.y) * 0.03;
  cupGroup.rotation.x += (-y - cupGroup.rotation.x) * 0.03;
});

window.addEventListener('resize', () => {
  const nw = Math.floor(window.innerWidth / PIXEL_SCALE);
  const nh = Math.floor(window.innerHeight / PIXEL_SCALE);
  camera.aspect = nw / nh;
  camera.updateProjectionMatrix();
  renderer.setSize(nw, nh);
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  boba.pearls.forEach((p, i) => {
    p.position.y += Math.sin(t * 1.5 + i * 2) * 0.0008;
  });

  glowMat.uniforms.time.value = t;
  dots.rotation.y += 0.0008;
  camera.position.x = Math.sin(t * 0.04) * 0.3;

  renderer.render(scene, camera);
}

animate();
