
// ===== DATA LOADED FROM js/data.js =====

// ===== CART STATE =====
let cart = [];
let selectedOutlet = null;
let selectedPayment = null;
let transferProofBase64 = null;

// formatRp diurus oleh data.js

// ===== SPLASH SCREEN =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if(splash) splash.classList.add('hidden');
  }, 2500);
});

// ===== NAVBAR =====
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const mobileMenu= document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  if(navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
});
if(navToggle){
  navToggle.addEventListener('click', () => mobileMenu.classList.toggle('open'));
}
document.querySelectorAll('.mobile-link, .nav-link').forEach(link => {
  link.addEventListener('click', () => { if(mobileMenu) mobileMenu.classList.remove('open'); });
});

// ===== RENDER MENU CARDS =====
function renderMenu(filter='all'){
  const grid = document.getElementById('menu-grid');
  if(!grid) return;
  const filtered = filter === 'all' ? menuItems : menuItems.filter(i => i.category === filter);
  grid.innerHTML = filtered.map(item => `
    <div class="menu-card" data-id="${item.id}">
      <div class="card-image" onclick="open3DViewer(${item.id})">
        <img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:12px 12px 0 0;" onerror="this.src='assets/images/dimsum_ayam.jpeg'">
        ${item.badge ? `<span class="card-badge">${item.badge}</span>` : ''}
        <div class="card-3d-icon"><i class="fas fa-cube"></i></div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${item.name}</h3>
        ${item.desc ? `<p class="card-desc">${item.desc}</p>` : `<p class="card-desc">${item.pcs}</p>`}
        <div class="card-footer">
          <span class="card-price">${formatRp(item.price)}</span>
          <button class="card-action btn-add-cart" onclick="addToCart(${item.id})" aria-label="Tambah ke keranjang">
            <i class="fas fa-cart-plus"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== EXTRAS LOGIC & CART =====
let currentExtraItemId = null;
let extraMentaiQty = 0;
let extraMozzaQty = 0;
let extraSaosQty = 0;

function addToCart(id){
  currentExtraItemId = id;
  const item = menuItems.find(i => i.id === id);
  if (!item) return;

  document.getElementById('extra-item-name').textContent = item.name;
  document.getElementById('extra-item-price').textContent = formatRp(item.price);
  
  if (item.shape === 'udang') {
    document.getElementById('extra-mentai-section').style.display = 'none';
  } else {
    document.getElementById('extra-mentai-section').style.display = 'block';
  }

  extraMentaiQty = 0;
  extraMozzaQty = 0;
  extraSaosQty = 0;
  
  document.getElementById('extra-mentai-qty').textContent = extraMentaiQty;
  document.getElementById('extra-mozza-qty').textContent = extraMozzaQty;
  document.getElementById('extra-saos-qty').textContent = extraSaosQty;

  updateExtrasTotal();
  document.getElementById('extras-modal').classList.add('open');
}

function closeExtrasModal() {
  document.getElementById('extras-modal').classList.remove('open');
}

function changeExtraQty(type, delta) {
  if (type === 'mentai') {
    extraMentaiQty += delta;
    if (extraMentaiQty < 0) extraMentaiQty = 0;
    document.getElementById('extra-mentai-qty').textContent = extraMentaiQty;
  } else if (type === 'mozza') {
    extraMozzaQty += delta;
    if (extraMozzaQty < 0) extraMozzaQty = 0;
    document.getElementById('extra-mozza-qty').textContent = extraMozzaQty;
  } else if (type === 'saos') {
    extraSaosQty += delta;
    if (extraSaosQty < 0) extraSaosQty = 0;
    document.getElementById('extra-saos-qty').textContent = extraSaosQty;
  }
  updateExtrasTotal();
}

function updateExtrasTotal() {
  const item = menuItems.find(i => i.id === currentExtraItemId);
  if (!item) return;
  
  let total = item.price;
  total += extraMentaiQty * 4000;
  total += extraMozzaQty * 6000;
  total += extraSaosQty * 5000;
  
  document.getElementById('extra-total-price').textContent = formatRp(total);
}

function confirmExtrasAndAdd() {
  const item = menuItems.find(i => i.id === currentExtraItemId);
  if (!item) return;
  
  let unitPrice = item.price;
  let extrasDesc = [];
  
  if (extraMentaiQty > 0) {
    unitPrice += extraMentaiQty * 4000;
    extrasDesc.push(extraMentaiQty + ' Mentai');
  }
  if (extraMozzaQty > 0) {
    unitPrice += extraMozzaQty * 6000;
    extrasDesc.push(extraMozzaQty + ' Mozza');
  }
  if (extraSaosQty > 0) {
    unitPrice += extraSaosQty * 5000;
    extrasDesc.push(extraSaosQty + ' Saos');
  }
  
  const cartItemId = item.id + '_' + extraMentaiQty + '_' + extraMozzaQty + '_' + extraSaosQty;
  const displayName = extrasDesc.length > 0 ? `${item.name} (+ ${extrasDesc.join(', ')})` : item.name;
  
  const existing = cart.find(c => c.cartItemId === cartItemId);
  if(existing){
    existing.qty++;
  } else {
    cart.push({ ...item, cartItemId, displayName, unitPrice, qty:1 });
  }
  
  closeExtrasModal();
  updateCartUI();
  showCartToast(displayName);
  openCart();
}

function removeFromCart(cartItemId){
  cart = cart.filter(c => c.cartItemId !== cartItemId);
  updateCartUI();
}

function changeQty(cartItemId, delta){
  const item = cart.find(c => c.cartItemId === cartItemId);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) removeFromCart(cartItemId);
  else updateCartUI();
}

function getCartTotal(){
  return cart.reduce((sum,i) => sum + i.unitPrice * i.qty, 0);
}

function getCartCount(){
  return cart.reduce((sum,i) => sum + i.qty, 0);
}

function updateCartUI(){
  const count = getCartCount();
  const total = getCartTotal();
  // badge
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
  // list
  const listEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const emptyEl = document.getElementById('cart-empty');
  const footerEl = document.getElementById('cart-footer');
  if(!listEl) return;
  if(cart.length === 0){
    listEl.innerHTML = '';
    if(emptyEl) emptyEl.style.display = 'flex';
    if(footerEl) footerEl.style.display = 'none';
  } else {
    if(emptyEl) emptyEl.style.display = 'none';
    if(footerEl) footerEl.style.display = 'block';
    listEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/images/dimsum_ayam.jpeg'">
        <div class="cart-item-info">
          <div class="cart-item-name" style="font-size:0.85rem; line-height:1.2;">${item.displayName}</div>
          <div class="cart-item-price">${formatRp(item.unitPrice)}</div>
        </div>
        <div class="cart-item-qty">
          <button onclick="changeQty('${item.cartItemId}',-1)"><i class="fas fa-minus"></i></button>
          <span>${item.qty}</span>
          <button onclick="changeQty('${item.cartItemId}',1)"><i class="fas fa-plus"></i></button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.cartItemId}')"><i class="fas fa-trash"></i></button>
      </div>
    `).join('');
  }
  if(totalEl) totalEl.textContent = formatRp(total);
}

