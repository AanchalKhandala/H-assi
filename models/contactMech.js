const mongoose = require('mongoose');

const contactMechSchema = new mongoose.Schema({
  customer_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true
  },
  street_address: { 
    type: String, 
    required: true 
  },
  city: { 
    type: String, 
    required: true 
  },
  state: { 
    type: String, 
    required: true 
  },
  postal_code: { 
    type: String, 
    required: true 
  },
  phone_number: { 
    type: String, 
    default: null
  },
  email: { 
    type: String, 
    default: null
  },
}, { timestamps: true });  

const ContactMech = mongoose.model('ContactMech', contactMechSchema);

module.exports = ContactMech;
