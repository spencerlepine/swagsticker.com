export default function PrivacyPage() {
  return (
    <div className="my-8 mx-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-700 leading-loose">
          This Privacy Policy describes how we collect, use, and disclose your information when you use our website and the choices you have associated with that data.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">Information We Collect</h2>
        <ul className="list-disc pl-4 mt-2">
          <li className="text-gray-700">Name and Email Address: We collect your name and email address when you directly provide it to us through a form on this site.</li>
          <li className="text-gray-700">
            Payment Information: We use Stripe to process payments during checkout. When you make a purchase, Stripe collects and processes your payment details (such as credit
            card or bank account information). We do not store your full payment details on our servers, but we may retain limited transaction data (e.g., amount, date, and order
            ID) for order fulfillment and record-keeping.
          </li>
        </ul>
        <h2 className="text-2xl font-semibold mt-6 mb-2">How We Use Your Information</h2>
        <p className="text-gray-700 leading-loose">We use the information we collect to:</p>
        <ul className="list-disc pl-4 mt-2">
          <li className="text-gray-700">Communicate with you (using your email).</li>
          <li className="text-gray-700">Process payments and fulfill orders (using Stripe for secure checkout).</li>
          <li className="text-gray-700">Maintain records of transactions as required by law.</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-6 mb-2">Third-Party Services</h2>
        <p className="text-gray-700 leading-loose">
          We use Stripe, a third-party payment processor, to handle checkout transactions. Stripe collects and processes your payment information in accordance with its own{' '}
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            Privacy Policy
          </a>
          . Please review their policy for details on how your payment data is handled.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">Contact Us</h2>
        <p className="text-gray-700">If you have any questions or concerns about our privacy practices, please contact us at:</p>
        <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`} className="text-blue-500 hover:underline">
          {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
        </a>
      </div>
    </div>
  );
}
