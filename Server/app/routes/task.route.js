const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middlewares/authMiddleware');

const {
    getAllTasks,
    getAllTaskByNames,
    editTask,
    createNewTask,
    deleteTask
} = require("../controllers/task.controller");

router.get("/getAllTasks", authenticateJWT, getAllTasks);
router.get("/getAllTaskByNames", authenticateJWT, getAllTaskByNames);

router.put("/editTask", authenticateJWT, editTask);
router.post("/createNewTask", authenticateJWT, createNewTask);
router.delete("/deleteTask", authenticateJWT, deleteTask);

module.exports = router;