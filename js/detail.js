document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const gameId = parseInt(params.get("id"));
  checkLoginStatus();

  if (typeof games === "undefined") {
    console.error("Lỗi: Không tìm thấy biến 'games' từ data.js.");
    return;
  }

  const game = games.find((g) => g.id === gameId);
  if (!game) {
    document.querySelector(".detail-wrapper").innerHTML =
      `<h1 style="text-align:center; padding:100px;">Hệ thống không tìm thấy game (ID: ${gameId})</h1>`;
    return;
  }

  // 1. Đổ dữ liệu cơ bản
  document.getElementById("game-title-side").innerText =
    game.title || "Tên game";
  document.getElementById("game-desc-full").innerText =
    game.description || "Đang cập nhật...";
  document.getElementById("developer").innerText =
    game.developer || "Đang cập nhật";
  document.getElementById("publisher").innerText =
    game.publisher || "Đang cập nhật";
  document.getElementById("release-date").innerText =
    game.releaseDate || "Sắp ra mắt";
  document.getElementById("price-val").innerText =
    (game.price ? game.price.toLocaleString() : "0") + " đ";

  const posterImg = document.getElementById("game-poster");
  if (posterImg) posterImg.src = game.img || "";

  if (game.oldPrice && document.getElementById("old-price-val")) {
    document.getElementById("old-price-val").innerText =
      game.oldPrice.toLocaleString() + " đ";
  }

  // 2. Đổ Tags
  const tagBox = document.getElementById("side-tags");
  if (tagBox) {
    tagBox.innerHTML = (game.categories || ["Action"])
      .map((c) => `<span class="tag">${c}</span>`)
      .join("");
  }

  // 3. Xử lý Nút bấm (Quan trọng nhất)
  const btnAddCart = document.getElementById("btn-add-cart");
  if (btnAddCart) {
    if (isGameOwned(game.id)) {
      // Nếu đã mua: Đổi thành nút Thư viện
      btnAddCart.innerHTML = `<i class="fas fa-gamepad"></i> VÀO THƯ VIỆN`;
      btnAddCart.style.background = "linear-gradient(90deg, #00d4ff, #0088ff)"; // Màu xanh dương cho nổi
      btnAddCart.onclick = () => {
        window.location.href = "library.html";
      };
    } else {
      // Nếu chưa mua: Giữ nguyên nút thêm vào giỏ
      btnAddCart.onclick = () => addToCartDetail(game.id);
    }
  }

  // 4. Media Gallery
  renderMediaGallery(game);
  updateCartBadge();
});

// --- CÁC HÀM HỖ TRỢ ---

function isGameOwned(gameId) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return false;
  const userLibraryKey = `ownedGames_${currentUser.username}`;
  const ownedGames = JSON.parse(localStorage.getItem(userLibraryKey)) || [];
  return ownedGames.some((id) => Number(id) === Number(gameId));
}

function addToCartDetail(gameId) {
  if (isGameOwned(gameId)) {
    showToast("Game này đã có trong Thư viện!", "info");
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    showToast("Vui lòng đăng nhập để thêm game vào giỏ hàng!", "error");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart.includes(gameId)) {
    cart.push(gameId);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
    showToast("Đã thêm vào giỏ hàng!");
  } else {
    showToast("Game này có trong giỏ rồi!");
  }
}

function renderMediaGallery(game) {
  const mainMedia = document.getElementById("main-media");
  const thumbBox = document.getElementById("thumb-gallery");
  if (!mainMedia || !thumbBox) return;

  window.updatePreview = (type, src, element) => {
    document
      .querySelectorAll(".thumb-item")
      .forEach((el) => el.classList.remove("active"));
    if (element) element.classList.add("active");
    mainMedia.innerHTML =
      type === "video"
        ? `<iframe src="https://www.youtube.com/embed/${src}?autoplay=1&mute=1" frameborder="0" allowfullscreen></iframe>`
        : `<img src="${src}" style="width:100%; border-radius:4px; animation: fadeIn 0.4s;">`;
  };

  let thumbHtml = "";
  if (game.trailer) {
    thumbHtml += `<div class="thumb-item active" onclick="updatePreview('video', '${game.trailer}', this)">
                    <img src="${game.img}"><i class="fas fa-play video-icon"></i>
                  </div>`;
    updatePreview("video", game.trailer, null);
  } else {
    updatePreview("image", game.img, null);
  }

  const listImg = game.screenshots || [game.img];
  listImg.forEach((img) => {
    thumbHtml += `<div class="thumb-item" onclick="updatePreview('image', '${img}', this)">
                    <img src="${img}">
                  </div>`;
  });
  thumbBox.innerHTML = thumbHtml;
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (badge) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    badge.innerText = cart.length;
    badge.style.display = cart.length > 0 ? "flex" : "none";
  }
}

function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function checkLoginStatus() {
  const authArea = document.getElementById("auth-buttons");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (authArea && currentUser && currentUser.isLoggedIn) {
    authArea.innerHTML = `
      <div class="user-menu">
        <a href="#" class="user-info"><i class="fas fa-user-circle"></i> ${currentUser.username}</a>
        <ul class="dropdown-user">
          <li><a href="profile.html">Hồ sơ</a></li>
          <li><a href="library.html">Thư viện</a></li>
          <li><hr></li>
          <li><a href="#" onclick="localStorage.removeItem('currentUser'); window.location.reload();">Đăng xuất</a></li>
        </ul>
      </div>`;
  }
}
