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

export const sendOrderNotifEmail = async (swagOrderId: string, printifyOrderId: string, paymentIntentId: string) => {
  await mailer.sendMail({
    from: '"SwagSticker.com" <noreply@swagsticker.com>',
    bcc: `${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`,
    subject: `New Printify Order: ${swagOrderId}`,
    text: `Please manually fulfill swagOrderId: ${swagOrderId}. PrintifyOrderId: ${printifyOrderId}. PaymentId: ${paymentIntentId} 
               Visit: https://printify.com/app/store/18739212/orders/1?sort=-created_at&searchKey=Swagorderid_${swagOrderId}
               and https://dashboard.stripe.com/test/search?query=${paymentIntentId}`,
    html: `<p>Please manually fulfill swagOrderId: ${swagOrderId}</p>
               <p>PrintifyOrderId: ${printifyOrderId}</p>
               <p>PaymentId: ${paymentIntentId}</p>
               <p>Printify: <a href="https://printify.com/app/store/18739212/orders/1?sort=-created_at&searchKey=Swagorderid_${swagOrderId}">Order Link</a></p>
               <p>Stripe: <a href="https://dashboard.stripe.com/test/search?query=${paymentIntentId}">Payment Link</a></p>`,
  });
};
