import { useRef } from 'react';
import { toast } from 'sonner';

export function useToastPromiseControl() {
  const defersRef = useRef<Record<string, PromiseWithResolvers<unknown>>>({});

  const register = (
    id: string,
    options: { loading?: string; success?: string; error?: string },
  ) => {
    const defer = (defersRef.current[id] = Promise.withResolvers());
    toast.promise(defer.promise, options);
  };

  const deref = (id: string) => delete defersRef.current[id];
  const resolve = (id: string) => defersRef.current[id]?.resolve(true);
  const reject = (id: string) => defersRef.current[id]?.reject(true);

  return {
    register,
    deref,
    resolve,
    reject,
  };
}
