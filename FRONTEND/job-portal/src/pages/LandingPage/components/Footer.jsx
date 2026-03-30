import { Briefcase } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">

        {/* Logo Section */}
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
            <Briefcase size={24} />
            JobPortal
          </div>
          <p className="text-sm">
            Connecting talented professionals with innovative companies worldwide.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>Find Jobs</li>
            <li>For Employers</li>
            <li>Post a Job</li>
            <li>Dashboard</li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-semibold mb-4">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li>Engineering</li>
            <li>Design</li>
            <li>Marketing</li>
            <li>IT & Software</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <p className="text-sm">support@jobportal.com</p>
          <p className="text-sm mt-2">+91 98765 43210</p>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm">
        © {new Date().getFullYear()} JobPortal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

