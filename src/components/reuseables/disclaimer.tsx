import { GoX } from "react-icons/go";

interface ChildProps {
  handleToggleModal: (newValue: boolean) => void;
}

const Disclaimer = ( {handleToggleModal}: ChildProps) =>{  

  return (
    <div className='flex flex-row justify-center fixed top-0 w-[100%] h-screen bg-[#191919] z-100'>
      <div className='flex flex-col lg:w-4/6 gap-5 rounded-xl lg:p-10 p-5'>
        <div className='flex flex-row items-center w-full pb-2 justify-between'>
            <div className='text-white w-1/2 text-lg font-semibold  tracking-wide'>
                ENQUIRE
                <div className='border-b-2 border-[#B39659] lg:w-1/12 w-3/12 pt-3'></div>
            </div>
            <GoX onClick={() => handleToggleModal(false)} className='cursor-pointer text-white text-[1.3rem]'/>
        </div>
        <div className='text-white text-lg font-akshar leading-relaxed'>
          Please note that any communication with ECCORP LTD via e-mail through this website does not constitute or create a client relationship with ECCORP LTD. Please do not send any confidential information using this website.   When you receive an engagement letter from ECCORP LTD you will be our client, and you may then exchange information freely with your designated member of staff or team.
        </div>
        <div onClick={() => handleToggleModal(false)} className='flex flex-row font-akshar capitalize gap-3 text-white items-center'>
            <GoX className='cursor-pointer text-[#B39659] text-[1.3rem]'/>
            Close Window
        </div>        
      </div>
    </div>
  );
}

export default Disclaimer