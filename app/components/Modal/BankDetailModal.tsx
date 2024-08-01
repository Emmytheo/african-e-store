import React, { useState } from 'react'
import ModalWrapper from './ModalWrapper';
import { useUpdateBankDetail } from '@/app/api/apiClients';
import { BankDetailRequest } from '../models/IBankDetails';
import { toast } from 'sonner';
import { createCustomErrorMessages } from '../constants/catchError';
import { TimesIcon } from '../SVGs/SVGicons';

type Props = {
    visibility: boolean;
    setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

const BankDetailModal = ({ visibility, setVisibility }: Props) => {
    const updateBankDetail = useUpdateBankDetail();
    const [formValues, setFormValues] = useState<BankDetailRequest>({ accountNumber: '', bank: '' });
    const [isEditing, setIsEditing] = useState(false);


    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value } as BankDetailRequest);
    }

    async function handleUpdateBankDetail(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        //show loader
        setIsEditing(true);

        await updateBankDetail(formValues as BankDetailRequest)
            .then((response) => {
                // Log response
                console.log(response);

                // Display success
                toast.success('Success, bank detail updated');

                setFormValues({ accountNumber: '', bank: '' });

            })
            .catch((error) => {
                // Display error
                const errorMessage = createCustomErrorMessages(error.response?.data);
                toast.error(errorMessage);
            })
            .finally(() => {
                // Close loader
                setIsEditing(false);
            });
    }

    return (
        <ModalWrapper
            visibility={visibility}
            setVisibility={setVisibility}
            styles={{ backgroundColor: "transparent" }}
        >
            <div className="bg-white rounded-[34px] md:w-[600px] w-full flex flex-col md:py-7 py-4 px-4 md:px-[32px]">
                <span onClick={() => setVisibility(false)} className='ml-auto cursor-pointer mb4 hover:bg-green-200 hover:rounded'><TimesIcon /></span>
                {/* <h2 className="text-[#828282] font-medium text-2xl mb-2">Update bank detail</h2> */}
                <form className='flex flex-col w-full md:w-[70%] mx-auto gap-7' onSubmit={(e) => handleUpdateBankDetail(e)}>
                    <div className="gap-2">
                        <label className='text-[#1E1E1E]' htmlFor=""><span className='text-[#FD6A02]'>*</span>Enter account number</label>
                        <input
                            type="text"
                            name='accountNumber'
                            placeholder='Enter account number'
                            value={formValues?.accountNumber}
                            onChange={(e) => handleChange(e)}
                            className='rounded-lg border w-full border-[#ACACAC] text-base placeholder:text-[#828282] p-4 outline-none'
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className='text-[#1E1E1E]' htmlFor=""><span className='text-[#FD6A02]'>*</span>Enter bank</label>
                        <input
                            type="text"
                            name='bank'
                            placeholder='Enter bank'
                            value={formValues?.bank}
                            onChange={(e) => handleChange(e)}
                            className='rounded-lg border w-full border-[#ACACAC] text-base placeholder:text-[#828282] p-4 outline-none'
                        />
                    </div>
                    <button disabled={isEditing} type='submit' className='py-2 bg-[#2C7865] hover:bg-opacity-80 text-white w-full rounded-full cursor-pointer disabled:opacity-60 disabled:pointer-events-none'>
                        Proceed
                    </button>
                </form>

            </div>
        </ModalWrapper>
    )
}

export default BankDetailModal