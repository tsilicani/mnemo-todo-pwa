export const signUp = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: { message: 'Signed up succesfully.' } })
        }, 2000)
    })
}

export const signIn = (email, password) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                data: {
                    token: password,
                    email: email,
                    verified: true
                }
            })
        }, 2000)
    })
}

export const sendCode = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: { message: 'Disposable code sent.' } })
        }, 2000)
    })
}

export const verifyEmail = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: { message: 'The Email is now verified.' } })
        }, 2000)
    })
}

export const resetPassword = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: { message: 'The password has been changed.' } })
        }, 2000)
    })
}