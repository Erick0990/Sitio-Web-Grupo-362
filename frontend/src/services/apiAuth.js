const BASE_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw { error: data.error || 'Credenciales inválidas' };
        }

        return data;
    } catch (error) {
        throw error.error ? error : { error: 'Error de conexión' };
    }
};