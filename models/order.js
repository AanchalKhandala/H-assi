const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_date: { type: Date, default: Date.now },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  shipping_address: { type: String, required: true },
  billing_address: { type: String, required: true },
  order_items: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
      status: { type: String, default: 'Pending' },
    },
  ],
});

module.exports = mongoose.model('Order', orderSchema);
