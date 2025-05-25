const workerUrl = 'https://reminder-system.your-account.workers.dev'; // آدرس Worker شما را جایگزین کنید

// ثبت‌نام
document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;
  const email = document.getElementById('signup-email').value;
  const phone = document.getElementById('signup-phone').value;
  try {
    const response = await fetch(`${workerUrl}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email, phone })
    });
    const result = await response.json();
    if (result.success) {
      localStorage.setItem('token', result.token); // ذخیره توکن
      alert('ثبت‌نام موفق! در حال هدایت به داشبورد...');
      window.location.href = 'dashboard.html';
    } else {
      alert('خطا در ثبت‌نام: ' + result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('خطا در ارتباط با سرور: ' + error.message);
  }
});

// لاگین
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  try {
    const response = await fetch(`${workerUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const result = await response.json();
    if (result.success) {
      localStorage.setItem('token', result.token);
      window.location.href = 'dashboard.html';
    } else {
      alert('نام کاربری یا رمز عبور اشتباه است');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('خطا در ارتباط با سرور: ' + error.message);
  }
});

// خروج
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}