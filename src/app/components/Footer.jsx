"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full px-6 py-8 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold">© 2025 DigiNote</h2>
          <p className="text-sm">All rights reserved.</p>
        </div>

        <div className="flex gap-4">
          <a href="/privacy-policy" className="hover:underline text-sm">
            Privacy Policy
          </a>
          <a href="/terms-of-service" className="hover:underline text-sm">
            Terms of Service
          </a>
          <a href="/contact" className="hover:underline text-sm">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
