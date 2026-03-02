let launchInterval;

document.addEventListener("DOMContentLoaded", () => {
  renderLibrary();

  // Xử lý tìm kiếm trong thư viện
  document.getElementById("lib-search-input").addEventListener("input", (e) => {
    renderLibrary(e.target.value);
  });
});

function renderLibrary(searchTerm = "") {
  const libContainer = document.getElementById("lib-game-list");
  const countEle = document.getElementById("lib-total-count");

  // 1. Lấy thông tin User đang đăng nhập
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    libContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #ff4d4d; padding: 50px;">
       Vui lòng đăng nhập để xem thư viện của bạn!
    </p>`;
    return;
  }
  // 2. Lấy danh sách game đã mua của User từ localStorage
  const userLibraryKey = `ownedGames_${currentUser.username}`;
  const ownedIds = JSON.parse(localStorage.getItem(userLibraryKey)) || [];

  // 3. Lọc dữ liệu từ data.js như cũ
  let myGames = games.filter((g) => ownedIds.includes(g.id));

  // 4. Nếu có tìm kiếm thì lọc tiếp
  if (searchTerm) {
    myGames = myGames.filter((g) =>
      g.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  countEle.innerText = myGames.length;

  if (myGames.length === 0) {
    libContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #555; padding: 50px;">
            ${searchTerm ? "Không tìm thấy game nào trong kho." : "Thư viện của bạn đang trống.!"}
        </p>`;
    return;
  }

  // 5. Render ra màn hình (giữ nguyên layout xịn của mày)
  libContainer.innerHTML = myGames
    .map(
      (game) => `
        <div class="lib-item">
            <div class="lib-img-wrapper"> <img src="${game.img}" alt="${game.title}">
            </div>
            <div class="lib-item-info">
                <h4>${game.title}</h4>
                <button class="btn-play" onclick="playGame('${game.id}')"> <i class="fas fa-play"></i> CHƠI NGAY
                </button>
            </div>
        </div>
    `,
    )
    .join("");
}

function playGame(title) {
  alert(`Đang khởi chạy ${title}... (chức năng này đang được phát triển)`);
}
