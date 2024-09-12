import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    await mongoose.connect('mongodburl');
    console.log("DB Connected Successfully");
  } catch (error) {
    console.error("DB Connection Error: ", error.message);
  }
};

export default ConnectDB;
