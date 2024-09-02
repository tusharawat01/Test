import { Schema, model } from "mongoose";

const userDroneDetailSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    drones: [{
        droneModel: {
            type: String,
            required: true
        },

        purchasedOn: {
            type: Number,
            required: true
        },
   
        serial: {
            type: String,
            required: true
        },

        uin: {
            type: String,
            default :"N/A"
        },

        droneType: {
            type: String,
            required: true
        },

        batteries: {
            type: Number,
            required: true
        }

    }],
    payloads: [{
        type: String,
        required: true
    }],
    addons: [{
        type: String,
        required: true
    }]
});


const DroneDetail = model("DroneDetail", userDroneDetailSchema);

export default DroneDetail;
