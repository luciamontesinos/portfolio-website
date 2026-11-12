import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { createStage, initHud, setupRenderer } from '../shared/stage.js';
import { createDrumLoop, TRACKS, STEPS } from './drums.js';

/* ------------------------------------------------------------------
   Starting layout. Every value here is just a reasonable default —
   click and drag things in the viewport (see on-screen hint). Call
   exportLayout() from the browser console to print the current
   positions back out so you can paste them in here permanently.
------------------------------------------------------------------ */
// The 4-color palette used across every kind of dinnerware (cups, plates,
// small plates, bowls, cutlery) — the exact same 4 colors everywhere, taken
// from the cups, so every kind reads as the same matching set.
const PALETTE = { yellow: 0xd19421, blue: 0x78878c, orange: 0xb6470b, green: 0x648c73 };

const CONFIG = {
  blanket: { position: { x: 0, y: 0, z: 0 }, rotationY: 0, scale: 1 },
  // basket centered, front-facing, toward the back of the blanket
  basket: { position: { x: 0, y: 4.6, z: -40 }, rotationY: 0.03, scale: 1 },

  // 4 large plates, 4 small (square) plates, 4 bowls — one of each in every
  // palette color, scattered casually on the blanket. Only rotationY varies
  // (a real placed object can spin on the spot, not tip over), and every
  // piece sits flat at the same y so nothing floats or clips into the cloth.
  // Positions were verified pairwise (footprint radius + 2-unit buffer) so
  // nothing overlaps or crosses the basket/blanket edge — see the layout
  // check in the scratchpad if these ever need to move again.
  // "plate3" (orange) keeps the original hero spot with the wine glass on it.
  plate: { position: { x: -55, y: 4.6, z: 44 }, rotationY: 0.9, scale: 0.85 },
  plate2: { position: { x: -15, y: 4.6, z: 58 }, rotationY: -0.5, scale: 0.85 },
  plate3: { position: { x: 19, y: 4.6, z: 4 }, rotationY: 0.15, scale: 0.85 },
  plate4: { position: { x: 55, y: 4.6, z: 42 }, rotationY: 0.4, scale: 0.85 },

  square: { position: { x: -22, y: 4.6, z: 8 }, rotationY: 0.6, scale: 0.8 },
  square2: { position: { x: -45, y: 4.6, z: 20 }, rotationY: 0.4, scale: 0.8 },
  square3: { position: { x: 58, y: 4.6, z: 15 }, rotationY: 0.75, scale: 0.8 },
  square4: { position: { x: 8, y: 4.6, z: 62 }, rotationY: -0.2, scale: 0.8 },

  bowl: { position: { x: -72, y: 4.6, z: 5 }, rotationY: -0.5, scale: 0.9 },
  bowl2: { position: { x: -38, y: 4.6, z: -6 }, rotationY: -0.3, scale: 0.9 },
  bowl3: { position: { x: 35, y: 4.6, z: 58 }, rotationY: -0.7, scale: 0.9 },
  bowl4: { position: { x: 62, y: 4.6, z: -30 }, rotationY: 0.3, scale: 0.9 },

  // 4 cups, one per palette color, resting on the blanket in a loose row
  // just in front of the basket.
  cup: { position: { x: -19, y: 4.6, z: -13 }, rotationY: 0.3, scale: 0.85 },
  cup2: { position: { x: -7, y: 4.6, z: -15 }, rotationY: -0.2, scale: 0.85 },
  cup3: { position: { x: 7, y: 4.6, z: -13 }, rotationY: 0.5, scale: 0.85 },
  cup4: { position: { x: 19, y: 4.6, z: -15 }, rotationY: -0.4, scale: 0.85 },

  // the wine glass, resting on top of the (orange) hero plate
  glass: { position: { x: 21, y: 6.4, z: 9 }, rotationY: 0, scale: 1.1 },
};

