'use client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'


interface ExpectedResponse {
    id: string
    title: string
    date: string
    description:string
    category:string
    city:string
    venue:string
}

interface urlProps {
    url:string
}

async function fetchGetAll(url: string): Promise<ExpectedResponse[]> {
    const result = await axios.get(url)
    console.log(result.data)
    return result.data;
}


function GetAllActivities({url}:urlProps) {
    const { isPending, isError, data, error } = useQuery({
      queryKey: ['activities'],
      queryFn: ()=>fetchGetAll(url),
    })
  
    if (isPending) {
      return <span>Loading...</span>
    }
  
    if (isError) {
      return <span>Error: {error.message}</span>
    }
  
    // We can assume by this point that `isSuccess === true`
    return (
      <ul>
        {data.map((todo,index) => (
          <li key={index}>{todo.category}</li>
        ))}
      </ul>
    )
  }



export default GetAllActivities;
