interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className='h-screen bg-white'>
            <div className="container h-full">
                {children}
            </div>
        </div>
    )
}

export default Layout