import React from 'react';
import {ThreeDots} from 'react-loader-spinner';

interface BannerProps {
  message?: string;
}

const Banner: React.FC<BannerProps> = ({message}) => {
  return (
    <div className='flex flex-col justify-center items-center w-full bg-secondary h-full'>
        <p className='text-lg text-center px-2'>{message}</p>
    </div>
  )
}

export default Banner