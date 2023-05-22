import axios from "axios";

export const api = axios.create({
  // check current IP
  baseURL: "http://192.168.0.103:3333",
});
