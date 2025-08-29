import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { 
    ArrowLeft, Utensils, ConciergeBell, GlassWater, Store, Soup, Coffee, Sandwich, Landmark, Dog, Palette,
    Baby, Sparkles, Wrench, Phone, Car, GraduationCap, Cog, Popcorn, PartyPopper, Shirt, Stethoscope,
    ClipboardList, Laptop, Gavel, UserCog, Factory, Clipboard, Globe, Megaphone, Scissors, FlaskConical,
    Shield, HeartPulse, Warehouse, Pencil, MoreHorizontal, X 
} from 'lucide-react';

const categories = [
    { name: 'เชฟ/พ่อครัว', icon: <Utensils /> },
    { name: 'พนักงานเสิร์ฟ', icon: <ConciergeBell /> },
    { name: 'บาร์เทนเดอร์', icon: <GlassWater /> },
    { name: 'ค้าปลีก/หน้าร้าน', icon: <Store /> },
    { name: 'ผู้ช่วยในครัว', icon: <Soup /> },
    { name: 'บาริสต้า', icon: <Coffee /> },
    { name: 'อาหารจานด่วน', icon: <Sandwich /> },
    { name: 'บัญชี/การเงิน', icon: <Landmark /> },
    { name: 'ดูแลสัตว์', icon: <Dog /> },
    { name: 'ศิลปะ/สื่อ/ออกแบบ', icon: <Palette /> },
    { name: 'ดูแลเด็ก', icon: <Baby /> },
    { name: 'ทำความสะอาด', icon: <Sparkles /> },
    { name: 'ก่อสร้าง/ช่าง', icon: <Wrench /> },
    { name: 'บริการลูกค้า', icon: <Phone /> },
    { name: 'คนขับรถ/ส่งของ', icon: <Car /> },
    { name: 'การศึกษา', icon: <GraduationCap /> },
    { name: 'วิศวกรรม', icon: <Cog /> },
    { name: 'บันเทิง', icon: <Popcorn /> },
    { name: 'อีเวนต์/โปรโมชัน', icon: <PartyPopper /> },
    { name: 'แฟชั่น', icon: <Shirt /> },
    { name: 'สุขภาพ', icon: <Stethoscope /> },
    { name: 'ต้อนรับ', icon: <ClipboardList /> },
    { name: 'ไอที', icon: <Laptop /> },
    { name: 'กฎหมาย', icon: <Gavel /> },
    { name: 'จัดการ', icon: <UserCog /> },
    { name: 'โรงงาน', icon: <Factory /> },
    { name: 'ธุรการ/ออฟฟิศ', icon: <Clipboard /> },
    { name: 'งานออนไลน์', icon: <Globe /> },
    { name: 'ขาย/การตลาด', icon: <Megaphone /> },
    { name: 'เสริมสวย', icon: <Scissors /> },
    { name: 'วิทยาศาสตร์', icon: <FlaskConical /> },
    { name: 'รักษาความปลอดภัย', icon: <Shield /> },
    { name: 'กีฬา/สุขภาพ', icon: <HeartPulse /> },
    { name: 'คลังสินค้า', icon: <Warehouse /> },
    { name: 'นักเขียน/บรรณาธิการ', icon: <Pencil /> },
    // We will handle 'อื่นๆ' separately
];

