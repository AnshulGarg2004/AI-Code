import { json } from "express";
import redis from "../../../shared/redis/redis.js";
import Project from "../models/project.model.js";

export const createProject = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];

        if(!userId) {
            return res.status(401).json({message : "User id required"});
        }

        const {name,desc} =  req.body;

        const project = await Project.create({
            owner : userId,
            name, desc
        });

        const key = `projects-${userId}`;

        await redis.del(key);

        return res.status(200).json({message : "Project created successfully", project});
    } catch (error) {
        console.log("Error in proj controller: ", error );
        
        return res.status(500).json({message : "Error in project controller"});
        
    }
}


export const getProjects = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];

        if(!userId) {
            return res.status(401).json({message : "User id required"});
        }

        const key = `projects-${userId}`;
        let result  =redis.get(key);
        
        if(result) {
            return res.status(200).json({message : "Projects fetched sucessfully"}, JSON.parse(result));
            
        }
        
        const projects = await Project.find({
            owner : userId
        }).sort({createdAt : -1});
        
        await redis.set(key, JSON.stringify(projects))
        
        
        return res.status(200).json({message : "Projects fetched sucessfully", projects});
    } catch (error) {
        console.log("error in fetching all projects: ", error);
        
        return res.status(500).json({message : "error in fetching all projects"});
    }
}


export const getProjectById = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        
        if(!userId) {
            return res.status(401).json({message : "User id required"});
        }
        const {id} = req.params;
        const project = await Project.findById(id);
        
        
        if(!project) {
            return res.status(404).json({message : "project not found"});
        }
        
        
        project.lastOpenedAt = new Date();
        
        await project.save();
        
        
        return res.status(200).json({message : "Project by id  fetched sucessfully", project});

        
    } catch (error) {
        console.log("error in fetching  project by id: ", error);
        
        return res.status(500).json({message : "error in fetching project by id"});
    }
}


export const getStaredProject = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        
        if(!userId) {
            return res.status(401).json({message : "User id required"});
        }
        
        const key = `starred-projects-${userId}`;
        let result = redis.get(key);
        if(result) {
            
            return res.status(200).json({message : "Starred Projects fetched sucessfully"}, JSON.parse(result));
        }
        const projects = await Project.find({
            owner : userId, 
            starred : true
        }).sort({createdAt : -1});
        await  redis.set(key, JSON.stringify(projects));
        return res.status(200).json({message : "Starred Projects fetched sucessfully", projects});
        
    } catch (error) {
        console.log("error in fetching all starred projects: ", error);
        
        return res.status(500).json({message : "error in fetching all starred projects"});
    }
}

export const toggleStar = async (req, res) => {
    try {
        
        const {id} = req.params;
        const project = await Project.findById(id);
        
        if(!project) {
            return res.status(404).json({message : "project not found"});
        }
        
        project.starred = !project.starred;
        
        const key = `starred-projects-${userId}`;
        await project.save();
        
        
        await redis.del(key);
        return res.status(200).json({message : "Project star toggled sucessfully", project});

        
    } catch (error) {
        console.log("error in Project star toggle ", error);
        
        return res.status(500).json({message : "error in Project star toggle"});
    }
}


export const deleteProject = async (req, res) => {
    try {
         
        const {id} = req.params;
        const project = await Project.findByIdAndDelete(id);
        
        if(!project) {
            return res.status(404).json({message : "project not found"});
        }
        
        const key = `projects-${userId}`;
        await redis.del(key);

        return res.status(200).json({message : "Project deleted sucessfully", project});


    } catch (error) {
         console.log("error in Project deletion ", error);
        
        return res.status(500).json({message : "error in Project deletion"});
    }
}