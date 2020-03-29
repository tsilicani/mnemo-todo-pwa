import { endpoint } from '../../config.js'
const axios = require('axios').default

export function signUp(email, password) {
    return axios.post(`${endpoint}/auth/signup`, {
        email: email,
        password: password
    })
}

export function signIn(email, password) {
    return axios.post(`${endpoint}/auth/login`, {
        email: email,
        password: password
    })
}

export function sendCode(email) {
    return axios.post(`${endpoint}/auth/sendcode`, {
        email: email
    })
}

export function verifyEmail(email, disposableCode) {
    return axios.post(`${endpoint}/auth/verifyemail`, {
        email: email,
        disposableCode: disposableCode
    })
}

export function resetPassword(email, disposableCode, newPassword) {
    return axios.post(`${endpoint}/auth/passwordchange`, {
        email: email,
        disposableCode: disposableCode,
        password: newPassword
    })
}