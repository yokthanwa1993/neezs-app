import React from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

type Job = {
  id: number;
  title: string;
  company: string;
  location: { lat: number; lng: number };
  salary: string;
};

type JobsMapProps = {
  jobs: Job[];
  selectedJob: Job | null;
  onSelectJob: (job: Job | null) => void;
};

// This component is now a simple list, not a map.
// This removes the Google Maps dependency and its third-party cookies.
export const JobsMap = ({ jobs, selectedJob, onSelectJob }: JobsMapProps) => {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          ตำแหน่งงานใกล้เคียง
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto h-[calc(100%-4rem)]">
        <p className="text-xs text-gray-500 mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          การแสดงผลแผนที่ถูกปิดใช้งานชั่วคราวเพื่อเพิ่มความเป็นส่วนตัวและลดการใช้คุกกี้จากภายนอก
        </p>
        <div className="space-y-2">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => onSelectJob(job)}
              className={`p-3 rounded-lg cursor-pointer border ${
                selectedJob?.id === job.id
                  ? 'bg-blue-50 border-blue-500'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <h4 className="font-semibold">{job.title}</h4>
              <p className="text-sm text-gray-600">{job.company}</p>
              <p className="text-sm text-green-600 font-semibold mt-1">{job.salary}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobsMap;