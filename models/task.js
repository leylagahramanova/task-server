import Joi from 'joi'
import mongoose from 'mongoose';

const subtaskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  subtasks: [subtaskSchema],
});

const Task = mongoose.model('Task', taskSchema);
const validateTask = (data) => {
    const schema = Joi.object({
        title: Joi.string().required().label('Title'),
        subtasks: Joi.array().items(Joi.object({
            task: Joi.string().required().label('Task'),
            completed: Joi.boolean().label('Completed'),
            _id: Joi.string().label('ID') // Allow the _id field for subtasks
        })).required().label('Tasks'),
    });
    return schema.validate(data);
};


export { Task, validateTask };
