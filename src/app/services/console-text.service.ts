import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsoleTextService {
  private input: string = null;
  private output: string = null;

  public getInput(): string { return this.input; }

  public setInput(newInput): void { this.input = newInput; }

  public getOutput(): string { return this.output; }

  public setOutput(newOutput: string): void { this.output = newOutput; }
}
