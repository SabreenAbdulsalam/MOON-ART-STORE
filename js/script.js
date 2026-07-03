let storeData = [];
let wishlist = JSON.parse(localStorage.getItem("moonWishlist")) || [];

const mainContent = document.getElementById("main-content");

// ===============================
// Store
// ===============================
function loadStore() {
  mainContent.innerHTML = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
  storeData.forEach((section, index) => {
    let sectionHTML = `

<section id="section-${index}">

<h2 class="section-title">
${section.title}
</h2>

<div class="slider">
`;

    section.products.forEach((product, index) => {
      let liked = wishlist.includes(product.name);
      sectionHTML += `
<div class="product-card"
onclick="zoomProduct(this)">
<div class="product-image">

<img src="images/${section.prefix}_${index + 1}.jpg" loading="lazy">

<button
class="fav-btn ${liked ? "active" : ""}"
onclick="toggleWishlist(event,this,'${product.name}')">

<i class="bi ${liked ? "bi-heart-fill" : "bi-heart"}"></i>

</button>

</div>

<div class="product-info">

<h3>${product.name}</h3>

<p class="product-desc">
${product.desc}
</p>

<div class="price">
${product.price}
<span>ر.ي</span>
</div>

<button
class="add-cart-btn"
onclick="event.stopPropagation();flyToCart(this);addToCart('${product.name}',${product.price},this)">
 أضف للسلة

</button>
</div>

</div>

`;
    });

    sectionHTML += `
</div>
</section>
`;
    mainContent.insertAdjacentHTML("beforeend", sectionHTML);
  });
}

function toggleSearch() {
  document.getElementById("searchBox").classList.toggle("active");
}
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

let cartKey = currentUser ? "cart_" + currentUser.email : "moonCart";

let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
updateUserHeader();
updateCart();
updateFavCount();

// ===============================
// Cart
// ===============================
function toggleCart() {
  let drawer = document.getElementById("cartDrawer");

  let overlay = document.getElementById("cart-overlay");

  drawer.classList.toggle("active");

  overlay.classList.toggle("active");
}

