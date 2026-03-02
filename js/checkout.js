document.addEventListener("DOMContentLoaded", () => {
  renderCheckoutOrder();
});

function renderCheckoutOrder() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const summaryContainer = document.getElementById("order-summary");

  if (cart.length === 0) {
    summaryContainer.innerHTML = "<p>Không có game nào để thanh toán!</p>";
    return;
  }

  let subtotal = 0;
  // Duyệt qua giỏ hàng để lấy thông tin game từ data.js
  const html = cart
    .map((id) => {
      const game = games.find((g) => Number(g.id) === Number(id)); //
      if (game) {
        const priceNum =
          parseInt(game.price.toString().replace(/\D/g, "")) || 0;
        subtotal += priceNum;

        return `
        <div class="summary-item" style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center;">
          <img src="${game.img}" style="width: 60px; height: 80px; object-fit: cover; border-radius: 4px;">
          <div style="flex-grow: 1;">
            <p style="margin: 0; font-weight: bold; color: white;">${game.title}</p>
            <small style="color: #888;">Giá: ${game.price}</small>
          </div>
          <div style="color: #00ff00; font-weight: bold;">${game.price}</div>
        </div>`;
      }
    })
    .join("");

  const tax = subtotal * 0.1; // Thuế 10%
  const total = subtotal + tax;

  summaryContainer.innerHTML = `
    <h3 style="color: white; margin-bottom: 20px;">Tóm tắt đơn hàng</h3>
    <div class="checkout-list">${html}</div>
    <div style="border-top: 1px solid #333; margin-top: 20px; padding-top: 20px; color: #ccc;">
      <p style="display: flex; justify-content: space-between;">Giá gốc: <span>${subtotal.toLocaleString()} đ</span></p>
      <p style="display: flex; justify-content: space-between;">Thuế (10%): <span>${tax.toLocaleString()} đ</span></p>
      <hr style="border: 0; border-top: 1px solid #444; margin: 15px 0;">
      <h2 style="display: flex; justify-content: space-between; color: white;">
        Tổng cộng: <span style="color: #00ff00;">${total.toLocaleString()} đ</span>
      </h2>
    </div>
    <button onclick="finalPayment()" style="width: 100%; padding: 15px; background: #0088ff; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; margin-top: 20px;">
      PLACE ORDER
    </button>
  `;
}

function finalPayment() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // 1. Lưu vào kho game riêng của user
  const userLibraryKey = `ownedGames_${currentUser.username}`;
  let ownedGames = JSON.parse(localStorage.getItem(userLibraryKey)) || [];
  let updatedLibrary = [...new Set([...ownedGames, ...cart])];
  localStorage.setItem(userLibraryKey, JSON.stringify(updatedLibrary));

  // 2. Xóa giỏ hàng
  localStorage.removeItem("cart");

  alert("Thanh toán thành công!.");
  window.location.href = "library.html";
}
