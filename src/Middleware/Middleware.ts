import { Response, Request, NextFunction } from "express";

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    let statusCode;
    let succes = false;
    let message;

    switch (err.message) {
        case 'BAD_REQUEST':
            statusCode = 400;
            message = '¡Algo salió mal! Por favor, inténtalo de nuevo más tarde';
            break;
        case 'BAD_DATE_REQUEST':
            statusCode = 400;
            message = '¡Formato Fecha Incorrecta!';
            break;
        case 'INVALID_CREDENTIALS_EMAIL':
            statusCode = 401;
            message = 'Datos inválidos : Email';
            break;
        case 'INVALID_CREDENTIALS_PASSWORD':
            statusCode = 401;
            message = 'Datos inválidos : Contraseña';
            break;
        case 'INVALID_CREDENTIALS':
            statusCode = 401;
            message = 'Datos inválidos';
            break;
        case 'NOT_FOUND':
            statusCode = 404;
            message = 'Lo siento, no hemos encontrado';
            break;
        case 'UNAUTHORIZATION':
            statusCode = 405;
            message = 'No autorizado';
            break;
        case 'NOT_ALLOWED':
            statusCode = 405;
            message = 'Lo siento, no tienes permiso';
            break;
        case 'ALLREADY_EXIST':
        case 'ALLREADY_NOT_EXIST':
            statusCode = 409;
            message = err.message === 'ALLREADY_EXIST' ? 'Lo siento, ya existe un registro con estos datos' : 'Lo siento, no existe';
            break;
        case 'EMAIL_PASSWORD':
            statusCode = 419;
            message = 'Email , Nombre de Usuario o Contraseña inválidos';
            break;
        case 'MISSING_DATA':
            statusCode = 422;
            message = 'Faltan datos';
            break;
        case 'MISSING_DATA_MODIFY':
            statusCode = 422;
            message = 'Introduce Al menos un campo';
            break;
        case 'DELETED':
            statusCode = 423;
            message = 'Este usuario está bloqueado';
            break;
        case 'EVENT_DELETED':
            statusCode = 423;
            message = 'Este evento ya esta borrado';
            break;
        default:
            statusCode = 500;
            message = 'Error del servidor';
    }

    res.status(statusCode).header('Content-Type', 'application/json').json({ succes, message });

}
export default errorHandler;