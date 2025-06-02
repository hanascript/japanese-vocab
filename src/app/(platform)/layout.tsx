import { Navbar } from '@/components/navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // TODO: Check if user is authenticated and redirect to login page if not

  return (
    <>
      <Navbar />
      <div className='mx-auto max-w-screen-lg'>{children}</div>
    </>
  );
}
