export class Task {
  constructor(
    public id :string = '',
    public taskName : string = '',
    public description: string = '',
    public dueDate : Date = new Date(),
    public status : boolean = false,
    public actualDate : Date = new Date(),
  ) {}
}