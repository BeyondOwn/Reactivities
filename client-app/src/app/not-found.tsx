import Image from 'next/image'
import { FC } from 'react'

interface NotFoundProps {
  
}

const NotFound: FC<NotFoundProps> = ({}) => {
  return <div className='relative max-w-screen h-[calc(92dvh+4px)]'>
    <Image  layout="fill" alt="404 not found" src="/images/404.jpg"></Image>
  </div>
}

export default NotFound