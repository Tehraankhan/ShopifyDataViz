import React, { useState } from "react";


import { Link as ScrollLink } from "react-scroll";

export default function Navbar() {
  const [navbar, setnavbar] = useState(false);

  return (
    <>
     
        <div id="Home" className="w-[100%] h-[80px] fixed  flex  bg-[black]  flex-row   "
        >
         

          <div className="text-[white] flex flex-col ">
            <ul className="flex flex-row font-jura text-[20px] mt-[20px]">
              <ScrollLink to="Total Sales" smooth={true} duration={500}  offset={-90}>
                <li
                  className="pl-[30px] text-[20px] text "
                  data-fill-text="Home"
                >
                 Total Sales
                </li>
              </ScrollLink>
              
              <ScrollLink to="Sales Growth" smooth={true} duration={500} offset={-90}>
                <li
                  className="pl-[30px] text-[20px] text"
                  data-fill-text="Features"
                >
                 Sales Growth 
                </li>
              </ScrollLink>
              <ScrollLink to="Newcustomer" smooth={true} duration={500} offset={-90}>
                <li
                  className="pl-[30px] text-[20px] text"
                  data-fill-text="About us"
                >
                 New Customers
                </li>
              </ScrollLink>
              <ScrollLink to="Cohort" smooth={true} duration={500} offset={-90}>
                <li
                  className="pl-[30px] text-[20px] text"
                  data-fill-text="Contact us"
                >
                 Cohort 
                </li>
              </ScrollLink>
              <ScrollLink to="Repeated customers" smooth={true} duration={500} offset={-90}>
                <li
                  className="pl-[30px] text-[20px] text"
                  data-fill-text="Contact us"
                >
                 Repeated customers 
                </li>
              </ScrollLink>
              <ScrollLink to="Maps" smooth={true} duration={500} offset={-90}>
                <li
                  className="pl-[30px] text-[20px] text"
                  data-fill-text="Contact us"
                >
                Map
                </li>
              </ScrollLink>
            </ul>
          </div>
         
        </div>
     
    </>
  );
}