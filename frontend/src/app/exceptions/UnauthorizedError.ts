export class UnauthorizedError extends Error{
    constructor(message: string = 'Unathorized'){
        super(message)
        this.name = 'Unathorized';
    }
}