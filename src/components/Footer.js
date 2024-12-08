import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black no-underline  w-full mt-2 text-gray-300 py-8">
      <div className="mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700 pb-6">
          {/* Branding */}
          <div>
            <h3 className="text-white text-xl font-bold">Prtl</h3>
            <p className="mt-2 text-sm">
              Your go-to platform for AI image generation and creative inspiration.
            </p>
          </div>
          {/* Navigation */}
          <div>
            <h4 className="text-white text-lg font-semibold">  Quick Links</h4>
            <ul className=" list-none  ">
              <li>
                <a href="/" className="hover:text-gray-100 transition no-underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-gray-100 transition no-underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="/dalleimagery" className="hover:text-gray-100 transition no-underline">
                  Dalle Images
                </a>
              </li>
              <li>
                <a href="/Dalle" className="hover:text-gray-100 transition no-underline">
                 Create Image
                </a>
              </li>
            </ul>
          </div>
          {/* Social Media */}
          <div>
            <h4 className="text-white text-lg font-semibold">Follow Portl on Instagram</h4>
            <div className=" mt-4">
            
              <a
                href="https://www.instagram.com/portl.world/"
                className="hover:text-gray-100 transition no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-instagram text-2xl"></i>
              </a>
            
            </div>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="mt-6 flex justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} Portl. All rights reserved.</p>
          <p>
            Built with <span className="text-red-500">&hearts;</span> by Portl.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;