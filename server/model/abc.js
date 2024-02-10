const mongoose = require('mongoose');

const abc = mongoose.Schema({
    name:{
        type: String,
    },
    reason: {
        type: String,
        default:null,
    },
    earn_amount: {
        type: Number,
    },
    waste_amount: {
        type: Number,
    },
    earn_date: {
        type: Date,
        default: Date.now
    },
    waste_date: {
        type: Date,
        default: Date.now
    },
    paid: {
        type: Boolean,
        default: false  // Default value for the checkbox
    }

});

const Expense = mongoose.model('Money', abc);
module.exports = Expense;
