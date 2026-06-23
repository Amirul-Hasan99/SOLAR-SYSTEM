// SolarSystem.js — Refactored Three.js solar system scene
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SceneManager } from './SceneManager.js';
import { createPlanet } from './PlanetFactory.js';

// Texture imports
import bgTexture1 from '/images/1.jpg';
import bgTexture2 from '/images/2.jpg';
import bgTexture3 from '/images/3.jpg';
import bgTexture4 from '/images/4.jpg';
import sunTexture from '/images/sun.jpg';
import mercuryTexture from '/images/mercurymap.jpg';
import mercuryBump from '/images/mercurybump.jpg';
import venusTexture from '/images/venusmap.jpg';
import venusBump from '/images/venusmap.jpg';
import venusAtmosphere from '/images/venus_atmosphere.jpg';
import earthTexture from '/images/earth_daymap.jpg';
import earthNightTexture from '/images/earth_nightmap.jpg';
import earthAtmosphere from '/images/earth_atmosphere.jpg';
import earthMoonTexture from '/images/moonmap.jpg';
import earthMoonBump from '/images/moonbump.jpg';
import marsTexture from '/images/marsmap.jpg';
import marsBump from '/images/marsbump.jpg';
import jupiterTexture from '/images/jupiter.jpg';
import ioTexture from '/images/jupiterIo.jpg';
import europaTexture from '/images/jupiterEuropa.jpg';
import ganymedeTexture from '/images/jupiterGanymede.jpg';
import callistoTexture from '/images/jupiterCallisto.jpg';
import saturnTexture from '/images/saturnmap.jpg';
import satRingTexture from '/images/saturn_ring.png';
import uranusTexture from '/images/uranus.jpg';
import uraRingTexture from '/images/uranus_ring.png';
import neptuneTexture from '/images/neptune.jpg';
import plutoTexture from '/images/plutomap.jpg';

export class SolarSystem {
  constructor(container, onPlanetSelect) {
    this.container = container;
    this.onPlanetSelect = onPlanetSelect;
    this.isRunning = false;
    this.animationId = null;

    this.settings = {
      accelerationOrbit: 1,
      acceleration: 1,
      sunIntensity: 1.9,
    };

    this.selectedPlanet = null;
    this.isMovingTowardsPlanet = false;
    this.isZoomingOut = false;
    this.targetCameraPosition = new THREE.Vector3();
    this.zoomOutTargetPosition = new THREE.Vector3(-175, 115, 5);
    this.offset = 10;
    this.asteroids = [];
    this.marsMoons = [];
    this.planets = {};

    this._init();
  }

