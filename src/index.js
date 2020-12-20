const express = require('express');
require('./db/mongoose');

const User = require('./model/user');
const Task = require('./model/task');
const { ObjectID } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/users', async (req, res) => {
    const users = await User.find({});
    try {
        res.status(200).send(users);
    }
    catch (e) {
        res.status(500).send(e);
    }
});

app.get('/users/:id', async (req, res) => {
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

app.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save()
        res.status(201).send(user);
    }
    catch (e) {
        res.status(400).send(e);
    }
})

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).send(tasks);
    }
    catch (e) {
        res.status(500).send(e);
    }
});

app.get('/tasks/:id', async (req, res) => {
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

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    }
    catch (e) {
        res.status(400).send(e);
    }

})
app.listen(port, () => {
    console.log('Server started at PORT ' + port);
})