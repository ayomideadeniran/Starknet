const postmark = require("postmark");
require("dotenv").config({ path: ".env.local" });

const serverToken = process.env.POSTMARK_LIVE_SERVER_TOKEN || process.env.POSTMARK_SERVER_TOKEN || "396480a3-0aa4-4583-bdd3-ce3ab4cab9f3";
const client = new postmark.ServerClient(serverToken);

const recipientEmail = process.argv[2] || "infoaboutknights@gmail.com";

console.log(`Sending Postmark test email using server token (${serverToken.slice(0, 8)}...) to ${recipientEmail}...`);

client.sendEmail({
  From: "info@starknetdev.online",
  To: recipientEmail,
  Subject: "StarknetDev Email Test",
  HtmlBody: `
    <h2>Hello</h2>
    <p>This is a test email from StarknetDev.</p>
    <p>Website: <a href="https://www.starknetdev.online/">starknetdev.online</a></p>
    <p>Regards,<br>StarknetDev</p>
  `,
  TextBody: "This is a test email from StarknetDev.",
  MessageStream: "outbound"
})
.then((res) => {
  console.log("✅ Email sent successfully:", res);
})
.catch((error) => {
  console.error("❌ Failed to send email via primary token:", error.message || error);
  
  if (serverToken !== "POSTMARK_API_TEST") {
    console.log("Retrying with Postmark API Test Sandbox token...");
    const testClient = new postmark.ServerClient("POSTMARK_API_TEST");
    testClient.sendEmail({
      From: "info@starknetdev.online",
      To: recipientEmail,
      Subject: "StarknetDev Email Test",
      HtmlBody: `
        <h2>Hello</h2>
        <p>This is a test email from StarknetDev.</p>
        <p>Website: <a href="https://www.starknetdev.online/">starknetdev.online</a></p>
        <p>Regards,<br>StarknetDev</p>
      `,
      TextBody: "This is a test email from StarknetDev.",
      MessageStream: "outbound"
    })
    .then((testRes) => {
      console.log("✅ Test sandbox email sent successfully:", testRes);
    })
    .catch((err2) => {
      console.error("❌ Sandbox dispatch error:", err2);
    });
  }
});
