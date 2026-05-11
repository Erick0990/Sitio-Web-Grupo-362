const API_URL = `${import.meta.env.VITE_API_URL}`;

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getAdmins = async () => {
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
    return data;
};

export const getEncargados = async () => {
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
    return data;
};

export const deleteUser = async (cedula) => {
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
    const response = await fetch(`${API_URL}/users/${cedula}`, {
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
    console.log("Iniciando peticion a:", API_URL);
    const response = await fetch(`${API_URL}/scouts`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        console.error("Error en la respuesta:", response.status, response.statusText);
        throw new Error('Error al obtener scouts');
    }

    const data = await response.json();
    return data;
};

export const deleteScout = async (cedula) => {
    const response = await fetch(`${API_URL}/scouts/${cedula}`, {
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
    const response = await fetch(`${API_URL}/scouts/${cedula}`, {
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
    const response = await fetch(`${API_URL}/finances`, {
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
    const response = await fetch(`${API_URL}/finances`, {
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
    const response = await fetch(`${API_URL}/finances/${id}`, {
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
    const response = await fetch(`${API_URL}/activities`, {
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
    const response = await fetch(`${API_URL}/activities`, {
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
    const response = await fetch(`${API_URL}/activities/${id}`, {
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
    const response = await fetch(`${API_URL}/activities/${id}`, {
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

// --- Inventario ---
export const getInventory = async () => {
    const response = await fetch(`${API_URL}/inventory`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error('Error al obtener inventario');
    }

    const data = await response.json();
    return data;
};

export const addInventoryItem = async (itemData) => {
    const response = await fetch(`${API_URL}/inventory`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(itemData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al registrar ítem');
    }

    const data = await response.json();
    return data;
};

export const editInventoryItem = async (id, itemData) => {
    const response = await fetch(`${API_URL}/inventory/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(itemData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al editar ítem');
    }

    const data = await response.json();
    return data;
};

export const updateInventoryQuantity = async (id, cantidad_cambio) => {
    const response = await fetch(`${API_URL}/inventory/${id}/cantidad`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ cantidad_cambio })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar cantidad');
    }

    const data = await response.json();
    return data;
};

export const deleteInventoryItem = async (id) => {
    const response = await fetch(`${API_URL}/inventory/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al eliminar ítem');
    }

    const data = await response.json();
    return data;
};
