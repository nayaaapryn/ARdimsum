// Shared 3D Models for Dimsum PJS
function createDimsumGroup(item, THREE) {
  const mainModel = new THREE.Group();
  const friedColor = 0xD4A373;

function addSiomay(group, x, z, count, skinColorOverride) {
  const siomayProfile = [
    new THREE.Vector2(0, 0), new THREE.Vector2(0.24, 0),
    new THREE.Vector2(0.26, 0.04), new THREE.Vector2(0.25, 0.1),
    new THREE.Vector2(0.23, 0.18), new THREE.Vector2(0.2, 0.24),
    new THREE.Vector2(0.18, 0.27), new THREE.Vector2(0.22, 0.29),
    new THREE.Vector2(0.19, 0.31), new THREE.Vector2(0.15, 0.32),
  ];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const r = count > 3 ? 0.52 : 0.42;
    const px = count === 1 ? x : x + Math.cos(a) * r;
    const pz = count === 1 ? z : z + Math.sin(a) * r;
    const skinGeo = new THREE.LatheGeometry(siomayProfile, 16);
    const skinMat = new THREE.MeshStandardMaterial({ color: skinColorOverride || 0xF0D8A0, roughness: 0.5, metalness: 0.02 });
    const skin = new THREE.Mesh(skinGeo, skinMat);
    skin.position.set(px, 0.09, pz);
    skin.castShadow = true;
    group.add(skin);
    for (let j = 0; j < 6; j++) {
      const ra = (j / 6) * Math.PI * 2;
      const ridgeGeo = new THREE.BoxGeometry(0.008, 0.22, 0.03);
      const ridgeMat = new THREE.MeshStandardMaterial({ color: skinColorOverride ? 0xC88A3A : 0xE0C888 });
      const ridge = new THREE.Mesh(ridgeGeo, ridgeMat);
      ridge.position.set(px + Math.cos(ra) * 0.24, 0.22, pz + Math.sin(ra) * 0.24);
      ridge.rotation.y = -ra;
      group.add(ridge);
    }
    const meatGeo = new THREE.SphereGeometry(0.14, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const meatMat = new THREE.MeshStandardMaterial({ color: skinColorOverride ? 0xB06A2A : 0xD4A06A, roughness: 0.35 });
    const meat = new THREE.Mesh(meatGeo, meatMat);
    meat.position.set(px, 0.38, pz);
    group.add(meat);
    
    if (!skinColorOverride) {
      const topGeo = new THREE.SphereGeometry(0.05, 8, 8);
      const topMat = new THREE.MeshStandardMaterial({ color: 0xE63946, roughness: 0.25 });
      const top = new THREE.Mesh(topGeo, topMat);
      top.position.set(px, 0.46, pz);
      group.add(top);
    }
  }
}

function addUdang(group, x, z, count) {
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const r = count > 3 ? 0.52 : 0.42;
    const px = count === 1 ? x : x + Math.cos(a) * r;
    const pz = count === 1 ? z : z + Math.sin(a) * r;
    const boxGeo = new THREE.BoxGeometry(0.5, 0.15, 0.3);
    const pos = boxGeo.attributes.position;
    for(let v=0; v<pos.count; v++){
      if(pos.getY(v) < 0) {
         pos.setX(v, pos.getX(v) * 0.9);
         pos.setZ(v, pos.getZ(v) * 0.9);
      }
    }
    boxGeo.computeVertexNormals();
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xFFEFD5, roughness: 0.6 });
    const base = new THREE.Mesh(boxGeo, skinMat);
    base.position.set(px, 0.15, pz);
    base.castShadow = true;
    group.add(base);
    // Rumbai / Frills memanjang
    for (let f = 0; f < 6; f++) {
      const frillL = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.15), new THREE.MeshStandardMaterial({ color: 0xFFEFD5, side: THREE.DoubleSide }));
      frillL.position.set(px - 0.25, 0.2, pz - 0.1 + (f * 0.04));
      frillL.rotation.y = -Math.PI / 2 + (Math.random() * 0.2);
      frillL.rotation.x = (Math.random() * 0.3);
      group.add(frillL);
      const frillR = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.15), new THREE.MeshStandardMaterial({ color: 0xFFEFD5, side: THREE.DoubleSide }));
      frillR.position.set(px + 0.25, 0.2, pz - 0.1 + (f * 0.04));
      frillR.rotation.y = Math.PI / 2 + (Math.random() * 0.2);
      frillR.rotation.x = (Math.random() * 0.3);
      group.add(frillR);
    }
  }
}

