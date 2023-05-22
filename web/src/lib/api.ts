import axios from "axios";

const baseURL = "http://192.168.0.103:3333";

export const api = axios.create({
  baseURL,
});

export function fetchData(path: string, init: RequestInit) {
  return fetch(`${baseURL}${path}`, init);
}
