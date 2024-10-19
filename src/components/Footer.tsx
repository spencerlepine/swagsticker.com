import { PRODUCT_CONFIG } from '@/lib/products';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-4 text-sm flex-shrink-0">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <p>English (US) | $ ({PRODUCT_CONFIG.currency})</p>
          <p>© 2024 SwagSticker</p>
        </div>

        <ul className="flex space-x-4">
          <li>
            <a href="/contact" className="hover:text-white">
              Contact
            </a>
          </li>
          <li>
            <a href="/faq" className="hover:text-white">
              FAQ
            </a>
          </li>
          <li>
            <a href="/privacy" className="hover:text-white">
              Privacy
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
