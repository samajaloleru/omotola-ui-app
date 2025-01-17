import { NavLink } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

import logo from '../../assets/images/logo.png';
import { useState } from 'react';


const Navbar = () => {
  const [showMenu, SetShowMenu] = useState(false)


  return (
    <div className='flex flex-col w-full font-akshar relative'>
      <div className='flex flex-row justify-between items-center w-full lg:py-5 py-3'>
        <NavLink  to='/'>
          <img src={logo} alt='logo' className='h-10'/>
        </NavLink>
        <div className={`${isMobile ? 'hidden' : '' } flex flex-col text-lg text-white  justify-end`}>
          <NavLink className={({ isActive }) => (isActive ? 'text-white tracking-wide text-right text-[1.2rem]' : 'text-[#B39659] tracking-wide text-right text-[1.2rem]')} to='/career'>
            Careers
          </NavLink>
          <div className={`tracking-wide flex flex-row gap-[4rem] text-[1.4rem]  text-white items-center`}>
            <NavLink to='/about' className={({ isActive }) => (isActive ? 'text-[#B39659]' : '')}>
              ABOUT THE FIRM
            </NavLink>
            <NavLink to='/professionals' className={({ isActive }) => (isActive ? 'text-[#B39659]' : '')}>
              PROFESSIONALS
            </NavLink>
            <NavLink to='/services' className={({ isActive }) => (isActive ? 'text-[#B39659]' : '')}>
              SERVICE AREAS
            </NavLink>
            <NavLink to='/clients' className={({ isActive }) => (isActive ? 'text-[#B39659]' : '')}>
              CLIENTS
            </NavLink>
            <NavLink to='/updates' className={({ isActive }) => (isActive ? 'text-[#B39659]' : '')}>
              UPDATES
            </NavLink>
          </div>
        </div>
        <div className={`${isMobile ? '' : 'hidden' } flex flex-row gap-4 text-white items-center`}>
          <i onClick={() => SetShowMenu(true)} className='fi fi-rr-menu-burger cursor-pointer'></i>
        </div>
      </div>
      {showMenu && 
        <div className='flex flex-col fixed top-0 right-0 w-screen h-screen bg-black bg-opacity-70 z-50'>
          <div className='flex flex-col w-full relative bg-[#110f16]'>
            <div className='flex flex-row items-center justify-between w-full py-3 px-5 border-b border-gray-200'>
              <NavLink to='/'>
                <img src={logo} alt='logo' className='h-10'/>
              </NavLink>
              <i onClick={() => SetShowMenu(false)} className='fi fi-rr-cross text-white cursor-pointer'></i>
            </div>
            <div className='flex flex-col tracking-wide w-full gap-[2rem] p-5 text-white'>
              <NavLink onClick={() => SetShowMenu(false)} to='/about'>
                ABOUT THE FIRM
              </NavLink>
              <NavLink onClick={() => SetShowMenu(false)} to='/professionals'>
                PROFESSIONALS
              </NavLink>
              <NavLink onClick={() => SetShowMenu(false)} to='/services'>
                SERVICE AREAS
              </NavLink>
              <NavLink onClick={() => SetShowMenu(false)} to='/clients'>
                CLIENTS
              </NavLink>
              <NavLink onClick={() => SetShowMenu(false)} to='/updates'>
                UPDATES
              </NavLink>
              <NavLink className=' text-[#B39659]' onClick={() => SetShowMenu(false)} to='/career'>
                CAREERS
              </NavLink>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default Navbar