import axios from "axios";
import {HOST} from "../Utils/constants";

export const apiClient = axios.create({
    baseURL: HOST,
    
});