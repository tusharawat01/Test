import mongoose, { Schema } from "mongoose";
		
const pilotProject = new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
	title:{
		type: String,
		required: true,
	},
    location:{
        type: String,
		required: true,
    },
    tag:{
        type: String,
		required: true,
    },
    startDate:{
        type: Date,
		required: true,
    },
    type:{
        type: String,
		required: true,
    },
    rangeCovered:{
        type: Number,
		required: true,
    },
    endDate:{
        type: Date,
		required: true,
    },
    // status:{
    //     type:String,
    //     enum:['ongoing','completed'],
	// 	required: true,
    // },
   

},{timestamps:true})

export const PilotProject = mongoose.model('PilotProject',pilotProject);