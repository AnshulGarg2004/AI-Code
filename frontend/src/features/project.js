import api from "../utils/axios"
export const createProject = async ({name,  desc}) => {
    try {
        const {data} = await api.post('/api/project', {name,  desc});
        return data;
    } catch (error) {
        return null;
    }
}

export const getProjects = async() => {
    try {
        const {data} = await api.get('/api/project');
        return data;
    } catch (error) {
        return null;
    }
}

export const getProjectById = async(id) => {
    try {
        const {data} = await api.get(`/api/project/${id}`);
        return data;
    } catch (error) {
        return null;
    }
}

export const getStarred = async () => {
    try {
        const {data} = await api.get('/api/project/starred');
        return data;
    } catch (error) {
        return null;
    }
}
export const toggleStar = async(id) => {
    try {
        const {data} = await api.patch(`/api/project/${id}`);
        return data;
    } catch (error) {
        return null;
    }
}

export const deleteProject = async(id) => {
    try {
        const {data} = await api.delete(`/api/project/${id}`);
        return data;
    } catch (error) {
        return null;
    }
} 