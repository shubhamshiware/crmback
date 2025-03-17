const salseSchema = require("../model/salse");
const { ObjectId } = require("mongodb");
let db = [];

const saveData = (data) => {
  const user = new salseSchema(data);
  return user.save();
};

const getData = (data) => {
  return salseSchema.find();
};

const getDataByUserName = (username) => {
  return salseSchema.findOne({ username: username });
};

const deleteData = (id) => {
  return salseSchema.deleteOne({ _id: id });
};
const editData = async ({ id, field, value }) => {
  try {
    // Validate inputs
    if (!id || !field || value === undefined) {
      throw new Error("Invalid input. ID, field, and value are required.");
    }

    // Ensure the field exists in the schema
    const allowedFields = [
      "totalClients",
      "salesToday",
      "monthlySales",
      "yearlySales",
    ];
    if (!allowedFields.includes(field)) {
      throw new Error(
        `Invalid field '${field}'. Allowed fields: ${allowedFields.join(", ")}.`
      );
    }

    // Construct the update object
    const update = {
      [field]: value,
      updatedAt: new Date(),
    };

    // Find the document by ID and update the specified field
    const result = await salseSchema.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!result) {
      throw new Error("No data found for the given ID.");
    }

    // Return the updated result
    return result;
  } catch (error) {
    console.error("Error updating sales data:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

module.exports = {
  saveData,
  getData,
  deleteData,
  editData,
  getDataByUserName,
};
