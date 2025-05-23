import { handleLogin, handleSignup } from './auth';
import { handleReminders, handleReminderUpdate, handleReminderDelete } from './reminders';
import { sendEmail } from './email';
import { sendSMS } from './sms';

// تابع بررسی دوره‌ای برای ارسال یادآورها
async function checkReminders() {
  const reminders = await REMINDERS.get('reminders', { type: 'json' }) || [];
  const now = new Date();
  for (const rem of reminders) {
    if (new Date(rem.time) <= now && !rem.sent) {
      if (rem.type === 'email' || rem.type === 'both') {
        await sendEmail(rem.email, 'یادآور', rem.message);
      }
      if (rem.type === 'sms' || rem.type === 'both') {
        await sendSMS(rem.phone, rem.message);
      }
      rem.sent = true;
      await REMINDERS.put('reminders', JSON.stringify(reminders));
    }
  }
}

// رویداد schedule برای بررسی دوره‌ای
addEventListener('scheduled', event => {
  event.waitUntil(checkReminders());
});

// رویداد fetch برای مدیریت درخواست‌ها
addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.pathname === '/login') {
    event.respondWith(handleLogin(event.request));
  } else if (url.pathname === '/signup') {
    event.respondWith(handleSignup(event.request));
  } else if (url.pathname.startsWith('/reminders')) {
    if (event.request.method === 'GET') {
      event.respondWith(handleReminders(event.request));
    } else if (event.request.method === 'POST') {
      event.respondWith(handleReminders(event.request));
    } else if (event.request.method === 'PUT') {
      event.respondWith(handleReminderUpdate(event.request));
    } else if (event.request.method === 'DELETE') {
      event.respondWith(handleReminderDelete(event.request));
    }
  } else {
    event.respondWith(new Response('Not Found', { status: 404 }));
  }
});