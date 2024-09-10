"use client";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white dark:bg-gray-800 dark:text-gray-200 py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Zahid Rahimoon. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
