import { ASTNode } from './../models/ast-node';
import { InvalidSyntaxError } from './invalid-syntax-error';
import { Token } from '../models/token';

/**
 * Groups information about the node and error at a particular parse step, when forming the AST.
 */
export class ParseResult {

  private error: InvalidSyntaxError;
  private node: ASTNode;
  private advanceCount: number;
  private lastRegisteredAdvanceCount: number;

  public reverseToCount: number;

  constructor() {
    this.error = null;
    this.node = null;
    this.advanceCount = 0;
    this.lastRegisteredAdvanceCount = 0;
    this.reverseToCount = 0;
  }

  public registerAdvancement(): void {
    this.lastRegisteredAdvanceCount = 1;
    this.advanceCount++;
  }

  /**
   * This method records any noticed errors in the passed in ParseResult and also returns the
   * AST node value.
   * @param result The result of a parse step to be checked for errors.
   * @returns Returns the node of the AST at that parse step.
   */
  public register(result: ParseResult): ASTNode {
    this.lastRegisteredAdvanceCount = result.advanceCount;
    this.advanceCount += result.advanceCount;
    if (result.getError() !== null) { this.error = result.getError(); }
    return result.getNode();
  }

  public tryRegister(result: ParseResult): ASTNode {
    if (result.getError() !== null) {
      this.reverseToCount = result.getAdvanceCount();
      return null;
    }

    return this.register(result);
  }

  public success(node: ASTNode): ParseResult {
    this.node = node;
    return this;
  }

  public failure(error: InvalidSyntaxError): ParseResult {
    // Prevents overwritting errors whilst traversing up AST.
    if (this.error === null || this.lastRegisteredAdvanceCount === 0) { this.error = error; }
    return this;
  }

  public getError(): InvalidSyntaxError { return this.error; }

  public getNode(): ASTNode { return this.node; }

  public getAdvanceCount(): number { return this.advanceCount; }

  public getReverseToCount(): number { return this.reverseToCount; }
}
