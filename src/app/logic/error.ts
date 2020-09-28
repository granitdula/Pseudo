export class Error {

    constructor(private type: string, private details?: string) {}

    public getErrorMessage(): string {

      if (this.details === undefined) {
        return this.type;
      }
      else {
        return `${this.type}: ${this.details}`;
      }
    }
}
