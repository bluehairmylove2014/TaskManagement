
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

// Component
import TasksPage from './pages/Tasks/Tasks';
import LoginPage from './pages/Login/Login';


function App() {
  return (
    <Provider store={redux_store}>
      <BrowserRouter>
        <div className="App" data-testid='app'>      
          <Toaster 
            position="bottom-right"
            reverseOrder={false}
          />
          <Routes>
            <Route exact path='/' element={<Navigate to='/tasks' />} />
            <Route exact path='/login' element={<LoginPage />} />
            <Route path='/tasks' element={
              <><TasksPage /><Header account={UserService.isLoggedIn()} /><Footer /></>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;


