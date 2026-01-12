import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">
              The Golden Stitch
            </h3>
            <p className="text-sm opacity-90">
              Premium dress marketplace connecting designers, seamstresses, and
              customers.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">For Customers</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>
                <Link to="/browse" className="hover:underline">
                  Browse Designs
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:underline">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">For Creators</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>
                <Link to="/become-designer" className="hover:underline">
                  Become a Designer
                </Link>
              </li>
              <li>
                <Link to="/become-seamstress" className="hover:underline">
                  Become a Seamstress
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>
                <Link to="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:underline">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm opacity-90 mb-4 md:mb-0">
              © 2024 The Golden Stitch. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm opacity-90">
              <Link to="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
