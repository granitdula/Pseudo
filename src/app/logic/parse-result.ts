import { ASTNode } from './../models/ast-node';
import { InvalidSyntaxError } from './invalid-syntax-error';
import { Token } from '../models/token';

/**
 * Groups information about the node and error at a particular parse step, when forming the AST.
 */
export class ParseResult {

  private error: InvalidSyntaxError;
  private node: ASTNode;

  constructor() {
    this.error = null;
    this.node = null;
  }

  /**
   * This method records any noticed errors in the passed in ParseResult and also returns the
   * AST node value.
   * @param result The result of a parse step to be checked for errors.
   * @returns Returns the node of the AST at that parse step.
   */
  public register(result: ParseResult | ASTNode | Token): ASTNode {
    if (result instanceof ParseResult) {
      if (result.getError() !== null) { this.error = result.getError(); }
      return result.getNode();
    }

    // if result is an ASTNode (based on if it has a token)
    if ((<ASTNode>result).token) { return <ASTNode>result; }

    return null; // Tokens should return null;
  }

  public success(node: ASTNode): ParseResult {
    this.node = node;
    return this;
  }

  public failure(error: InvalidSyntaxError): ParseResult {
    this.error = error;
    return this;
  }

  public getError(): InvalidSyntaxError { return this.error; }

  public getNode(): ASTNode { return this.node; }
}
