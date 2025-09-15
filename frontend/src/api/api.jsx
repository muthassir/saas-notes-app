// import axios from 'axios';

// const API_URL = 'http://localhost:3001'; // Update if deployed on Vercel

// const api = axios.create({
//   baseURL: API_URL,
// });

// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export const login = (email, password) => api.post('/auth/login', { email, password });
// export const getNotes = () => api.get('/notes');
// export const createNote = (note) => api.post('/notes', note);
// export const updateNote = (id, note) => api.put(`/notes/${id}`, note);
// export const deleteNote = (id) => api.delete(`/notes/${id}`);
// export const upgradeTenant = (slug) => api.post(`/tenants/${slug}/upgrade`);

// export default api;







import axios from 'axios';

const API_URL = 'http://localhost:3001'; // change when deploying

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (email, password) => api.post('/auth/login', { email, password });
export const getNotes = () => api.get('/notes');
export const createNote = (note) => api.post('/notes', note);
export const updateNote = (id, note) => api.put(`/notes/${id}`, note);
export const deleteNote = (id) => api.delete(`/notes/${id}`);
export const upgradeTenant = (slug) => api.post(`/tenants/${slug}/upgrade`);

export default api;
