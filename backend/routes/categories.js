const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();


// update a category
router.put('/:id', async (req, res) => {

    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },
        { new: true }
    );

    if(!category) return res.status(404).send('The category cannot be updated');

    res.send(category);

});

// Get categories
router.get('/', async (req, res) => {
    
    const categoryList = await Category.find();

    if(!categoryList) res.status(500).json({success: false});

    res.status(200).send(categoryList);
});

// Get category by id
router.get('/:id', async (req, res) => {

    const category = await Category.findById(req.params.id);

    if(!category) res.status(500).json({message: 'The category with the given Id was not found'});
    
    res.status(200).send(category);
});

// Post to add a new category
router.post('/', async (req, res) => {

    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });

    category = await category.save();

    if(!category) return res.status(404).send('The category cannot be created');

    res.send(category);
});

// Delete category by id
router.delete('/:id', (req, res) => {
    // using a promise instead of async
    Category.findByIdAndRemove(req.params.id).then(
        category => {
            if(category) return res.status(200).json({success: true, message: 'the category has been deleted'});
            // If it's not found
            return res.status(404).json({success: false, message: "the category was not found"});
        }
    ).catch( err => {
        return res.status(400).json({sucess: false, error: err});
    });
});

module.exports = router;