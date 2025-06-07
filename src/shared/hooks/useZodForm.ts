import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type FormMode = 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched';
type ReValidateMode = 'onChange' | 'onBlur' | 'onSubmit';

const useZodForm = <T extends Record<string, any>>(
    schema: z.ZodType<T>,
    mode: FormMode = 'onSubmit',
    reValidateMode: ReValidateMode = 'onChange') => {
    return useForm<T>({
        resolver: zodResolver(schema),
        mode,
        reValidateMode
    });
};

export { useZodForm };

