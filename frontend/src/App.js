import './App.css';
import React from "react";
import Dashboard from './Components/Dashborad/Dashboard';

import Navbar from './Components/Navabr';


function App() {
 


  

  return (
    <>
      <div className='w-screen h-full bg-[#e6e9ff]'>
        <div className='w-[100%] h-[99%] mx-auto my-auto'>
          <div className='flex flex-col'>
            <Navbar/>
           
            <Dashboard/>
           
            
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
