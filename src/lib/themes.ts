export const THEMES = {
    default: {
        name: "Simple Dark",
        bg: "bg-gradient-to-br from-gray-900 to-black",
        text: "text-white",
        card: "bg-white/10 text-white hover:bg-white/20 border-white/5",
        button: "bg-white text-black hover:bg-gray-200"
    },
    light: {
        name: "Clean Light",
        bg: "bg-gray-50",
        text: "text-gray-900",
        card: "bg-white border border-gray-200 text-gray-900 shadow-sm hover:shadow-md",
        button: "bg-black text-white hover:bg-gray-800"
    },
    gradient: {
        name: "Gradient Purple",
        bg: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500",
        text: "text-white",
        card: "bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30",
        button: "bg-white text-purple-600 hover:bg-gray-100"
    },
    neon: {
        name: "Neon Cyber",
        bg: "bg-black",
        text: "text-green-400 font-mono",
        card: "bg-black border border-green-500/50 text-green-400 hover:bg-green-500/10 hover:border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]",
        button: "bg-green-500 text-black hover:bg-green-400 font-bold shadow-[0_0_15px_rgba(34,197,94,0.5)]"
    },
    corporate: {
        name: "Corporate Blue",
        bg: "bg-slate-900",
        text: "text-white",
        card: "bg-slate-800 border-l-4 border-blue-500 text-white hover:bg-slate-700 shadow-lg",
        button: "bg-blue-600 text-white hover:bg-blue-500 font-semibold uppercase tracking-wide"
    },
    creative: {
        name: "Creative Pop",
        bg: "bg-yellow-400",
        text: "text-black",
        card: "bg-white border-2 border-black text-black hover:translate-x-1 hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        button: "bg-black text-white hover:bg-gray-800 border-2 border-transparent hover:border-white"
    }
}

export type ThemeKey = keyof typeof THEMES
