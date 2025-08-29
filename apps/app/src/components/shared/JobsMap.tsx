import { GoogleMap, Marker, useLoadScript, InfoWindow } from "@react-google-maps/api";
import React, { useEffect, useRef, useMemo } from "react";
import { Button } from "../ui/button";

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

const mapContainerStyle = {
  width: "100%",
  height: "100%",
} as const;

const mapOptions = {
  disableDefaultUI: true,
};

export const JobsMap = ({ jobs, selectedJob, onSelectJob }: JobsMapProps) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
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
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={11}
      options={mapOptions}
      onLoad={(map) => {
        mapRef.current = map;
      }}
    >
      {jobs.map((job) => (
        <Marker
          key={job.id}
          position={job.location}
          title={job.title}
          onClick={() => {
            onSelectJob(job);
          }}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: selectedJob?.id === job.id ? 10 : 7,
            fillColor: selectedJob?.id === job.id ? "#10B981" : "#EF4444",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "white",
          }}
        />
      ))}

      {selectedJob && (
        <InfoWindow
          position={selectedJob.location}
          onCloseClick={() => {
            onSelectJob(null);
          }}
        >
          <div className="p-1 max-w-xs">
            <h3 className="font-bold text-md">{selectedJob.title}</h3>
            <p className="text-sm text-gray-600">{selectedJob.company}</p>
            <p className="text-sm text-green-600 font-semibold mt-1">{selectedJob.salary}</p>
            <Button size="sm" className="mt-2 w-full">ดูรายละเอียด</Button>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};