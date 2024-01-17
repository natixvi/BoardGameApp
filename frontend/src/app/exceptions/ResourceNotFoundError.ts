export class ResourceNotFoundError extends Error{
    constructor(message: string = 'Not found'){
        super(message)
        this.name = 'Not found';
    }
}