// The "cutlery" group in dinnerware.obj is actually 5 separate, unconnected
// pieces (a chopstick pair + fork + knife + spoon) that only happen to share
// a material/group name — split apart at load time (see
// splitMeshByConnectivity) into a stable left-to-right order: [chopstick,
// chopstick, fork, knife, spoon]. 4 full sets (all 5 pieces each), one per
// palette color, each scattered in its own loose jumble near that color's
// plate/bowl, as if just dropped there.
const CUTLERY_SETS = [
  {
    color: 'yellow',
    pieces: [
      { position: { x: -25, y: 4.6, z: -22 }, rotationY: 0.2, scale: 1 },
      { position: { x: -17, y: 4.6, z: -25 }, rotationY: -0.15, scale: 1 },
      { position: { x: -9, y: 4.6, z: -21 }, rotationY: 0.4, scale: 1 },
      { position: { x: -2, y: 4.6, z: -24 }, rotationY: -0.3, scale: 1 },
      { position: { x: 5, y: 4.6, z: -20 }, rotationY: 0.1, scale: 1 },
    ],
  },
  {
    // scaled down from 1 to 0.6 — at full length (24 units) these long thin
    // pieces reached well past their jumble's footprint and crossed into
    // neighboring place settings; shrunk so each jumble stays a compact,
    // self-contained "dropped pile" like the (unscaled, more isolated)
    // yellow set above.
    color: 'blue',
    pieces: [
      { position: { x: -38, y: 4.6, z: 37 }, rotationY: 0.4, scale: 0.6 },
      { position: { x: -30, y: 4.6, z: 39 }, rotationY: -0.3, scale: 0.6 },
      { position: { x: -34, y: 4.6, z: 31 }, rotationY: 0.8, scale: 0.6 },
      { position: { x: -26, y: 4.6, z: 33 }, rotationY: -0.5, scale: 0.6 },
      { position: { x: -29, y: 4.6, z: 38 }, rotationY: 0.15, scale: 0.6 },
    ],
  },
  {
    color: 'orange',
    pieces: [
      { position: { x: 32, y: 4.6, z: 24 }, rotationY: 0.3, scale: 0.6 },
      { position: { x: 40, y: 4.6, z: 20 }, rotationY: -0.2, scale: 0.6 },
      { position: { x: 36, y: 4.6, z: 26 }, rotationY: 0.6, scale: 0.6 },
      { position: { x: 44, y: 4.6, z: 22 }, rotationY: -0.4, scale: 0.6 },
      { position: { x: 34, y: 4.6, z: 18 }, rotationY: 0.2, scale: 0.6 },
    ],
  },
  {
    color: 'green',
    pieces: [
      { position: { x: 12, y: 4.6, z: 44 }, rotationY: 0.5, scale: 0.6 },
      { position: { x: 20, y: 4.6, z: 40 }, rotationY: -0.3, scale: 0.6 },
      { position: { x: 16, y: 4.6, z: 46 }, rotationY: 0.7, scale: 0.6 },
      { position: { x: 24, y: 4.6, z: 44 }, rotationY: -0.6, scale: 0.6 },
      { position: { x: 14, y: 4.6, z: 38 }, rotationY: 0.25, scale: 0.6 },
    ],
  },
];

// Every instance of every kind (including the un-suffixed "1st" one) is
// explicitly recolored — see init() — so nothing falls back to
// dinnerware.mtl's own per-kind base color. That guarantees each kind gets
// exactly the 4 palette colors once each, matching the cups exactly.
const DINNERWARE_COLOR_OVERRIDES = {
  plate: PALETTE.yellow, plate2: PALETTE.blue, plate3: PALETTE.orange, plate4: PALETTE.green,
  square: PALETTE.yellow, square2: PALETTE.blue, square3: PALETTE.orange, square4: PALETTE.green,
  bowl: PALETTE.yellow, bowl2: PALETTE.blue, bowl3: PALETTE.orange, bowl4: PALETTE.green,
  cup: PALETTE.yellow, cup2: PALETTE.blue, cup3: PALETTE.orange, cup4: PALETTE.green,
};

// tealight candle clusters flanking the basket — no candle asset exists, so
// these are simple procedural stand-ins (see addTealights)
const TEALIGHT_CLUSTERS = [
  { x: -56, z: -8 },
  { x: 58, z: -8 },
];

// Local-space centers of each dinnerware sub-group inside dinnerware.obj,
// measured from the raw geometry so each can be recentered to its own
// footprint before being placed in the world.
const DINNERWARE_CENTERS = {
  plate: { x: -50.0, z: 22.0 },
  bowl: { x: -24.0, z: 22.0 },
  square: { x: 2.0, z: 22.0 },
  cup: { x: 26.0, z: 22.0 },
};

const ASSET_PATH = './';

/* ------------------------------------------------------------------
   Physics — click-and-drag-and-throw instead of the old W/E/R gizmo.
   This is a small hand-rolled 2D (x/z, plus a simple y arc) simulation,
   not a full physics engine: everything the player can pick up slides on
   a fixed-height plane (GROUND_Y) with friction and a bit of spin, walls
   at the edge of the blanket, a box obstacle for the basket, and simple
   circle-vs-circle bumping between pieces. A fast release also pops the
   piece into the air (scaled off how fast it was moving) with a gravity
   arc and some tumble, then it lands and settles flat again. Good enough
   to feel physical without needing real collision meshes.
------------------------------------------------------------------ */
const GROUND_Y = 4.6; // resting height for every piece once it's been touched
const DRAG_LIFT = 7; // held slightly above the table while dragging
const GRAVITY = 500; // only applies after an object is first grabbed
const FRICTION = 1.6; // higher = stops sliding sooner (exponential decay rate)
const RESTITUTION = 0.45; // bounciness off walls/basket/other objects/landing
const BLANKET_HALF = 78; // keeps thrown objects from sliding off the (170-wide) cloth
const TOSS_FACTOR = 0.5; // release speed -> upward launch speed
const MAX_TOSS_VY = 220; // cap how high a hard throw can pop something
// Padded world-space footprint of the basket (see picnic_basket.obj's combined
// wicker_body/wicker_rim/wicker_lid bounds), used as a simple box obstacle.
const BASKET_AABB = { xMin: -25, xMax: 25, zMin: -64, zMax: -23 };

