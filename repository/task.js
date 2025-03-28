const taskSchema = require("../model/task");

let db = [];

const saveData = (data) => {
  const user = new taskSchema(data);
  return user.save();
};

const getData = (data) => {
  return taskSchema.find();
};

const getDataByUserName = (username) => {
  return taskSchema.findOne({ username: username });
};

const deleteData = (id) => {
  return taskSchema.deleteOne({ _id: id });
};

const editData = (data) => {
  return taskSchema.updateOne(
    { username: data.username },
    { $push: { images: data } }
  );
};

const getDataById = async (id) => {
  try {
    const objectId = new ObjectId(id); // Convert string ID to ObjectId
    return await clientSchema.findOne({ _id: objectId }); // Fetch data by ObjectId
  } catch (error) {
    throw new Error("Invalid ID format or data not found");
  }
};

module.exports = {
  saveData,
  getDataById,
  getData,
  deleteData,
  editData,
  getDataByUserName,
};



