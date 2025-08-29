import React from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import StoryCard from '@/components/StoryCard';
import '@/styles/utilities.css';

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
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80'
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
        'https://images.unsplash.com/photo-1603712725038-92c104815203?w=1200&q=80'
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
        'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=1200&q=80'
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
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80'
      ] 
    },
  ],
};

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
    <Card className="mb-6 overflow-hidden rounded-2xl border shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white -mx-4 w-[calc(100%+2rem)]">
      <div className="relative">
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar">
          {job.images.map((img: string, index: number) => (
            <img
              key={index}
              src={img}
              alt={`${job.title} ${index + 1}`}
              className="w-full h-56 object-cover snap-center flex-shrink-0"
            />
          ))}
        </div>
        <div className="absolute top-4 right-4">
          {getStatusBadge(job.status)}
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="font-bold text-xl text-gray-900 truncate mb-2">{job.title}</h3>
        <div className="flex items-center text-base text-gray-500 mb-4">
          <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
          <span>{job.location}</span>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {job.applicants > 0 ? (
              <div className="relative flex-1 min-w-0">
                <div className="flex items-stretch gap-3 overflow-x-auto pb-2 snap-x snap-mandatory no-scrollbar">
                  {/* Create story card as first item */}
                  <div style={{ flex: `0 0 ${basisValue}` }}>
                    <StoryCard
                      isCreate
                      background={job.images[0]}
                      avatar={job.applicantAvatars[0]?.src || 'https://i.pravatar.cc/150?img=1'}
                      name="Create story"
                    />
                  </div>
                  {job.applicantAvatars.map((app: Seeker, index: number) => (
                    <div key={index} style={{ flex: `0 0 ${basisValue}` }}>
                      <StoryCard
                        background={job.images[index % job.images.length]}
                        avatar={app.src}
                        name={app.name || `ผู้สมัคร ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-base text-gray-500">No applicants yet</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EmployerHome = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      <div className="p-4">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-200/70 rounded-lg p-1 mb-4">
            <TabsTrigger value="active">Active ({mockJobs.active.length})</TabsTrigger>
            <TabsTrigger value="drafts">Drafts ({mockJobs.drafts.length})</TabsTrigger>
            <TabsTrigger value="closed">Closed ({mockJobs.closed.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4">
            {mockJobs.active.length > 0 ? (
              mockJobs.active.map((job: any) => <JobCard key={job.id} job={job} />)
            ) : (
              <p className="text-center text-gray-500 mt-12">You have no active jobs.</p>
            )}
          </TabsContent>
          <TabsContent value="drafts" className="mt-4">
            {mockJobs.drafts.length > 0 ? (
              mockJobs.drafts.map((job: any) => <JobCard key={job.id} job={job} />)
            ) : (
              <p className="text-center text-gray-500 mt-12">You have no draft jobs.</p>
            )}
          </TabsContent>
          <TabsContent value="closed" className="mt-4">
            {mockJobs.closed.length > 0 ? (
              mockJobs.closed.map((job: any) => <JobCard key={job.id} job={job} />)
            ) : (
              <p className="text-center text-gray-500 mt-12">You have no closed jobs.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployerHome;