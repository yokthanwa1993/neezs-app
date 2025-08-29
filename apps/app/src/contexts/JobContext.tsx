import React, { createContext, useState, useContext, ReactNode } from 'react';

// Based on the type in EmployerHome.tsx
export interface Job {
  id: number;
  images: string[];
  title: string;
  location: string;
  price: string;
  lat: number;
  lng: number;
  description: string;
}

interface JobContextType {
  jobs: Job[];
  completedJobs: Job[];
  addJob: (newJob: Omit<Job, 'id'>) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

// Initial jobs from the mock data in EmployerHome
const initialJobs: Job[] = [
  {
    id: 101,
    images: [
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    ],
    title: 'ตัดต่อวีดีโอ',
    location: 'กทม',
    price: '฿15,000',
    lat: 13.7563,
    lng: 100.5018,
    description: 'ตัดต่อวีดีโอสำหรับโฆษณาสินค้า ความยาว 2 นาที',
  },
  {
    id: 102,
    images: [
      'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=800&q=80',
      'https://images.unsplash.com/photo-1525803377221-4213da3d3512?w=800&q=80',
    ],
    title: 'ถ่ายภาพสินค้า',
    location: 'นนทบุรี',
    price: '฿8,000',
    lat: 13.8608,
    lng: 100.5144,
    description: 'ถ่ายภาพสินค้า 10 ชิ้น พร้อมรีทัชเบื้องต้น',
  },
  {
    id: 103,
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    ],
    title: 'ออกแบบโปสเตอร์',
    location: 'เชียงใหม่',
    price: '฿5,500',
    lat: 18.7883,
    lng: 98.9853,
    description: 'ออกแบบโปสเตอร์สำหรับงานอีเวนท์ ขนาด A3',
  },
];

const completedJobs: Job[] = [
    {
    id: 201,
    images: [
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    ],
    title: 'วีดีโอโปรโมท',
    location: 'ภูเก็ต',
    price: '฿12,000',
    lat: 7.8804,
    lng: 98.3923,
    description: 'วีดีโอโปรโมทโรงแรม ความยาว 1 นาที',
  },
]


export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  const addJob = (newJobData: Omit<Job, 'id' | 'images'> & { images?: string[] }) => {
    const newJob: Job = {
      ...newJobData,
      id: Date.now(), // Simple ID generation
      images: newJobData.images || [
        `https://source.unsplash.com/800x600/?${encodeURIComponent(newJobData.title)}`,
        `https://source.unsplash.com/800x600/?${encodeURIComponent(newJobData.title)},job`
      ],
    };
    setJobs(prevJobs => [newJob, ...prevJobs]);
  };

  return (
    <JobContext.Provider value={{ jobs, completedJobs, addJob }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
