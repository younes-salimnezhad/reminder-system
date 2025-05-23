export async function sendSMS(to, message) {
  const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
  const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      To: to,
      From: 'YOUR_TWILIO_PHONE_NUMBER',
      Body: message
    })
  });
  return response.ok;
}