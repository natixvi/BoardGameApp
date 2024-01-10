export class DuplicatedDataError extends Error{
    constructor(message: string = 'Duplicated data error'){
        super(message)
        this.name = 'Duplicated data error';
    }
}