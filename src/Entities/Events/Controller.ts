import { DataToken } from "../../Types/Type_Auth";
import { UserModel } from "../Users/Modelo";
import Event, { EventModel } from "./Model";


export const new_event = async (data_token: DataToken, data_event: EventModel) => {

    const user_token: UserModel | undefined = data_token.user;
    const dateNow = new Date();

    if (!data_event.name || !data_event.data || !data_event.date || !data_event.hour || !data_event.img || !data_event.details || !data_event.maps) throw new Error('MISSING_DATA')

    if (user_token === undefined) throw new Error('INVALID_CREDENTIALS');
    if (user_token.role === "user") throw new Error('UNAUTHORIZATION');

    const date = new Date(`${data_event.date}`)
    const [hours, minuts] = data_event.hour.split(':').map(Number)

    if (hours < 6 && hours > 18) throw new Error('INVALID_CREDENTIALS')
    if (minuts < 0 && minuts > 59) throw new Error('INVALID_CREDENTIALS')

    if (!(date instanceof Date)) throw new Error('BAD_DATE_REQUEST');
    if (date < dateNow) throw new Error('INVALID_CREDENTIALS');

    const event = await Event.findOne({ date: data_event.date })
    if (event) throw new Error('ALLREADY_EXIST')

    try {
        data_event.id_user = user_token._id;
        data_event.participants_ids = [user_token._id]
        data_event.is_active = true
        data_event.confirmed = false

        await new Event(data_event).save()
        return {
            succes: true,
            message: "Evento Creado",
            data: data_event
        }
    } catch (error) {
        throw new Error('BAD_REQUEST')
    }
}

export const list_active_events = async (data_token: DataToken, page_params: string) => {
    const user_token: UserModel | undefined = data_token.user

    let page = page_params ? parseFloat(page_params) : 1
    const pageSize = 1;

    const options = {
        page,
        limit: pageSize
    };

    if (user_token === undefined) throw new Error('INVALID_CREDENTIALS')

    if (user_token.is_active === false) throw new Error('DELETED')

    try {
        let events = await Event.paginate({ is_active: true }, options)

        if (page > events.totalPages) {
            options.page = 1;
            events = await Event.paginate({ is_active: true }, options)
        }

        if (events.docs.length > 0) {
            return {
                success: true,
                message: "Eventos",
                data: events
            };
        } else {
            return {
                success: false,
                message: "No hay eventos para mostrar",
            };
        }
    } catch (error) {
        throw new Error('NOT_FOUND')
    }
}

export const list_inactive_events = async (data_token: DataToken, page_params: string) => {
    const user_token: UserModel | undefined = data_token.user

    let page = page_params ? parseFloat(page_params) : 1
    const pageSize = 1;

    const options = {
        page,
        limit: pageSize
    };

    if (user_token === undefined) throw new Error('INVALID_CREDENTIALS')

    if (user_token.is_active === false) throw new Error('DELETED')

    try {
        let events = await Event.paginate({ is_active: false }, options)

        if (page > events.totalPages) {
            options.page = 1;
            events = await Event.paginate({ is_active: false }, options)
        }

        if (events.docs.length > 0) {
            return {
                success: true,
                message: "Eventos",
                data: events
            };
        } else {
            return {
                success: false,
                message: "No hay eventos para mostrar",
            };
        }
    } catch (error) {
        throw new Error('NOT_FOUND')
    }
}

export const delete_event = async (data_token: DataToken, id_event: any) => {

    const user_token: UserModel | undefined = data_token.user

    if (user_token === undefined) throw new Error('INVALID_CREDENTIALS')

    if (user_token.is_active === false) throw new Error('DELETED')
    const event = await Event.findOne({ _id: id_event })
    if (event !== null && event.is_active === false) throw new Error('EVENT_DELETED')
    try {
        if (event) {
            event.is_active = false
            await event.save()
            return {
                success: true,
                message: "Evento borrado con exito",
            };
        } else {
            throw new Error('NOT_FOUND')
        }
    } catch (error) {
        throw new Error('NOT_FOUND')
    }
}

export const add_participant_event = async (data_token: DataToken, id_event: any) => {

    console.log(id_event)
    const user_token: UserModel | undefined = data_token.user
    if (user_token === undefined) throw new Error('INVALID_CREDENTIALS')
    if (user_token.is_active === false) throw new Error('DELETED')

    const event = await Event.findOne({ _id: id_event })
    if (event !== null && event.is_active === false) throw new Error('EVENT_DELETED')

    const id_exist = event?.participants_ids.includes(user_token._id)
    if (id_exist) throw new Error('ALLREADY_EXIST')

    const participants_ids  = event?.participants_ids;

    try {
        if (event) {

            event.participants = event.participants + 1;
            participants_ids?.push(user_token._id)
            if(participants_ids)
            event.participants_ids = participants_ids

            await event.save()

            return {
                success: true,
                message: "Participante añadido con exito",
            };
        } else {
            throw new Error('NOT_FOUND')
        }
    } catch (error) {
        throw new Error('NOT_FOUND')
    }
}

export const remove_participant_event = async (data_token: DataToken, id_event: any) => {

    const user_token: UserModel | undefined = data_token.user

    if (user_token === undefined) throw new Error('INVALID_CREDENTIALS')

    if (user_token.is_active === false) throw new Error('DELETED')

    const event = await Event.findOne({ _id: id_event })
    if (event !== null && event.is_active === false) throw new Error('EVENT_DELETED')

    const id_exist = event?.participants_ids.includes(user_token._id)
    
    if (!id_exist) throw new Error('ALLREADY_NOT_EXIST')

    const indexId = event?.participants_ids.indexOf(user_token._id)

    const participants_ids  = event?.participants_ids;

    try {
        if (event) {
            event.participants = event.participants + (-1);
            if(indexId)
            participants_ids?.splice(indexId, 1)
            if(participants_ids)
            event.participants_ids = participants_ids
            await event.save()

            return {
                success: true,
                message: "Participante borrado con exito",
            };

        } else {
            throw new Error('ALLREADY_NOT_EXIST')
        }
    } catch (error) {
        throw new Error('NOT_FOUND')
    }
}