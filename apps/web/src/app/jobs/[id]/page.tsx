import Link from "next/link";
import { apiClient } from "@neeiz/api-client";

interface JobDetail {
  id: string;
  title: string;
  description?: string;
  location?: string;
  salary?: number;
  jobType?: string;
  images?: string[];
  createdAt?: string | { _seconds?: number; seconds?: number } | number | Date;
}

function formatDate(input: JobDetail["createdAt"]): string {
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

async function getJob(id: string): Promise<JobDetail | null> {
  try {
    const res = await apiClient.get(`/api/jobs/${id}`);
    return res.data || null;
  } catch (e) {
    console.error("Failed to fetch job detail:", e);
    return null;
  }
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await getJob(params.id);
  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <Link href="/jobs" className="text-blue-600">← กลับไปหน้ารายชื่องาน</Link>
          <div className="mt-6 bg-white rounded shadow p-6">ไม่พบงานนี้</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-gray-900">Neeiz</Link>
            <Link href="/jobs" className="text-blue-600 hover:text-blue-700">ดูงานทั้งหมด</Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <Link href="/jobs" className="text-blue-600">← กลับไปหน้ารายชื่องาน</Link>
        <div className="mt-4 bg-white rounded-lg shadow p-6 space-y-3">
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <div className="text-gray-600 text-sm">
            <span className="mr-4">📍 {job.location || '-'}</span>
            <span className="mr-4">💰 {formatSalary(job.salary)}</span>
            <span>⏰ {job.jobType || '-'}</span>
          </div>
          <div className="text-gray-500 text-sm">ประกาศเมื่อ {formatDate(job.createdAt)}</div>
          {Array.isArray(job.images) && job.images.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pt-2">
              {job.images.map((url, i) => (
                <img key={i} src={url} alt={`job-${i}`} className="h-28 w-44 object-cover rounded border" />
              ))}
            </div>
          )}
          {job.description && (
            <div className="pt-2 whitespace-pre-wrap text-gray-800">{job.description}</div>
          )}
        </div>
      </main>
    </div>
  );
}

