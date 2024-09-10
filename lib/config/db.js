import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://zahid:zahid@cluster0.xrfjw.mongodb.net/todo-app');
    console.log("DB Connected Successfully");
  } catch (error) {
    console.error("DB Connection Error: ", error.message);
  }
};

export default ConnectDB;