function openCart(){
  document.getElementById('cart-sidebar')?.classList.add('open');
  document.getElementById('cart-overlay')?.classList.add('open');
}

function closeCart(){
  document.getElementById('cart-sidebar')?.classList.remove('open');
  document.getElementById('cart-overlay')?.classList.remove('open');
}

function showCartToast(name){
  const toast = document.getElementById('cart-toast');
  if(!toast) return;
  toast.textContent = `✅ ${name} ditambahkan!`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== ORDER MODAL =====
function openOrderModal(){
  if(cart.length === 0) return;
  closeCart();
  // reset
  selectedOutlet = null;
  selectedPayment = null;
  transferProofBase64 = null;
  renderOrderSummary();
  document.getElementById('order-modal')?.classList.add('open');
  document.getElementById('payment-section').style.display = 'none';
  document.getElementById('transfer-section').style.display = 'none';
  document.getElementById('btn-send-order').style.display = 'none';
  document.querySelectorAll('.outlet-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.payment-btn').forEach(b => b.classList.remove('active'));
}

function closeOrderModal(){
  document.getElementById('order-modal')?.classList.remove('open');
}

function renderOrderSummary(){
  const el = document.getElementById('order-summary-list');
  if(!el) return;
  el.innerHTML = cart.map(item => `
    <div class="order-summary-item">
      <span class="order-item-name">${item.displayName} <span class="order-item-qty">x${item.qty}</span></span>
      <span class="order-item-subtotal">${formatRp(item.unitPrice * item.qty)}</span>
    </div>
  `).join('') + `
    <div class="order-summary-divider"></div>
    <div class="order-summary-total">
      <span>Total</span>
      <span>${formatRp(getCartTotal())}</span>
    </div>
  `;
}

function selectOutlet(outletId){
  selectedOutlet = outletId;
  document.querySelectorAll('.outlet-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.outlet === outletId);
  });
  document.getElementById('payment-section').style.display = 'block';
}

