import { useContext } from "react";
import { UserCardContext } from "../contexts/user.card.context";

export default function useUserCardContext () {

    const context = useContext(UserCardContext);

    if (!context) {
        throw Error("useUserCardContext must be within UserCardContextProvider");
    }

    return context;
}