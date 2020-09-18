import { WindowSizeService } from './../../services/window-size.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputConsoleComponent } from './output-console.component';

describe('OutputConsoleComponent', () => {
  let component: OutputConsoleComponent;
  let fixture: ComponentFixture<OutputConsoleComponent>;
  let service: WindowSizeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutputConsoleComponent ]
    })
    .compileComponents();

    service = TestBed.inject(WindowSizeService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('HTML tests', () => {
    describe('Main component test', () => {
      it('should create', () => {
        expect(component).toBeTruthy();
      });
    });

    describe('Output heading tests', () => {
      it('should create div with class output-heading', () => {

        const outputConsoleElement: HTMLElement = fixture.nativeElement;
        const outputHeadingClasses = outputConsoleElement.getElementsByClassName('output-heading');

        expect(outputHeadingClasses.length).toBe(1);
      });

      it(`should have output-heading with text 'Output'`, () => {

        const outputConsoleElement: HTMLElement = fixture.nativeElement;
        const outputHeading = outputConsoleElement.getElementsByClassName('output-heading')[0];

        expect(outputHeading.textContent).toBe('Output');
      });
    });

    describe('Line bar separator tests', () => {
      it('should create div with class line-bar-separator', () => {

        const outputConsoleElement: HTMLElement = fixture.nativeElement;
        const lineBarClasses = outputConsoleElement.getElementsByClassName('line-bar-separator');

        expect(lineBarClasses.length).toBe(1);
      });
    });

    describe('Output region tests', () => {
      it('should create div with class output-region', () => {

        const outputConsoleElement: HTMLElement = fixture.nativeElement;
        const outputRegionClasses = outputConsoleElement.getElementsByClassName('output-region');

        expect(outputRegionClasses.length).toBe(1);
      });

      it('should have output-region div which is not content editable', () => {

        const outputConsoleElement: HTMLElement = fixture.nativeElement;
        const outputRegionClasses = outputConsoleElement.getElementsByClassName('output-region');

        expect(outputRegionClasses[0].getAttribute('contenteditable')).toBe('false');
      });
    });
  });

  describe('Typescript tests', () => {
    describe('windowSizeService width update tests', () => {
      it(`should start with width style value of "47.2%"`, () => {

        const outputConsoleElement: HTMLElement = fixture.nativeElement;

        const expected: string = '47.2%';

        expect(outputConsoleElement.style.width).toEqual(expected);
      });

      it('should have correct width style value when adjustWindowWidths is called with argument 20 pixels', () => {

        const outputConsoleElement: HTMLElement = fixture.nativeElement;
        const helper: WindowSizeHelper = new WindowSizeHelper();

        helper.adjustWindowWidths(20);
        service.adjustWindowWidths(20);

        fixture.detectChanges();

        const expected: string = helper.expectedOutputWidth.toString() + '%';

        expect(outputConsoleElement.style.width).toEqual(expected);
      });

      it('should have correct width style value when adjustWindowWidths is called with argument -10 pixels', () => {

        const outputConsoleElement: HTMLElement = fixture.nativeElement;
        const helper: WindowSizeHelper = new WindowSizeHelper();

        helper.adjustWindowWidths(-10);
        service.adjustWindowWidths(-10);

        fixture.detectChanges();

        const expected: string = helper.expectedOutputWidth.toString() + '%';

        expect(outputConsoleElement.style.width).toEqual(expected);
      });

      it(`should have width style value of "30%" when adjustWindowWidths is called with argument 10000 pixels`, () => {

        const outputConsoleElement: HTMLElement = fixture.nativeElement;

        service.adjustWindowWidths(10000);

        fixture.detectChanges();

        const expected: string = '30%';

        expect(outputConsoleElement.style.width).toEqual(expected);
      });

      it(`should have width style value of "64.2%" when adjustWindowWidths is called with argument -10000 pixels`, () => {

        const outputConsoleElement: HTMLElement = fixture.nativeElement;

        service.adjustWindowWidths(-10000);

        fixture.detectChanges();

        const expected: string = '64.2%';

        expect(outputConsoleElement.style.width).toEqual(expected);
      });
    });

    describe('outputText tests', () => {
      it('should have empty innerHTML when output console initialised.', () => {

        const outputConsoleElement: HTMLElement = fixture.nativeElement;
        const outputRegion = outputConsoleElement.querySelector('div.output-region');

        expect(outputRegion.innerHTML).toBe('');
      });

      it('should have a line of text in innerHTML when calling outputText with that line.', () => {

        const outputConsoleElement: HTMLElement = fixture.nativeElement;
        const outputRegion = outputConsoleElement.querySelector('div.output-region');

        component.outputText('Output 1.');

        fixture.detectChanges();

        const expected: string = 'Output 1.';

        expect(outputRegion.innerHTML).toBe(expected);
      });

      it('should have 5 lines of text in innerHTML when calling outputText with 5 lines of text.', () => {

        const outputConsoleElement: HTMLElement = fixture.nativeElement;
        const outputRegion = outputConsoleElement.querySelector('div.output-region');

        const htmlArr: string[] = [];

        for (let i = 1; i < 6; i++) {
          htmlArr.push(`Line ${i}`);
        }

        const htmlText: string = htmlArr.join('<br>');

        component.outputText(htmlText);

        fixture.detectChanges();

        const expected: string = `Line 1<br>Line 2<br>Line 3<br>Line 4<br>Line 5`;

        expect(outputRegion.innerHTML).toBe(expected);
      });

      it('should have an empty line of text in innerHTML when calling outputText with that empty line.', () => {

        const outputConsoleElement: HTMLElement = fixture.nativeElement;
        const outputRegion = outputConsoleElement.querySelector('div.output-region');

        component.outputText('');

        fixture.detectChanges();

        const expected: string = '';

        expect(outputRegion.innerHTML).toBe(expected);
      });
    });
  });
});

class WindowSizeHelper {

  private changeSensitivity: number = 0.8;
  private sensitivityDenom: number = 10;
  private minWidth: number = 30;
  private maxWidth: number = 64.2;
  private startWidth: number = 47.2;

  public expectedEditorWidth: number;
  public expectedOutputWidth: number;

  constructor() {}

  public adjustWindowWidths(deltaXPixels: number) {

    const percentChange: number = deltaXPixels * (this.changeSensitivity / this.sensitivityDenom);

    this.expectedEditorWidth = Math.max(Math.min(this.startWidth + percentChange, this.maxWidth), this.minWidth);
    this.expectedOutputWidth = Math.max(Math.min(this.startWidth - percentChange, this.maxWidth), this.minWidth);
  }
}
