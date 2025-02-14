async function init() {
  const THREE = await import("three");
  const { OrbitControls } = await import("three/addons/controls/OrbitControls.js");
  const { FontLoader } = await import("three/examples/jsm/loaders/FontLoader.js");
  const { TextGeometry } = await import("three/examples/jsm/geometries/TextGeometry.js");

  // Initialize the scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("black");

  // Initialize the renderer
  const canvas = document.querySelector("canvas.threejs");
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Initialize the camera
  const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.z = 15;

  // Add lighting
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight("white", 2);
  pointLight.position.set(5, 10, 5);
  scene.add(pointLight);

  // Add orbit controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // Load font dynamically
  const fontLoader = new FontLoader();
  fontLoader.load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", (font) => {
    const textGeometry = new TextGeometry("Work IN Progress", {
      font: font,
      size: 1,
      height: 0.3,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.03,
      bevelSegments: 5,
    });

    const textMaterial = new THREE.MeshStandardMaterial({
      color: "gold",
      metalness: 1,
      roughness: 0.1,
      emissive: new THREE.Color("yellow"),
      emissiveIntensity: 0.6,
    });

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textGeometry.center();
    scene.add(textMesh);
  });

  // Add particle effects
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1000;
  const positions = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 30;
  }
  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    color: "white",
    size: 0.1,
    transparent: true,
    opacity: 0.8,
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Add rotating objects
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);

  const dumbMaterial1 = new THREE.MeshStandardMaterial({ color: "cyan", metalness: 0.9, roughness: 0.2 });
  const dumbMaterial2 = new THREE.MeshStandardMaterial({ color: "magenta", metalness: 0.9, roughness: 0.2 });

  const boxMesh = new THREE.Mesh(boxGeometry, dumbMaterial1);
  boxMesh.position.set(-3, 1, -2);
  scene.add(boxMesh);

  const sphereMesh = new THREE.Mesh(sphereGeometry, dumbMaterial2);
  sphereMesh.position.set(3, -1, 2);
  scene.add(sphereMesh);

  // Animation Loop
  const clock = new THREE.Clock();
  const renderLoop = () => {
    const elapsedTime = clock.getElapsedTime();
    particlesMesh.rotation.y = elapsedTime * 0.1;
    particlesMesh.rotation.x = elapsedTime * 0.05;
    boxMesh.rotation.x = elapsedTime * 0.5;
    boxMesh.rotation.y = elapsedTime * 0.5;
    sphereMesh.rotation.y = elapsedTime * 0.5;
    sphereMesh.rotation.z = elapsedTime * 0.5;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(renderLoop);
  };
  renderLoop();

  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

init();
