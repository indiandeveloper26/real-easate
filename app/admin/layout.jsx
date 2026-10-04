import AdminSidebar from "./components/AdminSidebar";


export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Admin Sidebar */}
            <AdminSidebar />

            {/* Admin Page Content */}
            <main className="min-h-screen min-w-0 lg:ml-[285px]">
                <div className="min-h-screen w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}

