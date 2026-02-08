const mongoose = require('mongoose');

// This file ONLY defines the structure of your data
const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  keywords: { type: [String], index: true }, 
  answer: { type: String, required: true },
  category: { type: String, default: 'General' }
});

// We export the model so server.js can use it
module.exports = mongoose.model('Faq', faqSchema);