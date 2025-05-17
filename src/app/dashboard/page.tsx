import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getDashboardStats } from "../actions/dashboard";
import { CheckCircle, FileTextIcon, MessageCircleDashedIcon, UsersIcon } from "lucide-react";
type Stats = {
  articlesCount: number;
  usersCount: number;
  approvedCommentsCount: number;
  pendingCommentsCount: number;
};


const DashboardPage = async () => {
  const stats = await getDashboardStats();

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h2 className=" font-bold">داشبورد مدیریت</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon />
              مقالات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-extrabold">{stats.articlesCount}</p>
            <p className="text-muted-foreground">تعداد مقالات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon />
              کاربران
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-extrabold">{stats.usersCount}</p>
            <p className="text-muted-foreground">تعداد کاربران</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle />
              نظرات تایید شده
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-extrabold">{stats.approvedCommentsCount}</p>
            <p className="text-muted-foreground">تعداد نظرات تایید شده</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircleDashedIcon />
              نظرات در انتظار تایید
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-extrabold">{stats.pendingCommentsCount}</p>
            <p className="text-muted-foreground">تعداد نظرات در انتظار تایید</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
