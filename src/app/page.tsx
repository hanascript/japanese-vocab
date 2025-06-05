import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function Home() {


  

  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      Marketing page{' '}
      <Button>
        <Link href='/learn'>Go to Learn Page</Link>
      </Button>

      
    </div>
  );
}