function openCart() {
  document.getElementById("cartDrawer").classList.add("active");

  document.getElementById("cart-overlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("active");

  document.getElementById("cart-overlay").classList.remove("active");
  document.body.style.overflow = "";
}
function addToCart(name, price, button) {
  let found = cart.find((item) => item.name === name);

  if (found) {
    found.qty++;
  } else {
    cart.push({
      name: name,
      price: price,
      qty: 1,
    });
  }

  updateCart();
  localStorage.setItem(cartKey, JSON.stringify(cart));
  if (button) {
    button.innerHTML = "✓ تمت الإضافة";

    button.disabled = true;

    setTimeout(() => {
      button.innerHTML = " أضف للسلة";

      button.disabled = false;
    }, 1500);
  }
}

function updateCart() {
  const list = document.getElementById("cart-items-list");

  const total = document.getElementById("cart-total");

  if (!list || !total) return;

  if (cart.length === 0) {
    list.innerHTML = "السلة فارغة";

    total.innerHTML = 0;
    document.querySelector(".cart-count-bag").innerHTML = cart.reduce(
      (a, b) => a + b.qty,
      0,
    );

    return;
  }
  let count = document.getElementById("cart-items-count");

  if (count) {
    count.innerHTML = cart.reduce((a, b) => a + b.qty, 0);
  }

  let html = "";
  let sum = 0;

  cart.forEach((item, index) => {
    sum += item.price * item.qty;

    html += `

        <div class="cart-item">

            <div>

                <h6>${item.name}</h6>

                <b>${item.price * item.qty} ر.ي</b>

            </div>

            <div class="qty-box">

                <button onclick="changeQty(${index},-1)">
                −
                </button>

                <span>${item.qty}</span>

                <button onclick="changeQty(${index},1)">
                +
                </button>

            </div>

        </div>

        `;
  });

  list.innerHTML = html;

  total.innerHTML = sum;

  document.querySelector(".cart-count-bag").innerHTML = cart.reduce(
    (a, b) => a + b.qty,
    0,
  );
}
function changeQty(index, value) {
  cart[index].qty += value;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  updateCart();

  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function goToWhatsApp() {
  if (cart.length === 0) {
    alert("السلة فارغة");

    return;
  }

  let message = "السلام عليكم 🌙\n\nأرغب بطلب:\n\n";

  let total = 0;

  cart.forEach((item) => {
    message += `${item.name} × ${item.qty}\n`;

    total += item.price * item.qty;
  });

  message += `\nعدد المنتجات: ${cart.reduce((a, b) => a + b.qty, 0)}`;

  message += `\nالإجمالي: ${total} ر.ي`;

  let phone = "967782925967";

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
}

// ===========================
// Floating Advertisement
// ===========================
function showAd() {
  const ad = document.getElementById("floatingAd");
  const video = document.getElementById("adVideo");

  if (!ad || !video) return;

  video.src = video.src;

  ad.style.display = "block";

  setTimeout(() => {
    ad.style.display = "none";
  }, 10000);
}
function closeAd() {
  const ad = document.getElementById("floatingAd");
  const video = document.getElementById("adVideo");

  ad.style.display = "none";
}
window.addEventListener("load", () => {
  // أول ظهور بعد 10 ثوانٍ
  setTimeout(() => {
    showAd();

    // يتكرر كل 20 ثانية
    setInterval(showAd, 20000);
  }, 10000);
});
function toggleWishlist(event, button, name) {
  event.stopPropagation();

  const icon = button.querySelector("i");

  if (wishlist.includes(name)) {
    wishlist = wishlist.filter((item) => item !== name);

    button.classList.remove("active");

    icon.className = "bi bi-heart";
  } else {
    wishlist.push(name);

    button.classList.add("active");

    icon.className = "bi bi-heart-fill";
  }

  localStorage.setItem("moonWishlist", JSON.stringify(wishlist));
  renderFavorites();
  updateFavCount();
}
// ===========================
// Fly Product To Cart
// ===========================

function flyToCart(button) {
  const img = button
    .closest(".product-card")
    .querySelector(".product-image img");

  const cart = document.querySelector(".icon-btn .bi-bag-heart").parentElement;

  const clone = img.cloneNode(true);

  clone.classList.add("fly-product");

  document.body.appendChild(clone);

  const start = img.getBoundingClientRect();

  const end = cart.getBoundingClientRect();

  clone.style.left = start.left + "px";
  clone.style.top = start.top + "px";

  setTimeout(() => {
    clone.style.left = end.left + 8 + "px";

    clone.style.top = end.top + 8 + "px";

    clone.style.transform = "scale(.25) rotate(720deg)";

    clone.style.opacity = "0";
  }, 20);

  setTimeout(() => {
    clone.remove();
  }, 950);
}
function zoomProduct(card) {
  const overlay = document.getElementById("zoomOverlay");

  overlay.classList.add("active");

  card.classList.add("zoomed");

  document.body.classList.add("no-scroll");

  overlay.onclick = function () {
    overlay.classList.remove("active");

    card.classList.remove("zoomed");

    document.body.classList.remove("no-scroll");
  };
}
// =====================
// User System
// =====================

function openLogin() {
  document.getElementById("userModal").classList.add("active");

  document.getElementById("user-title").innerText = "تسجيل الدخول";

  // إظهار الحقول الصحيحة
  document.getElementById("userEmail").style.display = "block";

  document.getElementById("userPassword").style.display = "block";

  document.getElementById("userName").style.display = "none";

  // تنظيف البيانات القديمة
  document.getElementById("userName").value = "";
  document.getElementById("userEmail").value = "";
  document.getElementById("userPassword").value = "";

  document.querySelector(".user-btn").style.display = "block";
}

function openRegister() {
  document.getElementById("userModal").classList.add("active");

  document.getElementById("user-title").innerText = "إنشاء حساب ✨";

  document.getElementById("userName").style.display = "block";

  document.getElementById("userEmail").style.display = "block";

  document.getElementById("userPassword").style.display = "block";

  document.getElementById("userName").value = "";
  document.getElementById("userEmail").value = "";
  document.getElementById("userPassword").value = "";

  document.querySelector(".user-btn").style.display = "block";

  document.querySelector(".user-btn").innerText = "إنشاء حساب";
}

function closeUser() {
  document.getElementById("userModal").classList.remove("active");
}

let usersData = [];

// تحميل المستخدمين

fetch("data/users.json")
  .then((res) => res.json())

  .then((data) => {
    usersData = data;
  })

  .catch(() => {});

// تسجيل الدخول

function loginUser() {
  let email = document.getElementById("userEmail").value;

  let password = document.getElementById("userPassword").value;

  let user = usersData.find(
    (u) => u.email === email && u.password === password,
  );

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));

    alert("تم تسجيل الدخول ✨");

    closeUser();
  } else {
    alert("البريد أو كلمة المرور غير صحيحة");
  }
}