function addNori(group, x, z, count) {
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const r = 0.45;
    const px = x + Math.cos(a) * r;
    const pz = z + Math.sin(a) * r;
    const wrapGeo = new THREE.CylinderGeometry(0.23, 0.25, 0.22, 16);
    const wrapMat = new THREE.MeshStandardMaterial({ color: 0x1A3320, roughness: 0.7 });
    const wrap = new THREE.Mesh(wrapGeo, wrapMat);
    wrap.position.set(px, 0.18, pz);
    wrap.castShadow = true;
    group.add(wrap);
    for (let j = 0; j < 4; j++) {
      const la = (j / 4) * Math.PI * 2;
      const lg = new THREE.BoxGeometry(0.005, 0.18, 0.02);
      const lm = new THREE.MeshStandardMaterial({ color: 0x0D1A10 });
      const ln = new THREE.Mesh(lg, lm);
      ln.position.set(px + Math.cos(la) * 0.235, 0.18, pz + Math.sin(la) * 0.235);
      ln.rotation.y = -la;
      group.add(ln);
    }
    const topWrap = new THREE.LatheGeometry([
      new THREE.Vector2(0, 0), new THREE.Vector2(0.22, 0),
      new THREE.Vector2(0.2, 0.06), new THREE.Vector2(0.15, 0.12),
      new THREE.Vector2(0.08, 0.15), new THREE.Vector2(0, 0.16)
    ], 12);
    const topMat = new THREE.MeshStandardMaterial({ color: 0xF0D8A0, roughness: 0.45 });
    const topMesh = new THREE.Mesh(topWrap, topMat);
    topMesh.position.set(px, 0.28, pz);
    group.add(topMesh);
    const dotGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const dotMat = new THREE.MeshStandardMaterial({ color: 0xE63946 });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.set(px, 0.46, pz);
    group.add(dot);
  }
}

function addKepitingHelper(group, x, z, count) {
  addSiomay(group, x, z, count, 0xFF6B6B); // Red skin
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const r = count > 3 ? 0.52 : 0.42;
    const px = count === 1 ? x : x + Math.cos(a) * r;
    const pz = count === 1 ? z : z + Math.sin(a) * r;
    for (let s = 0; s < 10; s++) {
      const stickGeo = new THREE.BoxGeometry(0.08, 0.01, 0.015);
      const stickMat = new THREE.MeshStandardMaterial({ color: 0xCC0000 });
      const stick = new THREE.Mesh(stickGeo, stickMat);
      stick.position.set(px + (Math.random() - 0.5) * 0.12, 0.45 + Math.random() * 0.02, pz + (Math.random() - 0.5) * 0.12);
      stick.rotation.y = Math.random() * Math.PI;
      group.add(stick);
    }
  }
}

