const mongoose = require("mongoose");
const Joi = require("joi");

// Book schema
const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 250
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Author"
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    cover: {
        type: String,
        required: true,
        enum: ["Soft Cover", "Hard Cover"]
    }
}, { timestamps: true });

// Book model
const Book = mongoose.model("Book", BookSchema);

// Validation Functions
function validateCreateBook(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(250).required(),
        description: Joi.string().trim().min(5).required(),
        author: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        price: Joi.number().min(0).required(),
        cover: Joi.string().valid("Soft Cover", "Hard Cover").required()
    });

    return schema.validate(obj);
}

function validateUpdateBook(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(250),
        description: Joi.string().trim().min(5),
        author: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        price: Joi.number().min(0),
        cover: Joi.string().valid("Soft Cover", "Hard Cover")
    });

    return schema.validate(obj);
}

module.exports = {
    Book, 
    validateCreateBook,
    validateUpdateBook
};
