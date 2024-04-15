import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Outlet } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';

function App() {
  return (
    <AuthProvider>
      <Header />
      <Outlet />
      <Footer />
    </AuthProvider>
  );
}

export default App;
