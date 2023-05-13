const User = require('../models/User');
const Note = require('../models/Note');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password').lean();
    // if not users
    if (!users?.length) {
        res.status(400).send('No users found');
        return;
    }
    res.json(users);
});

const createUser = asyncHandler(async (req, res) => {
    const {username, password, roles} = req.body;

    // confirm data
    if (!username || !password || !roles.length || !Array.isArray(roles)) {
        res.status(400).send('All Fields are required');
        return;
    }

    // Check if username already exists
    const foundUser = await User.findOne({username}).lean().exec();

    if (foundUser) {
        res.status(409).send('Username already exists');
        return;
    }

    // Hash password
    hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = User.create({
        username,
        password: hashedPassword,
        roles
    });
    
    if (newUser) {
        res.status(201).json({Message: `User ${newUser} created`});
    } else {
        res.status(400).send('Invalid user data');
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const {username, id, roles, active} = req.body;

    if (!username || !roles.length || !Array.isArray(roles) || typeof active !== 'boolean') {
        res.status(400).send('All Fields are required');
        return;
    }

    // Check if username exists in the database
    const foundUser = await User.findById(id).exec();

    if (!foundUser) {
        res.status(400).send('User does not exist');
        return;
    }

    // duplicate username check
    const duplicate = await User.findOne({username}).lean().exec();

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).send('Username already exists');
    }

    foundUser.username = username;
    foundUser.roles = roles;
    foundUser.active = active;

    const updatedUser = await foundUser.save();

    res.status(200).json(updatedUser);

});

const deleteUser = asyncHandler(async (req, res) => {
    const {id} = req.body;

    if (!id) {
        res.status(400).send('User ID required');
        return;
    }

    const notes = await Note.find({user: id}).lean().exec();

    if (notes?.length) {
        res.status(400).send('User has notes. Delete notes first');
        return;
    }

    // check if username exists in the database
    const foundUser = await User.findById(id).exec();

    if (!foundUser) {
        res.status(400).send('User does not exist');
        return;
    }

    // delete user
    const result = await foundUser.deleteOne();

    const reply = {
        message: 'User deleted',
    }

    res.status(200).json(reply);
});

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
}