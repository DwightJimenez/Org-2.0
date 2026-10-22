import React, { useEffect, useState } from "react";

const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
];

export default function ThemeSwitcher() {
    const [currentTheme, setCurrentTheme] = useState(
        localStorage.getItem("theme") || "dark",
    );

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", currentTheme);
        localStorage.setItem("theme", currentTheme);
    }, [currentTheme]);

    return (
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="btn m-1 btn-outline btn-primary"
            >
                Theme: {currentTheme}
                <svg
                    width="12px"
                    height="12px"
                    className="h-2 w-2 fill-current opacity-60 inline-block ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 2048 2048"
                >
                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                </svg>
            </div>
            <ul
                tabIndex={0}
                className="dropdown-content z-[100] p-2 shadow-2xl bg-base-300 rounded-box w-52 h-64 overflow-y-auto overflow-x-hidden flex flex-col gap-1"
            >
                {themes.map((theme) => (
                    <li key={theme}>
                        <button
                            className={`btn btn-sm btn-ghost w-full justify-start ${currentTheme === theme ? "bg-base-100" : ""}`}
                            onClick={() => setCurrentTheme(theme)}
                        >
                            <span className="capitalize">{theme}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
