import express from "express"
import { createFile, createFolder, createRootFolder, deleteFile, getFile, getTree, updateFile } from "../controller/file.controller.js";
 
const router = express.Router();


router.post('/create-root-folder', createRootFolder);
router.post('/create-folder', createFolder);
router.post('/create-file', createFile);
router.post('/update/:id',updateFile);

router.delete('/delete-file', deleteFile);

router.get('/:id', getFile);
router.get('/tree/:projectId', getTree);


export default router