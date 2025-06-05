export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // TODO: Check if user is authenticated and redirect to login page if not

  return (
    <>
      <div className='flex h-screen items-center justify-center'>{children}</div>
    </>
  );
}
