import React from 'react';
import {ThreeDots} from 'react-loader-spinner';

interface SpinnerProps {
  message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({message}) => {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full'>
        <ThreeDots 
            color='#D8CC34'
            height={50}
            width={50}
        />

        <p className='text-lg text-center px-2'>{message}</p>
    </div>
  )
}

export default Spinner