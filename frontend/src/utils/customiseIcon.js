import { Braces, FileCode2, FileText, FileTextIcon, ImageIcon, KeyRound, Lock, Package, Palette, Settings2 } from "lucide-react";
import { IoLogoJavascript, IoLogoReact } from "react-icons/io5";
import { SiTypescript } from "react-icons/si";
import { FaCss } from "react-icons/fa6";
import { MdHtml } from "react-icons/md";
import { VscJson } from "react-icons/vsc";
import { FaPython } from "react-icons/fa6";
import { BiSolidFilePng } from "react-icons/bi";

export const getFileColor = (name = "") => {
    const lower = name.toLowerCase();
    const ext = lower.split('.').pop();

    const known = {
        "package.json" : {
            icon : Package,
            color : "text-emerald-400"
        },
        "package-lock.json" :  {
            icon : Lock,
            color : "text-zinc-500"
        },
        ".env" :  {
            icon : KeyRound,
            color : "text-lime-400"
        }
    }


    if(known[name]) {
        return known[name];
    }

    const map = {
        js: { icon: IoLogoJavascript, color: "text-yellow-400" },
        mjs: { icon: IoLogoJavascript, color: "text-yellow-400" },
        cjs: { icon: IoLogoJavascript, color: "text-yellow-400" },
        jsx: { icon: IoLogoReact, color: "text-sky-400" },
        ts: { icon: SiTypescript, color: "text-blue-400" },
        tsx: { icon: IoLogoReact, color: "text-blue-600" },
        json: { icon: VscJson, color: "text-amber-400" },
        css: { icon: FaCss, color: "text-violet-400" },
        html: { icon: MdHtml, color: "text-orange-400" },
        py : {icon : FaPython, color : "text-emerald-400"},
        yml: { icon: Settings2, color: "text-rose-400" },
        png: { icon: ImageIcon, color: "text-green-400" },
        jpg: { icon: ImageIcon, color: "text-green-400" },
        jpeg: { icon: ImageIcon, color: "text-green-400" },
       
        txt: { icon: FileTextIcon, color: "text-zinc-400" },
    };

    return map[ext] || { icon: FileTextIcon, color: "text-zinc-400" };
}

export const getFolderColor =  (name = "") => {
    const key = name.toLowerCase()

    const map = {
        src: "text-sky-400",
        public: "text-emerald-400",
        images: "text-pink-400",
        img: "text-pink-400",
        assets: "text-pink-400",
        css: "text-violet-400",
        styles: "text-violet-400",
        js: "text-yellow-400",
        scripts: "text-yellow-400",
        components: "text-sky-400",
        pages: "text-sky-400",
        utils: "text-amber-400",
        hooks: "text-teal-400",
        node_modules: "text-zinc-600",
        dist: "text-zinc-500",
        build: "text-zinc-500",
    };
    return map[key] || "text-sky-400"
}