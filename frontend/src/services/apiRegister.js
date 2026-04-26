const BASE_URL = import.meta.env.VITE_API_URL;

export const registerUserAndScout = async (formData) => {
    try {
        const response = await fetch(`${BASE_URL}/register/registerUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw { error: data.error || 'Error en el servidor' };
        }

        return data;
    } catch (error) {
        console.log(error);
        throw error.error ? error : { error: 'No se pudo conectar con el servidor' };
    }
};

export const registerAdmin = async (formData) => {
    try {
        const response = await fetch(`${BASE_URL}/register/registerAdmin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw { error: data.error || 'Error en el servidor' };
        }

        return data;
    } catch (error) {
        console.log(error);
        throw error.error ? error : { error: 'No se pudo conectar con el servidor' };
    }
};
