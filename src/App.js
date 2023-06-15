
import {
  Routes, Route, Navigate
} from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Global style
import './App.scss';

// Component
import Sidebar from './components/layouts/Sidebar';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import PageLoader from './components/common/PageLoader';
import { Provider } from 'react-redux';

// Store redux
import redux_store from './redux/store';

// Service
import UserService from './services/UserService';

// Code spliting, lazy loading component
const DashboardPage = lazy(() => import('./pages/Dashboard/Dashboard'));
const TimelinePage = lazy(() => import('./pages/Timeline/Timeline'));
const TasksPage = lazy(() => import('./pages/Tasks/Tasks'));
const SettingPage = lazy(() => import('./pages/Setting/Setting'));
const FilesPage = lazy(() => import('./pages/Files/Files'));
const LoginPage = lazy(() => import('./pages/Login/Login'));


function App() {
  return (
    <Provider store={redux_store}>
      <div className="App">
        <Suspense fallback={<PageLoader></PageLoader>}>
          <Routes>
            <Route exact path='/' element={<Navigate to='/dashboard' />} />
            <Route exact path='/login' element={<LoginPage />} />
            <Route path='/dashboard' element={
              <><DashboardPage /><Sidebar /><Header account={UserService.isLoggedIn()} /><Footer /></>
            } />
            <Route path='/timeline' element={
              <><TimelinePage /><Sidebar /><Header account={UserService.isLoggedIn()} /><Footer /></>
            } />
            <Route path='/tasks' element={
              <><TasksPage /><Sidebar /><Header account={UserService.isLoggedIn()} /><Footer /></>
            } />
            <Route path='/setting' element={
              <><SettingPage /><Sidebar /><Header account={UserService.isLoggedIn()} /><Footer /></>
            } />
            <Route path='/files' element={
              <><FilesPage /><Sidebar /><Header account={UserService.isLoggedIn()} /><Footer /></>
            } />
          </Routes>
        </Suspense>
      </div>
    </Provider>
  );
}

export default App;


