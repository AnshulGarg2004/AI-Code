import { createSlice } from "@reduxjs/toolkit"
import {} from "react-redux"

const projectSlice = createSlice({
    name : "user", 
    initialState : {
        projects : [],
        starredProjects : [],

    },
    reducers : {
        setProjects : (state, action) => {
           state.projects = action.payload
        },

        setStarredProject : (state, action) => {
            state.starredProjects = action.payload
        },

        addNewProject : (state, action) => {
            state.projects.unshift(action.payload  )
        },
        starProject : (state, action) => {
            const project = state.projects.find(p => p._id == action.payload) ;
            if(project) {
                project.starred = !project.starred;
            }
        },
        setDeleteProject : (state, action) => {
            state.projects = state.projects.filter(p => p._id !== action.payload)
        }
    }
});

export const {setProjects, setStarredProject, starProject, addNewProject, setDeleteProject} = projectSlice.actions;
export default projectSlice.reducer;