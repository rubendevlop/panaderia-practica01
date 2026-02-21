/* ===========================
   Panadería Aurora — index.js
   (placeholder WhatsApp)
=========================== */

/** ✅ Cambiá SOLO este número (formato internacional sin +, sin espacios) */
const WHATSAPP_NUMBER = "5490000000000";

/** ✅ Productos (usan tus imágenes locales en /img) */
const PRODUCTS = [
  {
    id: "factura",
    title: "Factura",
    tag: "Dulce",
    category: "dulce",
    price: "$2.200",
    img: "img/factura.png",
    desc: "Clásica factura artesanal. Ideal para acompañar el mate o el café."
  },
  {
    id: "medialuna",
    title: "Medialuna",
    tag: "Dulce",
    category: "dulce",
    price: "$1.900",
    img: "img/medialuna.png",
    desc: "Medialuna hojaldrada, brillo perfecto y sabor mantecoso."
  },
  {
    id: "pan-casero",
    title: "Pan casero",
    tag: "Salado",
    category: "salado",
    price: "$3.800",
    img: "img/pan-casero.png",
    desc: "Pan casero de miga esponjosa y corteza crocante. Perfecto para tostadas."
  },
  {
    id: "budin",
    title: "Budín",
    tag: "Dulce",
    category: "dulce",
    price: "$3.200",
    img: "img/budin.png",
    desc: "Budín húmedo y suave. Ideal para compartir en la merienda."
  },
  {
    id: "chipa",
    title: "Chipá",
    tag: "Salado",
    category: "salado",
    price: "$2.600",
    img: "img/chipa.png",
    desc: "Chipá calentito, con queso y una textura irresistible."
  },
  {
    id: "sandwich-miga",
    title: "Sándwich de miga",
    tag: "Salado",
    category: "salado",
    price: "$4.500",
    img: "img/sandwich-miga.png",
    desc: "Sándwich de miga prolijo y fresco. Ideal para oficina o eventos."
  }
];

/* ===========================
   Helpers
=========================== */
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

function encodeText(text) {
  return encodeURIComponent(text);
}

