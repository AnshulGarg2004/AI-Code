import React, { useMemo } from "react";

const findHtmlFile = (nodes = []) => {
    for (const node of nodes) {
        if (node.type === "file" && node.name?.toLowerCase() === "index.html") {
            return node;
        }

        const nestedFile = findHtmlFile(node.children);
        if (nestedFile) {
            return nestedFile;
        }
    }

    return null;
};

const Preview = ({ activeTab, tree }) => {
    const previewFile = activeTab?.name?.toLowerCase().endsWith(".html")
        ? activeTab
        : findHtmlFile(tree);

    const content = useMemo(() => previewFile?.content || "", [previewFile]);

    if (!previewFile) {
        return (
            <div className="flex min-h-0 flex-1 items-center justify-center bg-white text-sm text-zinc-500">
                Open an HTML file or create an index.html file to preview it.
            </div>
        );
    }

    return (
        <iframe
            title={`Preview of ${previewFile.name}`}
            srcDoc={content}
            className="h-full w-full border-0 bg-white"
            sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-scripts"
        />
    );
};

export default Preview;
