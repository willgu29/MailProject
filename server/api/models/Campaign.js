import mongoose from 'mongoose'

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var CampaignSchema = new Schema({
    name:           {type: String, default: Date.now},
    sender:         {type: String, required: true},
    subject:        {type: String, default: ''},
    to:             {type: [String], default: []},
    isConverted:    {type: Boolean, default: false},
    sent:           {type: Number, default: 0},
    opened:         {type: Number, default: 0},
    unsubscribed:   {type: [String], default: []},
    clicked:        {type: Number, default: 0},
    bounced:        {type: Number, default: 0},
    html:           {type: String, default: ''}

}, { timestamps: { createdAt: 'createdAt' }});

var Campaign = mongoose.model('Campaign', CampaignSchema)

export default Campaign
