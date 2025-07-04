import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { DtoConnection, DtoConnectionSettings } from 'saas-dto';

import { Button } from '../../../../shadcn/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../shadcn/form';
import { Input } from '../../../../shadcn/input';
import { useConnectionEdit } from '../ConnectionSettingsEdit';

const formSchema = z.object({
  name: z.string().min(1),
  connectionString: z.string().min(1),
});

export function DbPostgresStrategy({
  settings,
  connection,
}: {
  settings: Extract<DtoConnectionSettings, { type: 'DB_PG' }> | null;
  connection: DtoConnection;
}) {
  const { _save, _isSaving } = useConnectionEdit();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: connection.name ?? '',
      connectionString: settings?.connectionString ?? '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    _save({
      name: data.name,
      settings: {
        type: 'DB_PG',
        connectionString: data.connectionString,
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="name"
            render={p => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...p.field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="connectionString"
            render={p => (
              <FormItem>
                <FormLabel>Connection String</FormLabel>
                <FormControl>
                  <Input {...p.field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={!form.formState.isValid || _isSaving}>
            {_isSaving ? (
              <LoaderIcon className="animate-spin" size={16} />
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