  _init() {
    // Scene manager
    this.sceneManager = new SceneManager(this.container);
    const { scene, camera, textureLoader, cubeTextureLoader, renderer } = this.sceneManager;
    this.scene = scene;
    this.camera = camera;
    this.loadTexture = textureLoader;

    // OrbitControls
    this.controls = new OrbitControls(camera, renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.75;
    this.controls.screenSpacePanning = false;

    // Raycaster
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Background
    scene.background = cubeTextureLoader.load([bgTexture3, bgTexture1, bgTexture2, bgTexture2, bgTexture4, bgTexture2]);

    // Ambient light
    const lightAmbient = new THREE.AmbientLight(0x222222, 6);
    scene.add(lightAmbient);

    // Sun
    const sunSize = 697 / 40;
    const sunGeom = new THREE.SphereGeometry(sunSize, 32, 20);
    this.sunMat = new THREE.MeshStandardMaterial({
      emissive: 0xFFF88F,
      emissiveMap: this.loadTexture.load(sunTexture),
      emissiveIntensity: this.settings.sunIntensity,
    });
    this.sun = new THREE.Mesh(sunGeom, this.sunMat);
    scene.add(this.sun);

    // Point light
    this.pointLight = new THREE.PointLight(0xFDFFD3, 1200, 400, 1.4);
    scene.add(this.pointLight);
    this.pointLight.castShadow = true;
    this.pointLight.shadow.mapSize.width = 1024;
    this.pointLight.shadow.mapSize.height = 1024;
    this.pointLight.shadow.camera.near = 10;
    this.pointLight.shadow.camera.far = 20;

    // Earth shader material
    const earthMaterial = new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { type: 't', value: this.loadTexture.load(earthTexture) },
        nightTexture: { type: 't', value: this.loadTexture.load(earthNightTexture) },
        sunPosition: { type: 'v3', value: this.sun.position },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec2 vUv;
        varying vec3 vSunDirection;
        uniform vec3 sunPosition;
        void main() {
          vUv = uv;
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
          vSunDirection = normalize(sunPosition - worldPosition.xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        varying vec3 vNormal;
        varying vec2 vUv;
        varying vec3 vSunDirection;
        void main() {
          float intensity = max(dot(vNormal, vSunDirection), 0.0);
          vec4 dayColor = texture2D(dayTexture, vUv);
          vec4 nightColor = texture2D(nightTexture, vUv) * 0.2;
          gl_FragColor = mix(nightColor, dayColor, intensity);
        }
      `,
    });

    // Moons
    const earthMoon = [{
      size: 1.6,
      texture: earthMoonTexture,
      bump: earthMoonBump,
      orbitSpeed: 0.001,
      orbitRadius: 10,
    }];

    this.marsMoons = [
      { modelPath: '/images/mars/phobos.glb', scale: 0.1, orbitRadius: 5, orbitSpeed: 0.002, position: 100, mesh: null },
      { modelPath: '/images/mars/deimos.glb', scale: 0.1, orbitRadius: 9, orbitSpeed: 0.0005, position: 120, mesh: null },
    ];

    const jupiterMoons = [
      { size: 1.6, texture: ioTexture, orbitRadius: 20, orbitSpeed: 0.0005 },
      { size: 1.4, texture: europaTexture, orbitRadius: 24, orbitSpeed: 0.00025 },
      { size: 2, texture: ganymedeTexture, orbitRadius: 28, orbitSpeed: 0.000125 },
      { size: 1.7, texture: callistoTexture, orbitRadius: 32, orbitSpeed: 0.00006 },
    ];

    // Create planets
    this.planets.mercury = createPlanet(this.loadTexture, 'Mercury', 2.4, 40, 0, mercuryTexture, mercuryBump);
    this.planets.venus = createPlanet(this.loadTexture, 'Venus', 6.1, 65, 3, venusTexture, venusBump, null, venusAtmosphere);
    this.planets.earth = createPlanet(this.loadTexture, 'Earth', 6.4, 90, 23, earthMaterial, null, null, earthAtmosphere, earthMoon);
    this.planets.mars = createPlanet(this.loadTexture, 'Mars', 3.4, 115, 25, marsTexture, marsBump);
    this.planets.jupiter = createPlanet(this.loadTexture, 'Jupiter', 69 / 4, 200, 3, jupiterTexture, null, null, null, jupiterMoons);
    this.planets.saturn = createPlanet(this.loadTexture, 'Saturn', 58 / 4, 270, 26, saturnTexture, null, { innerRadius: 18, outerRadius: 29, texture: satRingTexture });
    this.planets.uranus = createPlanet(this.loadTexture, 'Uranus', 25 / 4, 320, 82, uranusTexture, null, { innerRadius: 6, outerRadius: 8, texture: uraRingTexture });
    this.planets.neptune = createPlanet(this.loadTexture, 'Neptune', 24 / 4, 340, 28, neptuneTexture);
    this.planets.pluto = createPlanet(this.loadTexture, 'Pluto', 1, 350, 57, plutoTexture);

    // Add all planets to scene
    Object.values(this.planets).forEach(p => scene.add(p.planet3d));

    // Load Mars moons
    const loader = new GLTFLoader();
    this.marsMoons.forEach(moon => {
      loader.load(moon.modelPath, (gltf) => {
        const obj = gltf.scene;
        obj.position.set(moon.position, 0, 0);
        obj.scale.set(moon.scale, moon.scale, moon.scale);
        moon.mesh = obj;
        this.planets.mars.planetSystem.add(moon.mesh);
        moon.mesh.traverse(child => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      }, undefined, (error) => {
        console.warn('Mars moon load error:', error);
      });
    });

    // Shadows
    const p = this.planets;
    [p.earth, p.mercury, p.venus, p.mars, p.jupiter, p.saturn].forEach(obj => {
      obj.planet.castShadow = true;
      obj.planet.receiveShadow = true;
    });
    [p.uranus, p.neptune, p.pluto].forEach(obj => {
      obj.planet.receiveShadow = true;
    });
    if (p.earth.Atmosphere) {
      p.earth.Atmosphere.castShadow = true;
      p.earth.Atmosphere.receiveShadow = true;
    }
    if (p.venus.Atmosphere) {
      p.venus.Atmosphere.receiveShadow = true;
    }
    if (p.earth.moons) {
      p.earth.moons.forEach(m => { m.mesh.castShadow = true; m.mesh.receiveShadow = true; });
    }
    if (p.jupiter.moons) {
      p.jupiter.moons.forEach(m => { m.mesh.castShadow = true; m.mesh.receiveShadow = true; });
    }
    if (p.saturn.Ring) {
      p.saturn.Ring.receiveShadow = true;
    }

    // Raycast targets
    this.raycastTargets = [
      p.mercury.planet, p.venus.planet, p.venus.Atmosphere,
      p.earth.planet, p.earth.Atmosphere,
      p.mars.planet, p.jupiter.planet, p.saturn.planet,
      p.uranus.planet, p.neptune.planet, p.pluto.planet,
    ].filter(Boolean);

    // Asteroids
    this._loadAsteroids('/asteroids/asteroidPack.glb', 1000, 130, 160);
    this._loadAsteroids('/asteroids/asteroidPack.glb', 3000, 352, 370);

    // Event listeners
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onTouchStart = this._onTouchStart.bind(this);
    window.addEventListener('mousemove', this._onMouseMove, false);
    window.addEventListener('mousedown', this._onPointerDown, false);
    window.addEventListener('touchstart', this._onTouchStart, { passive: false });
  }

  _loadAsteroids(path, numberOfAsteroids, minOrbitRadius, maxOrbitRadius) {
    const loader = new GLTFLoader();
    loader.load(path, (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          for (let i = 0; i < numberOfAsteroids / 12; i++) {
            const asteroid = child.clone();
            const orbitRadius = THREE.MathUtils.randFloat(minOrbitRadius, maxOrbitRadius);
            const angle = Math.random() * Math.PI * 2;
            asteroid.position.set(
              orbitRadius * Math.cos(angle),
              0,
              orbitRadius * Math.sin(angle)
            );
            asteroid.scale.setScalar(THREE.MathUtils.randFloat(0.8, 1.2));
            this.scene.add(asteroid);
            this.asteroids.push(asteroid);
          }
        }
      });
    }, undefined, (error) => {
      console.warn('Asteroid load error:', error);
    });
  }

  _onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  _onTouchStart(event) {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.raycastTargets);
      if (intersects.length > 0) {
        event.preventDefault();
        const planet = this._identifyPlanet(intersects[0].object);
        if (planet) {
          this._selectPlanet(planet);
        }
      }
    }
  }

  _onPointerDown(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.raycastTargets);
    if (intersects.length > 0) {
      const planet = this._identifyPlanet(intersects[0].object);
      if (planet) {
        this._selectPlanet(planet);
      }
    }
  }

  _selectPlanet(planet) {
    this._closeInfoNoZoomOut();
    this.settings.accelerationOrbit = 0;

    const planetPosition = new THREE.Vector3();
    planet.planet.getWorldPosition(planetPosition);
    this.controls.target.copy(planetPosition);
    this.camera.lookAt(planetPosition);

    this.targetCameraPosition.copy(planetPosition).add(
      this.camera.position.clone().sub(planetPosition).normalize().multiplyScalar(this.offset)
    );
    this.isMovingTowardsPlanet = true;
    this.selectedPlanet = planet;
  }

  _identifyPlanet(clickedObject) {
    const p = this.planets;
    const mappings = [
      { test: p.mercury.planet.material, planet: p.mercury, offset: 10 },
      { test: p.venus.Atmosphere?.material, planet: p.venus, offset: 25 },
      { test: p.earth.Atmosphere?.material, planet: p.earth, offset: 25 },
      { test: p.mars.planet.material, planet: p.mars, offset: 15 },
      { test: p.jupiter.planet.material, planet: p.jupiter, offset: 50 },
      { test: p.saturn.planet.material, planet: p.saturn, offset: 50 },
      { test: p.uranus.planet.material, planet: p.uranus, offset: 25 },
      { test: p.neptune.planet.material, planet: p.neptune, offset: 20 },
      { test: p.pluto.planet.material, planet: p.pluto, offset: 10 },
    ];

    for (const m of mappings) {
      if (clickedObject.material === m.test) {
        this.offset = m.offset;
        return m.planet;
      }
    }
    return null;
  }

  _closeInfoNoZoomOut() {
    this.settings.accelerationOrbit = 1;
    this.selectedPlanet = null;
  }

  closeInfoAndZoomOut() {
    this.settings.accelerationOrbit = 1;
    this.isZoomingOut = true;
    this.controls.target.set(0, 0, 0);
    this.selectedPlanet = null;
  }

  // Settings controls
  setOrbitSpeed(val) { this.settings.accelerationOrbit = val; }
  setRotationSpeed(val) { this.settings.acceleration = val; }
  setSunIntensity(val) {
    this.settings.sunIntensity = val;
    this.sunMat.emissiveIntensity = val;
  }
  pauseOrbit() { this.settings.accelerationOrbit = 0; }
  resetAll() {
    this.settings.accelerationOrbit = 1;
    this.settings.acceleration = 1;
    this.settings.sunIntensity = 1.9;
    this.sunMat.emissiveIntensity = 1.9;
  }

  // Animation loop
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this._animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  _animate() {
    if (!this.isRunning) return;
    this.animationId = requestAnimationFrame(() => this._animate());

    const p = this.planets;
    const s = this.settings;

    // Rotations
    this.sun.rotateY(0.001 * s.acceleration);
    p.mercury.planet.rotateY(0.001 * s.acceleration);
    p.mercury.planet3d.rotateY(0.004 * s.accelerationOrbit);
    p.venus.planet.rotateY(0.0005 * s.acceleration);
    if (p.venus.Atmosphere) p.venus.Atmosphere.rotateY(0.0005 * s.acceleration);
    p.venus.planet3d.rotateY(0.0006 * s.accelerationOrbit);
    p.earth.planet.rotateY(0.005 * s.acceleration);
    if (p.earth.Atmosphere) p.earth.Atmosphere.rotateY(0.001 * s.acceleration);
    p.earth.planet3d.rotateY(0.001 * s.accelerationOrbit);
    p.mars.planet.rotateY(0.01 * s.acceleration);
    p.mars.planet3d.rotateY(0.0007 * s.accelerationOrbit);
    p.jupiter.planet.rotateY(0.005 * s.acceleration);
    p.jupiter.planet3d.rotateY(0.0003 * s.accelerationOrbit);
    p.saturn.planet.rotateY(0.01 * s.acceleration);
    p.saturn.planet3d.rotateY(0.0002 * s.accelerationOrbit);
    p.uranus.planet.rotateY(0.005 * s.acceleration);
    p.uranus.planet3d.rotateY(0.0001 * s.accelerationOrbit);
    p.neptune.planet.rotateY(0.005 * s.acceleration);
    p.neptune.planet3d.rotateY(0.00008 * s.accelerationOrbit);
    p.pluto.planet.rotateY(0.001 * s.acceleration);
    p.pluto.planet3d.rotateY(0.00006 * s.accelerationOrbit);

    // Moon animations
    const time = performance.now();
    if (p.earth.moons) {
      p.earth.moons.forEach(moon => {
        const tiltAngle = 5 * Math.PI / 180;
        const moonX = p.earth.planet.position.x + moon.orbitRadius * Math.cos(time * moon.orbitSpeed);
        const moonY = moon.orbitRadius * Math.sin(time * moon.orbitSpeed) * Math.sin(tiltAngle);
        const moonZ = p.earth.planet.position.z + moon.orbitRadius * Math.sin(time * moon.orbitSpeed) * Math.cos(tiltAngle);
        moon.mesh.position.set(moonX, moonY, moonZ);
        moon.mesh.rotateY(0.01);
      });
    }

    this.marsMoons.forEach(moon => {
      if (moon.mesh) {
        const moonX = p.mars.planet.position.x + moon.orbitRadius * Math.cos(time * moon.orbitSpeed);
        const moonY = moon.orbitRadius * Math.sin(time * moon.orbitSpeed);
        const moonZ = p.mars.planet.position.z + moon.orbitRadius * Math.sin(time * moon.orbitSpeed);
        moon.mesh.position.set(moonX, moonY, moonZ);
        moon.mesh.rotateY(0.001);
      }
    });

    if (p.jupiter.moons) {
      p.jupiter.moons.forEach(moon => {
        const moonX = p.jupiter.planet.position.x + moon.orbitRadius * Math.cos(time * moon.orbitSpeed);
        const moonY = moon.orbitRadius * Math.sin(time * moon.orbitSpeed);
        const moonZ = p.jupiter.planet.position.z + moon.orbitRadius * Math.sin(time * moon.orbitSpeed);
        moon.mesh.position.set(moonX, moonY, moonZ);
        moon.mesh.rotateY(0.01);
      });
    }

    // Asteroids
    this.asteroids.forEach(asteroid => {
      asteroid.rotation.y += 0.0001;
      const cos = Math.cos(0.0001 * s.accelerationOrbit);
      const sin = Math.sin(0.0001 * s.accelerationOrbit);
      const x = asteroid.position.x * cos + asteroid.position.z * sin;
      const z = asteroid.position.z * cos - asteroid.position.x * sin;
      asteroid.position.x = x;
      asteroid.position.z = z;
    });

    // Outline pass
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.raycastTargets);
    this.sceneManager.outlinePass.selectedObjects = [];
    if (intersects.length > 0) {
      const obj = intersects[0].object;
      if (obj === p.earth.Atmosphere) {
        this.sceneManager.outlinePass.selectedObjects = [p.earth.planet];
      } else if (obj === p.venus.Atmosphere) {
        this.sceneManager.outlinePass.selectedObjects = [p.venus.planet];
      } else {
        this.sceneManager.outlinePass.selectedObjects = [obj];
      }
    }

    // Camera zoom
    if (this.isMovingTowardsPlanet) {
      this.camera.position.lerp(this.targetCameraPosition, 0.03);
      if (this.camera.position.distanceTo(this.targetCameraPosition) < 1) {
        this.isMovingTowardsPlanet = false;
        if (this.onPlanetSelect && this.selectedPlanet) {
          this.onPlanetSelect(this.selectedPlanet.name);
        }
      }
    } else if (this.isZoomingOut) {
      this.camera.position.lerp(this.zoomOutTargetPosition, 0.05);
      if (this.camera.position.distanceTo(this.zoomOutTargetPosition) < 1) {
        this.isZoomingOut = false;
      }
    }

    this.controls.update();
    this.sceneManager.render();
  }

  dispose() {
    this.stop();
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('mousedown', this._onPointerDown);
    window.removeEventListener('touchstart', this._onTouchStart);
    this.controls.dispose();
    this.sceneManager.dispose();
  }
}
