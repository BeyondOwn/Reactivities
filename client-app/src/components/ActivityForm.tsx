'use client'
import { Activity } from "@/app/models/activity"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useActivities } from "@/utils/useActivities"
import { useUser } from "@/utils/UserContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { FC, useState } from 'react'
import { useForm } from "react-hook-form"
import { z } from "zod"

interface ActivityFormProps {
  className?:string
  activities?: Activity
  onSubmitFnc: (values: z.infer<typeof formSchema>,router:any,refetch:any,id?: number) => Promise<void>;
}

const formSchema = z.object({
    id: z.number().optional(),
    title: z.string().min(2),
    date: z.date(),
    description: z.string().min(4),
    category: z.string().min(2).optional(),
    city: z.string().min(2).optional(),
    venue: z.string().min(2).optional(),
    creatorId:z.string(),
    creatorDisplayName:z.string(),
    // users:z.any(),
    // userActivities:z.any()
    
    // userActivity : z.object({
    //   userId: z.string(),
    //   displayName: z.string(),
    //   user: z.string(),
    //   activityId: z.number(),
    //   activity: z.string()
    // })
  })

const ActivityForm: FC<ActivityFormProps> = ({className,activities,onSubmitFnc}:ActivityFormProps) => {
    const [date, setDate] = useState<Date>()
    const {error,loading,user} = useUser();
    const refetch = useActivities().refetch;
    const router = useRouter();

    const handleDateChange = (date:Date | undefined) => {
        if (date){
        setDate(date);
        }
      };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          id: activities?.id,
          date: new Date(Date.now()),
          description: "something boring",
          city:"asd",
          venue:"asd",
          category:"asd",
          creatorId:user?.id,
          creatorDisplayName:user?.displayName,
          // users:null,
          // userActivities:[]
        },
      })
      const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmitFnc(values, router,refetch,form.getValues().id);
      };

      const defaultStyles = 'border-2 bg-card text-card-foreground';
      const combinedStyles = `${defaultStyles} ${className || ''}`;

  return (
    <div className={combinedStyles}>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">

      <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Id</FormLabel>
              <FormControl>
                <Input defaultValue={activities?.id.toString()} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input defaultValue={activities?.title} placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                        initialFocus
                        />
                    </PopoverContent>
                    
                    </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input defaultValue={activities?.description} placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input defaultValue={activities?.category} placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input defaultValue={activities?.city} placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue</FormLabel>
              <FormControl>
                <Input defaultValue={activities?.venue} placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}

export { ActivityForm, formSchema }