// Footprint radius per kind, used only for physics (wall/basket/object
// collision) — matches the real dinnerware.obj proportions used to lay the
// scene out originally, scaled by each holder's own scale.
function physicsRadiusFor(name, scale) {
  if (name.startsWith('plate')) return 13.8 * scale;
  if (name.startsWith('square')) return 9.7 * scale;
  if (name.startsWith('bowl')) return 9.25 * scale;
  if (name.startsWith('cup')) return 4.35 * scale;
  if (name.startsWith('cutlery')) return 3.5 * scale; // thin sticks — collision is approximate
  if (name === 'glass') return 4.3 * scale;
  return 8 * scale;
}

/* ------------------------------------------------------------------
   Renderer / scene / camera
------------------------------------------------------------------ */
const renderer = new THREE.WebGLRenderer({ antialias: true });
setupRenderer(renderer);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
// Same backdrop, floor, grid (1 m squares — this scene is in centimetres) and lights as the other models.
// The blanket is flattened (see init) so everything lies on it; the floor sits just beneath it.
createStage(scene, { unit: 100, floorY: 3.5, shadowExtent: 1.2 });
initHud();

const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.set(13, 76, 128);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.target.set(0, 18, -15);
orbit.enableDamping = true;
orbit.dampingFactor = 0.08;
orbit.maxPolarAngle = Math.PI * 0.495;
orbit.minDistance = 30;
orbit.maxDistance = 500;
orbit.update();

/* ------------------------------------------------------------------
   Loading helpers
------------------------------------------------------------------ */
function loadOBJ(mtlFile, objFile) {
  return new Promise((resolve, reject) => {
    const mtlLoader = new MTLLoader().setPath(ASSET_PATH);
    mtlLoader.load(
      mtlFile,
      (materials) => {
        materials.preload();
        const objLoader = new OBJLoader().setMaterials(materials).setPath(ASSET_PATH);
        objLoader.load(objFile, resolve, undefined, reject);
      },
      undefined,
      reject
    );
  });
}

function applyShadows(root) {
  root.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      // These are thin, single-walled exports (no separate inner/outer shell),
      // so single-sided rendering culls faces like a bowl's interior/bottom
      // whenever their winding points away from the camera. Double-siding
      // fixes that at the cost of a bit of fill-rate, which is fine here.
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((m) => { if (m) m.side = THREE.DoubleSide; });
    }
  });
}

// Splits a single Mesh into multiple Meshes along connectivity boundaries.
// dinnerware.obj's "cutlery" group is exported as 5 physically separate
// pieces (a chopstick pair + 3 utensils) that only happen to share a
// material/group name — this recovers them as independent objects.
// Faces are considered connected if they share a vertex position (welded
// by rounding, since the exporter duplicates vertices per face-corner and
// doesn't reuse indices across faces).
function splitMeshByConnectivity(mesh, precision = 3) {
  const geometry = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry;
  const position = geometry.attributes.position;
  const normal = geometry.attributes.normal;
  const uv = geometry.attributes.uv;
  const vertexCount = position.count;

  const posKey = (i) =>
    `${position.getX(i).toFixed(precision)},${position.getY(i).toFixed(precision)},${position.getZ(i).toFixed(precision)}`;

  const parent = new Map();
  const find = (x) => {
    let root = x;
    while (parent.get(root) !== root) root = parent.get(root);
    while (parent.get(x) !== root) {
      const next = parent.get(x);
      parent.set(x, root);
      x = next;
    }
    return root;
  };
  const union = (a, b) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  };

  for (let i = 0; i < vertexCount; i++) {
    const k = posKey(i);
    if (!parent.has(k)) parent.set(k, k);
  }
  for (let i = 0; i < vertexCount; i += 3) {
    union(posKey(i), posKey(i + 1));
    union(posKey(i), posKey(i + 2));
  }

  const triByRoot = new Map();
  for (let i = 0; i < vertexCount; i += 3) {
    const root = find(posKey(i));
    if (!triByRoot.has(root)) triByRoot.set(root, []);
    triByRoot.get(root).push(i);
  }

  const pieces = [];
  for (const triStarts of triByRoot.values()) {
    const newPos = [];
    const newNormal = normal ? [] : null;
    const newUV = uv ? [] : null;
    for (const start of triStarts) {
      for (let j = 0; j < 3; j++) {
        const idx = start + j;
        newPos.push(position.getX(idx), position.getY(idx), position.getZ(idx));
        if (normal) newNormal.push(normal.getX(idx), normal.getY(idx), normal.getZ(idx));
        if (uv) newUV.push(uv.getX(idx), uv.getY(idx));
      }
    }
    const newGeom = new THREE.BufferGeometry();
    newGeom.setAttribute('position', new THREE.Float32BufferAttribute(newPos, 3));
    if (newNormal) newGeom.setAttribute('normal', new THREE.Float32BufferAttribute(newNormal, 3));
    if (newUV) newGeom.setAttribute('uv', new THREE.Float32BufferAttribute(newUV, 2));

    newGeom.computeBoundingBox();
    const center = new THREE.Vector3();
    newGeom.boundingBox.getCenter(center);
    newGeom.translate(-center.x, 0, -center.z); // recenter footprint, keep base at y=0

    pieces.push({ geometry: newGeom, center: { x: center.x, z: center.z } });
  }

  pieces.sort((a, b) => a.center.x - b.center.x); // stable left-to-right order
  return pieces;
}

