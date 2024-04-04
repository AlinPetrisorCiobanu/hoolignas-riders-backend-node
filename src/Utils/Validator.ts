//validator con Regex

export const validateName = (name: string): boolean => {
    const nameRegex: RegExp = /^[a-zA-Z ]{2,100}$/;
    return nameRegex.test(name);
};

export const validateLastName = (lastName: string): boolean => {
    const lastNameRegex: RegExp = /^[a-zA-Z ]{3,100}$/;
    return lastNameRegex.test(lastName);
};

export const validateDate = (date: string): boolean => {
    const dateRegex: RegExp = /^[a-zA-Z0-9 ]{3,20}$/;
    return dateRegex.test(date);
};

export const validatePhone = (phone: string): boolean => {
    const phoneRegex: RegExp = /^[0-9]{6,15}$/;
    return phoneRegex.test(phone);
};

export const validateEmail = (email: string): boolean => {
    const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,48}$/;
    return emailRegex.test(email);
};

export const validateNickname = (nickname: string): boolean => {
    const nicknameRegex: RegExp = /^[a-zA-Z0-9_]{3,20}$/;
    return nicknameRegex.test(nickname);
};

export const validatePassword = (password: string): boolean => {
    const passwordRegex: RegExp = /^(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+\\|[\]{};:'",.<>/?]).{6,15}$/;
    return passwordRegex.test(password);
};