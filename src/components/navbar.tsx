import Link from 'next/link';

export const Navbar = () => {
  return (
    <div className='border-b p-4'>
      <div className='mx-auto flex max-w-screen-xl items-center gap-8'>
        <h1 className='text-2xl font-bold'>Japaneezy</h1>
        <Link href='/dashboard'>Home</Link>
        <Link href='/dashboard/study'>Study</Link>
        <Link href='/dashboard/explore'>Explore</Link>
      </div>
    </div>
  );
};
