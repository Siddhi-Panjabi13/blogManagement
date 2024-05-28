export function responseError(status:boolean, message:string,error:object|string){
    return{
        status:status,
        message:message,
        error:error
    }
    }