export default async function PrivacyPage() {
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
            Device Information: We use Google Analytics to collect information about your device, location (approximate), IP address, and usage of this site.
          </li>
        </ul>
        <h2 className="text-2xl font-semibold mt-6 mb-2">How We Use Your Information</h2>
        <p className="text-gray-700 leading-loose">We use the information we collect to:</p>
        <ul className="list-disc pl-4 mt-2">
          <li className="text-gray-700">Communicate with you (using your email).</li>
          <li className="text-gray-700">Monitor usage and make decisions about content creation (using Google Analytics data).</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-6 mb-2">Contact Us</h2>
        <p className="text-gray-700">If you have any questions or concerns about our privacy practices, please contact us at:</p>
        <a href="mailto:spencer.sayhello@gmail.com" className="text-blue-500 hover:underline">
          spencer.sayhello@gmail.com
        </a>
      </div>
    </div>
  );
}
