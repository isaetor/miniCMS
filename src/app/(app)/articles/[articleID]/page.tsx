import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { ClockIcon, Layers2, MessagesSquare } from "lucide-react";
import SecondArticleCard from "@/components/app/articles/SecondArticleCard";
import CommentsWrapper from "@/components/app/comments/CommentsWrapper";

const articles = [
    {
        id: 1,
        title: "15 فیلم جذاب هوش مصنوعی که حتما باید ببینید",
        description: "در این مقاله، ۱۵ فیلم هوش مصنوعی را معرفی می‌کنیم که نه‌تنها سرگرم‌کننده‌اند، بلکه نگاهی فلسفی، اخلاقی یا حتی احساسی به رابطه انسان و ماشین",
        image: "/images/articles/article1.jpg",
        category: "طبیعت",
        author: "محمد حسین حسینی",
        date: "2025/05/15",
    },
    {
        id: 2,
        title: "اخذ فوری ایزو برای شرکت‌ها: چگونه در کوتاه‌ترین زمان ممکن گواهینامه معتبر بگیرید؟",
        description: "طراحی سایت در دماوندسلام دوستان! امروز میخوایم با یه گفتگوی دوستانه و خودمونی درباره طراحی سایت در دماوند صحبت کنیم. شاید شما هم مثل بقیه‌",
        image: "/images/articles/article2.jpg",
        category: "تکنولوژی",
        author: "سعید حسینی",
        date: "2025/02/10",
    },
    {
        id: 3,
        title: "مقاله سه",
        description: "توضیحات مقاله سه",
        image: "/images/articles/article3.jpg",
        category: "طبیعت",
        author: "علی تقی زاده",
        date: "2025/08/03",
    },
]

