import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Neeiz</h1>
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
                href="/seeker/jobs" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                หางาน
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">หางานที่ใช่</span>
            <span className="block text-blue-600">เจอคนที่ชอบ</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            แพลตฟอร์มจ้างงานที่เชื่อมโยงคนหางานกับนายจ้างอย่างมีประสิทธิภาพ 
            ด้วยเทคโนโลยีที่ทันสมัยและประสบการณ์การใช้งานที่ยอดเยี่ยม
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/seeker/jobs"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                เริ่มหางาน
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                href="/employer/post-job"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                ลงประกาศงาน
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">ค้นหางานง่าย</h3>
              <p className="text-gray-600">
                ค้นหางานที่เหมาะกับคุณด้วยระบบค้นหาขั้นสูง 
                ฟิลเตอร์ตามตำแหน่ง ประสบการณ์ และเงินเดือน
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">แชทกับนายจ้าง</h3>
              <p className="text-gray-600">
                สื่อสารกับนายจ้างได้โดยตรงผ่านระบบแชท 
                ตอบคำถามและเจรจาเงื่อนไขการทำงานได้ทันที
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">สมัครงานง่าย</h3>
              <p className="text-gray-600">
                สมัครงานด้วยคลิกเดียว พร้อมระบบติดตามสถานะ 
                และการแจ้งเตือนเมื่อมีการอัปเดต
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">1,000+</div>
              <div className="text-gray-600">งานที่เปิดรับ</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">500+</div>
              <div className="text-gray-600">บริษัทที่ร่วมงาน</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">10,000+</div>
              <div className="text-gray-600">ผู้ใช้งาน</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Neeiz</h3>
              <p className="text-gray-300 text-sm">
                แพลตฟอร์มจ้างงานที่เชื่อมโยงคนหางานกับนายจ้างอย่างมีประสิทธิภาพ
              </p>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">สำหรับผู้หางาน</h4>
              <ul className="space-y-2">
                <li><Link href="/seeker/jobs" className="text-gray-300 hover:text-white text-sm">ค้นหางาน</Link></li>
                <li><Link href="/seeker/profile" className="text-gray-300 hover:text-white text-sm">โปรไฟล์</Link></li>
                <li><Link href="/applications" className="text-gray-300 hover:text-white text-sm">งานที่สมัคร</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">สำหรับนายจ้าง</h4>
              <ul className="space-y-2">
                <li><Link href="/employer/post-job" className="text-gray-300 hover:text-white text-sm">ลงประกาศงาน</Link></li>
                <li><Link href="/employer/applications" className="text-gray-300 hover:text-white text-sm">จัดการผู้สมัคร</Link></li>
                <li><Link href="/employer/analytics" className="text-gray-300 hover:text-white text-sm">วิเคราะห์ข้อมูล</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">ติดต่อเรา</h4>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-gray-300 hover:text-white text-sm">ติดต่อ</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-white text-sm">เกี่ยวกับเรา</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-white text-sm">ความเป็นส่วนตัว</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-gray-400 text-sm text-center">
              © 2024 Neeiz. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