function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeText(message)}`;
}

/* ===========================
   Render productos
=========================== */
const grid = $("#gridProducts");

function productCard(p) {
  // Card (usa clases de tu CSS)
  return `
    <article class="pCard reveal" data-cat="${p.category}">
      <div class="pTop">
        <span class="pTag">${p.tag}</span>
        <span class="pricePill">${p.price}</span>
      </div>

      <div class="pImgWrap">
        <img src="${p.img}" alt="${p.title}" loading="lazy" />
      </div>

      <div class="pBody">
        <h3 class="pTitle">${p.title}</h3>
        <p class="pDesc">${p.desc}</p>
      </div>

      <div class="pBottom">
        <button class="pBtn" data-open="${p.id}">Ver detalle</button>
        <a class="pBtn" href="${waLink(`Hola Aurora! Quiero pedir: ${p.title} 😊`)}" target="_blank" rel="noopener">
          Pedir
        </a>
      </div>
    </article>
  `;
}

function renderProducts(list) {
  if (!grid) return;
  grid.innerHTML = list.map(productCard).join("");

  // Re-enganchar eventos de abrir modal
  $$("[data-open]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-open");
      const prod = PRODUCTS.find(x => x.id === id);
      if (prod) openModal(prod);
    });
  });

  // Activar reveal para los nuevos nodos
  setupReveal(); // crea observer si no existe y observa
}

/* ===========================
   Filtros (chips)
=========================== */
let currentFilter = "todos";

function setActiveChip(filter) {
  $$(".chip").forEach(c => c.classList.remove("isActive"));
  $$(".chip").forEach(c => {
    if (c.dataset.filter === filter) c.classList.add("isActive");
  });
}

function filterProducts(filter) {
  currentFilter = filter;
  setActiveChip(filter);

  const cards = $$("#gridProducts .pCard");
  cards.forEach(card => {
    const cat = card.getAttribute("data-cat");
    const show = filter === "todos" || cat === filter;
    card.style.display = show ? "" : "none";
  });
}

function initFilters() {
  $$(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter;
      filterProducts(filter);
    });
  });
}

/* ===========================
   Modal producto
=========================== */
const modal = $("#modal");
const mImg = $("#mImg");
const mTag = $("#mTag");
const mTitle = $("#mTitle");
const mDesc = $("#mDesc");
const mPrice = $("#mPrice");
const mWhats = $("#mWhats");

function openModal(prod) {
  if (!modal) return;

  mImg.src = prod.img;
  mImg.alt = prod.title;
  mTag.textContent = prod.tag;
  mTitle.textContent = prod.title;
  mDesc.textContent = prod.desc;
  mPrice.textContent = prod.price;

  mWhats.href = waLink(`Hola Aurora! Quiero pedir: ${prod.title} (${prod.price}) 😊`);

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function initModal() {
  if (!modal) return;

  // Click en backdrop o botones con data-close
  modal.addEventListener("click", (e) => {
    const el = e.target;
    if (el && el.getAttribute && el.getAttribute("data-close") === "1") {
      closeModal();
    }
  });

  // Esc para cerrar
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
}

/* ===========================
   Menú mobile
=========================== */
const btnMenu = $("#btnMenu");
const menuMobile = $("#menuMobile");

function initMobileMenu() {
  if (!btnMenu || !menuMobile) return;

  btnMenu.addEventListener("click", () => {
    menuMobile.classList.toggle("hidden");
  });

  // cerrar al clickear un link
  $$("a", menuMobile).forEach(a => {
    a.addEventListener("click", () => menuMobile.classList.add("hidden"));
  });
}

/* ===========================
   Reveal on scroll (IntersectionObserver)
=========================== */
let revealObserver = null;

function setupReveal() {
  const nodes = $$(".reveal");
  if (!nodes.length) return;

  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          ent.target.classList.add("isIn");
          revealObserver.unobserve(ent.target);
        }
      });
    }, { threshold: 0.12 });
  }

  nodes.forEach(n => {
    if (!n.classList.contains("isIn")) revealObserver.observe(n);
  });
}

/* ===========================
   Scroll helpers
=========================== */
const btnScrollOpiniones = $("#btnScrollOpiniones");

function initScrollButtons() {
  if (btnScrollOpiniones) {
    btnScrollOpiniones.addEventListener("click", () => {
      const target = $("#opiniones");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

/* ===========================
   Promo del día (simple)
=========================== */
const btnPromo = $("#btnPromo");

function initPromo() {
  if (!btnPromo) return;

  // Rotación por día (estable)
  const promos = [
    { title: "Promo Facturas", msg: "2 docenas de facturas + 10% off 🎁" },
    { title: "Promo Medialunas", msg: "12 medialunas + regalo sorpresa ☕" },
    { title: "Promo Combo Mañana", msg: "Combo “Mañana completa” con descuento 🥐🍞" },
    { title: "Promo Salado", msg: "Chipá + sándwich de miga a precio especial 🧀" }
  ];
  const idx = new Date().getDate() % promos.length;
  const promo = promos[idx];

  btnPromo.addEventListener("click", () => {
    alert(`${promo.title}\n\n${promo.msg}\n\nPedilo por WhatsApp 😉`);
  });
}

/* ===========================
   Form → WhatsApp
=========================== */
const formMsg = $("#formMsg");
const fNombre = $("#fNombre");
const fZona = $("#fZona");
const fPedido = $("#fPedido");
const fNotas = $("#fNotas");
const btnLimpiar = $("#btnLimpiar");

function initForm() {
  if (!formMsg) return;

  formMsg.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = (fNombre?.value || "").trim();
    const zona = (fZona?.value || "").trim();
    const pedido = (fPedido?.value || "").trim();
    const notas = (fNotas?.value || "").trim();

    const parts = [
      `Hola Aurora! Soy ${nombre}.`,
      `Zona: ${zona}.`,
      `Quiero pedir: ${pedido}.`
    ];
    if (notas) parts.push(`Notas: ${notas}.`);

    parts.push("😊");

    const msg = parts.join(" ");
    window.open(waLink(msg), "_blank", "noopener");
  });

  if (btnLimpiar) {
    btnLimpiar.addEventListener("click", () => {
      if (fNombre) fNombre.value = "";
      if (fZona) fZona.value = "";
      if (fPedido) fPedido.value = "";
      if (fNotas) fNotas.value = "";
      fNombre?.focus?.();
    });
  }
}

/* ===========================
   Año en footer
=========================== */
function setYear() {
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());
}

/* ===========================
   Navbar compact al scrollear
=========================== */
const nav = $("#nav");

function initNavCompact() {
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 18) nav.classList.add("navIsCompact");
    else nav.classList.remove("navIsCompact");
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ===========================
   Init
=========================== */
document.addEventListener("DOMContentLoaded", () => {
  setYear();
  initMobileMenu();
  initModal();
  initFilters();
  initScrollButtons();
  initPromo();
  initForm();
  initNavCompact();

  renderProducts(PRODUCTS);
  filterProducts("todos");
  setupReveal();
});