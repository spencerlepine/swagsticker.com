import nodemailer from 'nodemailer';

export const mailer = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: '"SwagSticker.com" <noreply@swagsticker.com>',
    to: email,
    subject: `${otp} - Your SwagSticker security Code`,
    text: `Hi, 
      To complete your login, please enter the following code.
      ${otp}
      This code is valid for 5 minutes and can only be used once.

      Best regards,
      SwagSticker Team
      `,
    html: `<p>Hi,</p>
      <p>To complete your login, please enter the following code.</p>
      <h3>${otp}</h3>
      <p>This code is valid for 5 minutes and can only be used once.</p>
      <p>Best regards,</p>
      <p>SwagSticker Team</p>
      <br>
      <a href="https://swagsticker.com/privacy">Privacy Policy</a>
      <a href="https://swagsticker.com/contact">Contact Us</a>
      `,
  };

  await mailer.sendMail(mailOptions);
};

export const sendOrderNotifEmail = async (swagOrderId: string, printifyOrderId: string, paymentIntentId: string, customerEmail: string) => {
  await mailer.sendMail({
    from: '"SwagSticker.com" <noreply@swagsticker.com>',
    bcc: `${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`,
    subject: `New Swag Order: ${swagOrderId}`,
    text: `New Order Received
  Order Details:
  - Swag Order ID: ${swagOrderId}
  - Printify Order ID: ${printifyOrderId}
  - Payment ID: ${paymentIntentId}
  - Customer Email: ${customerEmail}
  
  Links:
  - Printify: https://printify.com/app/store/18739212/orders/1?sort=-created_at&searchKey=Swagorderid_${swagOrderId}
  - Stripe: https://dashboard.stripe.com/test/search?query=${paymentIntentId}
  
  Please manually fulfill this order at your earliest convenience.`,
  
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Order Notification</h2>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3 style="margin: 0 0 10px 0; color: #444;">Order Details</h3>
          <p style="margin: 5px 0;"><strong>Swag Order ID:</strong> ${swagOrderId}</p>
          <p style="margin: 5px 0;"><strong>Printify Order ID:</strong> ${printifyOrderId}</p>
          <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${paymentIntentId}</p>
          <p style="margin: 5px 0;"><strong>Customer:</strong> ${customerEmail}</p>
        </div>
  
        <div style="margin: 15px 0;">
          <h3 style="margin: 0 0 10px 0; color: #444;">Quick Links</h3>
          <p style="margin: 5px 0;">
            <a href="https://printify.com/app/store/18739212/orders/1?sort=-created_at&searchKey=Swagorderid_${swagOrderId}" 
               style="color: #007bff; text-decoration: none;">View in Printify</a>
          </p>
          <p style="margin: 5px 0;">
            <a href="https://dashboard.stripe.com/test/search?query=${paymentIntentId}" 
               style="color: #007bff; text-decoration: none;">View in Stripe</a>
          </p>
        </div>
  
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          Please manually fulfill this order at your earliest convenience.
        </p>
      </div>
    `,
  });
};
