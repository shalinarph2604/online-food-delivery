import Navbar from "./layout/NavBar";

interface LayoutProps {
    onSearch?: (query: string) => void;
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, onSearch }) => {
    return (
        <div className="h-screen bg-white">
            <div className="container h-full mx-auto xl:px-30 max-w-6xl">
                <Navbar onSearch={onSearch} />
                <div className="h-full mx-16">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout