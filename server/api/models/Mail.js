import mongoose from 'mongoose'

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var MailSchema = new Schema({
    campaign:       {type: ObjectId, ref: 'Campaign'},
    sender:         {type: String, required: true},
    to:             {type: String, required: true},
    sent:           {type: Boolean, default: false},
    opened:         {type: Number, default: 0},
    unsubscribed:   {type: Boolean, default: false},
    clicked:        {type: Boolean, default: false},
    bounced:        {type: Boolean, default: false}

}, { timestamps: { createdAt: 'createdAt' }});

var Mail = mongoose.model('Mail', MailSchema)

export default Mail
