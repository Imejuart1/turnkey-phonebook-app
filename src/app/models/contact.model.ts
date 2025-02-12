export class Contact {
    constructor(
      public firstName: string = '',
      public lastName: string = '',
      public email: string = '',
      public phoneNumber: string = '',
      public contactImage?: string,
      public physicalAddress: string = '',
      public groupType: string = '',
    ) {}
  }
  