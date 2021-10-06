const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ContactSchema =  new Schema({
	name:{
		type:String,
        required:true
	},
	addressLines:{
		type:[{
            type:String,
            required:true
        }],
        required:true
	},
	number:{
		type:String,
        required:true
	}
},{timestamps:true,collection:"contacts"});

module.exports = ContactSchema;

