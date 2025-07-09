import React from 'react';
import { Database } from 'lucide-react';

const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-white py-8 ">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <Database className="text-white" size={20} />
          </div>
          <span className="font-semibold">DataFlowly</span>
        </div>
        <div className="text-sm text-gray-400">
          © 2025 DataFlowly. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
);

export default Footer; 