function selectPayment(method){
  selectedPayment = method;
  document.querySelectorAll('.payment-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.payment === method);
  });
  if(method === 'transfer'){
    document.getElementById('transfer-section').style.display = 'block';
  } else {
    document.getElementById('transfer-section').style.display = 'none';
    transferProofBase64 = null;
  }
  checkOrderReady();
}

function checkOrderReady(){
  const btnSend = document.getElementById('btn-send-order');
  if(!btnSend) return;
  const ready = selectedOutlet && selectedPayment &&
    (selectedPayment === 'tempat' || (selectedPayment === 'transfer' && transferProofBase64));
  btnSend.style.display = ready ? 'flex' : 'none';
}

function sendOrder(){
  if(!selectedOutlet || !selectedPayment) return;
  const outlet = OUTLETS.find(o => o.id === selectedOutlet);
  if(!outlet) return;
  const lines = cart.map(i => `• ${i.displayName} x${i.qty} = ${formatRp(i.unitPrice * i.qty)}`).join('\n');
  const total = formatRp(getCartTotal());
  const paymentLabel = selectedPayment === 'transfer' ? 'Transfer' : 'Bayar di Tempat';
  const msg =
`Halo Dimsum PJS Bintan 🥟

*PESANAN BARU*
Outlet: ${outlet.name}
Pembayaran: ${paymentLabel}

*Detail Pesanan:*
${lines}

*TOTAL: ${total}*

Terima kasih! 😊`;
  const waUrl = `https://wa.me/${outlet.wa}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
  if(selectedPayment === 'transfer' && transferProofBase64){
    alert('Silakan kirim juga bukti transfer Anda di chat WhatsApp ya! 📸');
  }
}

// ===== FILTER =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMenu(btn.dataset.filter);
  });
});

// ===== 3D VIEWER =====
let scene, camera, renderer, mainModel, autoRotate = true, animId, controls;

function open3DViewer(id){
  const item = menuItems.find(i => i.id === id);
  if(!item) return;
  const modal = document.getElementById('viewer-modal');
  document.getElementById('viewer-title').textContent = item.name;
  document.getElementById('viewer-desc').textContent = item.desc || item.pcs;
  document.getElementById('viewer-price').textContent = formatRp(item.price);
  modal.classList.add('open');
  setTimeout(() => init3D(item), 100);
  // update order button
  document.getElementById('btn-order').onclick = () => addToCart(id);
}

function init3D(item){
  const canvas = document.getElementById('viewer-canvas');
  if(!canvas) return;
  if(renderer){ renderer.dispose(); cancelAnimationFrame(animId); }
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111122);
  camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 3, 5);
  camera.lookAt(0, 0.5, 0);
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  if(window.THREE.OrbitControls){
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate; controls.autoRotateSpeed = 2.0;
    controls.minDistance = 2; controls.maxDistance = 10;
  }
  const ambient = new THREE.AmbientLight(0xffffff, 0.5); scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5,8,5); dirLight.castShadow = true; scene.add(dirLight);
  const pointLight = new THREE.PointLight(new THREE.Color(item.color), 0.6, 10);
  pointLight.position.set(-2,3,2); scene.add(pointLight);

  mainModel = new THREE.Group();
  
  // === DETAILED BAMBOO STEAMER ===
  const baseGeo = new THREE.CylinderGeometry(1.18, 1.25, 0.08, 48);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x9E8560, roughness: 0.9 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.receiveShadow = true;
  mainModel.add(base);
  for (let i = 0; i < 8; i++) {
    const lineGeo = new THREE.BoxGeometry(2.3, 0.012, 0.02);
    const lineMat = new THREE.MeshStandardMaterial({ color: 0x7A6840 });
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.position.y = 0.045;
    line.rotation.y = (i / 8) * Math.PI;
    mainModel.add(line);
  }
  const wallGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.65, 48, 1, true);
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xB89E6E, roughness: 0.65, side: THREE.DoubleSide });
  const wall = new THREE.Mesh(wallGeo, wallMat);
  wall.position.y = 0.37;
  mainModel.add(wall);
  for (let r = 0; r < 3; r++) {
    const ringGeo = new THREE.TorusGeometry(1.21, 0.02, 8, 48);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x7A6840, roughness: 0.7 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.15 + r * 0.2;
    mainModel.add(ring);
  }
  const rimGeo = new THREE.TorusGeometry(1.21, 0.035, 8, 48);
  const rimMat = new THREE.MeshStandardMaterial({ color: 0x6B5535, roughness: 0.6 });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.67;
  mainModel.add(rim);
  const paperGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.01, 48);
  const paperMat = new THREE.MeshStandardMaterial({ color: 0xFAF5E8, roughness: 0.95 });
  const paper = new THREE.Mesh(paperGeo, paperMat);
  paper.position.y = 0.08;
  mainModel.add(paper);

  // Dimsum items - accurate shapes per product
  const friedColor = 0xD4923A;

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
      const r = count > 3 ? 0.52 : 0.45;
      const px = count === 1 ? x : x + Math.cos(a) * r;
      const pz = count === 1 ? z : z + Math.sin(a) * r;
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

  const pcs = parseInt(item.pcs)||3;
  if (item.shape === 'siomay') {
    addSiomay(mainModel, 0, 0, pcs);
  } else if (item.shape === 'ayam_goreng') {
    addSiomay(mainModel, 0, 0, pcs, 0xD4923A); // golden brown
  } else if (item.shape === 'paket2') {
    // 4 Ayam, 3 Nori, 3 Udang (10 items)
    const pts = [
      {x: 0, z: 0}, // 1
      {x: 0.45, z: 0}, {x: -0.22, z: 0.39}, {x: -0.22, z: -0.39}, // 3
      {x: 0.85, z: 0}, {x: 0.42, z: 0.73}, {x: -0.42, z: 0.73}, {x: -0.85, z: 0}, {x: -0.42, z: -0.73}, {x: 0.42, z: -0.73} // 6
    ];
    // Assign: Ayam(4), Nori(3), Udang(3)
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
    addUdang(mainModel, 0, 0, pcs);
  } else if (item.shape === 'nori') {
    addNori(mainModel, 0, 0, pcs);
  } else if (item.shape === 'kepiting') {
    addKepitingHelper(mainModel, 0, 0, pcs);
  } else if (item.shape === 'mozarella') {
    addSiomay(mainModel, 0, 0, pcs);
    for (let i = 0; i < pcs; i++) {
      const a = (i / pcs) * Math.PI * 2;
      const r = pcs > 3 ? 0.5 : 0.4;
      const px = pcs === 1 ? 0 : Math.cos(a) * r;
      const pz = pcs === 1 ? 0 : Math.sin(a) * r;
      const cheeseGeo = new THREE.SphereGeometry(0.22, 16, 12, 0, Math.PI*2, 0, Math.PI*0.5);
      const pos = cheeseGeo.attributes.position;
      for(let v=0; v<pos.count; v++) {
        if(pos.getY(v) < 0.1) {
           pos.setY(v, pos.getY(v) - Math.random() * 0.1);
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
    addNori(mainModel, 0, 0, pcs);
    for (let i = 0; i < pcs; i++) {
      const a = (i / pcs) * Math.PI * 2;
      const px = Math.cos(a) * 0.45;
      const pz = Math.sin(a) * 0.45;
      const sauceGeo = new THREE.CylinderGeometry(0.19, 0.2, 0.05, 12);
      const sauceMat = new THREE.MeshStandardMaterial({ color: 0xF4845F, roughness: 0.15, metalness: 0.2 });
      const sauce = new THREE.Mesh(sauceGeo, sauceMat);
      sauce.position.set(px, 0.46, pz);
      mainModel.add(sauce);
    }
  } else if (item.shape === 'rambutan') {
    for (let i = 0; i < pcs; i++) {
      const a = (i / pcs) * Math.PI * 2;
      const px = Math.cos(a) * 0.4;
      const pz = Math.sin(a) * 0.4;
      const ballGeo = new THREE.IcosahedronGeometry(0.15, 1);
      const ballMat = new THREE.MeshStandardMaterial({ color: friedColor, roughness: 0.6 });
      const ball = new THREE.Mesh(ballGeo, ballMat);
      ball.position.set(px, 0.32, pz);
      ball.castShadow = true;
      mainModel.add(ball);
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
    for (let i = 0; i < pcs; i++) {
      const geo = new THREE.CylinderGeometry(0.12, 0.12, 0.7, 8);
      const mat = new THREE.MeshStandardMaterial({ color: friedColor, roughness: 0.5 });
      const m = new THREE.Mesh(geo, mat);
      m.rotation.z = Math.PI / 2;
      m.position.set(0, 0.22, -0.25 + i * 0.25);
      m.castShadow = true;
      mainModel.add(m);
    }
  } else if (item.shape === 'eggroll') {
    for (let i = 0; i < pcs; i++) {
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
    for (let i = 0; i < pcs; i++) {
      const a = (i / pcs) * Math.PI * 2;
      const geo = new THREE.SphereGeometry(0.22, 24, 24);
      const pos = geo.attributes.position;
      for(let v=0; v<pos.count; v++) {
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
    for (let i = 0; i < 2; i++) {
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
    const halfGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 16);
    const halfMat = new THREE.MeshStandardMaterial({ color: friedColor, roughness: 0.6 });
    const half = new THREE.Mesh(halfGeo, halfMat);
    half.rotation.z = Math.PI / 2;
    half.rotation.y = Math.PI / 4;
    half.position.set(0.2, 0.25, 0.3);
    half.castShadow = true;
    mainModel.add(half);
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

  const lid = new THREE.Mesh(new THREE.SphereGeometry(1.2,32,16,0,Math.PI*2,0,Math.PI*0.3), new THREE.MeshStandardMaterial({color:0x8B7355,roughness:0.6,transparent:true,opacity:0.3}));
  lid.position.y=0.7; mainModel.add(lid);
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,0.15,8), new THREE.MeshStandardMaterial({color:0x6B5335}));
  handle.position.y=1.05; mainModel.add(handle);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(6,6), new THREE.MeshStandardMaterial({color:0x1a1a2e}));
  floor.rotation.x=-Math.PI/2; floor.position.y=-0.08; scene.add(floor);

  const steamGeo = new THREE.BufferGeometry();
  const sp=[];
  for(let i=0;i<30;i++) sp.push((Math.random()-0.5)*1.5, 0.8+Math.random()*1.5, (Math.random()-0.5)*1.5);
  steamGeo.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));
  const steam = new THREE.Points(steamGeo, new THREE.PointsMaterial({color:0xffffff,size:0.06,transparent:true,opacity:0.3}));
  mainModel.add(steam);
  scene.add(mainModel);

  let time=0;
  function animate(){
    animId=requestAnimationFrame(animate); time+=0.016;
    if(controls) controls.update();
    if(steam){
      const pos=steam.geometry.attributes.position;
      for(let i=0;i<pos.count;i++){ pos.setY(i,pos.getY(i)+0.005); if(pos.getY(i)>2.5) pos.setY(i,0.8); }
      pos.needsUpdate=true; steam.material.opacity=0.15+Math.sin(time*2)*0.1;
    }
    renderer.render(scene,camera);
  }
  animate();
}

document.getElementById('close-viewer')?.addEventListener('click',()=>{ document.getElementById('viewer-modal').classList.remove('open'); if(renderer){renderer.dispose();cancelAnimationFrame(animId);} });
document.getElementById('ctrl-rotate')?.addEventListener('click',()=>{ autoRotate=!autoRotate; if(controls) controls.autoRotate=autoRotate; });
document.getElementById('ctrl-zoom-in')?.addEventListener('click',()=>{ if(camera) camera.position.z=Math.max(2,camera.position.z-0.5); });
document.getElementById('ctrl-zoom-out')?.addEventListener('click',()=>{ if(camera) camera.position.z=Math.min(10,camera.position.z+0.5); });
document.getElementById('ctrl-reset')?.addEventListener('click',()=>{ if(camera){camera.position.set(0,3,5);camera.lookAt(0,0.5,0);} autoRotate=true; });

// ===== AR MODE BUTTONS =====
document.querySelectorAll('.btn-mode').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const mode=btn.dataset.mode;
    if(mode==='viewer') open3DViewer(1);
    else if(mode==='ar') window.location.href='ar-camera.html';
    else if(mode==='marker') window.location.href='ar-marker.html';
  });
});

// ===== STAT COUNTER =====
function animateCounters(){
  document.querySelectorAll('.stat-number').forEach(el=>{
    const target=parseInt(el.dataset.count); let current=0;
    const step=Math.max(1,Math.floor(target/60));
    const timer=setInterval(()=>{ current+=step; if(current>=target){current=target;clearInterval(timer);} el.textContent=current+(target>=100?'+':''); },30);
  });
}
const observer=new IntersectionObserver(entries=>{ entries.forEach(e=>{ if(e.isIntersecting){ if(e.target.id==='home') animateCounters(); e.target.classList.add('visible'); } }); },{threshold:0.2});
document.querySelectorAll('section').forEach(s=>observer.observe(s));

// ===== ADDITIONAL CART LOGIC =====
const origUpdateCartUI = updateCartUI;
updateCartUI = function() {
  origUpdateCartUI();
  const count = getCartCount();
  const banner = document.getElementById('cart-banner');
  const bannerText = document.getElementById('cart-banner-text');
  if(banner) banner.style.display = count > 0 ? 'flex' : 'none';
  if(bannerText) bannerText.textContent = count + ' item · ' + formatRp(getCartTotal());
};

// ===== TRANSFER PROOF HANDLERS =====
window.handleProofUpload = function(event){
  const file = event.target.files[0];
  if(!file) return;
  if(file.size > 5*1024*1024){ alert('File terlalu besar! Maksimal 5MB.'); return; }
  const reader = new FileReader();
  reader.onload = function(e){
    transferProofBase64 = e.target.result;
    document.getElementById('proof-img').src = e.target.result;
    document.getElementById('proof-preview').style.display = 'block';
    document.getElementById('upload-area').style.display = 'none';
    document.getElementById('transfer-total-amount').textContent = formatRp(getCartTotal());
    checkOrderReady();
  };
  reader.readAsDataURL(file);
};

window.removeProof = function(){
  transferProofBase64 = null;
  document.getElementById('proof-img').src = '';
  document.getElementById('proof-preview').style.display = 'none';
  document.getElementById('upload-area').style.display = 'flex';
  document.getElementById('proof-input').value = '';
  checkOrderReady();
};

// ===== INIT =====
renderMenu();
updateCartUI();