// Wraps a loaded object in a "holder" Group so CONFIG.position/rotationY/scale
// always describes an intuitive, predictable pivot (the object's own footprint
// center at its base), regardless of quirks in the raw exported geometry.
function makeHolder(name, object3d, localCenter = { x: 0, z: 0 }) {
  object3d.position.set(-localCenter.x, 0, -localCenter.z);
  const holder = new THREE.Group();
  holder.name = name;
  holder.userData.isHolder = true;
  holder.add(object3d);
  return holder;
}

function applyConfig(holder, cfg) {
  holder.position.set(cfg.position.x, cfg.position.y, cfg.position.z);
  holder.rotation.set(0, cfg.rotationY, 0);
  holder.scale.setScalar(cfg.scale);
}

// No candle asset exists, so tealights are a simple procedural stand-in: a
// small frosted cylinder with a warm, lit wick tip — just enough to read as
// a tealight from a distance, clustered per the reference photo.
const tealightWaxMat = new THREE.MeshStandardMaterial({ color: 0xfff6e5, roughness: 0.4, transparent: true, opacity: 0.85 });
const tealightFlameMat = new THREE.MeshStandardMaterial({ color: 0xffb347, emissive: 0xffaa33, emissiveIntensity: 2.2, roughness: 0.3 });
const tealightWaxGeo = new THREE.CylinderGeometry(2.6, 2.6, 1.8, 20);
const tealightFlameGeo = new THREE.SphereGeometry(0.5, 10, 10);

function addTealightCluster(cx, cz) {
  const jitter = [
    { dx: -3.2, dz: 1.5 },
    { dx: 3.4, dz: 0.6 },
    { dx: 0.2, dz: -2.6 },
  ];
  jitter.forEach(({ dx, dz }) => {
    const wax = new THREE.Mesh(tealightWaxGeo, tealightWaxMat);
    wax.position.set(cx + dx, 5.5, cz + dz);
    wax.castShadow = true;
    wax.receiveShadow = true;
    scene.add(wax);

    const flame = new THREE.Mesh(tealightFlameGeo, tealightFlameMat);
    flame.position.set(cx + dx, 6.7, cz + dz);
    scene.add(flame);

    const glow = new THREE.PointLight(0xffaa55, 8, 22, 2);
    glow.position.set(cx + dx, 7, cz + dz);
    scene.add(glow);
  });
}

/* ------------------------------------------------------------------
   Load everything
------------------------------------------------------------------ */
const objects = {}; // name -> holder Group
const initialTransforms = {}; // name -> starting {position, rotationY, scale}, for "Reset layout"

