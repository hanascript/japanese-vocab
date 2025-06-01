'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { newDeckSchema } from '@/lib/schemas';
import { Trash } from '@/lib/svg/trash';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function CreateSetPage() {
  const form = useForm<z.infer<typeof newDeckSchema>>({
    resolver: zodResolver(newDeckSchema),
    defaultValues: {
      name: '',
      description: '',
      flashcards: [{ front: '', frontSecondary: '', back: '', backSecondary: '' }],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'flashcards',
  });

  function onSubmit(values: z.infer<typeof newDeckSchema>) {
    console.log(values);
  }

  return (
    <div>
      <h1 className='py-4'>Create Set</h1>

      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='Enter a Set Name'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder='Description'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className='flex justify-end space-x-1'>
              <Button
                type='button'
                onClick={() => {
                  append({ front: '', frontSecondary: '', back: '', backSecondary: '' });
                }}
              >
                Add Card
              </Button>

              <Button type='submit'>Save Set</Button>
            </div>

            {fields.map((field, index) => (
              <Card
                className='space-y-2 rounded-lg border-black p-4 shadow-xl/20'
                key={field.id}
              >
                <div>
                  <div className='grid grid-cols-2 pb-1 font-bold'>
                    <div className='content-center'>Card {index + 1}</div>
                    <div className='flex justify-end'>
                      <Button
                        type='button'
                        onClick={() => remove(index)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </div>
                  <hr className='border-black' />
                </div>

                <div className='grid grid-cols-2 gap-1'>
                  <FormField
                    control={form.control}
                    name={`flashcards.${index}.front`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className='border-black'
                            placeholder='Front'
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`flashcards.${index}.frontSecondary`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className='border-black'
                            placeholder='Front 2'
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className='grid grid-cols-2 gap-1'>
                  <FormField
                    control={form.control}
                    name={`flashcards.${index}.back`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className='border-black'
                            placeholder='Back'
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`flashcards.${index}.backSecondary`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className='border-black'
                            placeholder='Back 2'
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
            ))}
          </form>
        </Form>
      </div>
    </div>
  );
}
