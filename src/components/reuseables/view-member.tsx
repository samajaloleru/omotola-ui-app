import React from 'react';
import Spinner from './spinner';
import { MemberInfo } from '../../utils/interface';
import { AiFillCloseCircle, AiOutlineCloudDownload } from 'react-icons/ai';
import { addSuffix } from '../../utils/common';

interface ViewMemberProps {
    member: MemberInfo | null;
    loading?: boolean;
    // onPress: () => void;
    closeModal?: (value: boolean) => void;
}

const ViewMember = ({
    member,
    // onPress,
    loading,
    closeModal,
}: ViewMemberProps) => {
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
        <div className='h-screen w-full flex flex-col justify-center items-center absolute z-50  bg-opacity-40'>
            <div className='md:w-1/2 w-11/12 flex flex-col gap-8 items-center p-8 bg-white shadow-xl shadow-primary rounded-lg text-primary lg:h-auto h-[40rem] overflow-auto'>
                <div className='w-full flex flex-row justify-end sticky'>
                    <AiFillCloseCircle size={30} color='red' onClick={handleCloseModal}  className='cursor-pointer'/>
                </div>
                <div className='flex lg:flex-row flex-col gap-5 w-full items-center text-primary'>
                    <div className='flex flex-col gap-4 items-center'>
                        <img
                            // src={member?.image && urlFor(pinDetail.image).url()}
                            src={member?.imageUrl}
                            alt="uploaded-pic"
                            className="aspect-square max-h-[30rem] object-contain"
                        />
                        <a href={`${member?.imageUrl}?dl=`} download onClick={(e) => e.stopPropagation()} className='bg-secondary hover:bg-primary hover:text-white cursor-pointer w-auto gap-3 flex flex-row items-center justify-center p-2 px-5 rounded-lg font-semibold'>
                            <AiOutlineCloudDownload size={20}/>
                            Download
                        </a>
                    </div>
                    <div className='grid lg:grid-cols-2 items-center  gap-5 w-full'>
                        <div className='flex flex-col col-span-2'>
                            <div className='font-medium'>Rank</div>
                            <div className='font-bold lg:text-[1.4rem]'>{member?.rank || '---'}</div>
                        </div>
                        <div className='flex flex-col col-span-2'>
                            <div className='font-medium'>Full Name</div>
                            <div className='font-bold lg:text-[1.4rem]'>{member?.fullName || '---'}</div>
                        </div>
                        <div className='flex flex-col col-span-2'>
                            <div className='font-medium'>Email</div>
                            <div className='font-bold lg:text-[1.4rem]'>{member?.email || '---'}</div>
                        </div>
                        <div className='flex flex-col'>
                            <div className='font-medium'>Mobile</div>
                            <div className='font-bold lg:text-[1.4rem]'>{member?.mobile || '---'}</div>
                        </div>
                        <div className='flex flex-col'>
                            <div className='font-medium'>Gender</div>
                            <div className='font-bold lg:text-[1.4rem]'>{member?.gender || '---'}</div>
                        </div>
                        <div className='flex flex-col col-span-2'>
                            <div className='font-medium'>Day & Month of Date</div>
                            <div className='font-bold lg:text-[1.4rem]'>
                                {member?.day ? `${addSuffix(member.day)} of ${member.month || '---'}` : '---'}
                            </div>
                        </div>
                        <div className='flex flex-col col-span-2'>
                            <div className='font-medium'>Home Address</div>
                            <div className='font-bold lg:text-[1.4rem]'>{member?.homeAddress || '---'}</div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default ViewMember;
