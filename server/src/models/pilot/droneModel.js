

import mongoose from "mongoose"		
const droneSchema = new mongoose.Schema({
	name:{
		type: String,
		required: true,
		max:40,
	},
	droneId:{
		type:String,
		default:'',
		required:true,
	},
	status:{
		type:String,
		default:'Available'
	},
	image:{
		type:String,
		default:'',
	},
	ownerName:{
		type:String,
		default:''
	},
	userId:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User",
		required:true
	},
	// pilotDrone:{
	// 	type:Boolean,
	// 	default:false
	// }
	},
	{
		timestamps:true,
	}
)


export const Drone = mongoose.model("Drone",droneSchema)




