gsap.registerPlugin(ScrollTrigger);

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 8);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xf8c8dc, 0.3);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffe4f0, 2);
mainLight.position.set(5, 8, 5);
mainLight.castShadow = true;
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0x7ec8e3, 0.8);
fillLight.position.set(-3, 2, -4);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xf8c8dc, 1.5);
rimLight.position.set(-2, 1, 5);
scene.add(rimLight);

const pointLight = new THREE.PointLight(0xf8c8dc, 0.5, 10);
pointLight.position.set(0, 3, 2);
scene.add(pointLight);

const cupGroup = new THREE.Group();
scene.add(cupGroup);

function createBobaCup() {
  const group = new THREE.Group();

  const cupGeo = new THREE.CylinderGeometry(1.2, 0.9, 2.2, 48, 1, true);
  const cupMat = new THREE.MeshPhysicalMaterial({
    color: 0xd4e8f0,
    transparent: true,
    opacity: 0.2,
    roughness: 0.05,
    metalness: 0.0,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    side: THREE.DoubleSide,
    envMapIntensity: 0.5,
  });
  const cup = new THREE.Mesh(cupGeo, cupMat);
  cup.position.y = 0;
  cup.castShadow = true;
  group.add(cup);

  const rimGeo = new THREE.TorusGeometry(1.2, 0.08, 16, 48);
  const rimMat = new THREE.MeshPhysicalMaterial({
    color: 0xf0d8e0,
    roughness: 0.2,
    metalness: 0.3,
  });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.position.y = 1.1;
  rim.rotation.x = Math.PI / 2;
  group.add(rim);

  const bottomGeo = new THREE.CircleGeometry(0.9, 48);
  const bottomMat = new THREE.MeshPhysicalMaterial({
    color: 0xf0d8e0,
    roughness: 0.3,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });
  const bottom = new THREE.Mesh(bottomGeo, bottomMat);
  bottom.position.y = -1.1;
  bottom.rotation.x = -Math.PI / 2;
  group.add(bottom);

  const teaGeo = new THREE.CylinderGeometry(1.05, 0.95, 1.4, 32);
  const teaMat = new THREE.MeshPhysicalMaterial({
    color: 0x8B5E3C,
    transparent: true,
    opacity: 0.7,
    roughness: 0.1,
    metalness: 0.0,
    clearcoat: 0.3,
  });
  const tea = new THREE.Mesh(teaGeo, teaMat);
  tea.position.y = 0.1;
  group.add(tea);

  const surfaceGeo = new THREE.CircleGeometry(1.05, 32);
  const surfaceMat = new THREE.MeshPhysicalMaterial({
    color: 0x7a4e2e,
    transparent: true,
    opacity: 0.5,
    roughness: 0.0,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });
  const surface = new THREE.Mesh(surfaceGeo, surfaceMat);
  surface.position.y = 0.8;
  surface.rotation.x = -Math.PI / 2;
  group.add(surface);

  const pearlMat = new THREE.MeshPhysicalMaterial({
    color: 0x2a1a0a,
    roughness: 0.7,
    metalness: 0.0,
  });

  const pearlPositions = [
    [-0.3, -0.25, 0.4], [0.4, -0.3, 0.2], [-0.5, -0.2, -0.2],
    [0.2, -0.35, -0.4], [-0.1, -0.4, 0.0], [0.5, -0.25, -0.3],
    [-0.4, -0.3, -0.4], [0.0, -0.2, 0.5], [0.3, -0.3, -0.5],
    [-0.5, -0.35, 0.2], [0.6, -0.2, 0.1], [-0.2, -0.4, -0.3],
  ];

  const pearls = [];
  pearlPositions.forEach(pos => {
    const size = 0.1 + Math.random() * 0.06;
    const pearlGeo = new THREE.SphereGeometry(size, 16, 16);
    const pearl = new THREE.Mesh(pearlGeo, pearlMat);
    pearl.position.set(pos[0], pos[1], pos[2]);
    group.add(pearl);
    pearls.push(pearl);
  });

  const iceMat = new THREE.MeshPhysicalMaterial({
    color: 0xc8e8f0,
    transparent: true,
    opacity: 0.4,
    roughness: 0.0,
    metalness: 0.0,
    clearcoat: 0.5,
  });

  [[-0.2, 0.5, 0.5], [0.3, 0.55, -0.4], [-0.5, 0.6, 0.1], [0.5, 0.45, 0.3]].forEach(pos => {
    const iceGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const ice = new THREE.Mesh(iceGeo, iceMat);
    ice.position.set(pos[0], pos[1], pos[2]);
    ice.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    group.add(ice);
  });

  const strawMat = new THREE.MeshPhysicalMaterial({
    color: 0xf0e8e0,
    roughness: 0.4,
    metalness: 0.1,
  });

  const strawGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.4, 8);
  const straw = new THREE.Mesh(strawGeo, strawMat);
  straw.position.set(0.6, 0.8, 0.6);
  straw.rotation.z = -0.3;
  straw.rotation.x = 0.2;
  group.add(straw);

  const strawTopMat = new THREE.MeshPhysicalMaterial({
    color: 0xd47a9e,
    roughness: 0.3,
    metalness: 0.0,
  });
  const strawTopGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.15, 8);
  const strawTop = new THREE.Mesh(strawTopGeo, strawTopMat);
  strawTop.position.copy(straw.position);
  const offset = new THREE.Vector3(0, 1.2, 0);
  offset.applyQuaternion(straw.quaternion);
  strawTop.position.add(offset);
  group.add(strawTop);

  return { group, cup, tea, surface, pearls, straw };
}

