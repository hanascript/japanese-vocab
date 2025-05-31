'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { newDeckSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
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

            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`flashcards.${index}.front`}
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
            ))}

            <Button
              type='button'
              onClick={() => {
                append({ front: '', frontSecondary: '', back: '', backSecondary: '' });
              }}
            >
              Add
            </Button>

            <Button
              type='button'
              onClick={() => remove(1)}
            >
              Remove
            </Button>

            <Button type='submit'>Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
