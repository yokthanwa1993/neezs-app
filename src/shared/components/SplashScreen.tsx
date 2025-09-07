import React from 'react';

const SplashScreen: React.FC = () => {
	return (
		<div className="min-h-screen w-full bg-white flex items-center justify-center p-6">
			<div className="text-center">
				<div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-6" />
				<h1 className="text-2xl font-bold text-gray-900 mb-2">กำลังเตรียมระบบ</h1>
				<p className="text-gray-500">กรุณารอสักครู่...</p>
			</div>
		</div>
	);
};

export default SplashScreen;
