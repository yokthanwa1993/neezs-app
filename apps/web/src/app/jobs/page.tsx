import Link from "next/link";
import { apiClient } from "@neeiz/api-client";

interface Job {
  id: string;
  title: string;
  location?: string;
  salary?: number;
  jobType?: string;
  description?: string;
  images?: string[];
  createdAt?: string | { _seconds?: number; seconds?: number } | number | Date;
}

function formatDate(input: Job["createdAt"]): string {
  try {
    if (!input) return "";
    if (typeof input === "string") return new Date(input).toLocaleDateString();
    if (typeof input === "number") return new Date(input).toLocaleDateString();
    if (input instanceof Date) return input.toLocaleDateString();
    const sec = (input as any)._seconds ?? (input as any).seconds;
    if (typeof sec === "number") return new Date(sec * 1000).toLocaleDateString();
  } catch {}
  return "";
}

function formatSalary(salary?: number): string {
  if (typeof salary !== "number" || Number.isNaN(salary)) return "-";
  try {
    return `฿${salary.toLocaleString("th-TH")}`;
  } catch {
    return `฿${salary}`;
  }
}

async function getJobs(): Promise<Job[]> {
  try {
    const res = await apiClient.get("/api/jobs");
    return res.data.items || [];
  } catch (e) {
    console.error("Failed to fetch jobs:", e);
    return [];
  }
}

export default async function JobsPage() {
  const jobs = await getJobs();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Neeiz
              </Link>
              <span className="ml-2 text-sm text-gray-500">Job Platform</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                เข้าสู่ระบบ
              </Link>
              <Link 
                href="/employer/post-job" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                ลงประกาศงาน
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">ค้นหางาน</h1>
          
          {/* Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ตำแหน่งงาน
              </label>
              <input
                type="text"
                placeholder="เช่น Frontend Developer, Marketing Manager"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สถานที่
              </label>
              <input
                type="text"
                placeholder="เช่น กรุงเทพ, เชียงใหม่"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ประเภทงาน
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">ทั้งหมด</option>
                <option value="fulltime">งานประจำ</option>
                <option value="parttime">งานพาร์ทไทม์</option>
                <option value="contract">งานสัญญาจ้าง</option>
                <option value="internship">งานฝึกงาน</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium">
                ค้นหา
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Cards Container */}
          <div className="lg:col-span-2 space-y-4">
            {jobs && jobs.length > 0 ? (
              jobs.map((job: Job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {job.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <span>📍 {job.location || '-'}</span>
                        <span>💰 {formatSalary(job.salary)}</span>
                        <span>⏰ {job.jobType || '-'}</span>
                      </div>
                      {job.description && (
                        <p className="text-gray-700 mb-4 line-clamp-3">
                          {job.description}
                        </p>
                      )}
                      {Array.isArray(job.images) && job.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto mb-2">
                          {job.images.slice(0, 3).map((url, i) => (
                            <img key={i} src={url} alt={`job-${i}`} className="h-16 w-24 object-cover rounded border" />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-sm mt-1">{formatDate(job.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      ดูรายละเอียด →
                    </Link>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                      สมัครงาน
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900">ไม่พบตำแหน่งงาน</h3>
                <p className="text-gray-600 mt-2">ขณะนี้ยังไม่มีตำแหน่งงานที่เปิดรับ โปรดกลับมาตรวจสอบอีกครั้ง</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Filter Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ตัวกรอง</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ประสบการณ์
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">ไม่มีประสบการณ์</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">1-3 ปี</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">3-5 ปี</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">5 ปีขึ้นไป</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เงินเดือน
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">ต่ำกว่า 20,000 บาท</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">20,000 - 35,000 บาท</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">35,000 - 50,000 บาท</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">50,000 บาทขึ้นไป</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">สถิติ</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">งานทั้งหมด</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">งานใหม่วันนี้</span>
                  <span className="font-semibold text-green-600">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">บริษัทที่ร่วมงาน</span>
                  <span className="font-semibold">156</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
