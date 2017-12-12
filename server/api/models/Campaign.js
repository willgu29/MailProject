import mongoose from 'mongoose'

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var CampaignSchema = new Schema({
    name:           {type: String, default: Date.now.toString()},
    sender:         {type: String, required: true},
    emails:         [{type: ObjectId, ref: 'Mail'}],
    sent:           {type: Number, default: 0},
    opened:         {type: Number, default: 0},
    clicked:        {type: Number, default: 0},
    bounced:        {type: Number, default: 0}

}, { timestamps: { createdAt: 'createdAt' }});

var Campaign = mongoose.model('Campaign', CampaignSchema)

export default Campaign
