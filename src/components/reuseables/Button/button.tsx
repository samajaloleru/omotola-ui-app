import React from 'react';
import Spinner from '../spinner';

interface ButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'ghost';
    icon?: React.ReactNode;
    className?: string;
}

const Button = ({
    title,
    onPress,
    loading,
    variant = 'primary',
    icon,
    className = '',
}: ButtonProps) => {
    return (
        <button
            type='button'
            onClick={onPress}
            disabled={loading}
            aria-busy={loading}
            className={`btn-${variant} ${className}`}
        >
            {loading ? <Spinner size='sm' /> : <>{icon}{title}</>}
        </button>
    );
};

export default Button;
