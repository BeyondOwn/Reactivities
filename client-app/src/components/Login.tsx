'use client'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
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

      const defaultStyles = 'border-2 bg-card text-card-foreground';
      const combinedStyles = `${defaultStyles} ${className || ''}`;

  return <div>
    <Dialog>
  <DialogTrigger className={cn(
            buttonVariants({ variant: 'default' }),
            'self-start -mt-20'
          )}>
    Login
    </DialogTrigger>
  <DialogContent className={combinedStyles}>
    
  <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />



        <Button type="submit">Submit</Button>
      </form>
    </Form>

  </DialogContent>
</Dialog>
   
  </div>
}

export { formSchema, Login }

