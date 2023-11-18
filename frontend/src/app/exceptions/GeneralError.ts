export class GeneralError extends Error{
    constructor(message: string = 'An error occured!'){
        super(message)
        this.name = 'An error occured!';
    }
}