export class Contact {
    constructor(
      public id: number | null = null,
      public firstName: string = '',
      public lastName: string = '',
      public email: string = '',
      public phoneNumber: string = '',
      public contactImage?: string,
      public physicalAddress: string = '',
      public groupType: string = '',
      public isFavorite: boolean = false
    ) {}
  }
  