export class BadRequestError extends Error{
    constructor(message: string = 'Bad request error'){
        console.log("blad weszlo do tego mojego")
        super(message)
        this.name = 'Bad request error';
    }
}