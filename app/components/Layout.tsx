import Navbar from './Navbar/Navbar';

type LayoutProps = { children: React.ReactNode };

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{justifyContent:"center", alignItems:"center", padding:"1.2rem .1rem .1rem 0"}}>
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
