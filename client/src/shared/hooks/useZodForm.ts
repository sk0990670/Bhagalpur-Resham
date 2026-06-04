import { useForm, UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export function useZodForm<TSchema extends z.ZodType<any, any>>(
  props: Omit<UseFormProps<z.input<TSchema>>, 'resolver'> & {
    schema: TSchema;
  }
) {
  const form = useForm<z.input<TSchema>>({
    ...props,
    resolver: zodResolver(props.schema, undefined) as any,
  });

  return form;
}
