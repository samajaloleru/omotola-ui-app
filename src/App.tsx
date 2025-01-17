import { Routes, Route, useLocation} from 'react-router-dom';

import IndexRoutes from './containers/index';
import { useEffect } from 'react';

const App = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return (
    <div className="flex flex-col justify-center items-center lg:gap-[5rem] gap-7 w-full h-screen">
      <Routes>
        <Route path="/*" element={<IndexRoutes/>} />
      </Routes>
    </div>
  )
}

export default App;