document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  // 1. Hiển thị Ảnh đại diện
  const userAvatar = document.getElementById("user-avatar");
  if (currentUser.avatar) {
    userAvatar.src = currentUser.avatar;
  }

  // 2. Hiển thị Email (Chỗ dưới tên User)
  const emailEle = document.getElementById("profile-email");

  const userEmail = currentUser.email || `${currentUser.username}@vngame.com`;
  emailEle.innerText = userEmail;

  // 3. Hiển thị thông tin vào các ô Input
  document.getElementById("profile-username").innerText = currentUser.username;
  document.getElementById("display-name").value = currentUser.displayName || "";
  document.getElementById("join-date").value =
    currentUser.joinDate || "24/02/2026";

  const emailInput = document.getElementById("profile-input-email");
  if (emailInput) emailInput.value = userEmail;

  // 4. Thống kê game và tiền (Giữ nguyên logic Regex xịn của mày)
  const userLibraryKey = `ownedGames_${currentUser.username}`;
  const ownedIds = JSON.parse(localStorage.getItem(userLibraryKey)) || [];
  document.getElementById("stat-games").innerText = ownedIds.length;

  let totalSpent = 0;
  ownedIds.forEach((id) => {
    const game = games.find((g) => Number(g.id) === Number(id));
    if (game) {
      let priceStr = game.price || game.currentPrice || "0";
      const priceNum = parseInt(priceStr.toString().replace(/\D/g, "")) || 0;
      totalSpent += priceNum;
    }
  });

  document.getElementById("stat-spent").innerText =
    totalSpent.toLocaleString("vi-VN") + " đ";
});

function saveProfile() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const newName = document.getElementById("display-name").value;

  if (newName.trim() === "") {
    showToast("Display name không được để trống!", "error");
    return;
  }

  currentUser.displayName = newName;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  showToast("Đã cập nhật hồ sơ thành công!", "success");
}

function changeAvatar() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const newAvatarUrl = prompt(
    "Nhập URL ảnh đại diện mới (ví dụ: https://i.pravatar.cc/300):",
    currentUser.avatar || "",
  );

  if (newAvatarUrl && newAvatarUrl.trim() !== "") {
    document.getElementById("user-avatar").src = newAvatarUrl;

    currentUser.avatar = newAvatarUrl;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    showToast("Đã cập nhật ảnh đại diện!", "success");
  }
}

if (currentUser.avatar) {
  document.getElementById("user-avatar").src = currentUser.avatar;
}
