import { Navbar } from '@/components/navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className='max-w-screen-lg mx-auto'>{children}</div>
    </>
  );
}
