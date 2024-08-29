'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface pageProps {
    onSubmitFnc: (values: z.infer<typeof formSchema>) => Promise<void>;
    className?:string
}

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4).max(22),
  })

  

const Login: FC<pageProps> = ({onSubmitFnc,className}:pageProps) => {

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
      })

      const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmitFnc(values);
      };

      const defaultStyles = 'space-y-8';
      const combinedStyles = `${defaultStyles} ${className || ''}`;

  return <div>
  <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className={combinedStyles}>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>Email</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage className='font-semibold' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>Password</FormLabel>
              <FormControl>
                <Input  type='password' placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage className='font-semibold' />
            </FormItem>
          )}
        />



        <Button className='rounded-full font-semibold ' type="submit">Login</Button>
      </form>
    </Form>

 
   
  </div>
}

export { formSchema, Login }

