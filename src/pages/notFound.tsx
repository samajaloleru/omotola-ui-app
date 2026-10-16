import { NavLink } from "react-router-dom";
import { PiArrowLeftBold } from "react-icons/pi";

const NotFound = () => {
  return (
    <div className='mx-auto flex w-full max-w-xl flex-1 flex-col items-start justify-center px-4 py-20 sm:px-6'>
      <p className='eyebrow'>Error 404</p>
      <h1 className='mt-3 text-4xl font-semibold text-plum sm:text-5xl'>This page doesn't exist</h1>
      <p className='mt-4 text-lg text-muted'>
        The link may be mistyped or out of date. Check the address, or head back to the member portal.
      </p>
      <NavLink to='/' className='btn-primary mt-8'>
        <PiArrowLeftBold />
        Back to the portal
      </NavLink>
    </div>
  )
}

export default NotFound;