async function init() {
  const [blanketObj, basketObj, dinnerwareObj, glassObj] = await Promise.all([
    loadOBJ('picnic_cloth.mtl', 'picnic_cloth.obj'),
    loadOBJ('picnic_basket.mtl', 'picnic_basket.obj'),
    loadOBJ('dinnerware.mtl', 'dinnerware.obj'),
    loadOBJ('wine_glass.mtl', 'wine_glass.obj'),
  ]);

  [blanketObj, basketObj, dinnerwareObj, glassObj].forEach(applyShadows);
  // The exported cloth is wrinkled (y from -5 to +5), which made the objects float or sink. Swap its geometry for a
  // plain flat square (170 × 170, same size and same gingham tiling) so everything lies on top.
  blanketObj.traverse((c) => {
    if (!c.isMesh) return;
    const plane = new THREE.PlaneGeometry(170, 170);
    plane.rotateX(-Math.PI / 2);
    plane.translate(0, GROUND_Y - 0.1, 0);
    const uv = plane.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 40.476, uv.getY(i) * 40.476);
    c.geometry.dispose();
    c.geometry = plane;
  });
  // the blanket only needs to receive shadows, not cast them onto itself oddly
  blanketObj.traverse((c) => { if (c.isMesh) c.castShadow = false; });

  objects.blanket = makeHolder('blanket', blanketObj);
  objects.basket = makeHolder('basket', basketObj);
  objects.glass = makeHolder('glass', glassObj);
  applyConfig(objects.blanket, CONFIG.blanket);
  applyConfig(objects.basket, CONFIG.basket);
  applyConfig(objects.glass, CONFIG.glass);

  // The open lid's interior panels (gingham/wicker_lid) present their back
  // face to the camera from this angle. Something about how this asset was
  // exported (its normals are axis-aligned, not aligned to the panel's
  // actual tilt) stops three.js's usual double-sided normal flip from
  // lighting that back face — it renders as flat black no matter how the
  // scene is lit. A small fixed emissive tint gives every basket surface a
  // dim baseline color so this never crushes to pure black, without
  // visibly changing the properly-lit faces.
  basketObj.traverse((c) => {
    if (c.isMesh) {
      const mats = Array.isArray(c.material) ? c.material : [c.material];
      mats.forEach((m) => { if (m) { m.emissive = new THREE.Color(0x18120a); } });
    }
  });
  glassObj.traverse((c) => {
    if (c.isMesh) {
      c.material.transparent = true;
      c.material.depthWrite = false;
    }
  });

  // Split dinnerware.obj into its named single pieces (plate, bowl, square,
  // cup) so each can be placed independently, in or out of the basket.
  const dinnerwareNames = ['plate', 'bowl', 'square', 'cup'];
  for (const name of dinnerwareNames) {
    const piece = dinnerwareObj.getObjectByName(name);
    if (!piece) {
      console.warn(`dinnerware piece "${name}" not found in dinnerware.obj`);
      continue;
    }
    // Every instance, including this un-suffixed one, gets an explicit
    // palette color (see DINNERWARE_COLOR_OVERRIDES) rather than falling
    // back to dinnerware.mtl's own base color for the piece.
    piece.traverse((c) => {
      if (c.isMesh) {
        c.material = c.material.clone();
        c.material.color.setHex(DINNERWARE_COLOR_OVERRIDES[name]);
      }
    });
    objects[name] = makeHolder(name, piece, DINNERWARE_CENTERS[name]);
    applyConfig(objects[name], CONFIG[name]);

    // Extra copies (e.g. "cup2", "plate2") reuse the same source geometry —
    // the basket in the reference photo holds several plates/cups in
    // different colors, and dinnerware.obj only has one of each. Each copy
    // gets its own material instance so DINNERWARE_COLOR_OVERRIDES can
    // recolor it independently of the original piece.
    for (const extraName of Object.keys(CONFIG)) {
      if (extraName !== name && extraName.startsWith(name) && CONFIG[extraName] && !objects[extraName]) {
        const clone = piece.clone();
        const overrideColor = DINNERWARE_COLOR_OVERRIDES[extraName];
        clone.traverse((c) => {
          if (c.isMesh) {
            c.geometry = c.geometry.clone();
            if (overrideColor !== undefined) {
              c.material = c.material.clone();
              c.material.color.setHex(overrideColor);
            }
          }
        });
        objects[extraName] = makeHolder(extraName, clone, DINNERWARE_CENTERS[name]);
        applyConfig(objects[extraName], CONFIG[extraName]);
      }
    }
  }

  // "cutlery" is actually several disconnected physical pieces bundled under
  // one group/material name — split them apart, then stamp out one full
  // colored set of all 5 pieces per entry in CUTLERY_SETS.
  const cutleryMesh = dinnerwareObj.getObjectByName('cutlery');
  if (cutleryMesh) {
    const pieces = splitMeshByConnectivity(cutleryMesh);
    CUTLERY_SETS.forEach((set, setIndex) => {
      const overrideColor = PALETTE[set.color];
      pieces.forEach((piece, i) => {
        const geometry = piece.geometry.clone();
        const material = cutleryMesh.material.clone();
        material.color.setHex(overrideColor);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const name = `cutlery_${setIndex + 1}_${i + 1}`;
        const holder = makeHolder(name, mesh);
        objects[name] = holder;
        const cfg = set.pieces[i] || {
          position: { x: 15 + i * 8, y: 4.6, z: -15 },
          rotationY: 0,
          scale: 1,
        };
        applyConfig(holder, cfg);
      });
    });
  } else {
    console.warn('dinnerware piece "cutlery" not found in dinnerware.obj');
  }

  TEALIGHT_CLUSTERS.forEach((c) => addTealightCluster(c.x, c.z));

  for (const [name, holder] of Object.entries(objects)) {
    scene.add(holder);

    // "blanket" and "basket" are the static stage — everything else is a
    // physics body the player can grab (see the drag handlers below).
    // "active" stays false (untouched, exactly as authored) until the
    // player first picks the piece up — see grabbing() — so nothing drifts
    // or drops under gravity before you touch it.
    if (name !== 'blanket' && name !== 'basket') {
      holder.userData.physics = {
        vx: 0, vy: 0, vz: 0,
        angularVel: 0,
        radius: physicsRadiusFor(name, holder.scale.x),
        active: false,
      };
      // Snapshot of where this piece started, for the "Reset layout" button —
      // read straight off the holder rather than re-deriving from CONFIG, so
      // it works uniformly for dinnerware AND the generated cutlery pieces.
      initialTransforms[name] = {
        position: { x: holder.position.x, y: holder.position.y, z: holder.position.z },
        rotationY: holder.rotation.y,
        scale: holder.scale.x,
      };
    }
  }

  registerFlashables();
  document.getElementById('loading').remove();
  setupResetButton();
  animate();
}

