const express = require("express");
const { getTotalSalesOverTime, getGrowthrate,cohort } = require("../Controller/datacontroller.js");
const {CustomersData ,CustomersData2, repeatedCustomers} = require("../Controller/customeraddresscontreoller.js")
const dataRouter = express.Router();






dataRouter.get("/growthrate",getGrowthrate)
dataRouter.get("/cohort",cohort)
dataRouter.get("/repeatedcustomer/:literal",repeatedCustomers)
dataRouter.get("/totalsale/:literal",getTotalSalesOverTime)
dataRouter.get("/customer2/:literal",CustomersData2)

dataRouter.get("/customer",CustomersData)
module.exports = dataRouter;



