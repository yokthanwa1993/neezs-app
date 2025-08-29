import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, PlusCircle, CreditCard, History, X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

const EmployerBillingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(500);
  const [customAmount, setCustomAmount] = useState('');
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);

  const predefinedAmounts = [300, 500, 1000, 2000];

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const finalAmount = selectedAmount || (customAmount ? parseInt(customAmount, 10) : 0);

  const handleTopUp = () => {
    if (finalAmount > 0) {
      setIsQrDialogOpen(true);
    }
  };

  const transactionHistory = [
    { id: 1, type: 'เติมเงิน', amount: 500, date: '15 พ.ย. 2023' },
    { id: 2, type: 'ค่าลงประกาศงาน', amount: -50, date: '14 พ.ย. 2023', details: 'ตำแหน่งบาริสต้า' },
    { id: 3, type: 'ค่าลงประกาศงาน', amount: -50, date: '12 พ.ย. 2023', details: 'ตำแหน่งพนักงานทำความสะอาด' },
    { id: 4, type: 'เติมเงิน', amount: 300, date: '10 พ.ย. 2023' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 space-y-6 pb-24">
        {/* Wallet Balance Card */}
        <Card className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-800 shadow-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">ยอดเงินคงเหลือ</CardTitle>
            <Wallet className="h-5 w-5 text-gray-700" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">฿150.00</div>
            <p className="text-xs text-gray-600 mt-1">เทียบเท่า 150 เครดิต</p>
          </CardContent>
        </Card>

        {/* Top Up Section */}
        <Card>
          <CardHeader>
            <CardTitle>เติมเงินเข้า Wallet</CardTitle>
            <CardDescription>เลือกจำนวนเงินหรือระบุเอง</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {predefinedAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => handleSelectAmount(amount)}
                  className={cn(
                    "h-12 text-base border-2 font-semibold",
                    selectedAmount === amount ? "border-yellow-500 text-yellow-600 bg-yellow-100" : "border-gray-200"
                  )}
                >
                  ฿{amount.toLocaleString()}
                </Button>
              ))}
            </div>
            <div>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="หรือระบุจำนวนเงินเอง"
                value={customAmount}
                onChange={handleCustomAmountChange}
                onFocus={() => setSelectedAmount(null)}
                className={cn(
                  "text-center text-base h-12 bg-gray-100 focus:bg-white",
                  customAmount && !selectedAmount && "border-primary ring-1 ring-primary"
                )}
              />
            </div>
            <Button
                onClick={handleTopUp}
                disabled={finalAmount <= 0}
                className="w-full h-12 text-lg font-bold flex items-center justify-center gap-2 bg-yellow-400 text-gray-800 hover:bg-yellow-500 rounded-full"
            >
                <PlusCircle className="w-6 h-6" />
                ยืนยัน ฿{finalAmount > 0 ? finalAmount.toLocaleString() : '0'}
            </Button>
            <Separator />
            <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    <span>วิธีการชำระเงิน</span>
                </div>
                <span className="font-semibold">QR Code / Credit Card</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Transaction History */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    ประวัติการทำรายการ
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-1">
                    {transactionHistory.map(tx => (
                        <div key={tx.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                                {tx.amount > 0 ? (
                                    <ArrowUpCircle className="w-6 h-6 text-green-500" />
                                ) : (
                                    <ArrowDownCircle className="w-6 h-6 text-red-500" />
                                )}
                                <div>
                                    <p className="font-semibold">{tx.type}</p>
                                    <p className="text-sm text-gray-500">{tx.details ? `${tx.details} - ${tx.date}` : tx.date}</p>
                                </div>
                            </div>
                            <span className={`font-bold text-lg ${tx.amount > 0 ? 'text-green-600' : 'text-gray-800'}`}>
                                {tx.amount > 0 ? '+' : '-'}฿{Math.abs(tx.amount).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

      </main>
      {/* Footer is removed to place the confirmation button directly in the card */}

      <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">สแกนเพื่อชำระเงิน</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <img 
              src="https://iili.io/FDvZM1R.png" 
              alt="Sample QR Code" 
              className="mx-auto w-64 h-64"
            />
            <p className="mt-4 text-2xl font-bold">
              ยอดชำระ: ฿{finalAmount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              กรุณาตรวจสอบยอดเงินก่อนทำการชำระเงิน
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployerBillingPage;