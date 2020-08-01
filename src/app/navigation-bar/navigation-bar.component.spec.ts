import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationBarComponent } from './navigation-bar.component';

describe('NavigationBarComponent', () => {
  let component: NavigationBarComponent;
  let fixture: ComponentFixture<NavigationBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('HTML tests', () => {
    describe('Main component test', () => {
      it('should create', () => {
        expect(component).toBeTruthy();
      });
    });

    describe('nav tag tests', () => {
      it('should contain nav element', () => {

        const navbarElement: HTMLElement = fixture.nativeElement;
        const nav = navbarElement.querySelector('nav');

        expect(nav).toBeTruthy();
      });

      it('should contain navbar and navigation-bar class in nav', () => {

        const navbarElement: HTMLElement = fixture.nativeElement;
        const navClasses = navbarElement.querySelector('nav').classList;

        expect(navClasses[0]).toBe('navbar');
        expect(navClasses[1]).toBe('navigation-bar');
      });
    });

    describe('img tag tests', () => {
      it('should contain img of title logo within nav', () => {

        const navbarElement: HTMLElement = fixture.nativeElement;
        const img = navbarElement.querySelector('nav img');

        expect(img).toBeTruthy();
      });

      it('should contain pseudo-title class in img', () => {
        const navbarElement: HTMLElement = fixture.nativeElement;
        const imgClasses = navbarElement.querySelector('nav img').classList;

        expect(imgClasses[0]).toBe('pseudo-title');
      });

      it('should contain navbar-brand class in img', () => {
        const navbarElement: HTMLElement = fixture.nativeElement;
        const imgClasses = navbarElement.querySelector('nav img').classList;

        expect(imgClasses[1]).toBe('navbar-brand');
      });
    });
  });
});
