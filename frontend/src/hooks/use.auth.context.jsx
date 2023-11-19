import { AuthContext } from "../contexts/auth.context"; 
import { useContext } from "react";

export const useAuthContext = () => {

    const context = useContext(AuthContext);

    if (!context) {
        throw Error("useAuthContext must be within AuthContextProvider");
    }

    return context;
}