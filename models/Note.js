const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        unique: true,
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    completed: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
);

noteSchema.plugin(AutoIncrement, { inc_field: 'ticket', id: 'ticketNums', start_seq: 500 });

module.exports = mongoose.model('Note', noteSchema);