/* ------------------------------------------------------------------
   Sound — every kind of object is one percussion instrument:
     cup → Snare · bowl → Kick 1 · large plate → Hi-Hat 1 · small plate → Hi-Hat 2
     cutlery → Clap · basket → Kick 2 · glass → clears the loop
   Clicking an object plays its sound and adds a hit to that instrument's
   track in a 120 BPM, one-bar loop, snapped to the nearest 16th note.
------------------------------------------------------------------ */
function soundTypeOf(name) {
  if (name === 'glass') return 'reset';
  if (name === 'basket') return 'kick2';
  if (name.startsWith('plate')) return 'hat1';
  if (name.startsWith('square')) return 'hat2';
  if (name.startsWith('bowl')) return 'kick1';
  if (name.startsWith('cup')) return 'snare';
  if (name.startsWith('cutlery')) return 'clap';
  return null;
}

const toastEl = document.getElementById('toast');
let toastTimer = 0;
function toast(msg, ms = 1800) {
  toastEl.textContent = msg;
  toastEl.style.opacity = 1;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.style.opacity = 0; }, ms);
}

// step-sequencer readout in the control panel
const seqEl = document.getElementById('seq');
const seqCells = {};
for (const t of TRACKS) {
  const row = document.createElement('div');
  row.className = 'seq-row';
  row.innerHTML = `<span class="seq-name">${t.name}</span><span class="seq-cells">${'<i></i>'.repeat(STEPS)}</span>`;
  seqEl.appendChild(row);
  seqCells[t.id] = [...row.querySelectorAll('i')];
}
function drawPattern(pattern) {
  for (const t of TRACKS) seqCells[t.id].forEach((c, i) => c.classList.toggle('on', pattern[t.id][i]));
}
let shownStep = -1;
function drawPlayhead() {
  const step = drums.currentStep();
  if (step === shownStep) return;
  for (const t of TRACKS) {
    if (shownStep >= 0) seqCells[t.id][shownStep].classList.remove('now');
    if (step >= 0) seqCells[t.id][step].classList.add('now');
  }
  shownStep = step;
}

const drums = createDrumLoop({ onChange: drawPattern });

// only the object that was played lights up (not every copy of its kind), in time with its sound
const flashLevel = {};   // object name -> 0..1
const flashMats = {};    // object name -> [{ mat, base }]
function registerFlashables() {
  for (const [name, holder] of Object.entries(objects)) {
    if (!soundTypeOf(name)) continue;
    holder.traverse((c) => {
      if (!c.isMesh) return;
      const mats = Array.isArray(c.material) ? c.material : [c.material];
      mats.forEach((mat) => {
        if (mat && mat.emissive) (flashMats[name] ??= []).push({ mat, base: mat.emissive.clone() });
      });
    });
  }
}
function updateFlashes(dt) {
  for (const name of drums.drainFlashes()) if (name) flashLevel[name] = 1;
  for (const name in flashLevel) {
    const k = flashLevel[name] = Math.max(0, flashLevel[name] - dt * 3.5);
    for (const { mat, base } of flashMats[name] || []) mat.emissive.copy(base).addScalar(k * 0.4);
  }
}

function handleClick(name) {
  const type = soundTypeOf(name);
  if (!type) return;
  if (type === 'reset') {
    drums.clear();
    flashLevel[name] = 1;
    toast('Loop cleared');
    return;
  }
  drums.hit(type, name);
  flashLevel[name] = 1;
}

/* ------------------------------------------------------------------
   Click-and-drag-and-throw
   Pick up any piece of dinnerware, drag it around, and let go to throw
   it — it keeps sliding on its last drag velocity, with friction, a bit
   of spin, and bounces off the blanket edge / basket / other pieces.
   See updatePhysics() below for the actual simulation step.
------------------------------------------------------------------ */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -GROUND_Y);
const dragGroundHit = new THREE.Vector3();
const dragOffset = new THREE.Vector2();
let dragTarget = null; // the holder currently being dragged, or null
let dragMoved = false; // true once the pointer has travelled far enough to count as a drag, not a click
let press = null;      // the object under the pointer since pointerdown: { name, sx, sy }
const CLICK_SLOP = 6;  // px of movement still counted as a click

function setPointerFromEvent(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function grab(name) {
  const holder = objects[name];
  if (!holder || !holder.userData.physics) return;
  dragTarget = holder;
  dragMoved = false;
  orbit.enabled = false;
  const p = holder.userData.physics;
  p.vx = 0; p.vy = 0; p.vz = 0;
  raycaster.setFromCamera(pointer, camera);
  raycaster.ray.intersectPlane(dragPlane, dragGroundHit);
  // Keep the point you actually grabbed under the cursor, rather than
  // snapping the object's center there.
  dragOffset.set(holder.position.x - dragGroundHit.x, holder.position.z - dragGroundHit.z);
}

function release() {
  if (dragTarget && dragMoved) {
    const p = dragTarget.userData.physics;
    // A fast release pops the piece into the air (see updatePhysics's
    // gravity step), scaled off how fast it was moving when let go — a
    // gentle drop just stays on the table instead of launching.
    const speed = Math.hypot(p.vx, p.vz);
    p.vy = Math.min(speed * TOSS_FACTOR, MAX_TOSS_VY);
  }
  dragTarget = null;
  dragMoved = false;
  orbit.enabled = true;
}

renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());   // no long-press menu on touch
renderer.domElement.addEventListener('pointerdown', (event) => {
  if (event.target !== renderer.domElement) return;
  drums.unlock();   // browsers only start audio from inside a user gesture
  setPointerFromEvent(event);
  raycaster.setFromCamera(pointer, camera);
  const clickable = Object.values(objects).filter((h) => h.name !== 'blanket');
  const hits = raycaster.intersectObjects(clickable, true);
  if (!hits.length) return;
  let obj = hits[0].object;
  while (obj && !obj.userData.isHolder) obj = obj.parent;
  if (!obj) return;
  press = { name: obj.name, sx: event.clientX, sy: event.clientY };
  grab(obj.name);   // does nothing for the basket, which is fixed in place
});

