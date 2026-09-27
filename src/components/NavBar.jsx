import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LogOut, Moon, Settings, Sun, User } from "lucide-react";
import { useAuthContext } from "../AuthContext";
import { logout } from "../services/firestore";
import useProfileInfo from "../hooks/useProfileInfo";
import useTheme from "../hooks/useTheme";
import Logo from "./Logo";

export default function NavBar({ isVisible, setIsVisible }) {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);
    useEffect(() => {
        function handlePointerDown(event) {
            if (!profileMenuRef.current?.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        }
        function handleKeyDown(event) {
            if (event.key === "Escape") {
                setIsProfileMenuOpen(false);
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const { user, loading } = useAuthContext();
    const { profileInfo, error: profileError, loadingProfile } = useProfileInfo();
    const { mode, switchMode } = useTheme();
    const activeStyles = "nav-link border border-primary!";

    useEffect(() => {
        function handleResize() {
            setIsVisible(window.innerWidth > 767);
        }

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [setIsVisible]);

    const displayName = profileInfo?.name || user?.displayName || "Your account";
    const initials = user?.displayName?.trim()?.charAt(0)?.toUpperCase();
    const avatarUrl = !profileError ? profileInfo?.pfp : null;

    return (
        <aside
            className={`flex flex-col bg-background border-r border-border-color h-screen w-62.5 pt-section px-4 z-10 max-md:fixed max-sm:w-52 ${!isVisible ? "hidden" : ""}`}
        >
            <Logo />
            <nav className="w-full flex flex-col gap-2 mt-6">
                <NavLink end to="/user" className={({ isActive }) => isActive ? activeStyles : "nav-link"}>
                    Dashboard
                </NavLink>
                <NavLink to="goals" className={({ isActive }) => isActive ? activeStyles : "nav-link"}>
                    Goals
                </NavLink>
                <NavLink to="study-sessions" className={({ isActive }) => isActive ? activeStyles : "nav-link"}>
                    Study Sessions
                </NavLink>
            </nav>
            <div ref={profileMenuRef} className="fixed bottom-6 left-4 flex items-end gap-2">
                <button
                    type="button"
                    onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
                    className="rounded-[50%] w-10 h-10 flex items-center justify-center bg-accent cursor-pointer overflow-hidden"
                    aria-label={`${isProfileMenuOpen ? "Close" : "Open"} profile menu`}
                    aria-haspopup="menu"
                    aria-expanded={isProfileMenuOpen}
                >
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={`${displayName}'s profile`} className="w-full h-full object-cover" />
                    ) : (
                        <span aria-hidden="true" className="text-background">
                            {initials || <User size={20} />}
                        </span>
                    )}
                </button>
                {isProfileMenuOpen && (
                    <div className="flex flex-col gap-2 bg-card-background p-3 rounded shadow" role="menu">
                        <p className="detail flex items-center gap-1 px-2 py-1">
                            <User width={17} className="text-accent!" />
                            {loading || loadingProfile ? "Loading profile..." : profileError ? "Profile unavailable" : displayName}
                        </p>
                        <button
                            type="button"
                            className="text-accent! hover:bg-background px-2 py-1 rounded font-bold font-figtree cursor-pointer flex items-center gap-1"
                            onClick={logout}
                            role="menuitem"
                        >
                            <LogOut width={17} className="text-accent!" />
                            <span className="detail">Log Out</span>
                        </button>
                        <button
                            type="button"
                            className="detail hover:bg-background px-2 py-1 rounded flex gap-1 items-center cursor-pointer"
                            onClick={switchMode}
                            role="menuitem"
                        >
                            {mode === "dark mode" ? (
                                <Sun width={17} className="text-accent!" />
                            ) : (
                                <Moon width={17} className="text-accent!" />
                            )}
                            Switch mode
                        </button>
                        <Link
                            to="/user/settings"
                            className="cursor-pointer flex items-center gap-1 hover:bg-background px-2 py-1 rounded"
                            role="menuitem"
                            onClick={() => setIsProfileMenuOpen(false)}
                        >
                            <Settings width={17} className="text-accent!" />
                            <span className="detail">Settings</span>
                        </Link>
                    </div>
                )}
            </div>
        </aside>
    );
}