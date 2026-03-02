document.addEventListener("DOMContentLoaded", () => {
  const togglePasswordIcons = document.querySelectorAll(".toggle-password");

  togglePasswordIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const passwordInput = this.parentElement.querySelector("input");

      if (passwordInput.type === "password") {
        passwordInput.type = "text";

        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
      } else {
        passwordInput.type = "password";

        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
      }
    });
  });
});

// Chuyển đổi giữa các form
function switchForm(formId) {
  document
    .querySelectorAll(".auth-box")
    .forEach((box) => box.classList.remove("active"));
  document.getElementById(formId).classList.add("active");
}

// Toast Helper
function notify(msg, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// --- ĐĂNG KÝ ---
function handleRegister() {
  const user = document.getElementById("reg-user").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pw = document.getElementById("reg-pw").value;
  const pwConf = document.getElementById("reg-pw-conf").value;

  if (user.length < 4) return notify("Username tối thiểu 4 ký tự", "error");
  if (!email.includes("@gmail.com"))
    return notify("Email phải là định dạng Gmail", "error");
  if (pw.length < 6) return notify("Mật khẩu tối thiểu 6 ký tự", "error");
  if (pw !== pwConf) return notify("Mật khẩu không trùng khớp", "error");

  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.find((u) => u.username === user))
    return notify("Username đã tồn tại", "error");

  users.push({ username: user, email: email, password: btoa(pw) });
  localStorage.setItem("users", JSON.stringify(users));

  notify("Đăng ký thành công! Hãy đăng nhập.");
  setTimeout(() => switchForm("login-form"), 1500);
}

// --- ĐĂNG NHẬP ---
function handleLogin() {
  const account = document.getElementById("login-account").value.trim();
  const pw = document.getElementById("login-pw").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const userFound = users.find(
    (u) => u.username === account || u.email === account,
  );

  if (userFound && userFound.password === btoa(pw)) {
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        username: userFound.username,
        email: userFound.email,
        displayName: userFound.displayName || "",
        joinDate: userFound.joinDate || "24/02/2026",
        avatar: userFound.avatar || "",
        isLoggedIn: true,
      }),
    );

    notify("Đăng nhập thành công!");
    setTimeout(() => (window.location.href = "index.html"), 1000);
  } else {
    notify("Tài khoản hoặc mật khẩu không đúng", "error");
  }
}
// --- QUÊN MẬT KHẨU ---
let tempCode = "";
function sendResetCode() {
  const email = document.getElementById("forgot-email").value;
  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (!users.find((u) => u.email === email))
    return notify("Email không tồn tại", "error");

  const btn = document.getElementById("btn-send-code");
  btn.innerText = "ĐANG GỬI...";
  btn.disabled = true;

  setTimeout(() => {
    tempCode = Math.floor(100000 + Math.random() * 900000).toString();
    alert(`Mã xác nhận của bạn là: ${tempCode}`);
    document.getElementById("step-1").style.display = "none";
    document.getElementById("step-2").style.display = "block";
    startTimer();
  }, 1500);
}

function startTimer() {
  let sec = 60;
  const timerEle = document.getElementById("timer");
  const interval = setInterval(() => {
    sec--;
    timerEle.innerText = `Thời gian còn lại: ${sec}s`;
    if (sec <= 0) {
      clearInterval(interval);
      tempCode = "";
      notify("Mã đã hết hạn!", "error");
      switchForm("forgot-form");
    }
  }, 1000);
}

function verifyCode() {
  const codeInput = document.getElementById("verify-code").value;
  if (codeInput === tempCode) {
    document.getElementById("step-2").style.display = "none";
    document.getElementById("step-3").style.display = "block";
  } else {
    notify("Mã xác nhận sai", "error");
  }
}

function resetPassword() {
  const newPw = document.getElementById("new-pw").value;
  const confPw = document.getElementById("new-pw-conf").value;
  const email = document.getElementById("forgot-email").value;

  if (newPw.length < 6) return notify("Mật khẩu mới quá ngắn", "error");
  if (newPw !== confPw) return notify("Mật khẩu không khớp", "error");

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.map((u) =>
    u.email === email ? { ...u, password: btoa(newPw) } : u,
  );
  localStorage.setItem("users", JSON.stringify(users));

  notify("Đổi mật khẩu thành công!");
  setTimeout(() => location.reload(), 1500);
}
