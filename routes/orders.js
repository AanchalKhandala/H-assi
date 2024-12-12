module.exports = (app, Customer, Product, Order, ) => {
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
  };
  