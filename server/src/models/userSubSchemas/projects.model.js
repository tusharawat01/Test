import { Schema, model } from "mongoose";

const projectSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    projects: [{
        clientName: {
            type: String,
            required: true
        },
        projectDesc: {
            type: String,
            required: true
        },
        startMon: {
            type: String,
            required: true
        },
        endMon: {
            type: String,
            required: true
        },

        image: {
            type: String,
            // required:true
        },
        fileId:{
            type:String,
            // required:true
            
        }
    }],
 
    monitoring: [{
        type: String,
        required: true
    }],
    inspection: [{
        type: String,
        required: true
    }],
    mapping: [
        {
            type: String,
            required: true
        }
    ],

});

const ProjectDetail = model("ProjectDetail", projectSchema)

export default ProjectDetail;