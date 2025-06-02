import Link from 'next/link';

export const Navbar = () => {
  return (
    <div className='mb-8 flex items-center gap-8 border-b bg-orange-400/80 px-4 py-10 uppercase'>
      <h1 className='text-6xl font-extrabold text-yellow-200/80'>Japaneezy</h1>
      <div className='flex items-center gap-8 p-4 text-xl text-white'>
        <Link href='/learn'>Learn</Link>
        <Link href='/study'>Study</Link>
        <Link href='/explore'>Explore</Link>
        <Link href='/quiz'>Quiz</Link>
      </div>
    </div>
  );
};
