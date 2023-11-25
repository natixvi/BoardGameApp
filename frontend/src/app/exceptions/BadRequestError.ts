export class BadRequestError extends Error{
    constructor(message: string = 'Bad request error'){
        super(message)
        this.name = 'Bad request error';
    }
}