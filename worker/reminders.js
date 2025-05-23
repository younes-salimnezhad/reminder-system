import { v4 as uuidv4 } from 'uuid';

export async function handleReminders(request) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  const username = await USERS.get(`token:${token}`);
  if (!username) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  if (request.method === 'GET') {
    const reminders = await REMINDERS.get('reminders', { type: 'json' }) || [];
    const userReminders = reminders.filter(rem => rem.username === username);
    return new Response(JSON.stringify(userReminders), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else if (request.method === 'POST') {
    const { message, time, type } = await request.json();
    const user = await USERS.get(username, { type: 'json' });
    const reminder = { id: uuidv4(), username, message, time, type, email: user.email, phone: user.phone, sent: false };
    const reminders = await REMINDERS.get('reminders', { type: 'json' }) || [];
    reminders.push(reminder);
    await REMINDERS.put('reminders', JSON.stringify(reminders));
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function handleReminderUpdate(request) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  const username = await USERS.get(`token:${token}`);
  if (!username) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const id = new URL(request.url).pathname.split('/').pop();
  const { message, time, type } = await request.json();
  const reminders = await REMINDERS.get('reminders', { type: 'json' }) || [];
  const reminder = reminders.find(rem => rem.id === id && rem.username === username);
  if (reminder) {
    reminder.message = message;
    reminder.time = time;
    reminder.type = type;
    reminder.sent = false;
    await REMINDERS.put('reminders', JSON.stringify(reminders));
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return new Response(JSON.stringify({ success: false, message: 'Reminder not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function handleReminderDelete(request) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  const username = await USERS.get(`token:${token}`);
  if (!username) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const id = new URL(request.url).pathname.split('/').pop();
  const reminders = await REMINDERS.get('reminders', { type: 'json' }) || [];
  const updatedReminders = reminders.filter(rem => rem.id !== id || rem.username !== username);
  await REMINDERS.put('reminders', JSON.stringify(updatedReminders));
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}