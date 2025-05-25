// تابع اضافه کردن هدرهای CORS
async function addCorsHeaders(responsePromise) {
  const response = await responsePromise;
  const newHeaders = new Headers(response.headers);
  newHeaders.set('Access-Control-Allow-Origin', '*');
  newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  newHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return new Response(response.body, {
    status: response.status,
    headers: newHeaders
  });
}

// رویداد fetch با مدیریت درخواست‌ها
addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  let response;
  if (url.pathname === '/login') {
    response = handleLogin(event.request);
  } else if (url.pathname === '/signup') {
    response = handleSignup(event.request);
  } else if (url.pathname.startsWith('/reminders')) {
    if (event.request.method === 'GET') {
      response = handleReminders(event.request);
    } else if (event.request.method === 'POST') {
      response = handleReminders(event.request);
    } else if (event.request.method === 'PUT') {
      response = handleReminderUpdate(event.request);
    } else if (event.request.method === 'DELETE') {
      response = handleReminderDelete(event.request);
    }
  } else {
    response = new Response('Not Found', { status: 404 });
  }
  event.respondWith(addCorsHeaders(response));
});

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