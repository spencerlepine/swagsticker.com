export default function ContactForm() {
  return (
    <div className="my-8 mx-20">
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
        <p className="text-gray-700 mb-4">For general inquiries or customer support, please email us at:</p>
        <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`} className="text-blue-500 hover:underline">
          {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
        </a>
        <h3 className="text-2xl font-semibold mt-6 mb-2">Contact Form</h3>
        <form action={process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT} method="post" acceptCharset="UTF-8" className="space-y-4">
          <div>
            <input name="Name" placeholder="Full name" id="name" type="text" required className="border rounded-md px-4 py-2 w-full" data-testid="contact-form-name-input" />
          </div>
          <div>
            <input name="Email" placeholder="Your email" id="email" type="email" required className="border rounded-md px-4 py-2 w-full" data-testid="contact-form-email-input" />
          </div>
          <div>
            <textarea
              placeholder="Your message goes here..."
              data-testid="contact-form-message-input"
              name="message"
              required
              className="border rounded-md px-4 py-2 w-full h-24"
            ></textarea>
          </div>
          <div>
            <input type="submit" value="Send Message" className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600" />
            <div aria-hidden="true">
              <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
