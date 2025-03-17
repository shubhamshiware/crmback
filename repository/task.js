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

// const editData = async (req, res) => {
//   try {
//     console.log("Request Body:", req.body);

//     // Check if req.body is undefined
//     if (!req.body) {
//       console.error("Request body is undefined. Ensure middleware is added.");
//       return res.status(400).json({ message: "Request body is missing" });
//     }

//     const { id, field, value } = req.body;

//     // Validate required fields
//     if (!id || !field || value === undefined) {
//       console.error("Missing required fields in request body.");
//       return res.status(400).json({ message: "Invalid request data" });
//     }

//     const update = { [field]: value };
//     console.log("Generated Update Query:", update);

//     const documentExists = await SalesModel.findById(id);
//     if (!documentExists) {
//       console.error(`Document with ID ${id} not found.`);
//       return res.status(404).json({ message: "Document not found" });
//     }

//     const result = await SalesModel.findByIdAndUpdate(id, update, {
//       new: true,
//     });
//     console.log("Update Result:", result);

//     res.json({
//       acknowledged: true,
//       message: "Data updated successfully",
//       result,
//     });
//   } catch (error) {
//     console.error("Error in editData function:", error);
//     res.status(500).json({ message: "Internal server error", error });
//   }
// };
