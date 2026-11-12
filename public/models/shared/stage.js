// The space every interactive model is drawn in: warm-grey backdrop, flat floor that only
// catches soft shadows, a 10 × 10 grid of 1 m squares, and (optionally) a sky + sun light rig.
// `setDarkness(0..1)` fades the whole stage to night so glowing things read better (used by Tubularium).
import * as THREE from 'three';

export const LOOK = {
  bg:    0xd9d7d2,
  floor: 0xe9e7e2,
  bgDark:    0x07070e,
  floorDark: 0x0d0d14,
  gridMajor: 0x9a9890,
  gridMinor: 0xbdbab3,
};

/**
 * @param scene   THREE.Scene
 * @param opt.unit         scene units per metre (1 for metres, 100 for centimetres …)
 * @param opt.floorY       height of the floor
 * @param opt.lights       add the shared hemisphere + sun rig (default true)
 * @param opt.shadowExtent half-width of the shadow area, in metres
 */
export function createStage(scene, opt = {}) {
  const { unit = 1, floorY = 0, lights = true, shadowExtent = 4 } = opt;
  const size = 10 * unit;

  scene.background = new THREE.Color(LOOK.bg);

  const group = new THREE.Group();
  scene.add(group);

  const floorMat = new THREE.MeshBasicMaterial({
    color: LOOK.floor, polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 2,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(size * 3, size * 3), floorMat);
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);

  // flat floor colour + a separate transparent plane that only shows shadows, so the floor reads the
  // same in every model no matter how that model is lit
  const catcher = new THREE.Mesh(
    new THREE.PlaneGeometry(size * 3, size * 3),
    new THREE.ShadowMaterial({ opacity: 0.2, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 })
  );
  catcher.rotation.x = -Math.PI / 2;
  catcher.receiveShadow = true;
  group.add(catcher);

  const grid = new THREE.GridHelper(size, 10, LOOK.gridMajor, LOOK.gridMinor);
  grid.position.y = 0.0004 * size;
  grid.material.transparent = true;
  group.add(grid);

  group.position.y = floorY;

  let hemi = null, sun = null;
  const sunBase = 2.2, hemiBase = 1.1;
  if (lights) {
    hemi = new THREE.HemisphereLight(0xffffff, 0x888078, hemiBase);
    sun = new THREE.DirectionalLight(0xffffff, sunBase);
    sun.position.set(3 * unit, 6 * unit, 4 * unit);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const e = shadowExtent * unit;
    Object.assign(sun.shadow.camera, { left: -e, right: e, top: e, bottom: -e, near: unit, far: 16 * unit });
    sun.shadow.bias = -0.0005;
    scene.add(hemi, sun);
  }

  const cBg = new THREE.Color(), cFloor = new THREE.Color();
  let darkness = 0;
  function setDarkness(d) {
    darkness = THREE.MathUtils.clamp(d, 0, 1);
    scene.background.copy(cBg.set(LOOK.bg).lerp(new THREE.Color(LOOK.bgDark), darkness));
    floorMat.color.copy(cFloor.set(LOOK.floor).lerp(new THREE.Color(LOOK.floorDark), darkness));
    grid.material.color.setScalar(THREE.MathUtils.lerp(1, 0.2, darkness));
    catcher.material.opacity = 0.2 * (1 - darkness);
    if (lights) { hemi.intensity = hemiBase * (1 - 0.9 * darkness); sun.intensity = sunBase * (1 - 0.9 * darkness); }
    document.documentElement.toggleAttribute('data-dark', darkness > 0.5);
  }
  setDarkness(0);

  return { group, floor, grid, hemi, sun, setDarkness, get darkness() { return darkness; } };
}

/** Collapse the control panel on small screens so it never covers the model. */
export function initHud() {
  const hud = document.getElementById('hud');
  if (hud && matchMedia('(max-width: 640px), (max-height: 480px)').matches) hud.open = false;
}

/** Renderer settings shared by every model. */
export function setupRenderer(renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
}
