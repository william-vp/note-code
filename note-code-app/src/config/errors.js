import React from "react";
import {openMessageInfo, openNotification} from "../utils/alerts";

export const manage_errors = (e, show = false, type) => {
    let code, message, details
    //let status = e.response.status ? e.response.status : 0;
    code = e.response.data.code ? e.response.data.code : '';
    details = e.response.data.details ? e.response.data.details : '';
    message = e.response.data.msg ? e.response.data.msg : e.response.data.message;

    const msg = message ? message : "Ocurrió un error inesperado. Intenta nuevamente"
    if (show) {
        if (type === "notification") {
            openNotification('Error', msg, "error")
        } else {
            openMessageInfo('error', msg)
        }
    }

    if (process.env.REACT_APP_DEBUG) {
        console.log("error code")
        console.log(code)
        console.log("Details")
        console.log(details)
        console.log(e)
    }
};
