const express = require('express');
const router = new express.Router();
const User = require('../model/user');

router.get('/users', async (req, res) => {
    const users = await User.find({});
    try {
        res.status(200).send(users);
    }
    catch (e) {
        res.status(500).send(e);
    }
});

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    const user = await User.findById(_id);
    try {
        if (!user) {
            return res.status(404).send()
        }
        res.status(200).send(user);
    }
    catch (e) {
        res.status(500).send();
    }
});

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save()
        res.status(201).send(user);
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['age', 'name', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(404).send({ 'error': 'Invalid updates !' });
    }
    try {
        const user = await User.findById(req.params.id);
        updates.forEach((update) => {
            user[update] = req.body[update];
        });

        await user.save();
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!user) {
            return res.status(404).send({ 'error': 'No User found to Update !' });
        }

        res.status(200).send(user);
    }
    catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/users/:id', async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    try {
        if (!user) {
            return res.status(400).send({ error: 'User not found !' });
        }
        res.status(200).send();
    }
    catch (e) {
        return res.status(500).send({ error: 'Unable to Delete !' });
    }
});

module.exports = router;