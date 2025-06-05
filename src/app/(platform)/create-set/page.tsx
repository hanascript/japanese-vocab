'use client';

import { createNewDeck } from '@/actions/create-new-deck';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { newDeckSchema } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function CreateSetPage() {
  const form = useForm<z.infer<typeof newDeckSchema>>({
    resolver: zodResolver(newDeckSchema),
    defaultValues: {
      name: '',
      description: '',
      flashcards: [
        {
          kana: '',
          meaning: '',
          kanji: '',
          pronunciation: '',
          example: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'flashcards',
  });

  function onSubmit(values: z.infer<typeof newDeckSchema>) {
    createNewDeck(values);
  }

  const addCard = () => {
    append({ kana: '', meaning: '', kanji: '', pronunciation: '', example: '' });
  };

  const removeCard = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className='mb-16'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
        >
          {/* Deck Information */}
          <Card className='border-2 border-green-200 pt-0 shadow-lg'>
            <CardHeader className='flex items-center justify-between rounded-t-lg bg-gradient-to-r from-green-100 to-teal-100 p-6'>
              <CardTitle className='text-2xl text-green-700'>New Deck Information</CardTitle>
              <Button
                type='submit'
                variant='secondary'
                className={cn(!form.formState.isValid && 'hover:cursor-not-allowed')}
              >
                <Save className='size-4' />
                Save
              </Button>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-green-700'>Deck Name*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g., Basic Japanese Vocabulary'
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className='space-y-2'>
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-green-700'>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Describe what this deck covers...'
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Flashcards */}
          {fields.map((field, index) => (
            <Card
              key={field.id}
              className='border-2 border-orange-200 pt-0 shadow-lg'
            >
              <CardHeader className='flex items-center justify-between rounded-t-lg bg-gradient-to-r from-orange-100 to-yellow-100 p-4 px-6'>
                <CardTitle className='text-2xl text-orange-800'>
                  <FormField
                    control={form.control}
                    name={`flashcards.${index}.kana`}
                    render={({ field }) => (
                      <FormItem className='flex gap-4'>
                        <FormLabel className='self-end text-xs text-orange-800 italic'>
                          Kana*
                        </FormLabel>
                        <FormControl>
                          <input
                            className='border-b border-orange-800'
                            placeholder='かんじ'
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardTitle>
                <Button
                  type='button'
                  variant='destructive'
                  onClick={() => removeCard(index)}
                >
                  <Trash className='size-4' />
                  <span className='sr-only'>Remove Card</span>
                </Button>
              </CardHeader>
              <CardContent className='grid grid-cols-3 gap-4'>
                <FormField
                  control={form.control}
                  name={`flashcards.${index}.meaning`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-orange-800'>Meaning*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Chinese characters'
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`flashcards.${index}.kanji`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-orange-800'>Kanji</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='漢字'
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`flashcards.${index}.pronunciation`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-orange-800'>Romaji</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='kanji'
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`flashcards.${index}.example`}
                  render={({ field }) => (
                    <FormItem className='col-span-3'>
                      <FormLabel className='text-orange-800'>Example Sentence</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='漢字を勉強しています。(I am studying kanji.)'
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
          <Button
            type='button'
            onClick={addCard}
            className='w-full p-6'
          >
            <Plus className='size-4' />
            <span className='sr-only'>Add Card</span>
          </Button>
        </form>
      </Form>
    </div>
  );
}
