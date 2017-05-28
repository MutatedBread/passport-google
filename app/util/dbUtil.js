const dbUtil = {
    dbMessage: Object.freeze({
        DB_FAILED: "ERROR: could not inquire database.",
        DB_SUCCESS: "SUCCESS: inquire database.",
        USER_NOT_EXIST: "ERROR: user does not exist.",
        USER_EXIST: "SUCCESS: user exist.",
        USER_NOT_DELETED: "ERROR: user is not deleted.",
        USER_DELETED: "SUCCESS: user is deleted.",
        USER_NOT_MADE: "ERROR: user is not added or modified.",
        USER_MADE: "SUCCESS: user is added or modified.",
        TOKEN_RENEWED: "SUCCESS: token is renewed.",
        TOKEN_NOT_RENEWED: "ERROR: token is not renewed.",
    }),

    dbOperation: Object.freeze({
        ADD_USER: "ADD_USER",
        EXIST_USER: "EXIST_USER",
        FIND_USER: "FIND_USER",
        DELETE_USER: "DELETE_USER",
        RENEW_TOKEN: "RENEW_TOKEN",
    }),

    dbStatusMaker: (typeInput, successInput, msgInput) => {
        return ({
            action: typeInput,
            success: successInput,
            msg: msgInput
        })
    },
};

module.exports=dbUtil;