import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';

interface LeaveReviewModalProps {
    seekerName: string;
    onReviewSubmit: (rating: number, comment: string) => void;
    children: React.ReactNode; // The trigger button
}

const LeaveReviewModal: React.FC<LeaveReviewModalProps> = ({ seekerName, onReviewSubmit, children }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [open, setOpen] = useState(false);

    const handleSubmit = () => {
        onReviewSubmit(rating, comment);
        setOpen(false); // Close the modal after submission
        // Reset state for next time
        setRating(0);
        setComment('');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>รีวิวการทำงานของ {seekerName}</DialogTitle>
                    <DialogDescription>
                        ให้คะแนนและแสดงความคิดเห็นเพื่อช่วยให้ผู้หางานคนอื่นๆ ตัดสินใจได้ง่ายขึ้น
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="flex justify-center space-x-1">
                        {[...Array(5)].map((_, index) => {
                            const starValue = index + 1;
                            return (
                                <Star
                                    key={starValue}
                                    className={`w-10 h-10 cursor-pointer transition-colors ${
                                        starValue <= (hoverRating || rating)
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-300'
                                    }`}
                                    onMouseEnter={() => setHoverRating(starValue)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(starValue)}
                                />
                            );
                        })}
                    </div>
                    <Textarea
                        placeholder={`บอกเล่าประสบการณ์การทำงานกับ ${seekerName}...`}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                    />
                </div>
                <DialogFooter>
                    <Button 
                        onClick={handleSubmit}
                        disabled={rating === 0 || comment.trim() === ''}
                    >
                        ส่งรีวิว
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LeaveReviewModal;


