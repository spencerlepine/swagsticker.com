const faqs = [
  {
    question: 'How long do items take to produce/ship?',
    answer: 'Items are typically produced and shipped within 4-8 business days.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'While we do not accept returns, we understand that sometimes things don&apos;t go as planned. If you&apos;re dissatisfied with your purchase, please contact our customer support team to discuss a possible refund. We&apos;ll do our best to find a solution that works for you.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, and digital wallets like Apple Pay and Google Pay.',
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'No, we currently only offer shipping within the United States.',
  },
  // {
  //   question: 'Do you offer international shipping?',
  //   answer:
  //     'Yes, we offer international shipping to most countries with estimated delivery times of 2-5 business days for US orders and 10-30 business days for international orders. Please enter your shipping address during checkout for accurate rates and times.',
  // },
  {
    question: 'How can I track my order?',
    answer:
      "Once your order has shipped, you will receive a tracking number via email. You can use this number to track the status of your shipment on the shipping carrier's website. You can also find your tracking number in your order details on your account page.",
  },
  {
    question: 'What if my item is damaged or defective?',
    answer:
      'If you receive a damaged or defective item, please contact our customer support team within 14 days of receiving your order. We will review your case and initiate a refund process if applicable. We do not accept returns for damaged or defective items.',
  },
  {
    question: 'Can I cancel my order?',
    answer:
      'Unfortunately, we do not currently support order cancellations. However, we are working on adding this feature in the near future. If your order has not yet shipped, please contact our customer support team to see if there are any other options available.',
  },
  {
    question: 'How do I contact customer support?',
    answer:
      'You can contact our customer support team by email at [email address]. Our customer support hours are [hours of operation]. For general inquiries or customer support, please visit our Contact page.',
  },
];

export default function FAQPage() {
  return (
    <div className="my-8 mx-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
        <ul className="list-disc pl-4 mt-2 list-none">
          {faqs.map((faq, index) => (
            <li key={index} className="text-gray-700 mt-4">
              <span className="font-semibold">{faq.question}</span>
              <p>{faq.answer}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
