import axios from "axios";
import dotenv from "dotenv"

dotenv.config()
const File_URL = process.env.FILE_SERVICE_URL;

export const createFolder = async ({ projectId, parentId, name, userId }) => {
    try {
        const { data } = await axios.post(`${File_URL}/create-folder`, { projectId, parentId, name }, {
            headers: {
                "x-user-id": String(userId)
            }
        })
        return data;
    } catch (error) {
        console.log("error in create folder ai: ", error);
        throw new Error(error);

    }
}

export const createFile = async ({ projectId, parentId, name, userId, content = "", language = "" }) => {
    try {

        const { data } = await axios.post(`${File_URL}/create-file`, { projectId, parentId, name, content, language },
            {
                headers: {
                    "x-user-id": String(userId)
                }
            }
        )

        return data

    } catch (error) {
        console.log("error in create file ai: ", error);
        throw new Error(error);
    }
}

export const updateFile = async ({ name, content = "", userId, id }) => {
    try {

        const { data } = await axios.post(`${File_URL}/update-file/${id}`, { name, content },
            {
                headers: {
                    "x-user-id": String(userId)
                }
            }
        )

        return data

    } catch (error) {
        console.log("error in update file ai: ", error);
        throw new Error(error);
    }
}
export const deleteFile = async ({ userId }) => {
    try {

        const { data } = await axios.delete(`${File_URL}/delete-file`,
            {
                headers: {
                    "x-user-id": String(userId)
                }
            }
        )

        return data

    } catch (error) {
        console.log("error in delete file ai: ", error);
        throw new Error(error);
    }
}

export const getTree = async ({userId, projectId}) => {
    try {

        const { data } = await axios.get(`${File_URL}/tree/${projectId}`,
            {
                headers: {
                    "x-user-id": String(userId)
                }
            }
        )

        return data

    } catch (error) {
        console.log("error in get tree ai: ", error);
        throw new Error(error);
    }
}
export const getFile = async ({userId, id}) => {
    try {

        const { data } = await axios.get(`${File_URL}/${id}`,
            {
                headers: {
                    "x-user-id": String(userId)
                }
            }
        )

        return data

    } catch (error) {
        console.log("error in get file ai: ", error);
        throw new Error(error);
    }
}