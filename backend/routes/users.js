const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const e = require('express');

// GET all users
router.get(`/`, async (req, res) => {

    // Return all the user with information minus the passwordHash
    const userList = await User.find().select('name phone email');

    if(!userList) res.status(500).json({success: false});

    res.send(userList);
});

// GET specific user
router.get(`/:id`, async (req, res) => {

    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user) res.status(500).json({message: 'User with given id cannot be found' ,success: false});

    res.status(200).send(user);
});

// Post to add a new user
router.post('/', async (req, res) => {

    let user = new User({
        name: req.body.name,
        email:req.body.email, 
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone:req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        street: req.body.street,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    });

    user = await user.save();

    if(!user) return res.status(404).send('The user cannot be created');

    res.send(user);
});

// Login endpoint logic
router.post('/login', async (req, res) => {

    const user = await User.findOne({email: req.body.email});
    const secret = process.env.SECRET;

    if(!user) return res.status(404).send('User with the given email cannot be found');

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) 
    {
        const token = jwt.sign(
            {
                userId: user.id
            },
            secret,
            // Options
            { expiresIn: '1d' }
        );
        res.status(200).send({ user: user.email, token: token });

    } else res.status(400).send('Password is incorrect');

    return res.status(200).send(user);
});

module.exports = router;