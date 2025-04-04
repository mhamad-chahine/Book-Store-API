const express = require("express");
const router = express.Router();
const {} = require("../Models/Books");
const asyncHandler = require("express-async-handler");
const { validateCreateBook, validateUpdateBook, Book} = require("../Models/Books");
const { verifyTokenAndAdmin } = require("../Middlewares/verifyToken");

/**
 * @desc    Get all books
 * @route   /api/books
 * @method  GET
 * @access  public
 */
router.get("/",
     asyncHandler( async  (req, res) => {
    const books = await Book.find().populate("author", ["_id", "firstName", "lastName"]);
    res.json(books);
}));

/**
 * @desc    Get book by ID
 * @route   /api/books/:id
 * @method  GET
 * @access  public
 */
router.get("/:id", asyncHandler( async  (req, res) => {
    const book = await Book.findById(req.params.id).populate("author");
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: "Book not found!" });
    }
}));

/**
 * @desc    Create a new book
 * @route   /api/books
 * @method  POST
 * @access  private (only admin)
 */
router.post("/", verifyTokenAndAdmin,  asyncHandler( async (req, res) => {

    const { error } = validateCreateBook(req.body);
  
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
  
    const book = new Book(
        {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        price: req.body.price,
        cover: req.body.cover
    }
)
  
  const result = await book.save();
    res.status(201).json(result); // 201 => Created Successfully
}));

/**
 * @desc    Update a book
 * @route   /api/books/:id
 * @method  PUT
 * @access  private (only admin)
 */
router.put("/:id", verifyTokenAndAdmin, asyncHandler( async (req, res) => {
    const { error } = validateUpdateBook(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const updateBook = await Book.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            price: req.body.price,
            cover: req.body.cover
        }
    }, { new: true });
    res.status(200).json(updateBook);
}));

/**
 * @desc    Delete a book
 * @route   /api/books/:id
 * @method  DELETE
 * @access  private (only admin)
 */
router.delete("/:id", verifyTokenAndAdmin, asyncHandler( async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (book) {
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Book has been deleted" });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
}));



module.exports = router;
