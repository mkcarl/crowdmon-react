import { createContext, useContext, useState } from "react";
import { useCookies } from "react-cookie";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const [user, setUser] = useState(cookies.user);

    const login = (user) => {
        setCookie("user", user, { path: "/" });
        setUser(user);
    };

    const logout = () => {
        setUser(null);
        removeCookie("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