window.addEventListener('pointermove', (event) => {
  if (dragTarget) setPointerFromEvent(event);
  if (press && !dragMoved && Math.hypot(event.clientX - press.sx, event.clientY - press.sy) > CLICK_SLOP) {
    press.moved = true;
    if (dragTarget) { dragMoved = true; dragTarget.userData.physics.active = true; }
  }
});

function endPress(event, cancelled) {
  const wasClick = press && !press.moved && !cancelled;
  const name = press && press.name;
  press = null;
  if (dragTarget) release();
  if (wasClick) handleClick(name);
}
window.addEventListener('pointerup', (e) => endPress(e, false));
window.addEventListener('pointercancel', (e) => endPress(e, true));

// Moves the currently-dragged object to follow the cursor (clamped to the
// blanket/basket, same as everything else) and records how fast it's
// moving each frame, so releasing it mid-swing throws it at that velocity
// — using every frame (not just pointermove events) means the velocity
// naturally settles to ~0 if you hold it still before letting go, instead
// of keying off a single stale mousemove.
function updateDrag(dt) {
  if (!dragTarget || !dragMoved || dt <= 0) return;
  raycaster.setFromCamera(pointer, camera);
  if (!raycaster.ray.intersectPlane(dragPlane, dragGroundHit)) return;
  const p = dragTarget.userData.physics;
  const targetX = dragGroundHit.x + dragOffset.x;
  const targetZ = dragGroundHit.z + dragOffset.y;
  const [clampedX, clampedZ] = clampToBounds(targetX, targetZ, p.radius);
  p.vx = (clampedX - dragTarget.position.x) / dt;
  p.vz = (clampedZ - dragTarget.position.z) / dt;
  dragTarget.position.x = clampedX;
  dragTarget.position.z = clampedZ;
  dragTarget.position.y = GROUND_Y + DRAG_LIFT;
}

/* ------------------------------------------------------------------
   Physics simulation — see the constants block near CONFIG for the
   tunable numbers (friction, restitution, blanket/basket bounds).
------------------------------------------------------------------ */
function clampToBounds(x, z, radius) {
  let cx = x, cz = z;
  if (cx - radius < -BLANKET_HALF) cx = -BLANKET_HALF + radius;
  if (cx + radius > BLANKET_HALF) cx = BLANKET_HALF - radius;
  if (cz - radius < -BLANKET_HALF) cz = -BLANKET_HALF + radius;
  if (cz + radius > BLANKET_HALF) cz = BLANKET_HALF - radius;
  return [cx, cz];
}

function resolveWalls(holder) {
  const p = holder.userData.physics;
  const r = p.radius;
  if (holder.position.x - r < -BLANKET_HALF) {
    holder.position.x = -BLANKET_HALF + r;
    p.vx = Math.abs(p.vx) * RESTITUTION;
  } else if (holder.position.x + r > BLANKET_HALF) {
    holder.position.x = BLANKET_HALF - r;
    p.vx = -Math.abs(p.vx) * RESTITUTION;
  }
  if (holder.position.z - r < -BLANKET_HALF) {
    holder.position.z = -BLANKET_HALF + r;
    p.vz = Math.abs(p.vz) * RESTITUTION;
  } else if (holder.position.z + r > BLANKET_HALF) {
    holder.position.z = BLANKET_HALF - r;
    p.vz = -Math.abs(p.vz) * RESTITUTION;
  }
}

function resolveBasket(holder) {
  const p = holder.userData.physics;
  const r = p.radius;
  const x = holder.position.x, z = holder.position.z;
  const cx = THREE.MathUtils.clamp(x, BASKET_AABB.xMin, BASKET_AABB.xMax);
  const cz = THREE.MathUtils.clamp(z, BASKET_AABB.zMin, BASKET_AABB.zMax);
  const dx = x - cx, dz = z - cz;
  const distSq = dx * dx + dz * dz;
  if (distSq >= r * r) return;
  const dist = Math.sqrt(distSq) || 0.001;
  const nx = dx / dist, nz = dz / dist;
  const overlap = r - dist;
  holder.position.x += nx * overlap;
  holder.position.z += nz * overlap;
  const vn = p.vx * nx + p.vz * nz;
  if (vn < 0) {
    p.vx -= (1 + RESTITUTION) * vn * nx;
    p.vz -= (1 + RESTITUTION) * vn * nz;
  }
}

