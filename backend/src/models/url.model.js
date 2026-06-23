import mongoose, { Schema } from "mongoose";
import { timeStamp } from "node:console";
import { type } from "node:os";

const UrlSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    longUrl: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    clicks: {
      type: Number,
      required: true,
      default: 0,
    },
    clickLogs: [
      {
        timeStamp: {
          type: Date,
          default: Date.now,
        },
        ip: { type: String },
      },
    ],
    expiresAt:{
        type:Date,
        default:null,
    },
  },
  { timestamps: true }
);

UrlSchema.index({expiresAt:1},{expireAfterSeconds:0,sparse:true});

export const Url = mongoose.model("Url", UrlSchema);
