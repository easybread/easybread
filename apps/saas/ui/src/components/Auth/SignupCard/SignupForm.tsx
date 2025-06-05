'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { authClient } from 'saas-auth';

import { Button } from '../../../shadcn/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../shadcn/form';
import { Input } from '../../../shadcn/input';
import { Separator } from '../../../shadcn/separator';

const formSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormSchema = z.infer<typeof formSchema>;

export function SignupForm() {
  const router = useRouter();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: FormSchema) => {
    await authClient.signUp.email({
      callbackURL: '/',
      email: data.email,
      name: data.name ?? data.email,
      password: data.password,
    });

    router.push('/');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name={'name'}
            render={p => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder={'John Doe'}
                    required={false}
                    autoComplete={'username'}
                    {...p.field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={'email'}
            render={p => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    autoComplete={'email'}
                    type={'email'}
                    placeholder={'john.doe@example.com'}
                    {...p.field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={'password'}
            render={p => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type={'password'}
                    placeholder={'password'}
                    autoComplete={'new-password'}
                    {...p.field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={'confirmPassword'}
            render={p => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type={'password'}
                    placeholder={'confirm password'}
                    autoComplete={'new-password-confirm'}
                    {...p.field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={
              form.formState.isSubmitting ||
              (form.formState.isDirty && !form.formState.isValid)
            }
          >
            {form.formState.isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </div>

        <Separator orientation="horizontal" className="my-4" />

        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link
            href="/signin"
            className="cursor-pointer underline underline-offset-4"
          >
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
