import React from 'react';
import Spinner from '../spinner';

interface ModalProps {
    message: string;
    loading: boolean;
    onPress: () => void;
    closeModal: (value: boolean) => void;
}

const Modal = ({
    message,
    onPress,
    loading,
    closeModal,
}: ModalProps) => {
    const handleCloseModal = () => {//+
        if (closeModal) {//+
            closeModal(false);//+
        }//+
    };//

    if (loading) {
        return (
            <div className='h-full w-full flex flex-col justify-end items-center absolute z-50  bg-opacity-40'>
                <div className='md:w-4/5 w-full flex flex-col gap-8 items-center p-8 bg-white rounded-lg text-primary'>
                    <div className='font-bold w-full text-2xl text-center'>Submitting ...</div>
                    <Spinner />
                </div>
            </div>
        );
    }
    return (
        <div className='h-full w-full flex flex-col justify-end items-center absolute z-50  bg-opacity-40'>
            <div className='md:w-4/5 w-full flex flex-col gap-8 items-center p-8 bg-white rounded-lg text-primary'>
                {!loading && <div className='font-bold w-full text-2xl text-center'>{message}</div>}
                {!loading && <div className='grid grid-cols-2 gap-10 w-full items-center text-white'>
                    <div
                        onClick={handleCloseModal}
                        className='flex flex-col font-bold items-center w-full lg:text-xl text-lg bg-red hover:bg-light-red cursor-pointer p-3 rounded-lg'>
                        <div>No</div>
                    </div>
                    <div
                        onClick={onPress}
                        className='flex flex-col font-bold items-center w-full lg:text-xl text-lg bg-green hover:bg-light-green hover:text-primary cursor-pointer p-3 rounded-lg'>
                        <div>Yes</div>
                    </div>
                </div>}
                {loading && <div className='font-bold w-full text-2xl text-center'>Submitting ...</div> }
                {loading && <Spinner />}
            </div>

        </div>
    );
};

export default Modal;
