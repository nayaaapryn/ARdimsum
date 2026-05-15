function formatRp(n){ return "Rp "+n.toLocaleString("id-ID"); }

const menuItems = [
  // AYAM
  { id:1,  name:"Dimsum Ayam",            category:"ayam",    price:20000, badge:"Best Seller", pcs:"4 Pcs", image:"assets/images/dimsum_ayam.jpeg",     shape:"siomay",   color:"#F4A261" },
  { id:2,  name:"Dimsum Ayam Goreng",     category:"ayam",    price:20000, badge:"",            pcs:"4 Pcs", image:"assets/images/dimsum_ayam.jpeg",     shape:"ayam_goreng",   color:"#D4A373" },
  { id:3,  name:"Dimsum Ayam Mozzarella", category:"ayam",    price:26000, badge:"Favorit",     pcs:"4 Pcs", image:"assets/images/ayam_mozzarela.jpg", shape:"mozarella",color:"#FFD166" },
  { id:4,  name:"Dimsum Ayam Mentai",     category:"ayam",    price:24000, badge:"Spesial",     pcs:"4 Pcs", image:"assets/images/ayam_mentai.jpg",    shape:"mentai",   color:"#F4845F" },
  { id:5,  name:"Dimsum Ayam Bakar",      category:"ayam",    price:24000, badge:"Spesial",     pcs:"3 Pcs", image:"assets/images/dimsum_bakar.jpeg",     shape:"bakar",    color:"#BC6C25" },
  // NORI
  { id:6,  name:"Dimsum Nori",            category:"nori",    price:20000, badge:"",            pcs:"3 Pcs", image:"assets/images/dimsum_nori.jpeg",     shape:"nori",     color:"#2A9D8F" },
  { id:7,  name:"Dimsum Nori Mentai",     category:"nori",    price:24000, badge:"Spesial",     pcs:"3 Pcs", image:"assets/images/ayam_mentai.jpg",    shape:"mentai",   color:"#F4845F" },
  { id:8,  name:"Dimsum Nori Mozzarella", category:"nori",    price:26000, badge:"Favorit",     pcs:"3 Pcs", image:"assets/images/ayam_mozzarela.jpg", shape:"mozarella",color:"#FFD166" },
  // KEPITING
  { id:9,  name:"Dimsum Kepiting",        category:"kepiting",price:20000, badge:"Premium",     pcs:"3 Pcs", image:"assets/images/dimsum_kepiting.jpg",  shape:"kepiting", color:"#E63946" },
  { id:10, name:"Dimsum Kepiting Mentai", category:"kepiting",price:24000, badge:"Spesial",     pcs:"3 Pcs", image:"assets/images/ayam_mentai.jpg",    shape:"mentai",   color:"#F4845F" },
  { id:11, name:"Dimsum Kepiting Mozzarella",category:"kepiting",price:26000,badge:"Favorit",   pcs:"3 Pcs", image:"assets/images/ayam_mozzarela.jpg", shape:"mozarella",color:"#FFD166" },
  // UDANG
  { id:12, name:"Dimsum Udang",           category:"udang",   price:20000, badge:"Favorit",     pcs:"3 Pcs", image:"assets/images/dimsum_udang.jpeg",    shape:"udang",    color:"#E76F51" },
  { id:13, name:"Dimsum Udang Goreng",    category:"udang",   price:22000, badge:"",            pcs:"3 Pcs", image:"assets/images/dimsum_udang.jpeg",    shape:"lumpia",   color:"#D4A373" },
  // PAKET
  { id:14, name:"Paket 1",               category:"paket",   price:60000, badge:"Hemat",       pcs:"12 Pcs",image:"assets/images/dimsum_ayam.jpeg",     shape:"siomay",   color:"#F4A261",
    desc:"Dimsum Ayam 12 pcs" },
  { id:15, name:"Paket 2",               category:"paket",   price:60000, badge:"Hemat",       pcs:"10 Pcs",image:"assets/images/dimsum_ayam.jpeg",     shape:"paket2",   color:"#F4A261",
    desc:"Ayam 4pcs + Nori 3pcs + Udang 3pcs" },
  { id:16, name:"Paket 3",               category:"paket",   price:60000, badge:"Hemat",       pcs:"10 Pcs",image:"assets/images/dimsum_udang.jpeg",    shape:"paket3",    color:"#E76F51",
    desc:"Ayam 4pcs + Udang 3pcs + Kepiting 3pcs" },
  { id:17, name:"Paket 4",               category:"paket",   price:60000, badge:"Hemat",       pcs:"10 Pcs",image:"assets/images/dimsum_nori.jpeg",     shape:"paket4",     color:"#2A9D8F",
    desc:"Ayam 4pcs + Nori 3pcs + Kepiting 3pcs" },
  // LAINNYA
  { id:18, name:"Lumpia Kulit Tahu",     category:"lainnya", price:22000, badge:"",            pcs:"3 Pcs", image:"assets/images/lumpia_tahu.jpeg",     shape:"lumpia",   color:"#D4A373" },
  { id:19, name:"Lee Hong Kien",         category:"lainnya", price:22000, badge:"",            pcs:"4 Pcs", image:"assets/images/lee_hong_kien.jpeg",   shape:"eggroll",  color:"#DDA15E" },
  { id:20, name:"Dimsum Rambutan",       category:"lainnya", price:22000, badge:"Unik",        pcs:"3 Pcs", image:"assets/images/dimsum_rambutan.jpeg", shape:"rambutan", color:"#E8913A" },
  { id:21, name:"Dimsum Keju",           category:"lainnya", price:24000, badge:"Baru!",       pcs:"3 Pcs", image:"assets/images/dimsum_keju.jpeg",      shape:"keju",     color:"#FFD166" },
  { id:22, name:"Cheesy Ball",           category:"lainnya", price:22000, badge:"Favorit",     pcs:"3 Pcs", image:"assets/images/cheesy_ball.jpeg",     shape:"balls",    color:"#FFD166" },
];
