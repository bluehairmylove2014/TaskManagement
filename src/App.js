
import {
  Routes, Route, Navigate, BrowserRouter
} from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

// Global style
import './App.scss';

// Component
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import PageLoader from './components/common/PageLoader';
import { Provider } from 'react-redux';

// Store redux
import redux_store from './redux/store';

// Service
import UserService from './services/UserService';

// Code spliting, lazy loading component
const TasksPage = lazy(() => import('./pages/Tasks/Tasks'));
const LoginPage = lazy(() => import('./pages/Login/Login'));


function App() {
  const [isLoading, setIsLoading] = useState(true); // Initialize state for loading status

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <Provider store={redux_store}>
      <BrowserRouter>
        <div className="App" data-testid='app'>      
          <Toaster 
            position="bottom-right"
            reverseOrder={false}
          />
          <Suspense fallback={<PageLoader></PageLoader>}>
          {isLoading ? (
            <PageLoader />
          ) : (
            <Routes>
              <Route exact path='/' element={<Navigate to='/tasks' />} />
              <Route exact path='/login' element={<LoginPage />} />
              <Route path='/tasks' element={
                <><TasksPage /><Header account={UserService.isLoggedIn()} /><Footer /></>
              } />
            </Routes>
          )}
          </Suspense>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;


