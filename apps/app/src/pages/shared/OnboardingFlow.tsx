import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, User, Rocket, Utensils, ShoppingCart, Shirt, Building2, HeartPulse, MoreHorizontal, CheckCircle } from 'lucide-react';

const slides = [
    {
        icon: <Search className="w-20 h-20 text-yellow-400" />,
        title: 'พบกับงานที่ใช่',
        description: 'ค้นหางานหลากหลายประเภทใกล้ตัวคุณได้ง่ายๆ แค่ปลายนิ้ว',
    },
    {
        icon: <User className="w-20 h-20 text-yellow-400" />,
        title: 'โปรไฟล์ของคุณ คือโอกาส',
        description: 'สร้างโปรไฟล์ที่โดดเด่นเพื่อดึงดูดผู้จ้างงานให้สนใจในตัวคุณ',
    },
    {
        isCategorySelector: true, // Custom slide for category selection
    }
];

const categories = [
    { name: 'ร้านอาหาร/เครื่องดื่ม', icon: <Utensils className="w-8 h-8 text-yellow-500" /> },
    { name: 'ขาย/การตลาด', icon: <ShoppingCart className="w-8 h-8 text-blue-500" /> },
    { name: 'เสื้อผ้า/แฟชั่น', icon: <Shirt className="w-8 h-8 text-pink-500" /> },
    { name: 'ก่อสร้าง/ช่าง', icon: <Building2 className="w-8 h-8 text-gray-500" /> },
    { name: 'สุขภาพ/ความงาม', icon: <HeartPulse className="w-8 h-8 text-red-500" /> },
    { name: 'อื่นๆ', icon: <MoreHorizontal className="w-8 h-8 text-green-500" /> },
];

const OnboardingFlow: React.FC = () => {
    const navigate = useNavigate();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isLastSlide, setIsLastSlide] = useState(false);

    const handleFinish = () => {
        localStorage.setItem('onboardingCompleted', 'true');
        localStorage.setItem('userInterests', JSON.stringify(selectedCategories));
        navigate('/seeker/home');
    };
    
    const handleCategoryToggle = (categoryName: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryName)
                ? prev.filter(c => c !== categoryName)
                : [...prev, categoryName]
        );
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setIsLastSlide(scrollLeft + clientWidth >= scrollWidth - 1);
        }
    };

    const handleNext = () => {
        if (isLastSlide) {
            handleFinish();
        } else if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: scrollContainerRef.current.clientWidth, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-grow flex snap-x snap-mandatory overflow-x-auto no-scrollbar"
            >
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-full h-full flex flex-col items-center justify-center text-center p-8 snap-center"
                    >
                         {slide.isCategorySelector ? (
                            <div className="w-full">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">คุณสนใจงานประเภทไหน?</h2>
                                <p className="text-gray-500 mb-6">เลือกอย่างน้อย 1 ประเภทเพื่อที่เราจะแนะนำงานได้ดีขึ้น</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {categories.map((category) => (
                                        <Card 
                                            key={category.name} 
                                            className={`relative flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all border-2 ${selectedCategories.includes(category.name) ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}
                                            onClick={() => handleCategoryToggle(category.name)}
                                        >
                                            {selectedCategories.includes(category.name) && (
                                                <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-yellow-500" />
                                            )}
                                            <div className="mb-2">{category.icon}</div>
                                            <p className="font-semibold text-gray-700 text-sm">{category.name}</p>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ) : (
                           <>
                                <div className="mb-8">{slide.icon}</div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">{slide.title}</h2>
                                <p className="text-gray-500 max-w-xs">{slide.description}</p>
                           </>
                        )}
                    </div>
                ))}
            </div>

            <footer className="w-full bg-white p-4 border-t">
                 <div className="max-w-md mx-auto flex items-center justify-between gap-4">
                    <Button variant="ghost" onClick={handleFinish} className="text-gray-500">
                        ข้าม
                    </Button>
                    <Button 
                        onClick={handleNext} 
                        className="w-48 h-12 text-lg font-bold bg-yellow-400 text-black hover:bg-yellow-500 rounded-lg"
                        disabled={isLastSlide && selectedCategories.length === 0}
                    >
                        {isLastSlide ? 'เริ่มต้นใช้งาน' : 'ถัดไป'}
                    </Button>
                </div>
            </footer>
        </div>
    );
};

export default OnboardingFlow;

// Simple CSS to hide scrollbar
const style = document.createElement('style');
style.textContent = `
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
`;
document.head.append(style);
