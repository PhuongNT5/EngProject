var user = {
    login: {
        input: 'ERROR_INPUT',
        systemErr: 'SYSTEM_ERROR',
        notFound: 'USER_NOT_FOUND',
        inCorrect: 'PASSWORD_INCORRECT'
    },
    signup: {
        input: 'ERROR_INPUT',
        systemErr: 'SYSTEM_ERROR',
        duplicateUser: 'DUPLICATE_USER'
    },
    register: {
        input: 'ERROR_INPUT'
    },
    changePassword: {
        systemErr: 'SYSTEM_ERROR',
        passwordOldNotCorrect: 'PASSWORD_OLD_NOT_CORRECT',
        input: "ERROR_INPUT"
    }
}

module.exports = {
    user: user
}