function resolvePairCollision(a, b) {
  const pa = a.userData.physics, pb = b.userData.physics;
  const dx = b.position.x - a.position.x, dz = b.position.z - a.position.z;
  const dist = Math.hypot(dx, dz);
  const minDist = pa.radius + pb.radius;
  if (dist <= 0 || dist >= minDist) return;
  const nx = dx / dist, nz = dz / dist;
  const overlap = (minDist - dist) / 2;
  a.position.x -= nx * overlap; a.position.z -= nz * overlap;
  b.position.x += nx * overlap; b.position.z += nz * overlap;
  const relVx = pb.vx - pa.vx, relVz = pb.vz - pa.vz;
  const relN = relVx * nx + relVz * nz;
  if (relN >= 0) return; // already separating
  const impulse = -(1 + RESTITUTION) * relN * 0.5;
  pa.vx -= impulse * nx; pa.vz -= impulse * nz;
  pb.vx += impulse * nx; pb.vz += impulse * nz;
  pa.angularVel += (Math.random() - 0.5) * 1.5;
  pb.angularVel += (Math.random() - 0.5) * 1.5;
  // A knock is enough to wake a piece that's never been touched directly.
  pa.active = true; pb.active = true;
}

function updatePhysics(dt) {
  const bodies = [];
  for (const [name, holder] of Object.entries(objects)) {
    if (name === 'blanket' || name === 'basket') continue;
    if (holder === dragTarget) continue;
    const p = holder.userData.physics;
    if (!p || !p.active) continue;
    bodies.push(holder);

    // vertical: gravity, only once picked up at least once (see grab()),
    // so untouched pieces — like the glass resting on its plate — don't
    // start falling on their own. Pieces stay upright the whole time
    // (only rotation.y — flat spin — ever changes) since there's no real
    // ground-contact/normal detection here to justify tipping them over.
    if (holder.position.y > GROUND_Y || p.vy > 0) {
      p.vy -= GRAVITY * dt;
      holder.position.y += p.vy * dt;
      if (holder.position.y <= GROUND_Y) {
        holder.position.y = GROUND_Y;
        // a fast fall gets a little bounce, like a real toss landing;
        // a slow one just settles
        p.vy = Math.abs(p.vy) > 25 ? -p.vy * RESTITUTION : 0;
      }
    }

    // horizontal: slide with friction, spin decays the same way
    const decay = Math.exp(-FRICTION * dt);
    const speed = Math.hypot(p.vx, p.vz);
    if (speed > 0.05) {
      holder.position.x += p.vx * dt;
      holder.position.z += p.vz * dt;
    } else {
      p.vx = 0; p.vz = 0;
    }
    p.vx *= decay;
    p.vz *= decay;
    holder.rotation.y += p.angularVel * dt;
    p.angularVel *= decay;

    resolveWalls(holder);
    resolveBasket(holder);
  }

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      resolvePairCollision(bodies[i], bodies[j]);
    }
  }
}

function resetLayout() {
  release();
  for (const [name, holder] of Object.entries(objects)) {
    const t = initialTransforms[name];
    if (!t) continue;
    applyConfig(holder, t);
    Object.assign(holder.userData.physics, { vx: 0, vy: 0, vz: 0, angularVel: 0, active: false });
  }
}

/* ------------------------------------------------------------------
   UI — just a single "Reset layout" button (top-right, see index.html
   for its styling). exportLayout() is still available from the browser
   console for pulling numbers back into CONFIG, it just isn't shown as
   a button.
------------------------------------------------------------------ */
function setupResetButton() {
  const button = document.getElementById('resetBtn');
  button.hidden = false;
  button.addEventListener('click', resetLayout);
  window.exportLayout = exportLayout;
}

function exportLayout() {
  const layout = {};
  for (const [name, holder] of Object.entries(objects)) {
    layout[name] = {
      position: {
        x: Number(holder.position.x.toFixed(2)),
        y: Number(holder.position.y.toFixed(2)),
        z: Number(holder.position.z.toFixed(2)),
      },
      rotationY: Number(holder.rotation.y.toFixed(3)),
      scale: Number(holder.scale.x.toFixed(3)),
    };
  }
  console.log('CONFIG =', JSON.stringify(layout, null, 2));
  console.log('Copy the object above into CONFIG at the top of main.js to keep this arrangement.');
}

/* ------------------------------------------------------------------
   Resize + render loop
------------------------------------------------------------------ */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05); // clamp so a stalled tab doesn't jump-cut physics
  orbit.update();
  updateDrag(dt);
  updatePhysics(dt);
  updateFlashes(dt);
  drawPlayhead();
  renderer.render(scene, camera);
}

init().catch((err) => {
  console.error(err);
  document.getElementById('loading').textContent = 'Failed to load scene — check console.';
});
