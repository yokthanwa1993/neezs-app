import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Bot, X, MapPin, Pencil, Home, Globe, Search, Loader2, LocateFixed, ChevronLeft } from 'lucide-react';
import { GoogleMap, LoadScript, useLoadScript } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { runtimeConfig } from '@/lib/runtimeConfig';


const libraries: ('places')[] = ['places'];

const SearchOverlay: React.FC<{ onSelectPlace: (address: string) => void; onBack: () => void; }> = ({ onSelectPlace, onBack }) => {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: { componentRestrictions: { country: 'th' } },
        debounce: 300,
    });

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col pb-20">
            <header className="p-4 pb-2 shrink-0">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        disabled={!ready}
                        placeholder="ค้นหาที่อยู่หรือสถานที่"
                        className="w-full pl-10"
                        autoFocus
                    />
                    {value && (
                        <Button variant="ghost" size="icon" onClick={() => setValue('')} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </header>
            <main className="flex-1 overflow-y-auto">
                {status === 'OK' && (
                <ul>
                    {data.map(({ place_id, description, structured_formatting }) => (
                    <li key={place_id} onClick={() => onSelectPlace(description)} className="p-4 border-b cursor-pointer hover:bg-gray-50">
                        <p className="font-semibold">{structured_formatting.main_text}</p>
                        <p className="text-sm text-gray-600">{structured_formatting.secondary_text}</p>
                    </li>
                    ))}
                </ul>
                )}
            </main>
            <footer className="p-4 border-t">
                <Button onClick={onBack} className="w-full h-12 text-lg font-bold bg-yellow-400 text-black hover:bg-yellow-500 rounded-lg">
                    ย้อนกลับ
                </Button>
            </footer>
        </div>
    )
}

