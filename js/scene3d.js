/** One bounded WebGL scene on desktop; static gradient remains when unavailable. */
export function initHeroScene() {
  const host = document.querySelector('.hero-webgl');
  const THREE = window.THREE;
  if (!host || !THREE || matchMedia('(max-width: 800px), (prefers-reduced-motion: reduce)').matches) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
  } catch { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
  camera.position.z = 5.7;
  const geometry = new THREE.IcosahedronGeometry(1.7, 1);
  const edges = new THREE.EdgesGeometry(geometry);
  const shape = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xb4cded, transparent: true, opacity: .58 }));
  scene.add(shape);
  const count = 260;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = i * 2.399963229728653;
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y) * (2.1 + (i % 7) * .025);
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = y * 2.1;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }
  const cloudGeometry = new THREE.BufferGeometry();
  cloudGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const cloud = new THREE.Points(cloudGeometry, new THREE.PointsMaterial({ color: 0xb86f52, size: .035, transparent: true, opacity: .8 }));
  scene.add(cloud);
  const resize = () => {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };
  resize();
  addEventListener('resize', resize, { passive: true });
  let visible = true;
  let frame = 0;
  let targetX = 0;
  let targetY = 0;
  const tick = () => {
    frame = 0;
    if (!visible || document.hidden) return;
    shape.rotation.y += .002;
    cloud.rotation.y -= .0007;
    shape.rotation.x += (targetY - shape.rotation.x) * .035;
    cloud.rotation.x += (targetX - cloud.rotation.x) * .025;
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  };
  const start = () => { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick); };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else if (frame) { cancelAnimationFrame(frame); frame = 0; }
  });
  observer.observe(host);
  host.parentElement.addEventListener('pointermove', (event) => {
    const rect = host.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width - .5) * .4;
    targetY = ((event.clientY - rect.top) / rect.height - .5) * .4;
  }, { passive: true });
  addEventListener('scroll', () => {
    if (!visible) return;
    const top = host.getBoundingClientRect().top;
    camera.position.z = 5.7 + Math.max(0, -top / innerHeight) * 1.2;
  }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
    else start();
  });
  renderer.domElement.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    visible = false;
    observer.disconnect();
    host.classList.add('webgl-unavailable');
  });
}
