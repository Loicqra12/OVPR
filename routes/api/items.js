const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check } = require('express-validator');
const itemsController = require('../../controllers/itemsController');

// @route   POST api/items
// @desc    Create a new item
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty(),
    ],
  ],
  itemsController.createItem
);

// @route   GET api/items
// @desc    Get all items
// @access  Public
router.get('/', itemsController.getItems);

// @route   GET api/items/:id
// @desc    Get item by ID
// @access  Public
router.get('/:id', itemsController.getItemById);

// @route   PUT api/items/:id
// @desc    Update an item
// @access  Private
router.put('/:id', auth, itemsController.updateItem);

// @route   DELETE api/items/:id
// @desc    Delete an item
// @access  Private
router.delete('/:id', auth, itemsController.deleteItem);

module.exports = router;
