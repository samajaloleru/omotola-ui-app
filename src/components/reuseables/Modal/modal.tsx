import React from 'react';
import Spinner from '../spinner';

interface ModalProps {
    message: string;
    description?: string;
    loading: boolean;
    onPress: () => void;
    closeModal: (value: boolean) => void;
}

const Modal = ({
    message,
    description = 'Please confirm the details you entered are correct.',
    onPress,
    loading,
    closeModal,
}: ModalProps) => {
    return (
        <div className='fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-[2px] sm:items-center'>
            <div role='dialog' aria-modal='true' className='w-full max-w-md animate-rise rounded-2xl bg-white p-6 text-ink shadow-lift sm:p-8'>
                {loading ? (
                    <div className='flex flex-col items-center gap-4 py-6 text-plum'>
                        <Spinner />
                        <p className='font-serif text-xl'>Submitting…</p>
                    </div>
                ) : (
                    <>
                        <h2 className='text-2xl font-semibold'>{message}</h2>
                        <p className='mt-2 text-muted'>{description}</p>
                        <div className='mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
                            <button type='button' onClick={() => closeModal(false)} className='btn-secondary'>
                                Go back
                            </button>
                            <button type='button' onClick={onPress} className='btn-primary'>
                                Yes, submit
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Modal;
