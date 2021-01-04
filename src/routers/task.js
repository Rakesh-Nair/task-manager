const express = require('express');
const router = new express.Router();
const Task = require('../model/task');
const auth = require('../middleware/auth');

router.get('/tasks', auth, async (req, res) => {
    try {
        //const tasks = await Task.find({ owner: req.user._id });
        const match = {};
        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
        }
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        }).execPopulate();
        res.status(200).send(req.user.tasks);
    }
    catch (e) {
        res.status(500).send(e);
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task);
    }
    catch (e) {
        res.status(500).send();
    }
});

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save();
        res.status(201).send(task);
    }
    catch (e) {
        res.status(400).send(e);
    }

})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['completed', 'description'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(404).send({ 'error': 'Invalid updates !' });
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task) {
            return res.status(404).send({ 'error': 'No Task found to Update !' });
        }
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.status(200).send(task);
    }
    catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    //const task = await Task.findByIdAndDelete({ _id: req.params.id, owner: req.user._id });
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    try {
        if (!task) {
            return res.status(400).send({ error: 'Task not found !' });
        }
        res.status(200).send();
    }
    catch (e) {
        return res.status(500).send({ error: 'Unable to Delete !' });
    }
});

module.exports = router;