function registerUser() {
  let name = document.getElementById("userName").value;

  let email = document.getElementById("userEmail").value;

  let password = document.getElementById("userPassword").value;

  if (!name || !email || !password) {
    alert("أكمل البيانات");

    return;
  }

  let newUser = {
    name: name,

    email: email,

    password: password,
  };

  usersData.push(newUser);

  localStorage.setItem("currentUser", JSON.stringify(newUser));

  alert("تم إنشاء الحساب ✨");

  closeUser();
}

// الحساب

function openProfile() {
  let user = JSON.parse(localStorage.getItem("currentUser"));

  if (user) {
    document.getElementById("userModal").classList.add("active");

    document.getElementById("user-title").innerText = "حسابي ✨";

    document.getElementById("userName").style.display = "block";

    document.getElementById("userName").value = user.name;

    document.getElementById("userEmail").value = user.email;

    document.getElementById("userPassword").style.display = "none";

    document.querySelector(".user-btn").style.display = "none";
  } else {
    openLogin();
  }
}
function updateUserHeader() {
  let user = JSON.parse(localStorage.getItem("currentUser"));

  let icon = document.querySelector(".user-icon");

  if (user && icon) {
    icon.innerHTML = `<i class="bi bi-person-check"></i>
<span>${user.name}</span>`;
  }
}
function deleteAccount() {
  if (!confirm("هل أنت متأكد من حذف الحساب؟")) return;

  localStorage.removeItem("currentUser");

  alert("تم حذف الحساب من هذا الجهاز.");

  closeUser();
}
// =====================
// Menu System
// =====================
function toggleMenu() {
  document.getElementById("mainMenu").classList.toggle("active");
}

function closeMenu() {
  document.getElementById("mainMenu").classList.remove("active");
}

// تحميل عناصر القائمة من المنتجات
fetch("data/products.json")
  .then((res) => res.json())
  .then((data) => {
    storeData = data;

    loadStore(); // عرض المنتجات
    buildMenu(); // بناء القائمة
  });
