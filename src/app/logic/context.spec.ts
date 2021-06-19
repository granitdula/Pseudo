import { PositionTracker } from './position-tracker';
import { Context } from "./context";

describe('Context tests', () => {
  it('should initialise context with passed contextName and null for parent and parentEntryPos if not passed', () => {
    const context = new Context('<pseudo>');

    expect(context.getContextName()).toEqual('<pseudo>');
    expect(context.getParent()).toEqual(null);
    expect(context.getParentEntryPos()).toEqual(null);
  });

  it('should initialise context with passed contextName and null for parent and parentEntryPos if not passed', () => {
    const parentContext = new Context('<pseudo>');
    const parentPos = new PositionTracker(10, 2, 3);
    const context = new Context('function', parentContext, parentPos);

    expect(context.getContextName()).toEqual('function');
    expect(context.getParent()).toEqual(parentContext);
    expect(context.getParentEntryPos()).toEqual(parentPos);
  });
});
