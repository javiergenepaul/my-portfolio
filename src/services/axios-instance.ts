import axios, { AxiosInstance } from "axios";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: "https://api.emailjs.com/api/v1.0/email/send",
  timeout: 300000,
});
