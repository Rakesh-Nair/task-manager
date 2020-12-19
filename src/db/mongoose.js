const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
});

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});
// const me = new User({
//     name: 'Rakesh     ',
//     age: 30,
//     password: 'tres',
//     email: 'rakesh@test.com   '
// });

// const task = new Task({
//     description: 'Learn React Library  ',
// });



// me.save().then((data) => {
//     console.log(data);
// }).catch((error) => {
//     console.log(error);
// });

// task.save().then((data) => {
//     console.log(data);
// }).catch((error) => {
//     console.log(error);
// });