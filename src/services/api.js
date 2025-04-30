const API_URL = 'http://localhost:3001';

export const api = {
  // User related API calls
  users: {
    getByUsername: async (username) => {
      const response = await fetch(`${API_URL}/users?username=${username}`);
      return response.json();
    },
    
    create: async (userData) => {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return response.json();
    },
    
    update: async (id, userData) => {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return response.json();
    },
    
    delete: async (id) => {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    }
  },
  
  // Add other API endpoints as needed (expenses, categories, etc.)
};
