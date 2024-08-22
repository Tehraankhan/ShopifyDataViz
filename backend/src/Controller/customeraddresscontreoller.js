
const Customers = require('../models/customers')
const Order = require('../models/orders.js')


  

  const CustomersData = async (req,res) => {
    
    console.log("yes")
   
    try {
      

    const customers = await Customers.find({},'default_address.city');
    console.log(customers)
    res.status(500).json(customers);
    
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }


  const CustomersData2 = async (req, res) => {
    let literal = "";
  
    switch (req.params.literal) {
      case "Daily":
        literal = "%Y-%m-%d";
        break;
      case "Monthly":
        literal = "%Y-%m";
        break;
      case "Quarterly":
        literal = ""; 
        break;
      case "Yearly":
        literal = "%Y";
        break;
    }
  
    try {
      const groupBy = {
        $group: {
          _id: req.params.literal === "Quarterly" ? {
            $concat: [
              { $toString: { $year: { $toDate: "$created_at" } } },
              "-Q",
              { $toString: { $ceil: { $divide: [{ $month: { $toDate: "$created_at" } }, 3] } } }
            ]
          } : {
            $dateToString: {
              format: literal, 
              date: { $toDate: "$created_at" }
            }
          },
          count: { $sum: 1 }
        }
      };
  
      const sortBy = {
        $sort: {
          _id: 1 
        }
      };
  
      
      const result = await Customers.aggregate([groupBy, sortBy]);
      res.status(200).json({ result });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  const repeatedCustomers = async (req, res) => {
    let literal = "";
  
    switch (req.params.literal) {
      case "Daily":
        literal = "%Y-%m-%d";
        break;
      case "Monthly":
        literal = "%Y-%m";
        break;
      case "Quarterly":
        literal = ""; 
        break;
      case "Yearly":
        literal = "%Y";
        break;
    }
  
    try {
      const pipeline = [
        {
          "$project": {
            "customer_name": "$customer.default_address.first_name",
            "created_at": {
              "$dateFromString": { "dateString": "$created_at" }
            }
          }
        },
        {
          "$group": {
            "_id": {
              "customer_name": "$customer_name",
              "day": req.params.literal === "Quarterly" ? {
                year: { $year: "$created_at" },
                quarter: {
                  $ceil: { $divide: [{ $month: "$created_at" }, 3] }
                }
              } : {
                "$dateToString": {
                  "format": literal,
                  "date": "$created_at"
                }
              }
            },
            "order_count": { "$sum": 1 }
          }
        },
        {
          "$match": {
            "order_count": { "$gt": 1 }
          }
        },
        {
          "$group": {
            "_id": req.params.literal === "Quarterly" ? {
              $concat: [
                { $toString: "$_id.day.year" },
                "-Q",
                { $toString: "$_id.day.quarter" }
              ]
            } : "$_id.day",
            "repeat_customers_count": { "$sum": 1 }
          }
        },
        {
          "$sort": {
            "_id": 1
          }
        }
      ];
  
      const result = await Order.aggregate(pipeline);
      res.status(200).json({ result });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  module.exports = {CustomersData ,CustomersData2 ,repeatedCustomers}