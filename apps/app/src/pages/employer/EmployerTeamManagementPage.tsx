import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, MoreVertical, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const teamMembers = [
  { name: 'คุณสมชาย ใจดี', email: 'somchai.j@techsolutions.co', role: 'เจ้าของ', avatar: 'https://i.pravatar.cc/150?u=somchai' },
  { name: 'คุณสมหญิง เก่งมาก', email: 'somyimg.k@techsolutions.co', role: 'ผู้จัดการ', avatar: 'https://i.pravatar.cc/150?u=somyimg' },
  { name: 'คุณวิชัย มีสุข', email: 'wichai.m@techsolutions.co', role: 'HR', avatar: 'https://i.pravatar.cc/150?u=wichai' },
];

const EmployerTeamManagementPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-800">จัดการทีม</h1>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          เชิญสมาชิก
        </Button>
      </header>
      <main className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>สมาชิกในทีม ({teamMembers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {member.role === 'เจ้าของ' ? (
                      <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30">
                        <Crown className="w-3 h-3 mr-1" />
                        {member.role}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">{member.role}</Badge>
                    )}
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EmployerTeamManagementPage;