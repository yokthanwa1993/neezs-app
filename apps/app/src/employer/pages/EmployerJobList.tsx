import React from 'react';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import StoryCard from '@/shared/components/StoryCard';
import '@/shared/styles/utilities.css';
import { useEmployerAuth } from '../contexts/EmployerAuthContext';
import EmployerLogin from '../components/EmployerLogin';
import { logger } from '@/shared/utils/logger';

type Seeker = { src: string; rating?: number; name?: string };

const mockJobs = {
  active: [
    { 
      id: 1, 
      title: 'พนักงานเสิร์ฟ Full-time', 
      applicants: 12, 
      status: 'Active', 
      location: 'สยามพารากอน', 
      applicantAvatars: [
        { src: 'https://i.pravatar.cc/150?u=a', rating: 5, name: 'Sky Boonkrajang' },
        { src: 'https://i.pravatar.cc/150?u=b', rating: 4, name: 'Trustchai Champ' },
        { src: 'https://i.pravatar.cc/150?u=c', rating: 4, name: 'gxlfntw6119' },
        { src: 'https://i.pravatar.cc/150?u=d', rating: 3, name: 'คมกริช จงไกรจักร' },
        { src: 'https://i.pravatar.cc/150?u=e', rating: 5, name: 'ปู ฟองเบียร์' },
      ] as Seeker[], 
      images: [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
        'https://images.unsplash.com/photo-1541542684-4a3b5f9c3f36?w=1200&q=80',
        'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&q=80',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80'
      ] 
    },
    { 
      id: 2, 
      title: 'พนักงานทำความสะอาด', 
      applicants: 5, 
      status: 'Active', 
      location: 'เซ็นทรัลเวิลด์', 
      applicantAvatars: [
        { src: 'https://i.pravatar.cc/150?u=f', rating: 5, name: 'Nicha' },
        { src: 'https://i.pravatar.cc/150?u=g', rating: 3, name: 'Pattarawat' },
        { src: 'https://i.pravatar.cc/150?u=h', rating: 4, name: 'Saran' },
      ] as Seeker[], 
      images: [
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
        'https://images.unsplash.com/photo-1603712725038-92c104815203?w=1200&q=80',
        'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1200&q=80',
        'https://images.unsplash.com/photo-1581579188871-45ea61f2a0c8?w=1200&q=80',
        'https://images.unsplash.com/photo-1581579188869-7eaae78dc7ed?w=1200&q=80'
      ] 
    },
  ],
  drafts: [
    { 
      id: 3, 
      title: 'บาริสต้า', 
      applicants: 0, 
      status: 'Draft', 
      location: 'เอ็มควอเทียร์', 
      applicantAvatars: [] as Seeker[], 
      images: [
        'https://images.unsplash.com/photo-1511920183276-5941b6fb4513?w=1200&q=80',
        'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=1200&q=80',
        'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=1200&q=80',
        'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=1200&q=80'
      ] 
    },
  ],
  closed: [
    { 
      id: 4, 
      title: 'พนักงานต้อนรับ', 
      applicants: 25, 
      status: 'Closed', 
      location: 'โรงแรมแมนดาริน', 
      applicantAvatars: [
        { src: 'https://i.pravatar.cc/150?u=i', rating: 5, name: 'Mild' },
        { src: 'https://i.pravatar.cc/150?u=j', rating: 4, name: 'June' },
      ] as Seeker[], 
      images: [
        'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=1200&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
        'https://images.unsplash.com/photo-1556745751-3d5f3d7d4a2d?w=1200&q=80',
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80'
      ] 
    },
  ],
};

// Removed dashboard mock stats per request

