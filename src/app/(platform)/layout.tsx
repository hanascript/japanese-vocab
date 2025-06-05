import { getCurrentUser } from '@/lib/currentUser';
import { Navbar } from '@/components/navbar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // TODO: Check if user is authenticated and redirect to login page if not
  const user = await getCurrentUser({ redirectIfNotFound: true });

  return (
    <>
      <Navbar />
      <div className='mx-auto max-w-screen-lg'>{children}</div>
    </>
  );
}
