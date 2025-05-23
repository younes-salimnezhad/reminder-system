export async function sendEmail(to, subject, message) {
  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: 'YOUR_EMAILJS_SERVICE_ID',
      template_id: 'YOUR_EMAILJS_TEMPLATE_ID',
      user_id: 'YOUR_EMAILJS_USER_ID',
      template_params: { to_email: to, subject, message }
    })
  });
  return response.ok;
}