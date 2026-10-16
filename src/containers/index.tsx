import { Routes, Route } from 'react-router-dom';

import { AlertProvider } from '../utils/notification/alertcontext';
import Alert from '../utils/notification/alert';
import Layout from '../components/layout';

import {Games, Home, Members, NotFound} from '../pages/_route';

const IndexRoutes = () => {
  return (
    <AlertProvider>
      <Alert />
      <Layout>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/games" element={<Games/>} />
          <Route path="/members" element={<Members/>} />
          <Route path="/*" element={<NotFound/>} />
        </Routes>
      </Layout>
    </AlertProvider>
  )
}

export default IndexRoutes;
