/* =========================
   Config general
   ========================= */

// ⚠️ Cambiá esto por tu WhatsApp (Argentina ejemplo: 549381XXXXXXX)
const WHATSAPP_NUMBER = "5493810000000";

// Mensaje base para WhatsApp
const BASE_MESSAGE = "Hola! Quiero hacer un pedido en Panadería Delicias. ";

// Productos (podés agregar más)
const products = [
  {
    id: "facturas",
    name: "Facturas surtidas",
    category: "dulce",
    price: "$ Consultar",
    img: "img/factura.png",
    tag: "Dulce",
    desc: "Surtidas y frescas. Ideales para mate o café. Se entregan por docena o media docena."
  },
  {
    id: "medialunas",
    name: "Medialunas",
    category: "dulce",
    price: "$ Consultar",
    img: "img/medialuna.png",
    tag: "Dulce",
    desc: "Clásicas, tiernas y con buen dorado. Dulces o saladas según stock."
  },
  {
    id: "pan-casero",
    name: "Pan casero",
    category: "pan",
    price: "$ Consultar",
    img: "img/pan-casero.png",
    tag: "Pan",
    desc: "Miga suave, corteza fina. Perfecto para sandwich o tostadas."
  },
  {
    id: "budin",
    name: "Budín marmolado",
    category: "dulce",
    price: "$ Consultar",
    img: "img/budin.png",
    tag: "Dulce",
    desc: "Marmolado húmedo y rendidor. Ideal para compartir."
  },
  {
    id: "chipa",
    name: "Chipá",
    category: "salado",
    price: "$ Consultar",
    img: "img/chipa.png",
    tag: "Salado",
    desc: "Bien quesoso, crocante por fuera y suave por dentro. ¡Un clásico!"
  },
  {
    id: "miga",
    name: "Sándwich de miga",
    category: "salado",
    price: "$ Consultar",
    img: "img/sandwich-miga.png",
    tag: "Salado",
    desc: "Jamón y queso (y variantes). Consultá por bandejas para eventos."
  }
];

// DOM
const grid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");

// Modal producto
const pmTitle = document.getElementById("pmTitle");
const pmImg = document.getElementById("pmImg");
const pmDesc = document.getElementById("pmDesc");
const pmTag = document.getElementById("pmTag");
const pmPrice = document.getElementById("pmPrice");
const pmWhatsapp = document.getElementById("pmWhatsapp");
const qtyInput = document.getElementById("qtyInput");
const qtyMinus = document.getElementById("qtyMinus");
const qtyPlus = document.getElementById("qtyPlus");

// Botones WhatsApp generales
const btnWhatsappNav = document.getElementById("btnWhatsappNav");
const btnWhatsappCta = document.getElementById("btnWhatsappCta");
const btnWhatsappFloat = document.getElementById("btnWhatsappFloat");
const btnWhatsappPromo = document.getElementById("btnWhatsappPromo");
const btnWhatsappCombo = document.getElementById("btnWhatsappCombo");
const btnWhatsappComboModal = document.getElementById("btnWhatsappComboModal");
const btnWhatsappHistoria = document.getElementById("btnWhatsappHistoria");

// Contador año
document.getElementById("year").textContent = new Date().getFullYear();

/* =========================
   Helpers
   ========================= */

