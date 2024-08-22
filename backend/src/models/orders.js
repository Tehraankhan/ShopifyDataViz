// Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

});

module.exports = mongoose.model('orders', orderSchema,'shopifyOrders');
