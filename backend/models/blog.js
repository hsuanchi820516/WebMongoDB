import mongoose from 'mongoose';


const Schema = mongoose.Schema;

const blogSchema = new Schema({
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    Answers: {
        type : Array , "default" : [],
        required: true
    }

}, {timestamps: true});


const Blog = mongoose.model('Blog', blogSchema);

export { Blog };