const boba = createBobaCup();
cupGroup.add(boba.group);

const glowMat = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color(0xf8c8dc) },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 color;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vec3 viewDir = normalize(-vPosition);
      float rim = 1.0 - max(0.0, dot(viewDir, vNormal));
      rim = pow(rim, 3.0);
      float pulse = 0.7 + 0.3 * sin(time * 0.5 + vPosition.y * 2.0);
      vec3 glow = color * rim * pulse;
      gl_FragColor = vec4(glow, rim * 0.6);
    }
  `,
  transparent: true,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
  depthWrite: false,
});

const glowGeo = new THREE.CylinderGeometry(1.25, 0.95, 2.3, 48, 1, true);
const glowMesh = new THREE.Mesh(glowGeo, glowMat);
glowMesh.position.y = 0;
boba.group.add(glowMesh);

const shadowMat = new THREE.MeshBasicMaterial({
  color: 0xf8c8dc,
  transparent: true,
  opacity: 0.08,
});
const shadowGeo = new THREE.CircleGeometry(1.8, 32);
const shadow = new THREE.Mesh(shadowGeo, shadowMat);
shadow.rotation.x = -Math.PI / 2;
shadow.position.y = -1.3;
cupGroup.add(shadow);

const particlesGeo = new THREE.BufferGeometry();
const particlesCount = 400;
const positions = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 20;
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMat = new THREE.PointsMaterial({
  color: 0xf8c8dc,
  size: 0.03,
  transparent: true,
  opacity: 0.4,
  blending: THREE.AdditiveBlending,
});
const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5,
  },
});

tl.to(boba.group.rotation, { y: Math.PI * 4, ease: 'none' }, 0)
  .to(boba.group.position, { y: 1.0, ease: 'sine.inOut' }, 0)
  .to(boba.group.position, { x: 2.0, ease: 'sine.inOut' }, 0)
  .to(boba.group.position, { x: -1.5, ease: 'sine.inOut' }, 0.5)
  .to(boba.group.position, { z: 0.5, ease: 'sine.inOut' }, 0.25)
  .to(boba.group.position, { z: -0.8, ease: 'sine.inOut' }, 0.7)
  .to(boba.group.scale, { x: 1.1, y: 1.1, z: 1.1, ease: 'sine.inOut' }, 0)
  .to(boba.group.rotation, { x: 0.15, z: -0.1, ease: 'sine.inOut' }, 0)
  .to(boba.group.rotation, { y: Math.PI * 6, ease: 'none' }, 0.5);

if (boba.straw) {
  gsap.to(boba.straw.rotation, {
    z: -0.5, x: 0.4,
    ease: 'sine.inOut',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
    },
  });
}

document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 0.3;
  const y = (e.clientY / window.innerHeight - 0.5) * 0.2;
  cupGroup.rotation.y += (x - cupGroup.rotation.y) * 0.02;
  cupGroup.rotation.x += (-y - cupGroup.rotation.x) * 0.02;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();

  boba.pearls.forEach((pearl, i) => {
    pearl.position.y += Math.sin(elapsed * 1.2 + i * 2) * 0.0005;
    pearl.rotation.x += 0.01;
    pearl.rotation.z += 0.01;
  });

  if (boba.surface) {
    boba.surface.material.opacity = 0.4 + Math.sin(elapsed * 0.8) * 0.1;
  }

  glowMat.uniforms.time.value = elapsed;

  particles.rotation.y += 0.0005;
  particles.rotation.x += 0.0002;

  camera.position.x = Math.sin(elapsed * 0.05) * 0.5;

  renderer.render(scene, camera);
}

animate();
