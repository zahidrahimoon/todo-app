"use client";
import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const Navbar = ({ isDarkMode, toggleTheme }) => {
  return (
    <nav className={`p-4 font-playfair shadow-lg ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <a href="/">Zahid Rahimoon</a>
        </div>
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className={`p-3 rounded-full transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-200 text-purple-400 hover:bg-gray-300'
          }`}
        >
          {isDarkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
