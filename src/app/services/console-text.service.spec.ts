import { TestBed } from '@angular/core/testing';

import { ConsoleTextService } from './console-text.service';

describe('ConsoleTextService', () => {
  let service: ConsoleTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsoleTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