const AddJob: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const initialState = location.state || {};
    const [step, setStep] = useState(initialState.step || 1);
    const [locationMode, setLocationMode] = useState<'onsite' | 'online' | null>(null);
    const [aiPrompt, setAiPrompt] = useState(initialState.aiPrompt || '');
    const [images, setImages] = useState(initialState.images || []);
    const [locationDetails, setLocationDetails] = useState<{ lat: number; lng: number; address: string } | null>(null);
    const [mapCenter, setMapCenter] = useState({ lat: 13.736717, lng: 100.523186 });
    const [isSearching, setIsSearching] = useState(false);

    const mapRef = useRef<google.maps.Map | null>(null);
    const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: runtimeConfig.googleMapsApiKey,
        libraries,
        language: 'th',
    });

    const handleLocationUpdate = (lat: number, lng: number, address?: string) => {
        setMapCenter({ lat, lng });
        if (address) {
             setLocationDetails({ lat, lng, address });
             return;
        }

        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    setLocationDetails({ lat, lng, address: results[0].formatted_address });
                } else {
                    setLocationDetails({ lat, lng, address: 'ไม่สามารถระบุที่อยู่ได้' });
                }
            });
        }, 500);
    };

    const handleSelectPlace = async (address: string) => {
        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            handleLocationUpdate(lat, lng, address);
            setIsSearching(false);
        } catch (error) {
            console.error('Error: ', error);
        }
    };
    
    const requestCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => handleLocationUpdate(position.coords.latitude, position.coords.longitude),
                (error) => console.error('Could not get current location:', error)
            );
        }
    };

    useEffect(() => {
        if (isLoaded && !locationDetails) {
            requestCurrentLocation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded]);



    const handleNext = () => {
        if (isSearching) return;

        if (step === 1) {
            navigate('/employer/job-upload', {
                state: {
                    aiPrompt,
                }
            });
            return;
        }
        
        if (step === 2) {
            if (locationMode === 'onsite') {
                setStep(3);
            } else if (locationMode === 'online') {
                navigate('/employer/job-schedule', {
                    state: {
                        aiPrompt,
                        images,
                        locationMode,
                        locationDetails: null
                    }
                });
            }
        } else if (step === 3) {
             if (locationDetails) {
                navigate('/employer/job-schedule', {
                    state: {
                        aiPrompt,
                        images,
                        locationMode,
                        locationDetails
                    }
                });
            } else {
                alert('กรุณาเลือกตำแหน่งบนแผนที่');
            }
        }
    };

    const handleOnlineJobNext = () => {
        navigate('/employer/job-schedule', {
            state: {
                aiPrompt,
                images,
                locationMode: 'online',
                locationDetails: null
            }
        });
    };

    const handleClose = () => {
        if (isSearching) return;

        if (step === 3) {
            setStep(2);
        } else if (step === 2) {
            setStep(1);
            setLocationMode(null);
        } else {
            navigate(-1);
        }
    };
    
    if (step === 3) {
        if (loadError) return <div>เกิดข้อผิดพลาดในการโหลดแผนที่</div>;
        if (!isLoaded) return <div className="fixed inset-0 bg-white z-50 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;

        return (
            <>
            {isSearching && <SearchOverlay onSelectPlace={handleSelectPlace} onBack={() => setIsSearching(false)} />}
            <div className="fixed inset-0 bg-white flex flex-col">
                <div className="flex-1 min-h-0 flex flex-col">
                    <div className="p-4 pb-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <Input
                                readOnly
                                placeholder="ค้นหาที่อยู่หรือสถานที่"
                                onClick={() => setIsSearching(true)}
                                className="w-full cursor-pointer pl-10"
                            />
                        </div>
                    </div>
                    <div className="relative flex-grow">
                        <GoogleMap
                            mapContainerStyle={{ height: '100%', width: '100%' }}
                            center={mapCenter}
                            zoom={17}
                            onDragEnd={() => {
                                if (mapRef.current) {
                                    const newCenter = mapRef.current.getCenter();
                                    if(newCenter) handleLocationUpdate(newCenter.lat(), newCenter.lng());
                                }
                            }}
                            options={{ disableDefaultUI: true, gestureHandling: 'greedy' }}
                            onLoad={(map) => { mapRef.current = map; }}
                        >
                        </GoogleMap>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ pointerEvents: 'none' }}>
                            <MapPin className="h-12 w-12 fill-yellow-500 stroke-black" style={{ transform: 'translateY(-50%)' }} strokeWidth={1} />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={requestCurrentLocation}
                            className="absolute bottom-4 right-4 bg-white rounded-full shadow-lg h-12 w-12"
                        >
                            <LocateFixed className="h-6 w-6 text-gray-700" />
                        </Button>
                    </div>
                </div>
                <footer className="w-full border-t p-4 bg-white shrink-0 pb-24">
                    <div className="mb-3">
                        <p className="font-semibold text-lg">Delivery address</p>
                        <div className="flex justify-between items-start mt-1">
                            <p className="text-gray-700 pr-4">{locationDetails?.address || 'กำลังค้นหา...'}</p>
                            <Button variant="ghost" size="icon" className="text-gray-500">
                                <Pencil className="h-5 w-5"/>
                            </Button>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full items-center">
                        <Button
                            onClick={handleClose}
                            className="h-14 w-14 rounded-full bg-black text-white flex items-center justify-center p-0 hover:bg-black/90"
                            type="button"
                        >
                            <X className="w-9 h-9 font-bold" strokeWidth={3} />
                        </Button>
                        <Button
                            onClick={handleNext}
                            className="h-14 flex-1 text-lg font-bold"
                            disabled={!locationDetails}
                            type="button"
                        >
                            Confirm this address
                        </Button>
                    </div>
                </footer>
            </div>
            </>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md flex-1 flex flex-col justify-center">
                {step === 1 && (
                    <>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow">
                                <Bot className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">วันนี้คุณต้องการทำงานอะไร?</h1>
                                <p className="text-sm text-gray-600">พิมพ์สิ่งที่ต้องการ เดี๋ยว AI ช่วยจัดการต่อให้</p>
                            </div>
                        </div>
                        <div className="rounded-2xl border bg-white p-4 shadow-sm">
                            <Textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="เช่น ต้องการบาริสต้าพาร์ทไทม์ วันเสาร์-อาทิตย์ ที่สุขุมวิท"
                            rows={10}
                            className="resize-y text-base"
                            />
                            <div className="mt-4 pt-4 border-t">
                                <Button
                                    onClick={handleNext}
                                    className="w-full h-12 text-lg font-bold bg-yellow-400 text-black hover:bg-yellow-500 rounded-lg"
                                    disabled={!aiPrompt.trim()}
                                >
                                    ถัดไป
                                </Button>
                            </div>
                        </div>
                    </>
                )}
                {step === 2 && (
                    <div className="mt-6 w-full">
                        <div className="mb-3 font-semibold flex items-center gap-2 text-2xl">
                        <MapPin className="w-7 h-7 text-primary" />
                        <span>คุณต้องการให้ทำงานที่ไหน?</span>
                        </div>
                        <div className="grid grid-cols-1 gap-4 mt-4">
                        <button
                            type="button"
                            onClick={() => setLocationMode('onsite')}
                            className={`border rounded-xl p-4 text-left transition shadow-sm hover:shadow-md ${
                            locationMode === 'onsite' ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                            <Home className="w-8 h-8 text-primary" />
                            <div>
                                <div className="font-semibold text-lg">สถานที่จริง (ออนไซต์)</div>
                                <div className="text-sm text-gray-600">ต้องปักหมุดตำแหน่งในแผนที่</div>
                            </div>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setLocationMode('online');
                                handleOnlineJobNext();
                            }}
                            className={`border rounded-xl p-4 text-left transition shadow-sm hover:shadow-md ${
                            locationMode === 'online' ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                            <Globe className="w-8 h-8 text-primary" />
                            <div>
                                <div className="font-semibold text-lg">ออนไลน์ / ฟรีแลนซ์</div>
                                <div className="text-sm text-gray-600">ไม่ต้องระบุตำแหน่งสถานที่</div>
                            </div>
                            </div>
                        </button>
                        </div>
                        <div className="mt-6 pt-4 border-t">
                            <Button
                                onClick={handleNext}
                                className="w-full h-12 text-lg font-bold bg-yellow-400 text-black hover:bg-yellow-500 rounded-lg"
                                disabled={!locationMode}
                            >
                                ถัดไป
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            {step === 2 && (
            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50 max-w-md mx-auto w-full">
                <div className="flex gap-3 w-full items-center">
                <Button
                    onClick={handleClose}
                    className="h-14 w-14 rounded-full bg-gray-200 text-black flex items-center justify-center p-0 hover:bg-gray-300"
                    type="button"
                    style={{ minWidth: 56, minHeight: 56 }}
                >
                    <ChevronLeft className="w-9 h-9 font-bold" strokeWidth={3} />
                </Button>
                <Button
                    onClick={() => navigate('/employer/my-jobs')}
                    className="h-14 w-14 rounded-full bg-black text-white flex items-center justify-center p-0 hover:bg-black/90"
                    type="button"
                    style={{ minWidth: 56, minHeight: 56 }}
                >
                    <X className="w-9 h-9 font-bold" strokeWidth={3} />
                </Button>
                <Button
                    onClick={handleNext}
                    className="h-14 flex-1 text-lg font-bold"
                    disabled={!locationMode}
                    type="button"
                >
                    {locationMode === 'onsite' ? 'ยืนยัน' : 'ถัดไป'}
                </Button>
                </div>
            </footer>
            )}
        </div>
    );
};

export default AddJob;