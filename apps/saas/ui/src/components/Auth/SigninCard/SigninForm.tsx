'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
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

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormSchema = z.infer<typeof formSchema>;

export function SigninForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: FormSchema) => {
    console.log(data);
    await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: true,
      callbackURL: '/',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name={'email'}
            render={p => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder={'john.doe@example.com'}
                    autoFocus
                    type="email"
                    autoComplete={'email'}
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
                <div className="flex items-center">
                  <FormLabel>Password</FormLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={'password'}
                    autoComplete={'current-password'}
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
            {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </div>

        <Separator orientation="horizontal" className="my-4" />

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
}
