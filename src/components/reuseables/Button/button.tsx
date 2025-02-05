import React from 'react';
import Spinner from '../spinner';

interface ButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    hasShadow?: boolean;
}

const Button = ({
    title,
    onPress,
    loading,
    hasShadow = true,
}: ButtonProps) => {
    if (loading) {
        return (
            <div className='flex flex-col items-center w-full'>
                <Spinner />
            </div>
        );
    }

    return (
        <div
            onClick={onPress}
            className='flex flex-col font-bold items-center w-full lg:text-xl text-lg bg-secondary hover:bg-white text-primary cursor-pointer p-3 rounded-lg'>
            <div>{title}</div>
        </div>
    );
};

export default Button;
