const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { Author, validateCreateAuthor, validateUpdateAuthor } = require("../Models/Authors");
const { verifyTokenAndAdmin} = require("../Middlewares/verifyToken");
/**
 * @desc    Get all author
 * @route   /api/authors
 * @method  GET
 * @access  public
 */

router.get(
  "/", 
  asyncHandler(
  async (request, response) => {  
      const authorList = await Author.find(); // .sort({firstName: 1}) to sort it (-1) and i can use Select
      response.status(200).json(authorList);
  }
));

/**
 * @desc    Get authors by ID
 * @route   /api/authors/:id
 * @method  GET
 * @access  public
 */

router.get("/:id", asyncHandler( async (request, response) => {
    const author = await Author.findById(request.params.id);
    if (author) {
      response.status(200).json(author);
    } else {
      response.status(404).json({ message: "Author not found!" });
    }
}));

/**
 * @desc    Create a new author
 * @route   /api/author
 * @method  POST
 * @access  private (only admin)
 */

router.post("/", verifyTokenAndAdmin, asyncHandler(
  async (request, response) => {
    const { error } = validateCreateAuthor(request.body);
  
    if (error) {
      return response.status(400).json({ message: error.details[0].message });
    }
      const author = new Author({
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        nationality: request.body.nationality,
        image: request.body.image,
      });
  
      const result = await author.save();
  
      response.status(200).json(result);
  }
));

/**
 * @desc    Update an author
 * @route   /api/author/:id
 * @method  PUT
 * @access  private (only admin)
 */
router.put("/:id",verifyTokenAndAdmin, asyncHandler(
  async (request, response) => {
    const { error } = validateUpdateAuthor(request.body);
  
    if (error) {
      return response.status(400).json({ message: error.details[0].message });
    }

      const author = await Author.findByIdAndUpdate(
        request.params.id,
        {
          $set: {
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            nationality: request.body.nationality,
            image: request.body.image,
          },
        },
        { new: true }
      );
      response.status(200).json(author);
  }
));

/**
 * @desc    Delete an author
 * @route   /api/author/:id
 * @method  DELETE
 * @access  private (only admin)
 */
router.delete("/:id", verifyTokenAndAdmin, asyncHandler(
  async (request, response) => {

      const author = await Author.findById(request.params.id);
  
      if (author) {
        await Author.findByIdAndDelete(request.params.id);
        response.status(200).json({ message: "Author has been deleted" });
      } else {
        return response.status(404).json({ message: "Author not found" });
      }
  }
));

module.exports = router;
