// Order.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({

    _id: Date,
    Count1: Number,
    
});

module.exports = mongoose.model('customer', customerSchema,'shopifyCustomers');
