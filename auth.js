const workerUrl = "https://reminder-system.pages.dev"; // آدرس Worker شما

// لاگین
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  const response = await fetch(`${workerUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const result = await response.json();
  if (result.success) {
    localStorage.setItem("token", result.token);
    window.location.href = "dashboard.html";
  } else {
    alert("نام کاربری یا رمز عبور اشتباه است");
  }
});

// ثبت‌نام
document.getElementById("signup-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;
  const email = document.getElementById("signup-email").value;
  const phone = document.getElementById("signup-phone").value;
  const response = await fetch(`${workerUrl}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email, phone }),
  });
  const result = await response.json();
  if (result.success) {
    alert("ثبت‌نام موفق! لطفاً وارد شوید.");
    window.location.href = "index.html";
  } else {
    alert("خطا در ثبت‌نام: " + result.message);
  }
});

// خروج
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
