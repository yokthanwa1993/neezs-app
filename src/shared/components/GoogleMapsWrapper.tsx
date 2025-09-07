import { GoogleMap, Marker, useLoadScript, InfoWindow } from "@react-google-maps/api";
import React, { useEffect, useRef, useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import { runtimeConfig } from "@/shared/lib/runtimeConfig";

type Job = {
  id: number;
  title: string;
  company: string;
  location: { lat: number; lng: number };
  salary: string;
};

type GoogleMapsWrapperProps = {
  jobs: Job[];
  selectedJob: Job | null;
  onSelectJob: (job: Job | null) => void;
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
} as const;

const mapOptions = {
  disableDefaultUI: true,
};

export const GoogleMapsWrapper = ({ jobs, selectedJob, onSelectJob }: GoogleMapsWrapperProps) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: runtimeConfig.googleMapsApiKey,
    libraries: ["places"],
    version: "weekly",
    preventGoogleFontsLoading: true,
    authReferrerPolicy: "origin",
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const center = useMemo(() => ({ lat: 13.7563, lng: 100.5018 }), []); // Default to Bangkok

  useEffect(() => {
    if (mapRef.current && selectedJob) {
      mapRef.current.panTo(selectedJob.location);
      mapRef.current.setZoom(14);
    }
  }, [selectedJob]);

  if (loadError) return <p>โหลด Google Maps ไม่สำเร็จ. กรุณาตรวจสอบ API Key.</p>;
  if (!isLoaded) return <div className="w-full h-full flex items-center justify-center bg-gray-200"><p>กำลังโหลดแผนที่…</p></div>;

  return (
    <div className="w-full h-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        options={mapOptions}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        {jobs.map((job) => (
          <Marker
            key={job.id}
            position={job.location}
            onClick={() => onSelectJob(job)}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="${selectedJob?.id === job.id ? '#10B981' : '#EF4444'}" stroke="white" stroke-width="3"/>
                  <text x="20" y="25" text-anchor="middle" fill="white" font-size="12" font-weight="bold">$${job.salary.replace(/[^0-9]/g, '')}</text>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 40)
            }}
          />
        ))}

        {selectedJob && (
          <InfoWindow
            position={selectedJob.location}
            onCloseClick={() => onSelectJob(null)}
          >
            <div className="p-2 min-w-48">
              <h3 className="font-bold text-md">{selectedJob.title}</h3>
              <p className="text-sm text-gray-600">{selectedJob.company}</p>
              <p className="text-sm text-green-600 font-semibold mt-1">{selectedJob.salary}</p>
              <Button
                size="sm"
                className="mt-2 w-full"
                onClick={() => {
                  // Handle job application
                  console.log('Apply for job:', selectedJob.id);
                }}
              >
                สมัครงาน
              </Button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};
