import Link from 'next/link';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function StudyPage() {
  return (
    <div>
      <Button
        className='w-full border-orange-400/80 p-16 font-bold duration-600 ease-in-out hover:bg-orange-200/50'
        variant='outline'
        asChild
      >
        <Link href='/create-set'>
          <Plus />
          Create Set
        </Link>
      </Button>
    </div>
  );
}
