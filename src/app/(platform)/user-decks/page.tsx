import { getDecks } from '@/actions/get-decks';
import { Link, Plus, Save, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function UserDecksPage() {
  const decks = await getDecks();

  const formatDate = (date: string | number | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  console.log(decks);

  return (
    <div className='grid gap-6'>
      {decks.map(deck => (
        <Card
          key={deck.id}
          className='border-2 border-green-200 py-3 pt-0 shadow-lg'
        >
          <CardHeader className='flex items-center justify-between rounded-t-lg bg-gradient-to-r from-green-100 to-teal-100 p-6'>
            <CardTitle className='text-2xl text-green-700'> {deck.name} </CardTitle>
            <Button
              type='button'
              variant='destructive'
            >
              <Trash className='size-4' />
              <span className='sr-only'>Remove Card</span>
            </Button>
          </CardHeader>

          <CardContent>
            <div className='font-bold'>Description:</div>
            <CardDescription>{deck.description}</CardDescription>
          </CardContent>
          <CardContent>
            <span>Created: {formatDate(deck.createdAt)}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
