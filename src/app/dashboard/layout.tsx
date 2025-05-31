import { Navbar } from '@/components/navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className='mx-auto max-w-screen-xl py-4'>{children}</div>
    </>
  );
}
