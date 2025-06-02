import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className='mb-8 bg-orange-400/80 uppercase'>
      <div className='mx-auto flex max-w-screen-2xl items-center gap-8 px-4 py-10'>
        <h1 className='text-6xl font-extrabold text-yellow-200/80 hover:cursor-default'>
          Japaneezy
        </h1>
        <div className='flex items-center gap-8 p-4 text-xl font-semibold text-yellow-100'>
          <Link
            className='hover:text-white'
            href='/learn'
          >
            Learn
          </Link>
          <Link
            className='hover:text-white'
            href='/study'
          >
            Study
          </Link>
          <Link
            className='hover:text-white'
            href='/explore'
          >
            Explore
          </Link>
          <Link
            className='hover:text-white'
            href='/quiz'
          >
            Quiz
          </Link>
        </div>
      </div>
    </nav>
  );
};
