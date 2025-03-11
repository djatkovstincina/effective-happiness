import React from "react";

const Header = () => (
    <header className="flex items-center justify-between px-6 py-4 bg-cyan-600 rounded text-white">
        <div>
            <h1 className="text-lg sm:text-xl font-bold">NaviPartner Tech Test</h1>
            <h2 className="text-sm sm:text-base font-medium opacity-90">Create your app here!</h2>
        </div>
        <p className="text-xs sm:text-sm opacity-80">Let's get you started</p>
    </header>
);

export default Header;