const ArticlePage = () => {

    return (
        <div className="container mx-auto md:px-4">
            <Image src="/images/articles/article1.jpg" alt="Article" width={0} height={0} sizes="100vw" className="w-full h-[300px] object-cover md:rounded-xl mb-4" />
            <div className="relative max-w-screen-lg mx-auto py-4 md:p-0 rounded-t-xl bg-background -mt-10 md:mt-0 z-10">
                <h1 className="text-xl md:text-2xl font-black mb-4 px-4">مقاله یک</h1>
                <div className="flex items-center overflow-x-auto gap-6 mb-8 px-4">
                    <div className="flex items-center gap-2 shrink-0">
                        <Image className="rounded-full" src="/images/default-avatar.jpg" alt="user" width={32} height={32} />
                        <p className="text-sm">سعید ترکمان</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="size-8 bg-blue-100 text-blue-500 rounded-full p-1 flex items-center justify-center">
                            <ClockIcon size={16} />
                        </div>
                        <p className="text-sm">{formatDate("2025/05/15")}</p>
                    </div>
                </div>
                <div className="px-4 leading-9 text-foreground/70" dangerouslySetInnerHTML={{
                    __html: `<h2>طراحی سایت در دماوند</h2>
<p>سلام دوستان! امروز میخوایم با یه گفتگوی دوستانه و خودمونی درباره طراحی سایت در دماوند صحبت کنیم. شاید شما هم مثل بقیه‌مون فکر کنید که دنیای طراحی سایت کمی پیچیده و سخت به نظر میاد، ولی باور کنید که با داشتن راهکارهای ساده و نکات کاربردی، هرکسی می‌تونه سایتش رو به شکلی زیبا و جذاب راه بندازه.</p>
<p>یکی از بهترین ویژگی‌های طراحی سایت اینه که امروز امکانات زیادی رو در اختیار داریم؛ از قالب‌های آماده گرفته تا ابزارهایی برای بهینه‌سازی رابط کاربری. این همه ابزار به ما کمک می‌کنه تا سایتمون هم زیبا باشه و هم کاربرپسند. مثلاً یه سایت خوب باید ظاهری شاد و ساده داشته باشه که هر کسی بدون زحمت بتونه توش گشت بزنه و لذت ببرد. از طرفی، نکاتی همچون سرعت بارگزاری، ریسپانسیو بودن یعنی اینکه سایت به خوبی روی موبایل کار کنه، و بهینه بودن برای موتورهای جستجو مثل گوگل، از مهم‌ترین فاکتورها محسوب میشن.</p>
<p>حالا بذارید یه داستان کوچیک براتون تعریف کنم؛ چند وقت پیش توی همین خط مشی، یکی از دوستان خوبمون، مهندس فیاضی – که البته نامش رو نمیشه پنهان کرد چون ایشون واقعا توی طراحی سایت مازندران و دماوند جز بهترین‌ها حساب میشن – از تجربیاتش گفت که وقتی به سادگی و کیفیت اهمیت بدی، کاربران خیلی راحت با سایتت ارتباط برقرار می‌کنن. ایشون همیشه تأکید می‌کنن که طراحی سایت تنها به انتخاب رنگ و فونت ختم نمیشه، بلکه یه توازن بین زیبایی ظاهری و کارایی واقعیه. این نکته‌ها به ما یادآوری می‌کنه که مهم‌ترین چیز در این حوزه، راحتی کاربر و انتقال پیام به شیوه‌ای جذاب و صمیمی هست.</p>
<p>همین طور که می‌بینید، طراحی سایت در دماوند می‌تونه فرصتی باشه برای هم‌اندیشی، خلاقیت و رشد کسب و کارهای محلی. تصور کنید که با داشتن یه سایت قوی و به روز، نه تنها می‌تونید مشتریان بیشتری جذب کنید، بلکه حضور آنلاین شما باعث شه تا از رقبا یک قدم جلوتر باشید. نکات کوچیکی مثل استفاده از تصاویر با کیفیت، نوشتن محتوای ساده و روان، و به کارگیری یک ساختار منطقی می‌تونه تاثیر بزرگی داشته باشه.</p>
<p>اگر شما هم تصمیم دارید وارد این بازی جذاب بشید، حتماً به این نکات توجه کنید. از ابزارهای موجود استفاده کنید، روی جنبه‌های کاربرپسند بودن تمرکز داشته باشید و به یاد داشته باشید که نکات کوچک، می‌تونن تفاوت‌های بزرگی ایجاد کنن. شاید یه روز هم شما به عنوان یکی از نمونه‌های موفق در منطقه دماوند شناخته بشید!</p>
<p>در پایان، دوست دارم بگم که طراحی سایت نه تنها یه هنر هست، بلکه مهارتیه که می‌تونه درهای جدیدی رو به روی کسب و کارها باز کنه. همیشه به روز بمونید، از تجربیات دیگران الهام بگیرید (مثل توصیه‌های خوب مهندس فیاضی) و با ذهنی باز وارد دنیای دیجیتال بشید. امیدوارم مقاله امروز برای شما هم الهام‌بخش بوده باشه و در مسیر طراحی سایت موفق باشید!</p>`
                }} />
            </div>
            <div className="py-16 md:py-32 px-4">
                <div className="flex flex-col items-center gap-2 mb-8">
                    <Layers2 strokeWidth={1.5} className="text-blue-500 size-7 md:size-9" />
                    <h2 className="text-xl md:text-2xl font-black">مقالات مرتبط</h2>
                    <p className="text-muted-foreground text-sm md:text-base mb-4">مقالاتی که ممکن است دوست داشته باشید</p>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    {/* {articles.map((article, index) => (
                        <SecondArticleCard key={article.id} article={article} index={index} />
                    ))} */}
                </div>
            </div>
            <div className="pt-16 md:pt-32 pb-4 px-4">
                <div className="flex flex-col items-center gap-2 mb-8">
                    <MessagesSquare strokeWidth={1.5} className="text-blue-500 size-7 md:size-9" />
                    <h3 className="text-xl md:text-2xl font-black">نظرات</h3>
                    <p className="text-muted-foreground text-sm md:text-base mb-4">دیدگاه ها و نظرات کاربران</p>
                </div>
                <div className="max-w-screen-md mx-auto">
                    <CommentsWrapper />
                </div>
            </div>
        </div>
    );
};

export default ArticlePage;