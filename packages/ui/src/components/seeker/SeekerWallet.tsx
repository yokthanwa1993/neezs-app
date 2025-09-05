import React, { useState } from 'react';
import { Wallet as WalletIcon, ArrowUpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '../shared/BottomNavigation';

interface Transaction {
  id: number;
  title: string;
  date: string;
  amount: string;
  type: 'income' | 'outcome';
}

const Wallet = () => {
  const [balance, setBalance] = useState(7450);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Mock transaction data
  const transactions: Transaction[] = [
    {
      id: 1,
      title: 'เงินเดือนจากงานพนักงานเสิร์ฟ',
      date: '10 พ.ย. 2023',
      amount: '+5,000 บาท',
      type: 'income'
    },
    {
      id: 2,
      title: 'ถอนเงินเข้าบัญชี',
      date: '5 พ.ย. 2023',
      amount: '-3,500 บาท',
      type: 'outcome'
    },
    {
      id: 3,
      title: 'เงินเดือนจากงานพนักงานเก็บเงิน',
      date: '1 พ.ย. 2023',
      amount: '+6,000 บาท',
      type: 'income'
    },
    {
      id: 4,
      title: 'ค่าธรรมเนียมระบบ',
      date: '25 ต.ค. 2023',
      amount: '-50 บาท',
      type: 'outcome'
    }
  ];

  const handleWithdraw = () => {
    const amount = prompt('กรุณากรอกจำนวนเงินที่ต้องการถอน:');
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0 && Number(amount) <= balance) {
      const withdrawalAmount = Number(amount);
      setBalance(prev => prev - withdrawalAmount);
      alert(`ถอนเงินจำนวน ${withdrawalAmount.toLocaleString()} บาท เรียบร้อยแล้ว!`);
    } else if (amount) {
      alert('จำนวนเงินไม่ถูกต้องหรือเกินจำนวนเงินในบัญชี');
    }
  };

  if (!user) {
    navigate('/');
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      
      {/* Balance Card */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <WalletIcon className="text-primary mr-2" size={24} />
            <h2 className="font-bold text-lg">ยอดเงินคงเหลือ</h2>
          </div>
          <p className="text-3xl font-bold mb-2">{balance.toLocaleString()} บาท</p>
          <p className="text-gray-500 text-sm">อัปเดตล่าสุด: 10 พ.ย. 2023</p>
        </div>

        {/* Withdraw Button */}
        <button 
          onClick={handleWithdraw}
          className="flex items-center justify-center bg-primary w-full rounded-full py-3 font-bold text-primary-foreground mb-6"
        >
          <ArrowUpCircle className="mr-2" size={20} />
          ถอนเงินเข้าบัญชี
        </button>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="font-bold text-lg mb-4">ประวัติการทำรายการ</h2>
          <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="py-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{transaction.title}</p>
                    <p className="text-gray-500 text-xs">{transaction.date}</p>
                  </div>
                  <span className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Wallet;