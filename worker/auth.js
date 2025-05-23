import { v4 as uuidv4 } from 'uuid'; // نیاز به پکیج uuid در Worker

export async function handleLogin(request) {
  const { username, password } = await request.json();
  const user = await USERS.get(username, { type: 'json' });
  if (user && user.password === password) {
    const token = uuidv4();
    await USERS.put(`token:${token}`, username);
    return new Response(JSON.stringify({ success: true, token }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return new Response(JSON.stringify({ success: false, message: 'Invalid credentials' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function handleSignup(request) {
  const { username, password, email, phone } = await request.json();
  const existingUser = await USERS.get(username);
  if (existingUser) {
    return new Response(JSON.stringify({ success: false, message: 'Username exists' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  await USERS.put(username, JSON.stringify({ password, email, phone }));
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}