export const authService = {
  getCurrentUser: async () => {
    const res = await fetch("http://localhost:3000/api/auth/me", {
      credentials: "include", // important for cookie
    });
    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
  },
};
