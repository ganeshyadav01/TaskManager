const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth"); 
const {getTasks, createTask, getTask, updateTask, deleteTask} = require("../controllers/taskController");


router.get("/", authenticate, getTasks)
router.post("/", authenticate, createTask) 
router.get("/:id", authenticate, getTask)
router.patch("/:id", authenticate, updateTask)
router.delete("/:id", authenticate, deleteTask)

module.exports = router;