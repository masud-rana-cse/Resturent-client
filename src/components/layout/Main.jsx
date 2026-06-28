import React from 'react'
import Navbar from '../common/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../common/Footer';

const Main = () => {
  return (
    <>
      <Navbar />
      {/* </div> */}
      <Outlet />
      <Footer />
    </>
  );
}

export default Main