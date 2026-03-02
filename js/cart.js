document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});

function renderCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart-items-container");
  const totalEle = document.getElementById("total-price");
  const countEle = document.getElementById("cart-count");

  if (cart.length === 0) {
    container.innerHTML = `
            <div style="text-align:center; padding:100px 20px; color:#444;">
                <i class="fas fa-shopping-bag" style="font-size:5rem; margin-bottom:20px;"></i>
                <h2>Giỏ hàng đang trống</h2>
                <a href="index.html" style="color:#00d4ff; text-decoration:none;">Quay lại mua sắm ngay</a>
            </div>`;
    totalEle.innerText = "0 đ";
    countEle.innerText = "0";
    return;
  }

  let html = "";
  let total = 0;

  cart.forEach((id) => {
    const game = games.find((g) => g.id === id);
    if (game) {
      total += game.price;
      html += `
                <div class="cart-item">
                    <img src="${game.img}" alt="${game.title}">
                    <div class="item-info">
                        <h4>${game.title}</h4>
                        <p>${game.categories.join(" / ")}</p>
                    </div>
                    <div class="item-price-remove">
                        <span class="price">${game.price.toLocaleString()} đ</span>
                        <button class="btn-remove" onclick="removeFromCart(${game.id})">
                            <i class="fas fa-trash"></i> Xóa
                        </button>
                    </div>
                </div>`;
    }
  });

  container.innerHTML = html;
  totalEle.innerText = total.toLocaleString() + " đ";
  countEle.innerText = cart.length;
}

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((gameId) => gameId !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function processCheckout() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Đăng nhập để tiếp tục thanh toán!");
    window.location.href = "login.html";
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Giỏ hàng trống?");
    return;
  }

  // Chuyển sang trang checkout để chọn phương thức và xem lại đơn hàng
  window.location.href = "checkout.html";
}
