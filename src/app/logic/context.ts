import { SymbolTable } from './symbol-table';
import { PositionTracker } from './position-tracker';

/**
 * This handles the scope of access to variables in the current step of the runtime.
 */
export class Context {

  private parent: Context = null; // Defines the access scope during runtime.
  private parentEntryPos: PositionTracker = null; // For runtime error tracebacks.
  public symbolTable: SymbolTable = null;

  constructor(private contextName: string, parent?: Context, parentEntryPos?: PositionTracker) {
    if (parent !== undefined) { this.parent = parent; }
    if (parentEntryPos !== undefined) { this.parentEntryPos = parentEntryPos; }
  }

  public getContextName(): string { return this.contextName; }

  public getParent(): Context { return this.parent; }

  public getParentEntryPos(): PositionTracker { return this.parentEntryPos; }
}
