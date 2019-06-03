export class chat
{
    actions:string;
    message:string;
    
    constructor(actions:string,message:string)
    {
        this.actions=actions;
        this.message=message;
    }
}

export class simplechat
{
    type:string;
    message:any[];
    
    constructor(type:string,message:any[])
    {
        this.type=type;
        this.message=message;
    }
}



