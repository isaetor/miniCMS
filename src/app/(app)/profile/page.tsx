import { Info, User } from "lucide-react";

const ProfilePage = () => {
    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col items-center justify-center gap-4 py-20">
                <User size={48} />
                <h1 className="text-2xl font-bold">حساب کاربری</h1>
                <p className="text-muted-foreground">اطلاعات حساب کاربری خود را می توانید در این صفحه مشاهده و ویرایش کنید</p>
                <div className="flex items-center gap-2">
                    <Info size={16} />
                    <p className="-mt-1">به زودی این صفحه طراحی خواهد شد</p>
                </div>
            </div>
        </div>
    )
}
export default ProfilePage;
