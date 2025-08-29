import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchViewProps {
  onClose: () => void;
}

const SearchView: React.FC<SearchViewProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('Jobs');

  const placeholderText = 'ค้นหา';

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col animate-in fade-in">
      <header className="p-4 border-b flex items-center gap-2 flex-shrink-0">
        <div className="flex-grow flex items-center bg-gray-100 rounded-lg">
          <Search className="w-5 h-5 text-gray-500 mx-3" />
          <Input
            type="text"
            placeholder={placeholderText}
            className="w-full bg-transparent border-none h-10 pl-0 focus:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
            autoFocus
          />
        </div>
        <Button variant="ghost" onClick={onClose} className="text-primary shrink-0">
          ยกเลิก
        </Button>
      </header>
      <div className="flex border-b flex-shrink-0">
        <button
          className={`flex-1 py-3 text-center font-semibold transition-colors ${activeTab === 'Jobs' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-100'}`}
          onClick={() => setActiveTab('Jobs')}
        >
          งาน
        </button>
        <button
          className={`flex-1 py-3 text-center font-semibold transition-colors ${activeTab === 'Companies' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-100'}`}
          onClick={() => setActiveTab('Companies')}
        >
          บริษัท
        </button>
      </div>
      <main className="flex-grow overflow-y-auto p-4">
        {/* Placeholder for search results */}
        {activeTab === 'Jobs' && <p className="text-gray-500">กำลังแสดงผลการค้นหางาน...</p>}
        {activeTab === 'Companies' && <p className="text-gray-500">กำลังแสดงผลการค้นหาบริษัท...</p>}
      </main>
    </div>
  );
};

export default SearchView;