import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const reviews = [
    {
        employer: 'ร้านกาแฟใจดี',
        rating: 5,
        comment: 'ทำงานดีมากครับ ตรงต่อเวลาและมีความรับผิดชอบสูงมาก โอกาสหน้าใช้บริการอีกแน่นอนครับ',
        date: '28 พ.ค. 2567',
    },
    {
        employer: 'Event Organizer Pro',
        rating: 4.5,
        comment: 'เป็นทีมงานที่ดี ช่วยให้งานอีเวนต์ราบรื่นไปได้ด้วยดี',
        date: '15 พ.ค. 2567',
    },
    {
        employer: 'คุณสมศรี (ทำความสะอาดบ้าน)',
        rating: 5,
        comment: 'สะอาดเรียบร้อยทุกมุมจริงๆ ค่ะ ประทับใจมาก',
        date: '2 เม.ย. 2567',
    },
];

const StarRating = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
            {halfStar && <StarHalf key="half" className="w-5 h-5 text-yellow-400 fill-current" />}
            {[...Array(emptyStars)].map((_, i) => (
                <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" />
            ))}
        </div>
    );
};


const SeekerProfileReviewsTab: React.FC = () => {
    // When actual data is available, you would replace the mock `reviews` array with a prop or a data fetch.
    const hasReviews = reviews && reviews.length > 0;

    return (
        <div className="animate-fade-in">
            {hasReviews ? (
                 <div className="space-y-6 py-6">
                    {reviews.map((review, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col">
                                    <h4 className="font-bold text-lg text-gray-800">{review.employer}</h4>
                                    <p className="text-sm text-gray-400 mt-1">{review.date}</p>
                                </div>
                                <StarRating rating={review.rating} />
                            </div>
                            <p className="mt-4 text-gray-600 leading-relaxed">{review.comment}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <Star className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-800">ยังไม่มีรีวิว</h3>
                    <p className="mt-1 text-sm">รีวิวจากผู้จ้างงานจะปรากฏที่นี่หลังคุณทำงานเสร็จ</p>
                </div>
            )}
        </div>
    );
};

export default SeekerProfileReviewsTab;