const workerUrl = "https://reminder-system.pages.dev"; // آدرس Worker شما

// بارگذاری یادآورها
async function loadReminders() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${workerUrl}/reminders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const reminders = await response.json();
  const table = document.getElementById("reminders-table");
  table.innerHTML = "";
  reminders.forEach((rem) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${rem.message}</td>
      <td>${new Date(rem.time).toLocaleString("fa-IR")}</td>
      <td>${rem.type}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editReminder('${rem.id}')">ویرایش</button>
        <button class="btn btn-sm btn-danger" onclick="deleteReminder('${rem.id}')">حذف</button>
      </td>
    `;
    table.appendChild(row);
  });
}

// ایجاد یادآور
document.getElementById("reminder-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = document.getElementById("reminder-message").value;
  const time = document.getElementById("reminder-time").value;
  const type = document.getElementById("reminder-type").value;
  const token = localStorage.getItem("token");
  const response = await fetch(`${workerUrl}/reminders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message, time, type }),
  });
  if (response.ok) {
    loadReminders();
    document.getElementById("reminder-form").reset();
  } else {
    alert("خطا در ایجاد یادآور");
  }
});

// حذف یادآور
async function deleteReminder(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${workerUrl}/reminders/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.ok) {
    loadReminders();
  } else {
    alert("خطا در حذف یادآور");
  }
}

// ویرایش یادآور (ساده‌سازی شده)
async function editReminder(id) {
  const message = prompt("پیام جدید را وارد کنید:");
  const time = prompt("زمان جدید (YYYY-MM-DDTHH:MM):");
  const type = prompt("نوع (email, sms, both):");
  const token = localStorage.getItem("token");
  const response = await fetch(`${workerUrl}/reminders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message, time, type }),
  });
  if (response.ok) {
    loadReminders();
  } else {
    alert("خطا در ویرایش یادآور");
  }
}

// بارگذاری اولیه
document.addEventListener("DOMContentLoaded", loadReminders);
