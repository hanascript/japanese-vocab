import Link from 'next/link';

export const Navbar = () => {
  return (
    <div className='mb-4 flex gap-8 border-b px-4 py-2'>
      <h1 className='text-4xl font-bold'>Japaneezy</h1>
      <div className='flex items-center gap-8 p-4'>
        <Link href='/dashboard'>Home</Link>
        <Link href='/dashboard/study'>Study</Link>
        <Link href='/dashboard/explore'>Explore</Link>
      </div>
    </div>
  );
};
