import {useState}  from 'react';
import { Routes, Route } from 'react-router-dom';

import { AlertProvider } from '../utils/notification/alertcontext';
import Alert from '../utils/notification/alert';

import {Games, Home, NotFound} from '../components/pages/_route';

const IndexRoutes = () => {
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false)
  //   }, 2000);
  // }, [])

  // if (loading) {
  //   return <Onboarding/>
  // }
  
  return (
    <div className={`flex flex-col justify-center bg-primary items-center w-full overflow-auto h-screen`}>
      <AlertProvider>
        <Alert />  
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/games" element={<Games/>} />
          <Route path="/*" element={<NotFound/>} />
        </Routes>
      </AlertProvider>
      {/* <div className='absolute bottom-1 bg-black bg-opacity-80 py-5 z-10 w-full text-center text-white oswald-font'>
        Powered by Authentic Sam
      </div> */}
    </div>
  )
}

export default IndexRoutes;