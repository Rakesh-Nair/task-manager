const express = require('express');
const router = new express.Router();
const Task = require('../model/task');

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).send(tasks);
    }
    catch (e) {
        res.status(500).send(e);
    }
});

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task);
    }
    catch (e) {
        res.status(500).send();
    }
});

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    }
    catch (e) {
        res.status(400).send(e);
    }

})

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['completed', 'description'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(404).send({ 'error': 'Invalid updates !' });
    }
    try {
        const task = await Task.findById(req.params.id);
        allowedUpdates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task) {
            return res.status(404).send({ 'error': 'No Task found to Update !' });
        }

        res.status(200).send(task);
    }
    catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id', async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id);
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