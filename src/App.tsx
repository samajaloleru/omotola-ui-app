import { Routes, Route, useLocation} from 'react-router-dom';

import IndexRoutes from './containers/index';
import { useEffect } from 'react';

const App = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/*" element={<IndexRoutes/>} />
    </Routes>
  )
}

export default App;
