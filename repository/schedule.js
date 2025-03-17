const scheduleSchema = require("../model/meeting");

let db = [];

const saveData = (data) => {
  const user = new scheduleSchema(data);
  return user.save();
};

const getData = (data) => {
  return scheduleSchema.find();
};

const getDataByUserName = (username) => {
  return scheduleSchema.findOne({ username: username });
};

const deleteData = (id) => {
  return scheduleSchema.deleteOne({ _id: id });
};

const editData = (data) => {
  return scheduleSchema.updateOne(
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
