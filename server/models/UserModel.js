import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+@.+\..+/, "Please fill a valid email address"], // Optional: regex for email validation
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    profileSetup: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
        required: false,
    },
});

// Hash the password before saving the user
userSchema.pre("save", async function(next) {
    if (this.isModified('password')) {
        const salt = await genSalt(10); // Salt rounds
        this.password = await hash(this.password, salt);
    }
    next();
});

const User = mongoose.model("Users", userSchema); // Ensure the model name is consistent
export default User;