import Footer from "@/components/app/Footer"
import Header from "@/components/app/Header"

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col justify-between min-h-screen pb-20 md:pb-0">
            <main className="flex-grow">
            <Header />
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default AppLayout