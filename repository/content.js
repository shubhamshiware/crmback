const contentSchema = require("../model/content");

let db = [];

const saveData = (data) => {
  const task = new contentSchema({ ...data, completed: false });
  return task.save();
};

const getData = (data) => {
  return contentSchema.find();
};

const getDataByUserName = (username) => {
  console.log(username, "username ");
  return contentSchema.findOne({ username: username });
};

const deleteData = (id) => {
  return contentSchema.deleteOne({ _id: id });
};

const editData = (data) => {
  return contentSchema.updateOne(
    { username: data.username },
    { $push: { images: data } }
  );
};

module.exports = {
  saveData,
  getData,
  deleteData,
  editData,
  getDataByUserName,
};