const SeekerCategorySelection: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { jobId, phone } = location.state || {};
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [otherValue, setOtherValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleCategoryToggle = (categoryName: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryName)
                ? prev.filter(c => c !== categoryName)
                : [...prev, categoryName]
        );
    };

    const handleRemoveSelected = (name: string) => {
        setSelectedCategories(prev => prev.filter(c => c !== name));
    };

    const handleClearAll = () => setSelectedCategories([]);

    const handleSubmit = () => {
        console.log('Applying for job:', jobId);
        console.log('User phone:', phone);
        console.log('Selected categories:', selectedCategories);
        navigate('/seeker/apply/ekyc-id', { state: { jobId, phone, selectedCategories } });
    };

    const handleOtherSubmit = () => {
        // Remove previous 'other' category if it exists
        const newSelected = selectedCategories.filter(c => !c.startsWith('อื่นๆ:'));
        if (otherValue.trim()) {
            newSelected.push(`อื่นๆ: ${otherValue.trim()}`);
        }
        setSelectedCategories(newSelected);
    };

    const customOtherCategory = selectedCategories.find(c => c.startsWith('อื่นๆ:'));

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <main className="flex-1 w-full max-w-lg mx-auto p-4 pt-12 pb-24">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">คุณถนัดงานประเภทไหน?</h1>
                    <p className="text-muted-foreground mt-2">เลือกประเภทงานที่ใช่สำหรับคุณ (เลือกได้หลายข้อ)</p>
                </div>

                {/* Search + Clear */}
                <div className="mb-4 flex items-center gap-2">
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="ค้นหาประเภทงาน..."
                        className="h-11"
                    />
                    {selectedCategories.length > 0 && (
                        <Button variant="outline" onClick={handleClearAll} className="h-11">
                            ล้างทั้งหมด
                        </Button>
                    )}
                </div>

                {/* Selected tags */}
                {selectedCategories.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {selectedCategories.map((name) => (
                            <span key={name} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300 text-sm">
                                {name}
                                <button onClick={() => handleRemoveSelected(name)} className="ml-1 text-yellow-700 hover:text-yellow-900">
                                    <X className="w-4 h-4" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap justify-center gap-3">
                    {filteredCategories.map((category) => {
                        const isSelected = selectedCategories.includes(category.name);
                        return (
                            <button
                                key={category.name}
                                onClick={() => handleCategoryToggle(category.name)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200 ease-in-out transform hover:scale-105 ${
                                    isSelected 
                                    ? 'bg-yellow-400 border-yellow-500 text-black shadow-lg' 
                                    : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {React.cloneElement(category.icon, { className: 'w-5 h-5' })}
                                <span className="font-semibold text-sm">{category.name}</span>
                            </button>
                        );
                    })}

                    {/* Other Category Dialog */}
                    <Dialog onOpenChange={(open) => {
                        if (!open) {
                            handleOtherSubmit();
                        } else {
                            setOtherValue(customOtherCategory ? customOtherCategory.replace('อื่นๆ: ', '') : '');
                        }
                    }}>
                        <DialogTrigger asChild>
                            <button
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200 ease-in-out transform hover:scale-105 ${
                                    customOtherCategory
                                    ? 'bg-yellow-400 border-yellow-500 text-black shadow-lg' 
                                    : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <MoreHorizontal className="w-5 h-5" />
                                <span className="font-semibold text-sm">{customOtherCategory ? customOtherCategory : 'อื่นๆ'}</span>
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>ความสามารถอื่นๆ ของคุณ?</DialogTitle>
                                <DialogDescription>
                                  บอกเราสิ แล้ว AI จะช่วยหางานที่ใช่ให้เอง
                                </DialogDescription>
                            </DialogHeader>
                            <Input 
                                placeholder="เช่น ดูแลผู้สูงอายุ, สอนพิเศษ..."
                                value={otherValue}
                                onChange={(e) => setOtherValue(e.target.value)}
                                className="h-12 text-lg"
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button">บันทึก</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </main>
            <footer className="sticky bottom-0 w-full bg-white/80 backdrop-blur-sm border-t p-4">
                <div className="max-w-md mx-auto">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(-1)}
                            className="h-12 w-12 rounded-full bg-gray-200 text-black hover:bg-gray-300"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="w-full h-12 text-lg font-bold flex-1 bg-yellow-400 text-black hover:bg-yellow-500 rounded-lg shadow-md hover:shadow-lg"
                            disabled={selectedCategories.length === 0}
                        >
                            ถัดไป {selectedCategories.length > 0 ? `(${selectedCategories.length})` : ''}
                        </Button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SeekerCategorySelection;
