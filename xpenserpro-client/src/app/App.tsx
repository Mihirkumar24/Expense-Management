// shadcn/ui

import { Progress } from '@/shared/ui/progress';

import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

import { useGetMeQuery } from '../entities/me';

import Home from '@/pages/home';

import './App.css'

function App() {
  const { data: getMeData } = useGetMeQuery();

  const {
    isLoading,
    isAuthenticated
  } = useSelector((state) => state.authentication);

  console.log('Inside App, State:', 'loading?', isLoading, 'authenticated?', isAuthenticated);

  if (isLoading) {
    return (
      <Progress value={70} />
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to='/sign-in' />
    );
  }

  return (
    <Home />
  )
}

export default App
