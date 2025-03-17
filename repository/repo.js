const userModel = require("../model/user");
const { ObjectId } = require("mongodb");

let db = [];

const saveData = (data) => {
  const user = new userModel(data);
  return user.save();
};

const getData = (data) => {
  return userModel.find();
};

const getDataByUserName = (username) => {
  return userModel.findOne({ username: username });
};

const deleteData = (id) => {
  return userModel.deleteOne({ _id: id });
};

const editData = async ({ id, role }) => {
  const result = await userModel.findByIdAndUpdate(id, { role }, { new: true });
  return result;
};

const getDataById = async (id) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }

    const objectId = new ObjectId(id);
    const data = await userModel.findOne({ _id: objectId });

    if (!data) {
      throw new Error("Data not found");
    }

    return data;
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

module.exports = {
  saveData,
  getData,
  deleteData,
  editData,
  getDataByUserName,
  getDataById,
};
