import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useLoginMutation } from '@/services/api';
import { setSession } from '@/reducers/session/sessionSlice';

const formSchema: z.ZodSchema = z.object({
  email: z.string().email('El email no es válido').nonempty('El email es requerido'),
  password: z.string().nonempty('La contraseña es requerida'),
});

function Login() {
  const [login, { isLoading, isSuccess, error }] = useLoginMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (isSuccess) {
        navigate('/home');
      }
    },
    [isSuccess, navigate],
  );

  useEffect(() => {
    if (error) {
      if ('status' in error) {
        const fetchError = error as FetchBaseQueryError;
        const errorMessages = fetchError.data as string[];
        toast.error(errorMessages?.[0] || 'Error al iniciar sesión');
      } else {
        toast.error(error.message || 'Error inesperado al iniciar sesión');
      }
    }
  }, [error]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { data: result } = await login(data);

    dispatch(setSession(result));
  };

  return (
    <div className="flex flex-row">
      <div className="w-3/5 h-screen bg-gradient-to-r from-primary to-sky-600" />
      <div className="flex flex-col items-center justify-center w-2/5 h-screen gap-8">
        <h1 className="text-3xl font-semibold text-center font-sans">Bienvenido</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-3/5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Ingrese su correo electrónico"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Ingrese su contraseña"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>Acceder</Button>
          </form>
        </Form>
        <div className="flex items-center justify-center">
          <img src="/fing.png" alt="Fing log" className="h-25" />
          <img src="/udelar.png" alt="UdelaR logo" className="h-25" />
        </div>
      </div>
    </div>
  );
}

export default Login;
