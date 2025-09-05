"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@neeiz/api-client";

export default function EmployerPostJobPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    salary: "",
    jobType: "full-time",
  });
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setLoading(true);
    try {
      const results = await Promise.all(files.map(async (file) => {
        const fd = new FormData();
        fd.append("file", file);
        const res = await apiClient.post("/api/jobs/upload", fd);
        return res.data.url as string;
      }));
      setImages(prev => [...prev, ...results]);
    } catch (err) {
      console.error("Upload error", err);
      alert("อัปโหลดรูปภาพไม่สำเร็จ");
    } finally {
      setLoading(false);
      e.currentTarget.value = "";
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post("/api/jobs", {
        title: form.title,
        description: form.description,
        category: form.category,
        location: form.location,
        salary: Number(form.salary || 0),
        jobType: form.jobType,
        status: "active",
        employerId: "web-anonymous",
        images,
      });
      alert("ลงประกาศงานสำเร็จ");
      router.push("/jobs");
    } catch (err) {
      console.error("Post job error", err);
      alert("ไม่สามารถลงประกาศงานได้");
    } finally {
      setLoading(false);
    }
  };

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">ลงประกาศงาน</h1>
        <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ชื่อตำแหน่งงาน</label>
            <input name="title" value={form.title} onChange={onChange} required className="w-full mt-1 px-3 py-2 border rounded-md" placeholder="เช่น บาริสต้า, พนักงานเสิร์ฟ" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">รายละเอียดงาน</label>
            <textarea name="description" value={form.description} onChange={onChange} required className="w-full mt-1 px-3 py-2 border rounded-md" rows={5} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">หมวดหมู่</label>
              <select name="category" value={form.category} onChange={onChange} className="w-full mt-1 px-3 py-2 border rounded-md">
                <option value="">เลือกหมวดหมู่</option>
                <option value="accounting">บัญชีและการเงิน</option>
                <option value="cleaning">ทำความสะอาด</option>
                <option value="food">อาหารและเครื่องดื่ม</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">สถานที่</label>
              <input name="location" value={form.location} onChange={onChange} className="w-full mt-1 px-3 py-2 border rounded-md" placeholder="เช่น กรุงเทพ" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">เงินเดือน (บาท/เดือน)</label>
              <input name="salary" type="number" value={form.salary} onChange={onChange} className="w-full mt-1 px-3 py-2 border rounded-md" placeholder="25000" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ประเภทงาน</label>
            <select name="jobType" value={form.jobType} onChange={onChange} className="w-full mt-1 px-3 py-2 border rounded-md">
              <option value="full-time">งานประจำ</option>
              <option value="part-time">พาร์ทไทม์</option>
              <option value="contract">สัญญาจ้าง</option>
              <option value="internship">ฝึกงาน</option>
              <option value="freelance">ฟรีแลนซ์</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">อัปโหลดรูปภาพงาน</label>
            <input type="file" accept="image/*" multiple onChange={onUpload} />
            {loading && <p className="text-sm text-gray-500 mt-1">กำลังอัปโหลด...</p>}
            {images.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {images.map((url, i) => (
                  <img key={i} src={url} className="h-16 w-24 object-cover rounded border" />
                ))}
              </div>
            )}
          </div>
          <div className="pt-2">
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
              {loading ? "กำลังบันทึก..." : "ยืนยันและประกาศงาน"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

