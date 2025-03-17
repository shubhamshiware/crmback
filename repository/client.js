const clientSchema = require("../model/clients");
const { ObjectId } = require("mongodb");

const saveData = (data) => {
  const user = new clientSchema(data);
  return user.save();
};

const getData = (data) => {
  return clientSchema.find();
};

const getDataByUserName = (username) => {
  return clientSchema.findOne({ username: username });
};

const deleteData = (id) => {
  return clientSchema.deleteOne({ _id: id });
};

// const editData = async (Data) => {
//   const { id, ...updateFields } = Data;

//   // Convert the string `id` to an ObjectId using `new`
//   const objectId = new ObjectId(id);

//   // Use Mongoose's `clientSchema` to update the record
//   return await clientSchema.updateOne(
//     { _id: objectId }, // Match the document by ObjectId
//     { $set: updateFields } // Update the specified fields
//   );
// };

// Update a document by ID
const editData = async (Data) => {
  try {
    const { id, ...updateFields } = Data;

    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }

    const objectId = new ObjectId(id);

    // Ensure there are fields to update
    if (Object.keys(updateFields).length === 0) {
      throw new Error("No fields to update");
    }

    const result = await clientSchema.updateOne(
      { _id: objectId },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      throw new Error("No document found with the provided ID");
    }

    return { success: true, message: "Document updated successfully", result };
  } catch (error) {
    throw new Error(`Error updating data: ${error.message}`);
  }
};

// Fetch a document by ID
const getDataById = async (id) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }

    const objectId = new ObjectId(id);
    const data = await clientSchema.findOne({ _id: objectId });

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
