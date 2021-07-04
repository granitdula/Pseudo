import { RuntimeError } from './../logic/runtime-error';
import { ValueType } from './value-type';
import { NumberType } from './number-type';

export class ListType extends ValueType {

  public elements: ValueType[];

  constructor(elements: ValueType[]) {
    super();
    this.elements = elements;
  }

  public addBy(other: ValueType): [ValueType, RuntimeError] {
    let newList: ListType = this.copy();
    newList.elements.push(other);

    return [newList, null];
  }

  public subtractBy(other: ValueType): [ValueType, RuntimeError] {
    if (other instanceof NumberType) {
      if (Number.isInteger(other.getValue())) {
        if (other.getValue() < this.elements.length &&
            other.getValue() >= -(this.elements.length)) {
          let newList: ListType = this.copy();
          newList.elements.splice(other.getValue(), 1);

          return [newList, null];
        }
        else {
          return [null, new RuntimeError('index out of bounds', other.getPosStart(),
                                          other.getPosEnd(), other.getContext())];
        }
      }
      else {
        return [null, new RuntimeError('right operand should be an integer', other.getPosStart(),
                                        other.getPosEnd(), other.getContext())];
      }
    }
    else {
      return [null, this.illegalOperation()];
    }
  }

  public multiplyBy(other: ValueType): [ValueType, RuntimeError] {
    if (other instanceof ListType) {
      let newList: ListType = this.copy();
      newList.elements.push(...(other.elements));

      return [newList, null];
    }
    else {
      return [null, this.illegalOperation()];
    }
  }

  /**
   * Performs list element index referencing
   * @param other A ValueType supported by the interpreter.
   */
  public poweredBy(other: ValueType): [ValueType, RuntimeError] {
    if (other instanceof NumberType) {
      if (Number.isInteger(other.getValue())) {
        if (other.getValue() < this.elements.length &&
            other.getValue() >= -(this.elements.length)) {
          if (other.getValue() < 0) {
            return [this.elements[this.elements.length + other.getValue()], null];
          }
          else { return [this.elements[other.getValue()], null]; }
        }
        else {
          return [null, new RuntimeError('index out of bounds', other.getPosStart(),
                                          other.getPosEnd(), other.getContext())];
        }
      }
      else {
        return [null, new RuntimeError('right operand should be an integer', other.getPosStart(),
                                        other.getPosEnd(), other.getContext())];
      }
    }
    else {
      return [null, this.illegalOperation()];
    }
  }

  /**
   * Adds element to a list at a specified index using elements of other.elements to specify
   * index and the element to add.
   * @param other A ValueType supported by the interpreter.
   */
  public lessThanComparison(other: ValueType): [ValueType, RuntimeError] {
    if (other instanceof ListType) {
      if (other.elements.length === 2) {
        const result: RuntimeError = this.findErrorsInElements(other);

        if (result === null) {
          let newList: ListType = this.copy();
          const firstElem: NumberType = <NumberType>other.elements[0];
          newList.elements.splice(firstElem.getValue(), 0, other.elements[1]);
          return [newList, null];
        }
        else { return [null, result]; }
      }
      else {
        return [null, new RuntimeError(`list on the right should be of size 2 where index 0 is` +
                                       ` the position and 1 is the element`, other.getPosStart(),
                                        other.getPosEnd(), other.getContext())];
      }
    }
    else {
      return [null, this.illegalOperation()];
    }
  }

  public copy(): ListType {
    const list = new ListType(this.elements);

    list.setPos(this.posStart, this.posEnd);
    list.setContext(this.context);

    return list;
  }

  private findErrorsInElements(other: ListType): RuntimeError {
    const [firstElem, _] = other.elements;

    if (firstElem instanceof NumberType) {
      if (Number.isInteger(firstElem.getValue())) {
        if (firstElem.getValue() <= this.elements.length &&
              firstElem.getValue() >= -(this.elements.length)) {
          return null;
        }
        else {
          return new RuntimeError('index out of bounds', other.getPosStart(), other.getPosEnd(),
                           other.getContext());
        }
      }
      else {
        return new RuntimeError('element at index 0 of list on the right should be an integer',
                                other.getPosStart(), other.getPosEnd(), other.getContext());
      }
    }
    else {
      return new RuntimeError('element at index 0 of list on the right should be an integer',
                              other.getPosStart(), other.getPosEnd(), other.getContext());
    }
  }
}
