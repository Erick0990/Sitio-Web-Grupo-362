
-- Este es el query para crear las tablas --

-- Tabla 1: Usuarios

CREATE TYPE public.user_role AS ENUM ('encargado', 'administrador')

CREATE TABLE public.Usuarios(
	cedula VARCHAR(9) NOT NULL,
	nombre VARCHAR(20) NOT NULL,
	apellidos VARCHAR(40) NOT NULL,
	fecha_nacimiento DATE NOT NULL,
	telefono VARCHAR(15) NOT NULL,
	email VARCHAR(40) NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	rol public.user_role NOT NULL DEFAULT 'encargado',
	creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT usuarios_pkey PRIMARY KEY (cedula),
    CONSTRAINT usuarios_email_key UNIQUE (email),
    CONSTRAINT usuarios_cedula_check CHECK (cedula ~ '^[0-9]{1,9}$')
);

-- Tabla 2: Scouts

CREATE TABLE public.scouts (
	cedula VARCHAR(9) NOT NULL,
	cedula_encargado VARCHAR(9) NOT NULL,
	nombre VARCHAR(20) NOT NULL,
	apellidos VARCHAR(40) NOT NULL,
	fecha_nacimiento DATE NOT NULL,
	creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT scouts_pkey PRIMARY KEY (cedula),
	CONSTRAINT fk_usuario_encargado FOREIGN KEY (cedula_encargado) REFERENCES public.Usuarios (cedula) on UPDATE CASCADE on DELETE CASCADE,
	CONSTRAINT scouts_cedula_check CHECK (cedula ~ '^[0-9]{1,9}$')
);

-- Tabla 3: Finanzas

CREATE TYPE public.tipo_transaccion AS ENUM ('ingreso', 'gasto');

CREATE TABLE public.finanzas (
    id SERIAL NOT NULL,
    concepto VARCHAR(100) NOT NULL,
    tipo public.tipo_transaccion NOT NULL,
    monto NUMERIC(10, 2) NOT NULL,
    encargado_cedula VARCHAR(9),
    fecha TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT finanzas_pkey PRIMARY KEY (id),
    CONSTRAINT finanzas_encargado_cedula_fkey FOREIGN KEY (encargado_cedula) REFERENCES public.usuarios (cedula) ON DELETE SET NULL
);

-- Tabla 4: Actividades

CREATE TYPE public.tipo_actividad AS ENUM ('Reunión', 'Campamento', 'Excursión', 'Servicio');

CREATE TABLE public.actividades (
    id SERIAL NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    lugar VARCHAR(150),
    costo NUMERIC(10, 2) DEFAULT 0.00,
    tipo public.tipo_actividad DEFAULT 'Reunión',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT actividades_pkey PRIMARY KEY (id)
);

-- Tabla 5: Asistencia

CREATE TYPE public.estado_asistencia AS ENUM ('Confirmado', 'Pendiente');

CREATE TABLE public.asistencias (
    id SERIAL NOT NULL,
    actividad_id INTEGER,
    scout_cedula VARCHAR(12),
    estado public.estado_asistencia DEFAULT 'Pendiente',
    fecha_actualizacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT asistencias_pkey PRIMARY KEY (id),
    CONSTRAINT asistencias_actividad_id_scout_cedula_key UNIQUE (actividad_id, scout_cedula),
    CONSTRAINT asistencias_actividad_id_fkey FOREIGN KEY (actividad_id) REFERENCES public.actividades (id) ON DELETE CASCADE,
    CONSTRAINT asistencias_scout_cedula_fkey FOREIGN KEY (scout_cedula) REFERENCES public.scouts (cedula) ON DELETE CASCADE
);

-- Tabla 6: Inventario

CREATE TYPE public.estado_inventario AS ENUM ('Nuevo', 'Bueno', 'Regular', 'Malo');

CREATE TABLE public.inventario (
    id SERIAL NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    cantidad INTEGER NOT NULL DEFAULT 0,
    estado public.estado_inventario DEFAULT 'Bueno',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT inventario_pkey PRIMARY KEY (id)
);