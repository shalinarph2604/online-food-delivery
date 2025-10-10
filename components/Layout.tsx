import Navbar from "./layout/NavBar";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="h-screen bg-white">
            <div className="container h-full mx-auto xl:px-30 max-w-6xl">
                <Navbar />
                <div className="h-full mx-16">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout