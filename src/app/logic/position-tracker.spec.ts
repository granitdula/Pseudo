import { PositionTracker } from './position-tracker';

describe('PositionTracker tests', () => {
  it('should initialise with the correct values for index, line and column', () => {
    const positionTracker = new PositionTracker(0, 1, 1);
    const [index, line, column] = positionTracker.getAllTrackerValues();

    expect(index).toEqual(0);
    expect(line).toEqual(1);
    expect(column).toEqual(1);
  });

  describe('advance tests', () => {
    it('should increment index and column same amount as advance is called', () => {
      const numberOfAdvances = 3;
      const positionTracker = new PositionTracker(0, 1, 1);

      for(let i = 0; i < numberOfAdvances; i++){ positionTracker.advance(); }

      const [index, line, column] = positionTracker.getAllTrackerValues();

      expect(index).toEqual(3);
      expect(line).toEqual(1);
      expect(column).toEqual(4);
    });

    it('should reset column to 0 and increment index and line when newline character passed', () => {
      const numberOfAdvances = 3;
      const positionTracker = new PositionTracker(0, 1, 1);

      for(let i = 0; i < numberOfAdvances; i++){ positionTracker.advance(); }

      positionTracker.advance('\n');

      const [index, line, column] = positionTracker.getAllTrackerValues();

      expect(index).toEqual(4);
      expect(line).toEqual(2);
      expect(column).toEqual(1);
    });
  });

  describe('copy tests', () => {
    it('should create independent copy of PositionTracker instance which changes attributes independently', () => {
      const numberOfAdvances = 3;
      const positionTracker1 = new PositionTracker(0, 1, 1);
      const positionTracker2 = positionTracker1.copy();

      for(let i = 0; i < numberOfAdvances; i++){ positionTracker2.advance(); }

      const [index1, line1, column1] = positionTracker1.getAllTrackerValues();
      const [index2, line2, column2] = positionTracker2.getAllTrackerValues();

      expect(index1).toEqual(0);
      expect(line1).toEqual(1);
      expect(column1).toEqual(1);
      expect(index2).toEqual(3);
      expect(line2).toEqual(1);
      expect(column2).toEqual(4);
    });
  })
});
