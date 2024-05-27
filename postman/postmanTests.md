# Pruebas para el Backend de Twitter

Este documento describe las pruebas para el backend de la aplicación de Twitter utilizando las solicitudes de Postman. A continuación, se detallan los pasos para cada prueba y los resultados esperados.

## 1. Crear Usuario

### Solicitud
- **Método**: POST
- **URL**: `http://localhost:3000/user/`
- **Headers**: 
  - `Content-Type: application/json`
- **Body**:
  ```json
  {
    "name": "Elon Musk",
    "email": "doge@twitter.com",
    "username": "elon"
  }
  ```

### Resultado Esperado
- **Código de Estado**: 200 OK
- **Respuesta**:
  ```json
  {
    "id": 1,
    "email": "doge@twitter.com",
    "name": "Elon Musk",
    "username": "elon",
    "bio": "Hello, I'm new on Twitter"
  }
  ```

## 2. Listar Usuarios

### Solicitud
- **Método**: GET
- **URL**: `http://localhost:3000/user/`

### Resultado Esperado
- **Código de Estado**: 200 OK
- **Respuesta**:
  ```json
  [
    {
      "id": 1,
      "email": "doge@twitter.com",
      "name": "Elon Musk",
      "username": "elon",
      "bio": "Hello, I'm new on Twitter"
    }
    // Otros usuarios si existen
  ]
  ```

## 3. Obtener Usuario por ID

### Solicitud
- **Método**: GET
- **URL**: `http://localhost:3000/user/1`

### Resultado Esperado
- **Código de Estado**: 200 OK
- **Respuesta**:
  ```json
  {
    "id": 1,
    "email": "doge@twitter.com",
    "name": "Elon Musk",
    "username": "elon",
    "bio": "Hello, I'm new on Twitter",
    "tweets": []
  }
  ```

## 4. Actualizar Usuario

### Solicitud
- **Método**: PUT
- **URL**: `http://localhost:3000/user/1`
- **Headers**: 
  - `Content-Type: application/json`
- **Body**:
  ```json
  {
    "name": "Andres",
    "bio": "Hello there!"
  }
  ```

### Resultado Esperado
- **Código de Estado**: 200 OK
- **Respuesta**:
  ```json
  {
    "id": 1,
    "email": "doge@twitter.com",
    "name": "Andres",
    "username": "elon",
    "bio": "Hello there!"
  }
  ```

## 5. Eliminar Usuario

### Solicitud
- **Método**: DELETE
- **URL**: `http://localhost:3000/user/1`

### Resultado Esperado
- **Código de Estado**: 200 OK
- **Respuesta**: Sin contenido (vacío)

---

### Notas
- Asegúrate de que el servidor esté ejecutándose en `http://localhost:3000` antes de realizar las pruebas.
- Los IDs de los usuarios pueden variar según el estado de la base de datos.
- Si las pruebas fallan, verifica que la configuración de la base de datos y las dependencias estén correctamente instaladas y configuradas.