import { NavLink } from "react-router-dom";


const NotFound = () => {
  
  return (
    <div className='flex flex-col lg:gap-[3rem] gap-10 w-full'>
      <div className='flex flex-col w-full items-center px-5 lg:mt-[5rem] bg-black bg-opacity-50 mt-10 lg:mb-20'>
        <div className={`leading-relaxed text-white  lg:text-[3.5rem] text-2xl my-3 font-bold text-center`}>
          Oops! It looks like you've wandered off right path
        </div>
        <div className='text-white lg:text-lg text-sm lg:w-2/5 w-full text-center'>Oops! It seems you've stumbled upon a page that doesn't exist. Don't worry, it happens to the best of us. Here are a few things you can try:</div>

        <div className='flex flex-col text-white lg:text-lg text-sm lg:w-2/5 w-full gap-2 mt-10 lg:mb-20 mb-10'>
          <div className='flex flex-row gap-3'>
            <span>1.</span>
            <span>Double-check the URL: Ensure that you've entered the correct web address. Sometimes, a simple typo can lead you astray.</span>
          </div>
          <div className='flex flex-row gap-3'>
            <span>2.</span>
            <span>Navigate Back: Use the navigation menu or browser back button to return to the previous page.</span>
          </div>
          <div className='flex flex-row gap-3'>
            <span>3.</span>
            <span>Explore Our Site: Take this opportunity to explore our website. We have a lot to offer, from informative articles and updates to exciting products and services.</span>
          </div>
          <div className='flex flex-row gap-3'>
            <span>4.</span>
            <span>Contact Us: If you're still having trouble finding what you need, feel free to reach out to our support team. We're here to help!</span>
          </div>
        </div>

        <NavLink to={'/'} className='bg-yellow-500 p-3 px-5 text-white font-semibold lg:text-xl text-sm gap-2 tracking-wider uppercase flex flex-row items-center mb-10'>
          <i className="fi fi-rr-angle-small-left mb-[-.3rem]"></i>
          Back to homepage
        </NavLink>
      </div>
    </div>
  )
}

export default NotFound;
