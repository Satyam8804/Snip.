import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase:true,
      trim:true
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken:{
        type:String,
        default:null,
    }
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", UserSchema);