// Arma link de WhatsApp con texto
function whatsappLink(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

// Setea links base
function setGlobalWhatsAppLinks() {
  const msg = BASE_MESSAGE + "¿Me pasás el catálogo y precios?";
  const link = whatsappLink(msg);

  btnWhatsappNav.href = link;
  btnWhatsappCta.href = link;
  btnWhatsappFloat.href = link;
  btnWhatsappHistoria.href = whatsappLink(BASE_MESSAGE + "Hola! Quiero consultar sobre la panadería 😊");
  btnWhatsappPromo.href = whatsappLink(BASE_MESSAGE + "Quiero pedir la *Promo del día*. ¿Qué incluye y precio?");
  btnWhatsappCombo.href = whatsappLink(BASE_MESSAGE + "Quiero pedir el *Combo Merienda Completa*.");
  btnWhatsappComboModal.href = whatsappLink(BASE_MESSAGE + "Quiero pedir el *Combo Merienda Completa*.");
}

setGlobalWhatsAppLinks();

/* =========================
   Render productos
   ========================= */

function productCardTemplate(p) {
  return `
    <div class="col-sm-6 col-lg-4 reveal" data-cat="${p.category}">
      <div class="product-card card h-100">
        <div class="product-media">
          <!-- Imagen local, NO se recorta por CSS -->
          <img src="${p.img}" alt="${p.name}">
        </div>
        <div class="card-body p-4 d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start gap-2">
            <h5 class="fw-bold mb-1">${p.name}</h5>
            <span class="pill">${p.tag}</span>
          </div>

          <p class="text-muted mb-3">${p.desc}</p>

          <div class="mt-auto d-flex justify-content-between align-items-center gap-2 flex-wrap">
            <div class="price">
              <span class="price-label">Precio sugerido</span>
              <span class="price-value">${p.price}</span>
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-outline-brand btn-sm" data-action="view" data-id="${p.id}" data-bs-toggle="modal" data-bs-target="#productModal">
                Ver
              </button>
              <a class="btn btn-brand btn-sm" target="_blank" rel="noopener"
                 href="${whatsappLink(BASE_MESSAGE + "Quiero pedir: *" + p.name + "* (cantidad a confirmar).")}">
                <i class="bi bi-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderProducts(list) {
  grid.innerHTML = list.map(productCardTemplate).join("");
  attachCardEvents();
  revealOnScroll(); // recalcula reveal en nuevos nodos
}

renderProducts(products);

/* =========================
   Filtros: búsqueda + categoría
   ========================= */

function applyFilters() {
  const q = (searchInput.value || "").toLowerCase().trim();
  const cat = categorySelect.value;

  const filtered = products.filter(p => {
    const matchesText =
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.tag.toLowerCase().includes(q);

    const matchesCat = (cat === "all") ? true : (p.category === cat);

    return matchesText && matchesCat;
  });

  renderProducts(filtered);
}

searchInput.addEventListener("input", applyFilters);
categorySelect.addEventListener("change", applyFilters);

/* =========================
   Modal producto (dinámico)
   ========================= */

let currentProduct = null;

function attachCardEvents() {
  document.querySelectorAll('[data-action="view"]').forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      currentProduct = products.find(x => x.id === id);
      openProductModal(currentProduct);
    });
  });
}

function openProductModal(p) {
  if (!p) return;

  pmTitle.textContent = p.name;
  pmImg.src = p.img;
  pmImg.alt = p.name;
  pmDesc.textContent = p.desc;
  pmTag.textContent = p.tag;
  pmPrice.textContent = p.price;

  // Reinicia cantidad
  qtyInput.value = 1;

  // Link WhatsApp con cantidad
  pmWhatsapp.href = whatsappLink(
    BASE_MESSAGE + `Quiero pedir: *${p.name}* — Cantidad: ${qtyInput.value}.`
  );
}

// Qty buttons
qtyMinus.addEventListener("click", () => {
  const v = Math.max(1, Number(qtyInput.value || 1) - 1);
  qtyInput.value = v;
  if (currentProduct) {
    pmWhatsapp.href = whatsappLink(BASE_MESSAGE + `Quiero pedir: *${currentProduct.name}* — Cantidad: ${v}.`);
  }
});
qtyPlus.addEventListener("click", () => {
  const v = Number(qtyInput.value || 1) + 1;
  qtyInput.value = v;
  if (currentProduct) {
    pmWhatsapp.href = whatsappLink(BASE_MESSAGE + `Quiero pedir: *${currentProduct.name}* — Cantidad: ${v}.`);
  }
});
qtyInput.addEventListener("input", () => {
  const v = Math.max(1, Number(qtyInput.value || 1));
  qtyInput.value = v;
  if (currentProduct) {
    pmWhatsapp.href = whatsappLink(BASE_MESSAGE + `Quiero pedir: *${currentProduct.name}* — Cantidad: ${v}.`);
  }
});

/* =========================
   Animaciones: reveal on scroll
   ========================= */
function revealOnScroll() {
  const els = document.querySelectorAll(".reveal");

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
}

revealOnScroll();

/* =========================
   Contadores en hero
   ========================= */
function animateCounters() {
  const counters = document.querySelectorAll(".count");
  counters.forEach(c => {
    const target = Number(c.getAttribute("data-count") || 0);
    let current = 0;
    const steps = 40;
    const inc = Math.max(1, Math.round(target / steps));

    const timer = setInterval(() => {
      current += inc;
      if (current >= target) {
        c.textContent = target;
        clearInterval(timer);
      } else {
        c.textContent = current;
      }
    }, 18);
  });
}

// Dispara contadores cuando el hero entra
const hero = document.querySelector(".hero");
const heroObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounters();
      heroObs.disconnect();
    }
  });
}, { threshold: 0.3 });

heroObs.observe(hero);