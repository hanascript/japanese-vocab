'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { signUpSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AuthCard } from '@/components/auth/auth-card';

export default function SignUpForm() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof signUpSchema>) {
    console.log(values);
  }

  return (
    <AuthCard
      cardTitle='Register an account'
      backButtonHref='/auth/sign-in'
      backButtonLabel='Already have an account?'
    >
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <User className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400' />
                      <Input
                        type='text'
                        className='pl-10'
                        placeholder='John Doe'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Mail className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400' />
                      <Input
                        type='email'
                        className='pl-10'
                        placeholder='your-mail@example.com'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Lock className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400' />
                      <Input
                        type='password'
                        className='pl-10'
                        placeholder='••••••••'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              className='my-4 w-full'
            >
              <p>Register</p>
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
}
