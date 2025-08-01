import { create } from 'zustand';

const useStore = create((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  role: null,
  setRole: (role) => set({ role }),
  rollNumber: null,
  setRollNumber: (rollNumber) => set({ rollNumber })
}));

export default useStore;
