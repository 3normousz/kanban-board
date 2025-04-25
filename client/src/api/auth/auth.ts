import { sign } from "crypto";

const BASE_URL = 'http://localhost:3000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    console.log('Response data:', data); // Log the response data for debugging

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  },
  signup: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    console.log('Response data:', data); // Log the response data for debugging

    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }

    return data;
  }
};