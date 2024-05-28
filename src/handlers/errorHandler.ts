export interface customErrors{
    statusCode:number,
    message:string
}

export class ErrorHandler extends Error implements customErrors{
    statusCode: number;
    constructor(message:string,statusCode:number){
        super(message);
        this.message=message;
        this.statusCode=statusCode;
    }
}