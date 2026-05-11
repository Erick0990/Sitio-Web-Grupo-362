const API_URL = `${import.meta.env.VITE_API_URL}`;

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getAdmins = async () => {
    console.log("Iniciando peticion a /admins...");
    const response = await fetch(`${API_URL}/getinfo/admins`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error("Error en peticion a /admins:", error);
        throw new Error(error.error || 'Error al obtener administradores');
    }

    const data = await response.json();
    console.log("Respuesta de /admins:", data);
    return data;
};

export const getEncargados = async () => {
    console.log("Iniciando peticion a /encargados...");
    const response = await fetch(`${API_URL}/getinfo/encargados`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error("Error en peticion a /encargados:", error);
        throw new Error(error.error || 'Error al obtener encargados');
    }

    const data = await response.json();
    console.log("Respuesta de /encargados:", data);
    return data;
};

export const deleteUser = async (cedula) => {
    console.log(`Iniciando peticion para eliminar usuario: ${cedula}`);
    const response = await fetch(`${API_URL}/users/${cedula}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error("Error al eliminar usuario:", error);
        throw new Error(error.error || 'Error al eliminar usuario');
    }

    const data = await response.json();
    return data;
};

export const editUser = async (cedula, userData) => {
    const API_URL_USERS = `${import.meta.env.VITE_API_URL}/users`;
    console.log(`Iniciando peticion para editar usuario: ${cedula}`);
    const response = await fetch(`${API_URL_USERS}/${cedula}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        const error = await response.json();
        console.error("Error al editar usuario:", error);
        throw new Error(error.error || 'Error al editar usuario');
    }

    const data = await response.json();
    return data;
};

// --- Scouts ---
export const getScouts = async () => {
    const API_URL_SCOUTS = `${import.meta.env.VITE_API_URL}/scouts`;
    console.log("Iniciando peticion a:", API_URL_SCOUTS);
    const response = await fetch(API_URL_SCOUTS, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        console.error("Error en la respuesta:", response.status, response.statusText);
        throw new Error('Error al obtener scouts');
    }

    const data = await response.json();
    console.log("Respuesta de /scouts:", data);
    return data;
};

export const deleteScout = async (cedula) => {
    const API_URL_SCOUTS = `${import.meta.env.VITE_API_URL}/scouts`;
    console.log(`Iniciando peticion para eliminar scout: ${cedula}`);
    const response = await fetch(`${API_URL_SCOUTS}/${cedula}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error("Error al eliminar scout:", error);
        throw new Error(error.error || 'Error al eliminar scout');
    }

    const data = await response.json();
    return data;
};

export const editScout = async (cedula, scoutData) => {
    const API_URL_SCOUTS = `${import.meta.env.VITE_API_URL}/scouts`;
    console.log(`Iniciando peticion para editar scout: ${cedula}`);
    const response = await fetch(`${API_URL_SCOUTS}/${cedula}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(scoutData)
    });

    if (!response.ok) {
        const error = await response.json();
        console.error("Error al editar scout:", error);
        throw new Error(error.error || 'Error al editar scout');
    }

    const data = await response.json();
    return data;
};

// --- Finanzas ---
export const getFinances = async () => {
    const API_URL_FINANCES = `${import.meta.env.VITE_API_URL}/finances`;
    const response = await fetch(API_URL_FINANCES, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error('Error al obtener finanzas');
    }

    const data = await response.json();
    return data;
};

export const addFinance = async (financeData) => {
    const API_URL_FINANCES = `${import.meta.env.VITE_API_URL}/finances`;
    const response = await fetch(API_URL_FINANCES, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(financeData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al registrar finanza');
    }

    const data = await response.json();
    return data;
};

export const deleteFinance = async (id) => {
    const API_URL_FINANCES = `${import.meta.env.VITE_API_URL}/finances`;
    const response = await fetch(`${API_URL_FINANCES}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar finanza');
    }

    const data = await response.json();
    return data;
};

// --- Actividades ---
export const getActivities = async () => {
    const API_URL_ACTIVITIES = `${import.meta.env.VITE_API_URL}/activities`;
    const response = await fetch(API_URL_ACTIVITIES, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error('Error al obtener actividades');
    }

    const data = await response.json();
    return data;
};

export const addActivity = async (activityData) => {
    const API_URL_ACTIVITIES = `${import.meta.env.VITE_API_URL}/activities`;
    const response = await fetch(API_URL_ACTIVITIES, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(activityData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al registrar actividad');
    }

    const data = await response.json();
    return data;
};

export const editActivity = async (id, activityData) => {
    const API_URL_ACTIVITIES = `${import.meta.env.VITE_API_URL}/activities`;
    const response = await fetch(`${API_URL_ACTIVITIES}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(activityData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al editar actividad');
    }

    const data = await response.json();
    return data;
};

export const deleteActivity = async (id) => {
    const API_URL_ACTIVITIES = `${import.meta.env.VITE_API_URL}/activities`;
    const response = await fetch(`${API_URL_ACTIVITIES}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar actividad');
    }

    const data = await response.json();
    return data;
};
