export class DuplicateUserDataError extends Error{
    constructor(message: string = 'Duplicate user data error.'){
        super(message)
        this.name = 'Duplicate user data error';
    }
}