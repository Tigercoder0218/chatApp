import { useContext } from "react";
import { Context } from "../Context/Context";

export const useContextData = () => {
    return useContext(Context);
}