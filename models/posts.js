const mongoose = require('mongoose'),
      findOrCreate = require('mongoose-find-or-create');
let postsSchema = new mongoose.Schema({
    // postDate : String,
    postId : { type: String },
    postTitle: {
         type: String,
         required: true,
         unique: true
     },
     postImage:{ type: String },
    link : { type: Array }
   
});

postsSchema.plugin(findOrCreate, { appendToArray: true, saveOptions: { validateBeforeSave: false } });

postsSchema.methods.saved = function(){
    return this.isSaved;
};
let Posts = mongoose.model('Posts', postsSchema);

module.exports = Posts;
