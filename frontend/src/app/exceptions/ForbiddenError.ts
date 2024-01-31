export class ForbiddenError extends Error{
    constructor(message: string = 'Forbidden action'){
        super(message)
        this.name = 'Forbidden action';
    }
}