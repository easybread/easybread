import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4-mini';

import { PG_CONNECTION_TYPE } from 'saas-db/enums';
import type { DtoConnection } from 'saas-dto';

import { Button } from '../../shadcn/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '../../shadcn/form';
import { Input } from '../../shadcn/input';

const formSchema = z.object({
  name: z.string().check(z.minLength(1)),
  connectionString: z.string().check(z.minLength(1), z.url()),
});

export function ConnectionDetailsForm({
  connection,
}: {
  connection: DtoConnection;
}) {
  const { settings, name } = connection;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name ?? '',
      connectionString:
        settings?.type === PG_CONNECTION_TYPE.DB_PG
          ? settings.connectionString
          : '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        className="flex items-end gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={p => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...p.field} />
              </FormControl>
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
                <Input {...p.field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
