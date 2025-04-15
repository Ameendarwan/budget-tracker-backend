import mongoose, { Document, Schema } from "mongoose";

import bcrypt from "bcryptjs";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  fatherName: string;
  aboutMe: string;
  jobTitle?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  completeAddress?: string;
  phoneNumber: string;
  email: string;
  dob?: Date;
  education?: string;
  gender?: string;
  budgetLimit: number;
  profilePic?: string;
  role: "admin" | "user";
  password: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  comparePassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fatherName: { type: String },
    aboutMe: { type: String },
    jobTitle: { type: String },
    streetAddress: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    completeAddress: { type: String },
    phoneNumber: { type: String },
    dob: { type: Date },
    education: { type: String },
    gender: { type: String },
    profilePic: { type: String },
    email: { type: String, required: true, unique: true },
    budgetLimit: { type: Number, required: true },
    role: { type: String, enum: ["admin", "user"], required: true },

    password: { type: String, required: true, select: false },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
