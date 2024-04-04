import { DataToken } from "../../Types/Type_Auth"
import { validateDate, validateEmail, validateLastName, validateName, validateNickname, validatePassword, validatePhone } from "../../Utils/Validator"
import CONFIDENCE from "../../config/config_conexion"
import User, { UserModel } from "./Modelo"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const register = async (data: UserModel) => {

    if (!data.name || !data.last_name || !data.date || !data.phone || !data.email || !data.nickname || !data.password) throw new Error('MISSING_DATA')

    const phone_exist = await User.findOne({ phone: data.phone })
    const email_exist = await User.findOne({ email: data.email })
    const nickname_exist = await User.findOne({ nickname: data.nickname })

    if (phone_exist || email_exist || nickname_exist) throw new Error('ALLREADY_EXIST')

    if (!validateEmail(data.email)) throw new Error('INVALID_CREDENTIALS_EMAIL')
    if (!validatePassword(data.password)) throw new Error('INVALID_CREDENTIALS_PASSWORD')
    try {
        data.password = await bcrypt.hash(data.password, CONFIDENCE.LOOPDB)
        data.role = "user"
        data.is_active = true
        data.confirmed = false


        await new User(data).save()
        return {
            succes: true,
            message: "Gracias por Registrarte"
        }
    } catch (error) {
        throw new Error('BAD_REQUEST')
    }
}

export const login = async (data: UserModel) => {

    const user_exist = await User.findOne({ $or: [{ email: data.email }, { nickname: data.nickname }] });
    if (!user_exist) throw new Error('EMAIL_PASSWORD')
    if (user_exist.is_active === false) throw new Error('DELETED')
    try {
        const compare_password = await bcrypt.compare(data.password, user_exist.password)
        if (!compare_password) throw new Error('EMAIL_PASSWORD')

        let token = jwt.sign({ user: user_exist }, CONFIDENCE.SECRETDB, { expiresIn: '24h' });


        return {
            succes: true,
            data: user_exist,
            token: token
        }
    } catch (error) {
        throw new Error('BAD_REQUEST')
    }
}

export const modify_user = async (data_token: DataToken, id: String | undefined, data: UserModel) => {

    const user_token: UserModel | undefined = data_token.user

    if (user_token === undefined) throw new Error('INVALID_CREDENTIALS')
    if (!(data.name || data.last_name || data.date || data.phone || data.email || data.nickname || data.password)) throw new Error('MISSING_DATA_MODIFY')

    if (user_token.role === "user" || user_token.role === "rider") { id = user_token._id }
    if (!id) { id = user_token._id }

    let user_to_update
    try {
        user_to_update = await User.findById(id)
    } catch {
        throw new Error('NOT_FOUND')
    }

    if (data.name) { if (!validateName(data.name)) { throw new Error('INVALID_CREDENTIALS') } }
    if (data.last_name) { if (!validateLastName(data.last_name)) { throw new Error('INVALID_CREDENTIALS') } }
    if (data.date) { if (!validateDate(data.date)) { throw new Error('INVALID_CREDENTIALS') } }
    if (data.phone) { if (!validatePhone(data.phone.toString())) { throw new Error('INVALID_CREDENTIALS') } }
    if (data.email) { if (!validateEmail(data.email)) { throw new Error('INVALID_CREDENTIALS') } }
    if (data.nickname) { if (!validateNickname(data.nickname)) { throw new Error('INVALID_CREDENTIALS') } }
    if (data.password) { if (!validatePassword(data.password)) { throw new Error('INVALID_CREDENTIALS') } }

    if (user_to_update && data.img) {
        user_to_update.img = data.img;
    }
    if (user_to_update && data.name) {
        user_to_update.name = data.name;
    }
    if (user_to_update && data.last_name) {
        user_to_update.last_name = data.last_name;
    }
    if (user_to_update && data.date) {
        user_to_update.date = data.date;
    }
    if (user_to_update && data.phone) {
        user_to_update.phone = data.phone;
    }
    if (user_to_update && data.email) {
        user_to_update.email = data.email;
    }
    if (user_to_update && data.nickname) {
        user_to_update.nickname = data.nickname;
    }
    if (user_to_update && data.password) {
        user_to_update.password = data.password;
    }
    if (data.role || data.is_active || data.confirmed) {
        if (user_token.role === "admin" || user_token.role === "super_admin") {
            if (user_to_update && (data.role === "user" || data.role === "rider" || data.role === "admin")) {
                user_to_update.role = data.role
            }
            if (user_to_update && data.is_active) {
                user_to_update.is_active = data.is_active
            }
            if (user_to_update && data.confirmed) {
                user_to_update.confirmed = data.confirmed
            }
        }
    }

    try {
        if (user_to_update) {
            await user_to_update.save();
            return {
                success: true,
                message: "Usuario modificado",
            };
        } else {
            return {
                success: false,
                message: "No hay usuario para modificar",
            };
        }

    } catch (err) {
        throw new Error('BAD_REQUEST')
    }
}

export const delete_user = async (data_token: DataToken, id: String | undefined) => {

    const user_token: UserModel | undefined = data_token.user

    if (user_token === undefined) throw new Error('INVALID_CREDENTIALS')
    if (user_token.is_active === false) throw new Error('DELETED')

    if (user_token.role === "user" || user_token.role === "rider") { id = user_token._id }
    if (!id) { id = user_token._id }



    try {
        const user_to_delete = await User.findById(id)
        if (user_to_delete) {
            user_to_delete.is_active = false
            await user_to_delete.save();
            return {
                success: true,
                message: "Usuario borrado",
            };
        } else {
            return {
                success: false,
                message: "No hay usuario para borrar",
            };
        }

    } catch (err) {
        throw new Error('BAD_REQUEST')
    }
}

export const data_user = async (data_token: DataToken, id: String | undefined) => {
    const user_token: UserModel | undefined = data_token.user
    let user;

    if (user_token === undefined) throw new Error('INVALID_CREDENTIALS')
    if (user_token.is_active === false) throw new Error('DELETED')

    try {
        if (!id) {
            user = await User.findById(user_token._id)
        } else {
            if (user_token.role === "user" || user_token.role === "rider") { id = user_token._id }
            user = await User.findById(id)
        }

        try {
            if (user) {
                return {
                    success: true,
                    message: "Usuario",
                    data: user
                };
            } else {
                return {
                    success: false,
                    message: "No hay usuario para mostrar",
                };
            }

        } catch (err) {
            throw new Error('BAD_REQUEST')
        }
    } catch {
        throw new Error('NOT_FOUND')
    }
}

export const list_users = async (data_token: DataToken, page_params: string) => {
    const user_token: UserModel | undefined = data_token.user

    let page = page_params ? parseFloat(page_params) : 1
    const pageSize = 2;

    const options = {
        page,
        limit: pageSize
    };

    if (user_token === undefined) throw new Error('INVALID_CREDENTIALS')

    if (user_token.is_active === false) throw new Error('DELETED')

    if (user_token.role === "user" || user_token.role === "rider") throw new Error('UNAUTHORIZATION')


    try {

        let users = await User.paginate({}, options)

        if (page > users.totalPages) {
            options.page = 1;
            users = await User.paginate({}, options)
        }

        if (users.docs.length > 0) {
            return {
                success: true,
                message: "Usuario",
                data: users
            };
        } else {
            return {
                success: false,
                message: "No hay usuario para mostrar",
            };
        }
    } catch {
        throw new Error('NOT_FOUND')
    }
}