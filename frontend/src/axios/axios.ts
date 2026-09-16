import axios from "axios";
import type { FormType } from "../App";

const apiClient = axios.create({
    baseURL : "http://localhost:3000/api/v1"
});

export const createReportHandler = (formData : FormType) => {
    return apiClient.post(`/POST/reports` , formData)
}