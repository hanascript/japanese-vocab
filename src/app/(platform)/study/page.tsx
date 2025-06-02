import Link from 'next/link';
import { Bookmark, BookMarked, BookOpen, CircleX, Plus, Target } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function StudyPage() {
  return (
    <div className='mb-12 space-y-12'>
      <div className='flex w-full justify-between rounded-md bg-orange-300 p-8'>
        <div className='space-y-8'>
          <div className='space-y-2 text-yellow-100'>
            <h2 className='text-5xl font-bold text-black/80'>Daily vocab workout</h2>
            <p>Practice words and phrases to maxximize your vocab retention.</p>
          </div>
          <Button>Review Vocab</Button>
        </div>
        <Target className='size-16 text-yellow-100' />
      </div>

      <div className='space-y-4'>
        <h2 className='text-2xl font-bold'>Your Vocab</h2>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col gap-4 rounded-md bg-gray-200/50 p-6 hover:cursor-pointer hover:bg-gray-200/70'>
            <BookOpen className='size-12 text-orange-400' />
            <p className='text-xl font-semibold'>All items</p>
          </div>
          <div className='flex flex-col gap-4 rounded-md bg-gray-200/50 p-6 hover:cursor-pointer hover:bg-gray-200/70'>
            <CircleX className='size-12 text-orange-400' />
            <p className='text-xl font-semibold'>Recent mistakes</p>
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        <h2 className='text-2xl font-bold'>Custom Decks</h2>

        <div className='flex items-center gap-4 rounded-md bg-gray-200/50 hover:cursor-pointer hover:bg-gray-200'>
          <div className='h-full rounded-l-md bg-gray-200/80 p-8'>
            <Bookmark className='size-12 text-orange-400' />
          </div>
          <div className='flex flex-1 items-center justify-between px-8'>
            <div className='space-y-2'>
              <p className='text-xl font-semibold'>Saved items</p>
              <p className='text-sm'>0 items</p>
            </div>
            <Button disabled>Study</Button>
          </div>
        </div>
      </div>

      <Button
        className='w-full border-orange-400/80 p-16 font-bold duration-300 ease-in-out hover:bg-orange-200/50'
        variant='outline'
        asChild
      >
        <Link
          href='/create-set'
          className='flex flex-col items-center gap-2'
        >
          <Plus className='size-6' />
          <p className='text-lg'>Create new deck</p>
          <p className='text-sm font-normal'>
            Create custom decks to review and practice your vocabulary however you like.
          </p>
        </Link>
      </Button>
    </div>
  );
}
