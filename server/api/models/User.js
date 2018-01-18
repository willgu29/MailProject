import mongoose from 'mongoose'

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    email:         {type: String, required: true},
    name:          {type: String, default: ''},
    tokens:        {type: Schema.Types.Mixed, default: {} },
    pjLabels:     {type: [String], default: []}

}, { timestamps: { createdAt: 'createdAt' }});

var User = mongoose.model('User', UserSchema)

export default User
