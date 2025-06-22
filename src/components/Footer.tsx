import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white py-8 px-4 mt-16">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <div className="mb-4 md:mb-0">
                    <h3 className="text-2xl font-bold text-lime-200">Habits Tracker</h3>
                    <p className="text-gray-400">Stay consistent, achieve your goals.</p>
                </div>
                <div className="flex space-x-6 mb-4 md:mb-0">
                    <a href="/habits" className="text-gray-300 hover:text-white transition-colors duration-300">
                        Home
                    </a>
                </div>
                <div className="text-gray-500">
                    <p>&copy; {currentYear} Habits Tracker. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 