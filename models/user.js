const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema(
    {
        state: {
            type: String,
            required: true,
            enum: ["pending", "active", "removed"],
            default: "pending",
            lowercase: true
        },

        name: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },

        created: { type: Date, default: Date.now }
    },
    {
        collection: "users"
    }
);

module.exports = schema;
