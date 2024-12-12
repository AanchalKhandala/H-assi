const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT =  process.env.PORT ||5000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/h-ecom', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Models
const Customer = require('./models/customer');
const Product = require('./models/product');
const Order = require('./models/order');
const ContactMech = require('./models/contactMech');


//create customer
app.post('/customers', async (req, res) => {
  const { first_name, last_name } = req.body;
  try {
    const newCustomer = new Customer({ first_name, last_name });
    await newCustomer.save();
    res.status(201).send(newCustomer);
  } catch (err) {
    res.status(400).send('Error creating customer: ' + err.message);
  }
});

// Create a Product
app.post('/products', async (req, res) => {
  const { product_name, color, size } = req.body;
  try {
    const newProduct = new Product({
      product_name,
      color,
      size,
    });

    await newProduct.save();
    res.status(201).send(newProduct); // Return the created product
  } catch (err) {
    res.status(400).send('Error creating product: ' + err.message);
  }
});

 // Create an Order
 app.post('/orders', async (req, res) => {
  const { customer_id, shipping_address, billing_address, order_items } = req.body;
  try {
    const customer = await Customer.findById(customer_id);
    if (!customer) return res.status(404).send('Customer not found');

    const order = new Order({
      customer_id,
      shipping_address,
      billing_address,
      order_items,
    });

    await order.save();
    res.status(201).send(order);
  } catch (err) {
    res.status(400).send('Error creating order: ' + err.message);
  }
});
 // Get Order Details
 app.get('/orders/:order_id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.order_id).populate('customer_id').populate('order_items.product_id');
    if (!order) return res.status(404).send('Order not found');
    res.status(200).send(order);
  } catch (err) {
    res.status(400).send('Error retrieving order: ' + err.message);
  }
});
//update order
app.put('/orders/:order_id', async (req, res) => {
  const { quantity, status } = req.body;
  try {
    const order = await Order.findById(req.params.order_id);
    if (!order) return res.status(404).send('Order not found');


    await order.save();
    res.status(200).send(order);
  } catch (err) {
    res.status(400).send('Error updating order item: ' + err.message);
  }
});

 // Update Order Item
 app.put('/orders/:order_id/items/:item_id', async (req, res) => {
  const { quantity, status } = req.body;
  try {
    const order = await Order.findById(req.params.order_id);
    if (!order) return res.status(404).send('Order not found');

    const item = order.order_items.id(req.params.item_id);
    if (!item) return res.status(404).send('Order item not found');

    item.quantity = quantity || item.quantity;
    item.status = status || item.status;

    await order.save();
    res.status(200).send(order);
  } catch (err) {
    res.status(400).send('Error updating order item: ' + err.message);
  }
});

// Delete Order
app.delete('/orders/:order_id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.order_id);
    if (!order) return res.status(404).send('Order not found');
    res.status(200).send('Order deleted');
  } catch (err) {
    res.status(400).send('Error deleting order: ' + err.message);
  }
});

// Delete Order Item
app.delete('/orders/:order_id/items/:item_id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.order_id);
    if (!order) return res.status(404).send('Order not found');

    const item = order.order_items.id(req.params.item_id);
    if (!item) return res.status(404).send('Order item not found');

    item.remove();
    await order.save();
    res.status(200).send(order);
  } catch (err) {
    res.status(400).send('Error deleting order item: ' + err.message);
  }
});
//get order item
app.get('/:orderId/items', async (req, res) => {
  const { orderId } = req.params; 

  try {
    
    const order = await Order.findById(orderId).populate({
      path: 'order_items.product_id', 
      select: 'name price', 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order_items: order.order_items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new ContactMech
app.post('/contactmech', async (req, res) => {
  try {
    const { customer_id, street_address, city, state, postal_code, phone_number, email } = req.body;

    const newContactMech = new ContactMech({
      customer_id: mongoose.Types.ObjectId(customer_id), 
      street_address,
      city,
      state,
      postal_code,
      phone_number,
      email
    });

    await newContactMech.save();
    res.status(201).json(newContactMech);
  } catch (err) {
    res.status(400).json({ message: "Error creating contactMach", error: err.message });
  }
});

// // Get all contact mechanisms
// app.get('/contactmech/:id', async (req, res) => {
//   try {
//     const contactMechs = await ContactMech.find().populate('customer_id', 'first_name last_name'); 
//     res.status(200).json(contactMechs);
//   } catch (err) {
//     res.status(500).json({ message: "Error retrieving contact mechanisms", error: err.message });
//   }
// });
// // Get a specific contact mechanism by ID
// app.get('/contactmech/:id', async (req, res) => {
//   try {
//     const contactMech = await ContactMech.findById(req.params.id).populate('customer_id', 'first_name last_name');
//     if (!contactMech) {
//       return res.status(404).json({ message: "Contact mechanism not found" });
//     }
//     res.status(200).json(contactMech);
//   } catch (err) {
//     res.status(500).json({ message: "Error retrieving contact mechanism", error: err.message });
//   }
// });

// API Routes
//require('./routes/orders')(app, Customer, Product, Order);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
