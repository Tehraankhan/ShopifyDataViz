

import Growthrate from "./Growthrate";
import Maps from "../Maps"


import Newcustomer from "./Newcustomer";
import Cohortcustomer from "./Cohortcustomer";
import Repeatcustomer from "./Repeatcustomer";
import Totalsale from "./Totalsales";



export default function Dashboard() {


 
  return (
    <>
      <div className="w-full mt-[30px] overflow-y-auto no-scrollbar">

    
       <Totalsale/>
        <Growthrate/>
        <Newcustomer/>
        <Cohortcustomer/>
        <Repeatcustomer/>
        <Maps/>
        
        
      </div>
    </>
  );
}
