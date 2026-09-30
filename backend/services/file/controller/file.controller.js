import File from "../models/file.model.js";
import { buildTree } from "../utils/buildTree.js";

export const createRootFolder = async (req ,res) => {
    try {
        const {projectId, projectName} = req.body;

        const userId = req.headers['x-user-id']

        if(!projectId || !projectName) {
            return res.status(404).json({message : "Project Id and Name required"});
        }
        
        if(!userId) {
            return res.status(404).json({message : "Unauthorised Access"});
        }
        
        const existingRootFolder = await File.findOne({
            projectId,
            parentId : null,
            isDeleted : false
        })
        
        if(existingRootFolder) {
            return res.status(404).json({message : "Root Folder already exisits"});
             
        }

        const rootFolder = await File.create({
            owner : userId,
            name : projectName,
            projectId,
            type : "folder",
            parentId : null
        });

        return res.status(200).json({message : "Root folder created", rootFolder})
    } catch (error) {
        console.log("error in create root folder controller : ", error);
        
        return res.status(500).json({message : "error in create root folder controller"})
        
    }
}

export const createFolder = async (req ,res) => {
    try {
        const {projectId, name, parentId} = req.body;

        const userId = req.headers['x-user-id']

        if(!projectId || !name || !parentId) {
            return res.status(404).json({message : "Project Id and Name and Parent Id required"});
        }
        
        if(!userId) {
            return res.status(404).json({message : "Unauthorised Access"});
        }
        
        const exist = await File.findOne({
            projectId,
            parentId ,
            name,
            isDeleted : false
        })
        
        if(exist) {
            return res.status(404).json({message : "Folder already exisits"});
             
        }

        const Folder = await File.create({
            owner : userId,
            name ,
            projectId,
            type : "folder",
            parentId 
        });

        return res.status(200).json({message : "Folder created", Folder})
    } catch (error) {
        console.log("error in create folder controller : ", error);
        
        return res.status(500).json({message : "error in create  folder controller"})
        
    }
}
export const createFile = async (req ,res) => {
    try {
        const {projectId, name, parentId, content = "", language = "plaintext"} = req.body;

        const userId = req.headers['x-user-id']

        if(!projectId || !name || !parentId) {
            return res.status(404).json({message : "Project Id and Name and Parent Id required"});
        }
        
        if(!userId) {
            return res.status(404).json({message : "Unauthorised Access"});
        }
        
        const exist = await File.findOne({
            projectId,
            parentId ,
            name,
            isDeleted : false
        })
        
        if(exist) {
            return res.status(404).json({message : "File already exisits"});
             
        }

        const ext = name.includes(".")?name.split('.').pop() : "";

        const file = await File.create({
            owner : userId,
            name ,
            projectId,
            ext, 
            size : content.length ,
            type : "file",
            parentId : parentId || null
        });

        return res.status(200).json({message : "File created", file})
    } catch (error) {
        console.log("error in create File controller : ", error);
        
        return res.status(500).json({message : "error in create  File controller"})
        
    }
}
export const updateFile = async (req ,res) => {
    try {
        const {name, content} = req.body;
    

        const userId = req.headers['x-user-id']

        if(!projectId || !name || !parentId) {
            return res.status(404).json({message : "Project Id and Name and Parent Id required"});
        }
        
        if(!userId) {
            return res.status(404).json({message : "Unauthorised Access"});
        }
        
        const file = await File.findOne({
            id : _id,
            owner : userId ,
            isDeleted : false
        })
        
        if(!file) {
            return res.status(404).json({message : "File does not exisit"});
             
        }

        if(name) {
            file.name=  name;
            const ext = name.includes(".")?name.split('.').pop() : "";
        }

        if(content !== undefined) {
            file.content = content;
            file.size = content.length
        }



        await file.save();

    

        return res.status(200).json({message : "File created", file})
    } catch (error) {
        console.log("error in update File controller : ", error);
        
        return res.status(500).json({message : "error in update  File controller"})
        
    }
}
export const deleteFile = async (req ,res) => {
    try {

        const userId = req.headers['x-user-id']

        if(!projectId || !name || !parentId) {
            return res.status(404).json({message : "Project Id and Name and Parent Id required"});
        }
        
        if(!userId) {
            return res.status(404).json({message : "Unauthorised Access"});
        }
        
        const file = await File.findByIdAndUpdate(req.params._id, {
            isDeleted : true
        })
        
        
    

        return res.status(200).json({message : "File created", file})
    } catch (error) {
        console.log("error in delete File controller : ", error);
        
        return res.status(500).json({message : "error in delete  File controller"})
        
    }
}

export const getFile = async (req, res) => {
    
    try {

        const userId = req.headers['x-user-id']
        const { id } = req.params


        
        const file = await File.findOne({
            _id : id,
            owner : userId,
            
            isDeleted : false
        })

        if(!file) {
            return res.status(400).json({message : "File does not exist"});
        }

        
        
    

        return res.status(200).json({message : "File fetched", file})
    } catch (error) {
        console.log("error in get File controller : ", error);
        
        return res.status(500).json({message : "error in get  File controller"})
        
    }
}

export const getTree = async (req, res) => {
    
    try {

        const userId = req.headers['x-user-id']
        const {projectId} = req.params

        
        const files = await File.find({
            projectId,
            owner : userId,
            
            isDeleted : false
        }).sort({
            name : 1, type : -1
        })

        const tree = await buildTree(files);


        return res.status(200).json({message : "Tree fetched", tree})
    } catch (error) {
        console.log("error in building tree  controller : ", error);
        
        return res.status(500).json({message : "error in building tree  controller "})
        
    }
}

