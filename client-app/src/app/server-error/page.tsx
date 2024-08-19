'use client'
import { FC } from 'react'
import { useCommonStore } from '../stores/commonStore'

interface pageProps {
}

const Page: FC<pageProps> = ({}) => {
  const serverError = useCommonStore((state) => state.error)
  console.log(serverError)
  return <div>
    {serverError?.message}
    {serverError?.details}
  </div>
}

export default Page