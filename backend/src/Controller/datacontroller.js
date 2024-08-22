
const Order = require('../models/orders.js')


  
const getTotalSalesOverTime = async (req, res) => {
  let literal = "";
console.log(req.params.literal)
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
        _id: literal
          ? {
              $dateToString: {
                format: literal,
                date: { $toDate: "$created_at" }
              }
            }
          : {
              $concat: [
                { $substr: [{ $year: { $toDate: "$created_at" } }, 0, 4] },
                "-Q",
                {
                  $toString: {
                    $ceil: {
                      $divide: [{ $month: { $toDate: "$created_at" } }, 3]
                    }
                  }
                }
              ]
            },
        totalSales: {
          $sum: {
            $toDouble: "$total_price_set.shop_money.amount"
          }
        }
      }
    };

    const sortBy = {
      $sort: {
        _id: 1 
      }
    };

    const result = await Order.aggregate([groupBy, sortBy]);

    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




  const getGrowthrate = async (req,res) => {

    console.log("yes")
   
    try {
      const groupBy = {

        
          $group: {

            _id: {
              $dateToString: {


                format: "%Y-%m",

                date: {
                $toDate: "$created_at"

                }

              }
            }
            ,
            totalSales: {
              $sum: {
                $toDouble: "$total_price_set.shop_money.amount"
              }
            }
        
          
        }




    };
    
    const sortBy = {
      $sort: {
        _id: 1 
      }
    };

    const result = await Order.aggregate([groupBy, sortBy]);
    const growthRates = [];
for (let i = 1; i < result.length; i++) {
  const previousSales = result[i - 1].totalSales;
  const currentSales = result[i].totalSales;
  const growthRate = ((currentSales - previousSales) / previousSales) * 100;
  growthRates.push({ date: result[i]._id, growthRate });
}




    res.status(200).json({growthRates});
    
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }


  }


  const cohort = async (req,res)=>{


    try{

     const pipeline =  [
        {
          "$addFields": {
            "created_at": {
              "$dateFromString": { "dateString": "$created_at" }
            },
            "total_price": {
              "$toDouble": "$total_price_set.shop_money.amount"
            }
          }
        },
        {
          "$group": {
            "_id": {
              "customerId": "$customer.id",
              "cohort": { "$dateToString": { "format": "%Y-%m", "date": { "$min": "$created_at" } } }
            },
            "firstPurchaseDate": { "$min": "$created_at" },
            "lifetimeValue": { "$sum": "$total_price" }
          }
        },
        {
          "$group": {
            "_id": "$_id.cohort",
            "averageLTV": { "$avg": "$lifetimeValue" },
            "totalLTV": { "$sum": "$lifetimeValue" },
            "customerCount": { "$sum": 1 }
          }
        },
        {
          "$sort": { "_id": 1 }  
        }
      ]
      const result = await Order.aggregate(pipeline);
      res.status(200).json({result});

    }catch(err){
      res.status(5400).json({message:"error"});

    }
  }


  module.exports = {getTotalSalesOverTime ,getGrowthrate ,cohort}