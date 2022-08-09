
const mongoose = require('mongoose');


const SubmissionsSchema = mongoose.Schema({
    
    name: {
        type: String
    },
    
    fileType: {
        type: String
    },

    files: [{
        name: String,
        originalname: String,
        ext: String
    }]

})


const Submissions = mongoose.model('Submissions', SubmissionsSchema);

module.exports = Submissions;