// 1. Khai báo biến toàn cục
let currentPage = 1;
const gamesPerPage = 20;
let currentCategory = "All";
let searchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
  updateCartBadge();
  renderCategories();
  renderGameGrid(1);

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      currentPage = 1;
      renderGameGrid(1);
    });
  }
});

function checkLoginStatus() {
  const authArea = document.getElementById("auth-buttons");
  if (!authArea) return;
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser && currentUser.isLoggedIn) {
    authArea.innerHTML = `
            <div class="user-menu">
                <a href="javascript:void(0)" class="user-info">
                    <i class="fas fa-user-circle"></i> ${currentUser.username}
                </a>
                <ul class="dropdown-user">
                    <li><a href="profile.html"><i class="fas fa-id-card"></i> Hồ sơ</a></li>
                    <li><a href="library.html"><i class="fas fa-gamepad"></i> Thư viện</a></li>
                    <li><hr></li>
                    <li><a href="javascript:void(0)" onclick="handleLogout()"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a></li>
                </ul>
            </div>
        `;
  }
}

function handleLogout() {
  localStorage.removeItem("currentUser");
  window.location.reload();
}

function buyNow(gameId) {
  addToCart(gameId);
  window.location.href = "cart.html";
}

// 3. Hàm Render chính
function renderGameGrid(page) {
  const gameContainer = document.getElementById("game-display");
  if (!gameContainer) return;

  const filteredGames = games.filter((game) => {
    const matchesCategory =
      currentCategory === "Tất cả" ||
      currentCategory === "All" ||
      game.categories.includes(currentCategory);

    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery) ||
      (game.developer && game.developer.toLowerCase().includes(searchQuery));

    return matchesCategory && matchesSearch;
  });

  const startIndex = (page - 1) * gamesPerPage;
  const gamesToShow = filteredGames.slice(
    startIndex,
    startIndex + gamesPerPage,
  );

  let htmlContent = "";
  if (gamesToShow.length === 0) {
    htmlContent = `<div style="grid-column: 1/-1; text-align: center; padding: 50px; color: #777;">
                        Không tìm thấy game nào phù hợp!
                       </div>`;
  } else {
    gamesToShow.forEach((game) => {
      const discountTag = game.oldPrice
        ? `<span class="discount">-${Math.round((1 - game.price / game.oldPrice) * 100)}%</span>`
        : "";

      // Check xem đã mua chưa để đổi nút bấm
      let buttonHTML = "";
      if (isGameOwned(game.id)) {
        buttonHTML = `
            <button class="btn-add-cart btn-owned" onclick="window.location.href='library.html'">
                <i class="fas fa-check-circle"></i> VÀO THƯ VIỆN
            </button>`;
      } else {
        buttonHTML = `
            <button class="btn-add-cart" onclick="addToCart(${game.id})">
                <i class="fas fa-cart-plus"></i> THÊM VÀO GIỎ
            </button>`;
      }

      htmlContent += `
                <div class="game-card">
                    <a href="detail.html?id=${game.id}" class="card-link">
                      <div class="card-img">
                          <img src="${game.img}" alt="${game.title}" loading="lazy">
                          ${discountTag}
                      </div>
                    </a>
                    <div class="game-info">
                        <p class="cate">${game.categories.join(" / ")}</p>
                        <h4 class="game-title">${game.title}</h4>
                        <div class="price-area">
                            <span class="current-price">${game.price.toLocaleString("vi-VN")} đ</span>
                            ${game.oldPrice ? `<span class="old-price">${game.oldPrice.toLocaleString("vi-VN")} đ</span>` : ""}
                        </div>
                    </div>
                    ${buttonHTML}
                </div>`;
    });
  }

  gameContainer.innerHTML = htmlContent;
  renderPagination(filteredGames.length);
}

// 4. Hàm tạo nút phân trang
function renderPagination(totalItems) {
  const paginationContainer = document.getElementById("pagination");
  if (!paginationContainer) return;

  const totalPages = Math.ceil(totalItems / gamesPerPage);
  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  let paginationHtml = "";
  for (let i = 1; i <= totalPages; i++) {
    paginationHtml += `
            <button class="${i === Number(currentPage) ? "active" : ""}" onclick="changePage(${i})">
                ${i}
            </button>`;
  }
  paginationContainer.innerHTML = paginationHtml;
}

function changePage(page) {
  currentPage = page;
  renderGameGrid(page);
  scrollToGameSection();
}

function filterByCategory(cate) {
  currentCategory = cate;
  currentPage = 1;
  renderGameGrid(1);
  scrollToGameSection();
}

function scrollToGameSection() {
  const gameSection = document.getElementById("game-display");
  if (gameSection) {
    window.scrollTo({
      top: gameSection.offsetTop - 150,
      behavior: "smooth",
    });
  }
}

function renderCategories() {
  const categoryList = document.getElementById("category-list");
  if (!categoryList) return;

  const allCates = games.flatMap((game) => game.categories);
  const uniqueCates = ["Tất cả", ...new Set(allCates)];

  let html = "";
  uniqueCates.forEach((cate) => {
    html += `<li><a href="javascript:void(0)" onclick="filterByCategory('${cate}')">${cate}</a></li>`;
  });
  categoryList.innerHTML = html;
}

function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function addToCart(gameId) {
  if (isGameOwned(gameId)) {
    showToast("Bạn đã sở hữu game này rồi! Vào thư viện để chơi nhé!", "error");
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    showToast("Vui lòng đăng nhập để thêm vào giỏ hàng!", "error");
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
    showToast("Đã thêm vào giỏ hàng thành công!");
  } else {
    showToast("Game này đã có trong giỏ hàng rồi!");
  }
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (badge) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.length;
    badge.innerText = totalItems;
    badge.style.display = totalItems > 0 ? "flex" : "none";
  }
}

function isGameOwned(gameId) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return false;
  const userLibraryKey = `ownedGames_${currentUser.username}`;
  const ownedGames = JSON.parse(localStorage.getItem(userLibraryKey)) || [];
  return ownedGames.some((id) => Number(id) === Number(gameId));
}
