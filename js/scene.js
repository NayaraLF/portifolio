// Cena WebGL de fundo: túnel de partículas + brilho central, guiado pelo scroll.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export const PARTICLES = { desktop: 6000, mobile: 2200 };

const vert = /* glsl */ `
  uniform float uTime, uBurst, uPx;
  uniform vec2 uMouse;
  attribute float aSeed;
  attribute float aScale;
  varying float vAlpha;
  varying float vMix;
  void main() {
    vec3 p = position;
    float t = uTime * 0.12;
    p.xy += vec2(sin(t * 3.0 + aSeed * 20.0), cos(t * 2.0 + aSeed * 17.0)) * (0.3 + aSeed * 0.9);
    p.xy += uMouse * (0.4 + aScale) * 1.6;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    gl_PointSize = clamp(aScale * uPx * (70.0 / max(dist, 1.0)) * (1.0 + uBurst * 1.6), 1.0, 46.0);
    vAlpha = smoothstep(1.0, 8.0, dist) * (1.0 - smoothstep(40.0, 120.0, dist)) * (0.35 + aScale * 0.65);
    vMix = aSeed;
  }
`;

const frag = /* glsl */ `
  uniform float uBurst, uIntensity;
  varying float vAlpha;
  varying float vMix;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    vec3 col = mix(vec3(0.77, 0.71, 0.99), vec3(0.49, 0.23, 0.93), vMix);
    col = mix(col, vec3(0.96, 0.95, 0.98), uBurst * 0.55);
    gl_FragColor = vec4(col, a * vAlpha * uIntensity);
  }
`;

const glowFrag = /* glsl */ `
  uniform float uSize, uAlpha;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0 / max(uSize, 0.001);
    float core = exp(-d * d * 18.0);
    float halo = exp(-d * 2.6) * 0.35;
    vec3 col = mix(vec3(0.49, 0.23, 0.93), vec3(0.96, 0.95, 0.98), core);
    gl_FragColor = vec4(col, (core + halo) * uAlpha * smoothstep(1.0, 0.15, d));
  }
`;

export function initScene(canvas, { still = false } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    return null;
  }
  const mobile = matchMedia('(max-width: 768px)').matches || !matchMedia('(hover: hover)').matches;
  const dpr = Math.min(devicePixelRatio || 1, mobile ? 1.5 : 2);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
  scene.add(camera);

  const count = mobile ? PARTICLES.mobile : PARTICLES.desktop;
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const scale = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = 1.6 + Math.pow(Math.random(), 0.7) * 16;
    const th = Math.random() * Math.PI * 2;
    pos[i * 3] = Math.cos(th) * r;
    pos[i * 3 + 1] = Math.sin(th) * r * 0.7;
    pos[i * 3 + 2] = -110 + Math.random() * 125;
    seed[i] = Math.random();
    scale[i] = 0.25 + Math.pow(Math.random(), 3) * 1.4;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  geo.setAttribute('aScale', new THREE.BufferAttribute(scale, 1));

  const uniforms = {
    uTime: { value: 0 }, uBurst: { value: 0 }, uIntensity: { value: 0.3 },
    uPx: { value: dpr }, uMouse: { value: new THREE.Vector2() },
  };
  const points = new THREE.Points(geo, new THREE.ShaderMaterial({
    uniforms, vertexShader: vert, fragmentShader: frag,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  scene.add(points);

  const glowU = { uSize: { value: 0.12 }, uAlpha: { value: 0.0 } };
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShaderMaterial({
      uniforms: glowU,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: glowFrag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }),
  );
  glow.position.set(0, 0, -30);
  camera.add(glow);

  let target = 0, current = 0, burst = 0;
  const mouse = { x: 0, y: 0 }, mouseT = { x: 0, y: 0 };
  const onMove = (e) => {
    mouseT.x = (e.clientX / innerWidth - 0.5) * 2;
    mouseT.y = -(e.clientY / innerHeight - 0.5) * 2;
  };
  if (!mobile) window.addEventListener('pointermove', onMove, { passive: true });

  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const dist = 30;
    const hh = 2 * Math.tan((camera.fov * Math.PI) / 360) * dist;
    glow.scale.set(hh * camera.aspect * 0.9, hh * 0.9, 1);
    glow.scale.set(hh * 1.2, hh * 1.2, 1);
  }
  resize();

  if (still) {
    // movimento reduzido: um único quadro aceso, sem loop nem reação ao scroll/mouse
    uniforms.uIntensity.value = 0.85;
    uniforms.uBurst.value = 0.04;
    camera.position.z = -8;
    glowU.uSize.value = 0.14;
    glowU.uAlpha.value = 0.2;
    renderer.render(scene, camera);
    const redraw = () => { resize(); renderer.render(scene, camera); };
    window.addEventListener('resize', redraw);
    return { setProgress() {}, setBurst() {}, dispose() { window.removeEventListener('resize', redraw); renderer.dispose(); } };
  }

  window.addEventListener('resize', resize);

  let running = true;
  const clock = new THREE.Clock();
  let frameId;
  function frame() {
    frameId = requestAnimationFrame(frame);
    if (!running || document.hidden) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    uniforms.uTime.value += dt;
    current += (target - current) * Math.min(1, dt * 5);
    mouse.x += (mouseT.x - mouse.x) * 0.05;
    mouse.y += (mouseT.y - mouse.y) * 0.05;
    uniforms.uMouse.value.set(mouse.x, mouse.y);
    uniforms.uBurst.value = burst;
    uniforms.uIntensity.value = 0.3 + 0.7 * smooth(0.02, 0.22, current);
    camera.position.z = 8 - current * 100;
    camera.rotation.z = current * 0.9 + uniforms.uTime.value * 0.01;
    // brilho central: pontinho no início, cresce com a faísca
    const settle = smooth(0.18, 0.4, current);
    glowU.uSize.value = 0.1 + burst * 0.9 + (1 - settle) * 0.1;
    glowU.uAlpha.value = 0.55 - settle * 0.48 + burst * 0.45;
    renderer.render(scene, camera);
  }
  frame();

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    running = false;
    document.documentElement.classList.add('no-webgl');
  });

  return {
    setProgress(p) { target = p; },
    setBurst(b) { burst = b; },
    dispose() {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      geo.dispose();
      renderer.dispose();
    },
  };
}

function smooth(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
