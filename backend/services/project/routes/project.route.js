import express from "express"
import { createProject, deleteProject, getProjectById, getProjects, getStaredProject, toggleStar } from "../controller/project.controller.js";

const router = express.Router();

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.patch('/:id', toggleStar);
router.delete('/:id', deleteProject);
router.get('/starred', getStaredProject);


export default router