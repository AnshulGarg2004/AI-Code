import { tool } from "@langchain/core/tools"
import { createFile, createFolder, deleteFile, getFile, getTree, updateFile } from "../utils/fetchFileAPI.js";
import z, { file } from "zod";

const compactTree = (items = []) => {
    return items.map((item) => ({
        _id: item._id,
        parentId: item.parentId,
        name: item.name,
        type: item.type,
        language: item.language,
        extension: item.extension,

        children: compactTree(
            item.children || []
        ),
    }))
}

export const fileTools = ({ projectId, userId }) => {

    const getTreeTool = tool(
        async ({ projectId, userId }) => {
            console.log("ai tool get tre");

            const res = await getTree({ projectId, userId })
            const tree = compactTree(res);

            return JSON.stringify({ success: true, tree })
        },
        {
            name: "get_tree",

            description: `
Get the complete project file and folder tree.

IMPORTANT:

1. Use this when the project structure is unknown.
2. Do not repeatedly call get_tree.
3. type="folder" means folder.
4. type="file" means file.
5. Folder IDs are used as parentId.
6. NEVER call get_file with a folder ID.
7. Do not use terminal commands to inspect the project.
8. Use the exact IDs returned by this tool.

The tree contains:
_id
parentId
name
type
language
extension
children
        `,

            schema: z.object({})
        },


    )

    const getFileTool = tool(
        async ({ fileId }) => {
            console.log("ai tool get file");

            const file = await getFile({ userId, id: fileId })

            if (!file) {
                console.log("File not found");
                return JSON.stringify({ success: false, error: "File not found" })

            }

            if (file && file.type != "file") {
                console.log("blocked it is folder");

                return JSON.stringify({ success: false, error: "Id is folder", instructions: "Do not call get_file for folder. Use folder ID as parentId" })
            }

            return JSON.stringify({
                success: true, file: {
                    _id: file._id,
                    name: file.name,
                    type: file.type,
                    content: file.content || "",
                    language: file.language,
                    ext: file.extension,
                    parentId: file.parentId
                }
            })
        },
        {
            name: "get_file",

            description: `
Read an Exitsting file before modifying it.

SRICT RULES:

1. feilds must belong to a file.
2. Never pass a folder.
3. use exact file Id from get_tree.
4. Call this before update_file.
5. Folder IDs are used as parentId.
6. NEVER call get_file with a folder ID.
7. Do not call this for newly created files unless necessary.
8. Do not call this repeatedly for the same file.

The response contains the complete file content

        `,

            schema: z.object({
                fileId: z.string()
            })
        },


    )
    const createFolderTool = tool(
        async ({ name, parentId }) => {
            console.log("ai tool create folder");

            const folder = await createFolder({ projectId, userId, name, parentId })


            return JSON.stringify({
                success: true, operation: "folder_created", folder: {
                    _id: folder._id,
                    name: folder.name,
                    type: folder.type,
                    parentId: folder.parentId
                }
            })
        },
        {
            name: "create_folder",

            description: `
Create a new folder.

RULES:

1. Create parent folders first.
2. Use exact parentId from get_tree.
3. Never create duplicate folders.
4. A folder directly inside another folder must use that folder's ID as parentId.
5. After creation continue with the remaining files.
6. Do not call get_tree again just to verify the folder.
The response contains the complete file content

        `,

            schema: z.object({
                name: z.string(),
                parentId: z.string().nullable()
            })
        },


    )
    const createFileTool = tool(
        async ({ name, parentId }) => {
            console.log("ai tool create filde");

            const file = await createFile({ projectId, userId, name, parentId, content, language : language ||  "plaintext" })


            return JSON.stringify({
                success: true, operation: "file_created", file: {
                    _id: file._id,
                    name: file.name,
                    type: file.type,
                    parentId: file.parentId,
                    language : file.language,
                    content : file.content
                }
            })
        },
        {
            name: "create_file",

            description: `
Create a NEW FILE.

RULES:

1. Use get_tree first when project structure is unknown.
2. Use exact folder ID as parentId.
3. Never create duplicate files.
4. Send complete file content.
5. Create folders before files inside them.
6. Never use terminal commands to create files.
7. Do not call get_file immediately after creating a file.
8. Continue creating all required files.
9. Do not stop after creating only one file.

For a React/Vite project, create ALL required files.

        `,

            schema: z.object({
                name: z.string(),
                parentId: z.string().nullable(),
                language : z.string().optional(),
                content : z.string()
            })
        },


    )
    const updateFileTool = tool(
        async ({ name, content, fileId  }) => {
            console.log("ai tool update filde");

            const file = await updateFile({  userId, name,  content,id:  fileId})


            return JSON.stringify({
                success: true, operation: "file_updated", file: {
                    _id: file._id,
                    name: file.name,
                    content : file.content
                }
            })
        },
        {
            name: "update_file",

            description: `
Update an EXISTING FILE.

RULES:

1. Call get_file before updating.
2. fileId must be an actual file ID.
3. NEVER use a folder ID.
4. Send the complete updated file content.
5. Do not update files that do not exist.
6. After successful update continue with remaining work.
7. Do not call get_file again unless another modification is needed.

        `,

            schema: z.object({
                name: z.string(),
                fileId : z.string(),
                content : z.string()
            })
        },


    )
    const deleteFileTool = tool(
        async ({ userId }) => {
            console.log("ai tool delele filde");

            const file = await deleteFile({  userId})


            return JSON.stringify({
                success: true, operation: "file_updated", file: {
                    _id: file._id,
                    
                }
            })
        },
        {
            name: "delete_file",

            description: `
Delete an EXISTING FILE from the project.

STRICT RULES:

1. fileId must belong to an actual file.
2. NEVER pass a folder ID.
3. Use the exact file ID from get_tree.
4. Before deleting, make sure the target is actually a file.
5. Do not delete a file unless the user’s request requires it.
6. Never use terminal commands to delete files.
7. After successful deletion, continue with the remaining work.
8. Do not call get_file after deletion.

        `,

            schema: z.object({})
        },


    )

    return [getFileTool, getTreeTool, updateFileTool, deleteFileTool, createFileTool, createFolderTool ]
}
