import React from "react";

const A11yWrapper = ({ children }) => {
  return (
    <>
      {/* Skip to main content link (WCAG) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>

      {/* Main content wrapper */}
      <div id="main-content" role="main">
        {children}
      </div>
    </>
  );
};

export default A11yWrapper;