if (item.shape === 'siomay') {
  addSiomay(mainModel, 0, 0, parseInt(item.pcs)||3);
} else if (item.shape === 'ayam_goreng') {
  addSiomay(mainModel, 0, 0, parseInt(item.pcs)||3, 0xD4923A); // golden brown
} else if (item.shape === 'paket2') {
  // 4 Ayam, 3 Nori, 3 Udang (10 items)
  const pts = [
    {x: 0, z: 0}, // 1
    {x: 0.45, z: 0}, {x: -0.22, z: 0.39}, {x: -0.22, z: -0.39}, // 3
    {x: 0.85, z: 0}, {x: 0.42, z: 0.73}, {x: -0.42, z: 0.73}, {x: -0.85, z: 0}, {x: -0.42, z: -0.73}, {x: 0.42, z: -0.73} // 6
  ];
  [0, 1, 2, 3].forEach(i => addSiomay(mainModel, pts[i].x, pts[i].z, 1));
  [4, 5, 6].forEach(i => addNori(mainModel, pts[i].x, pts[i].z, 1));
  [7, 8, 9].forEach(i => addUdang(mainModel, pts[i].x, pts[i].z, 1));
} else if (item.shape === 'paket3') {
  // 4 Ayam, 3 Udang, 3 Kepiting (10 items)
  const pts = [
    {x: 0, z: 0}, // 1
    {x: 0.45, z: 0}, {x: -0.22, z: 0.39}, {x: -0.22, z: -0.39}, // 3
    {x: 0.85, z: 0}, {x: 0.42, z: 0.73}, {x: -0.42, z: 0.73}, {x: -0.85, z: 0}, {x: -0.42, z: -0.73}, {x: 0.42, z: -0.73} // 6
  ];
  // Assign: Ayam(4), Udang(3), Kepiting(3)
  [0, 1, 2, 3].forEach(i => addSiomay(mainModel, pts[i].x, pts[i].z, 1));
  [4, 5, 6].forEach(i => addUdang(mainModel, pts[i].x, pts[i].z, 1));
  [7, 8, 9].forEach(i => addKepitingHelper(mainModel, pts[i].x, pts[i].z, 1));
} else if (item.shape === 'paket4') {
  // 4 Ayam, 3 Nori, 3 Kepiting (10 items)
  const pts = [
    {x: 0, z: 0}, // 1
    {x: 0.45, z: 0}, {x: -0.22, z: 0.39}, {x: -0.22, z: -0.39}, // 3
    {x: 0.85, z: 0}, {x: 0.42, z: 0.73}, {x: -0.42, z: 0.73}, {x: -0.85, z: 0}, {x: -0.42, z: -0.73}, {x: 0.42, z: -0.73} // 6
  ];
  [0, 1, 2, 3].forEach(i => addSiomay(mainModel, pts[i].x, pts[i].z, 1));
  [4, 5, 6].forEach(i => addNori(mainModel, pts[i].x, pts[i].z, 1));
  [7, 8, 9].forEach(i => addKepitingHelper(mainModel, pts[i].x, pts[i].z, 1));
} else if (item.shape === 'udang') {
  addUdang(mainModel, 0, 0, parseInt(item.pcs)||3);
} else if (item.shape === 'nori') {
  addNori(mainModel, 0, 0, parseInt(item.pcs)||3);
} else if (item.shape === 'kepiting') {
  addKepitingHelper(mainModel, 0, 0, parseInt(item.pcs)||3);
} else if (item.shape === 'mozarella') {
  addSiomay(mainModel, 0, 0, parseInt(item.pcs));
  const cnt = parseInt(item.pcs);
  for (let i = 0; i < cnt; i++) {
    const a = (i / cnt) * Math.PI * 2;
    const r = cnt > 3 ? 0.5 : 0.4;
    const px = cnt === 1 ? 0 : Math.cos(a) * r;
    const pz = cnt === 1 ? 0 : Math.sin(a) * r;
    // Keju meleleh tidak beraturan
    const cheeseGeo = new THREE.SphereGeometry(0.22, 16, 12, 0, Math.PI*2, 0, Math.PI*0.5);
    const pos = cheeseGeo.attributes.position;
    for(let v=0; v<pos.count; v++) {
      if(pos.getY(v) < 0.1) {
         pos.setY(v, pos.getY(v) - Math.random() * 0.1); // leleh ke bawah
      }
    }
    cheeseGeo.computeVertexNormals();
    const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xFFFDD0, roughness: 0.1, metalness: 0.1 });
    const cheese = new THREE.Mesh(cheeseGeo, cheeseMat);
    cheese.position.set(px, 0.42, pz);
    cheese.scale.set(1, 0.5, 1);
    mainModel.add(cheese);
  }
} else if (item.shape === 'mentai') {
  addNori(mainModel, 0, 0, parseInt(item.pcs));
  const cnt = parseInt(item.pcs);
  for (let i = 0; i < cnt; i++) {
    const a = (i / cnt) * Math.PI * 2;
    const px = Math.cos(a) * 0.45;
    const pz = Math.sin(a) * 0.45;
    const sauceGeo = new THREE.CylinderGeometry(0.19, 0.2, 0.05, 12);
    const sauceMat = new THREE.MeshStandardMaterial({ color: 0xF4845F, roughness: 0.15, metalness: 0.2 });
    const sauce = new THREE.Mesh(sauceGeo, sauceMat);
    sauce.position.set(px, 0.46, pz);
    mainModel.add(sauce);
  }
} else if (item.shape === 'rambutan') {
  const cnt = parseInt(item.pcs);
  for (let i = 0; i < cnt; i++) {
    const a = (i / cnt) * Math.PI * 2;
    const px = Math.cos(a) * 0.4;
    const pz = Math.sin(a) * 0.4;
    const ballGeo = new THREE.IcosahedronGeometry(0.15, 1);
    const ballMat = new THREE.MeshStandardMaterial({ color: friedColor, roughness: 0.6 });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.set(px, 0.32, pz);
    ball.castShadow = true;
    mainModel.add(ball);
    // Tambah banyak duri rambut mie
    for (let h = 0; h < 60; h++) {
      const hairGeo = new THREE.BoxGeometry(0.015, 0.25, 0.015);
      const hairMat = new THREE.MeshStandardMaterial({ color: friedColor });
      const hair = new THREE.Mesh(hairGeo, hairMat);
      const phi = Math.acos(-1 + (2 * h) / 60);
      const theta = Math.sqrt(60 * Math.PI) * phi;
      const hx = Math.sin(phi) * Math.cos(theta);
      const hy = Math.sin(phi) * Math.sin(theta);
      const hz = Math.cos(phi);
      hair.position.set(px + hx * 0.15, 0.32 + hy * 0.15, pz + hz * 0.15);
      hair.lookAt(px, 0.32, pz);
      mainModel.add(hair);
    }
  }
} else if (item.shape === 'lumpia') {
  for (let i = 0; i < 3; i++) {
    const geo = new THREE.CylinderGeometry(0.12, 0.12, 0.7, 8);
    const mat = new THREE.MeshStandardMaterial({ color: friedColor, roughness: 0.5 });
    const m = new THREE.Mesh(geo, mat);
    m.rotation.z = Math.PI / 2;
    m.position.set(0, 0.22, -0.25 + i * 0.25);
    m.castShadow = true;
    mainModel.add(m);
  }
} else if (item.shape === 'eggroll') {
  for (let i = 0; i < 4; i++) {
    const geo = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8);
    const mat = new THREE.MeshStandardMaterial({ color: 0xC8923A, roughness: 0.5 });
    const m = new THREE.Mesh(geo, mat);
    m.rotation.z = Math.PI / 2;
    m.position.set(0, 0.18, -0.3 + i * 0.2);
    m.castShadow = true;
    mainModel.add(m);
    const mayoGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.5, 4);
    const mayoMat = new THREE.MeshStandardMaterial({ color: 0xFFFFF0 });
    const mayo = new THREE.Mesh(mayoGeo, mayoMat);
    mayo.rotation.z = Math.PI / 2;
    mayo.position.set(0, 0.28, -0.3 + i * 0.2);
    mainModel.add(mayo);
  }
} else if (item.shape === 'balls') {
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const geo = new THREE.SphereGeometry(0.22, 24, 24);
    const pos = geo.attributes.position;
    for(let v=0; v<pos.count; v++) {
      // Beri displacement acak untuk efek kasar (tepung panir)
      const dx = (Math.random() - 0.5) * 0.02;
      const dy = (Math.random() - 0.5) * 0.02;
      const dz = (Math.random() - 0.5) * 0.02;
      pos.setX(v, pos.getX(v) + dx);
      pos.setY(v, pos.getY(v) + dy);
      pos.setZ(v, pos.getZ(v) + dz);
    }
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ color: friedColor, roughness: 0.9 });
    const ball = new THREE.Mesh(geo, mat);
    ball.position.set(Math.cos(a) * 0.35, 0.3, Math.sin(a) * 0.35);
    ball.castShadow = true;
    mainModel.add(ball);
  }
} else if (item.shape === 'keju') {
  // 2 Utuh
  for (let i = 0; i < 2; i++) {
    // Menggunakan CylinderGeometry bukan Capsule untuk r128
    const geo = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16);
    const mat = new THREE.MeshStandardMaterial({ color: friedColor, roughness: 0.6 });
    const m = new THREE.Mesh(geo, mat);
    m.rotation.z = Math.PI / 2;
    m.position.set(0, 0.25, -0.3 + i * 0.4);
    m.castShadow = true;
    mainModel.add(m);
    
    const cap1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 8), mat);
    cap1.position.set(0.2, 0.25, -0.3 + i * 0.4);
    mainModel.add(cap1);
    const cap2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 8), mat);
    cap2.position.set(-0.2, 0.25, -0.3 + i * 0.4);
    mainModel.add(cap2);
  }
  // 1 Terpotong
  const halfGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 16);
  const halfMat = new THREE.MeshStandardMaterial({ color: friedColor, roughness: 0.6 });
  const half = new THREE.Mesh(halfGeo, halfMat);
  half.rotation.z = Math.PI / 2;
  half.rotation.y = Math.PI / 4;
  half.position.set(0.2, 0.25, 0.3);
  half.castShadow = true;
  mainModel.add(half);
  // Isi Keju leleh di potongannya
  const oozeGeo = new THREE.SphereGeometry(0.14, 12, 12);
  const pos = oozeGeo.attributes.position;
  for(let v=0; v<pos.count; v++) {
    if(pos.getX(v) < 0) {
       pos.setX(v, pos.getX(v) - 0.1);
       if(pos.getY(v) < 0) pos.setY(v, pos.getY(v) - 0.05);
    }
  }
  oozeGeo.computeVertexNormals();
  const oozeMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.2 });
  const ooze = new THREE.Mesh(oozeGeo, oozeMat);
  ooze.position.set(0.05, 0.25, 0.3);
  ooze.rotation.y = Math.PI / 4;
  mainModel.add(ooze);
} else if (item.shape === 'bakar') {
  const bakarGroup = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const g = new THREE.Group();
    // Warna ayam panggang kecoklatan, tanpa topping dot merah
    addSiomay(g, 0, 0, 1, 0x8B4513);
    
    // Lapisan glaze saus bakar transparan dan mengkilap
    const glazeGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const glazeMat = new THREE.MeshStandardMaterial({ color: 0x5C2005, roughness: 0.1, transparent: true, opacity: 0.5 });
    const glaze = new THREE.Mesh(glazeGeo, glazeMat);
    glaze.position.set(0, 0.25, 0);
    g.add(glaze);

    // Siomay di-stack secara vertikal
    g.position.set(0, -0.4 + i * 0.4, 0);
    bakarGroup.add(g);
  }

  // Tusuk sate menembus bagian tengah dimsum vertikal
  const stickGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.8, 6);
  const stickMat = new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.8 });
  const stick = new THREE.Mesh(stickGeo, stickMat);
  stick.position.set(0, 0, 0);
  bakarGroup.add(stick);

  // Baringkan seluruh sate di atas piring/steamer
  bakarGroup.rotation.z = -Math.PI / 2;
  bakarGroup.position.set(0, 0.25, 0);
  mainModel.add(bakarGroup);
}

  return mainModel;
}
