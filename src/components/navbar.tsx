import Link from 'next/link';

import { AvatarButton } from '@/components/avatar-button';

export const Navbar = () => {
  return (
    <nav className='mb-8 bg-orange-400/80 uppercase'>
      <div className=' flex items-center justify-between p-2 px-6'>
        <h1 className='font-logo text-4xl font-extrabold text-yellow-200/80 hover:cursor-default'>
          Japaneezy
        </h1>
        <div className='flex items-center gap-8'>
          <div className='flex items-center gap-8 font-semibold text-yellow-100'>
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
              href='/quiz'
            >
              Quiz
            </Link>
            <Link
              className='hover:text-white'
              href='/explore'
            >
              Explore
            </Link>
          </div>
          <div>
            <AvatarButton />
          </div>
        </div>
      </div>
    </nav>
  );
};
