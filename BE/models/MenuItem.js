const mongoose = require('mongoose')

const menuItemSchema = new mongoose.Schema({
  name: String,
  price: String,
  info: String,
  image: String,
  category: String,
  discountPercent: { type: Number, default: 0, min: 0, max: 100 } // Giảm giá theo phần trăm (0-100)
})

module.exports = mongoose.model('MenuItem', menuItemSchema, 'menus')