function buildMenu() {
  let menu = document.getElementById("mainMenu");

  let html = `
    <div class="menu-item" onclick="
loadStore();

document.querySelectorAll('section').forEach(s => {
  s.classList.remove('active-section');
  s.classList.remove('flash');
});

closeMenu();
"
      <i class="bi bi-grid"></i>
      كل الأقسام
    </div>

    <div class="menu-line"></div>

    <div class="menu-item" onclick="toggleSearch();closeMenu()">
      <i class="bi bi-search"></i>
      البحث
    </div>

    <div class="menu-item" onclick="openFavorites();closeMenu()">
      <i class="bi bi-heart"></i>
      المفضلة
    </div>

    <div class="menu-item" onclick="toggleCart();closeMenu()">
      <i class="bi bi-bag-heart"></i>
      السلة
    </div>

    <div class="menu-item" onclick="toggleTheme();closeMenu()">
      <i class="bi bi-moon-stars"></i>
      الوضع الليلي
    </div>

    <div class="menu-line"></div>

    <div class="menu-item" onclick="openLogin();closeMenu()">
      <i class="bi bi-person"></i>
      تسجيل الدخول
    </div>

    <div class="menu-item" onclick="openRegister();closeMenu()">
      <i class="bi bi-person-plus"></i>
      إنشاء حساب
    </div>

    <div class="menu-item" onclick="openProfile();closeMenu()">
      <i class="bi bi-person-circle"></i>
      حسابي
    </div>

    <div class="menu-line"></div>
  `;
  storeData.forEach((section, index) => {
    html += `
    <div class="menu-item"
onclick="
const el = document.getElementById('section-${index}');
if(el){
  el.scrollIntoView({behavior:'smooth', block:'start'});

  el.classList.add('flash');

  setTimeout(() => {
    el.classList.remove('flash');
    el.classList.add('active-section');
  }, 800);
}

closeMenu();
"
    <i class="bi bi-stars"></i>
      ${section.title}
    </div>
  `;
  });
  menu.innerHTML = html;
}
// ===============================
// Search
// ===============================
function searchProducts() {
  let text = document.getElementById("searchInput").value.toLowerCase().trim();

  if (text === "") {
    loadStore();

    return;
  }

  let html = "";

  let found = false;

  storeData.forEach((section, index) => {
    section.products.forEach((product, index) => {
      if (
        product.name.toLowerCase().includes(text) ||
        product.desc.toLowerCase().includes(text)
      ) {
        found = true;

        html += `

<div class="product-card">

<div class="product-image">

<img src="images/${section.prefix}_${index + 1}.jpg">

</div>


<div class="product-info">

<h3>${product.name}</h3>

<p class="product-desc">

${product.desc}

</p>


<div class="price">

${product.price}

<span>ر.ي</span>

</div>


<button class="add-cart-btn"
onclick="addToCart('${product.name}',${product.price},this)">

أضف للسلة

</button>


</div>

</div>

`;
      }
    });
  });

  if (found) {
    mainContent.innerHTML = `<div class="slider">${html}</div>`;
  } else {
    mainContent.innerHTML = `
<h2 style="text-align:center">
لا يوجد نتائج ✨
</h2>
`;
  }
}
// ===============================
// Theme
// ===============================
function toggleTheme() {
  document.body.classList.toggle("light-mode");

  const icon = document.querySelector(
    ".icon-btn i.bi-moon-stars, .icon-btn i.bi-sun",
  );

  if (document.body.classList.contains("light-mode")) {
    icon.classList.remove("bi-moon-stars");
    icon.classList.add("bi-sun");
  } else {
    icon.classList.remove("bi-sun");
    icon.classList.add("bi-moon-stars");
  }

  localStorage.setItem("theme", document.body.classList.contains("light-mode"));
}
window.addEventListener("load", () => {
  if (localStorage.getItem("theme") == "true") {
    document.body.classList.add("light-mode");

    const icon = document.querySelector(".icon-btn i");
    if (icon) {
      icon.classList.remove("bi-moon-stars");
      icon.classList.add("bi-sun");
    }
  }
});
function clearCart() {
  if (cart.length === 0) {
    showToast("السلة فارغة");

    return;
  }

  cart = [];

  updateCart();

  showToast("تم إخلاء السلة 🗑️");
}
function openFavorites() {
  let box = document.getElementById("favoritesBox");

  box.classList.toggle("active");

  if (box.classList.contains("active")) {
    renderFavorites();
  }
}

function closeFavorites() {
  document.getElementById("favoritesBox").classList.remove("active");
}
function renderFavorites() {
  const list = document.getElementById("favoritesList");

  list.innerHTML = "";

  if (wishlist.length === 0) {
    list.innerHTML =
      "<p style='color:white;text-align:center'>لا توجد منتجات في المفضلة ❤️</p>";

    return;
  }

  let foundCount = 0;

  storeData.forEach((section) => {
    section.products.forEach((product, index) => {
      if (wishlist.includes(product.name)) {
        foundCount++;

        list.innerHTML += `

<div class="cart-item">


<img src="images/${section.prefix}_${index + 1}.jpg"
style="width:80px;border-radius:12px">


<div>

<h6>${product.name}</h6>

<p>${product.desc}</p>

<b>${product.price} ر.ي</b>

</div>


</div>

`;
      }
    });
  });

  if (foundCount === 0) {
    list.innerHTML =
      "<p style='color:white;text-align:center'>لا توجد منتجات في المفضلة ❤️</p>";
  }
}

function clearFavorites() {
  wishlist = [];

  localStorage.setItem("moonWishlist", JSON.stringify(wishlist));

  renderFavorites();

  loadStore();

  updateFavCount();

  showToast("تم مسح المفضلة ❤️");
}

function updateFavCount() {
  let count = document.querySelector(".fav-count");

  if (count) {
    count.innerHTML = wishlist.length;
  }
}
updateFavCount();

function closeMenu() {
  document.querySelector(".main-menu").classList.remove("active");
  document.body.classList.remove("menu-open");
}
function openMenu() {
  document.querySelector(".main-menu").classList.add("active");
  document.querySelector(".menu-overlay").classList.add("active");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  document.querySelector(".main-menu").classList.remove("active");
  document.querySelector(".menu-overlay").classList.remove("active");
  document.body.classList.remove("menu-open");
}
function goHome() {
  const home = document.getElementById("main-content");

  home.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