const JobCard = ({ job }: { job: any }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 shadow-sm">Active</Badge>;
      case 'Draft':
        return <Badge variant="secondary" className="shadow-sm">Draft</Badge>;
      case 'Closed':
        return <Badge variant="outline" className="border-red-200 text-red-600 bg-white shadow-sm">Closed</Badge>;
      default:
        return <Badge className="shadow-sm">{status}</Badge>;
    }
  };

  // gap-3 = 0.75rem; we show 3.5 cards, so there are 2.5 gaps in view.
  const basisValue = 'calc((100% - 0.75rem * 2.5) / 3.5)';

  return (
    <Card className="mb-6 overflow-hidden rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-300 bg-white -mx-4 w-[calc(100%+2rem)]">
      <div className="relative">
        {/* Single-image horizontal slider with smooth snap */}
        <div className="p-0">
          <div className="overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth">
            <div className="flex w-full">
              {job.images.map((image: string, index: number) => (
                <div key={index} className="w-full shrink-0 snap-start">
                  <img
                    src={image}
                    alt={`${job.title} ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          {getStatusBadge(job.status)}
        </div>
      </div>

      <CardContent className="p-6 pt-4">
        <div className="space-y-4">
          {/* Job Title and Location */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{job.location}</span>
            </div>
          </div>

          {/* Applicants Section */}
          <div>
            <p className="text-sm text-gray-600 mb-3">
              {job.applicants} คนสมัคร
            </p>
            
              {job.applicantAvatars.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {job.applicantAvatars.slice(0, 4).map((seeker: Seeker, index: number) => (
                  <div key={index} className="relative">
                    <img
                      className="inline-block h-12 w-12 rounded-full ring-2 ring-white object-cover"
                      src={seeker.src}
                      alt={seeker.name || `Applicant ${index + 1}`}
                    />
                  </div>
                ))}
                {job.applicants > 4 && (
                  <div className="relative">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full ring-2 ring-white bg-gray-100 text-sm font-medium text-gray-600">
                      +{job.applicants - 4}
                    </div>
                  </div>
                )}
              </div>
              )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button asChild variant="outline" className="flex-1">
              <Link to={`/employer/job/${job.id}/applicants`}>ดูผู้สมัคร</Link>
            </Button>
            <Button asChild className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500">
              <Link to={`/employer/job/${job.id}/detail`}>จัดการงาน</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EmployerJobList = () => {
  const { user, isAuthenticated, isLoading } = useEmployerAuth();

  logger.info('EmployerJobList: Component rendered', {
    user: user ? `${user.uid} (${user.email})` : 'null',
    isAuthenticated,
    isLoading
  });

  // ถ้ายังไม่ได้ login แสดงหน้า login แทน
  if (!isAuthenticated) {
    logger.info('EmployerJobList: User not authenticated, showing login component');
    return <EmployerLogin />;
  }

  // ถ้ากำลังโหลด auth state
  if (isLoading) {
    logger.info('EmployerJobList: Still loading auth state, showing loading screen');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-4 rounded-2xl shadow-xl w-full max-w-mobile-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            กำลังตรวจสอบสถานะ...
          </h2>
          <p className="text-gray-600">🔍 โปรดรอสักครู่...</p>
        </div>
      </div>
    );
  }

  logger.info('EmployerJobList: Authenticated user detected, showing job list content');

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50/50 to-gray-50 pb-24 relative">
      <div className="p-4">
        {/* Header - Dashboard style */}
        <div className="space-y-4 mb-2">
          {/* Header removed per request */}

          {/* Removed PromoGrid section per request */}
          {/* Removed quick stats row per request */}
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm rounded-3xl p-2 mb-6 h-14 shadow-lg border border-yellow-200">
            <TabsTrigger value="active" className="rounded-2xl font-semibold data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-gray-900">
              Active ({mockJobs.active.length})
            </TabsTrigger>
            <TabsTrigger value="drafts" className="rounded-2xl font-semibold data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-gray-900">
              Drafts ({mockJobs.drafts.length})
            </TabsTrigger>
            <TabsTrigger value="closed" className="rounded-2xl font-semibold data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-gray-900">
              Closed ({mockJobs.closed.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4">
            {mockJobs.active.length > 0 ? (
              mockJobs.active.map((job: any) => <JobCard key={job.id} job={job} />)
            ) : (
              <div className="text-center text-gray-600 mt-12">
                <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M5 7v14h14V7M9 3h6"/></svg>
                </div>
                <p className="font-medium">ยังไม่มีงานที่เปิดอยู่</p>
                <p className="text-sm">เริ่มต้นด้วยการสร้างงานใหม่</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="drafts" className="mt-4">
            {mockJobs.drafts.length > 0 ? (
              mockJobs.drafts.map((job: any) => <JobCard key={job.id} job={job} />)
            ) : (
              <div className="text-center text-gray-600 mt-12">
                <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M7 8h10M5 4h14v16H5z"/></svg>
                </div>
                <p className="font-medium">ยังไม่มีฉบับร่าง</p>
                <p className="text-sm">บันทึกงานของคุณไว้เป็นร่างก่อนเผยแพร่</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="closed" className="mt-4">
            {mockJobs.closed.length > 0 ? (
              mockJobs.closed.map((job: any) => <JobCard key={job.id} job={job} />)
            ) : (
              <div className="text-center text-gray-600 mt-12">
                <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </div>
                <p className="font-medium">ยังไม่มีงานที่ปิดแล้ว</p>
                <p className="text-sm">งานที่ปิดแล้วจะแสดงในหน้านี้</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployerJobList;
