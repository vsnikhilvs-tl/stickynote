import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { QuillEditorComponent } from 'ngx-quill';

import { Note, NoteComponent } from './note.component';

describe('NoteComponent', () => {
  let component: NoteComponent;
  let fixture: ComponentFixture<NoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        FormsModule
      ],
      declarations: [ NoteComponent, QuillEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(NoteComponent);
    component = fixture.componentInstance;
    component.currentTitle = "Test";
    component.newNote = "<p>Test</p>";
    fixture.detectChanges();
  });

  it('should create and init itself', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('create a note with title "Test" and desc "Test"', waitForAsync(() => {
    const createButton = fixture.debugElement.nativeElement.querySelector("#addCreate");
    createButton.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.notes[0].title).toBe("Test");
      expect(component.notes[0].description).toBe("<p>Test</p>");
    })
  }))

  it('edit a note', waitForAsync(() => {
    const createButton = fixture.debugElement.nativeElement.querySelector("#addCreate");
    createButton.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.updateNote({html: "<p>Test1</p>"}, component.notes[0].id);
      component.changeTitle({target: {value: "Test1"}}, component.notes[0].id);
      component.finishUpdateNote();
      expect(component.notes[0].title).toBe("Test1");
      expect(component.notes[0].description).toBe("<p>Test1</p>");
      expect(component.notes[0].update).toBeFalse();
    })
  }))

  it('delete a note', waitForAsync(() => {
    const createButton = fixture.debugElement.nativeElement.querySelector("#addCreate");
    createButton.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.notes[0].title).toBe("Test");
      expect(component.notes[0].description).toBe("<p>Test</p>");
      fixture.debugElement.nativeElement.querySelector("#editOne").click();
      expect(component.notes[0].update).toBeTrue();
      // fixture.debugElement.nativeElement.querySelector("#deleteOne").click();
      const delFunc = spyOn(component, 'deleteNote').withArgs(component.notes[0].id).and.callThrough();
      component.deleteNote(component.notes[0].id);
      expect(component.deleteNote).toHaveBeenCalled();
      expect(component.notes.length).toBe(0);
    })
  }))

  it('cancels Edit functionality', waitForAsync(() => {
    const createButton = fixture.debugElement.nativeElement.querySelector("#addCreate");
    createButton.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.notes[0].title).toBe("Test");
      expect(component.notes[0].description).toBe("<p>Test</p>");
      fixture.debugElement.nativeElement.querySelector("#editOne").click();
      expect(component.notes[0].update).toBeTrue();
      let originalNote = component.notes[0].description;
      const cancelFunc = spyOn(component, 'cancelEdit').withArgs(component.notes[0].id).and.callThrough();
      component.cancelEdit(component.notes[0].id);
      expect(component.cancelEdit).toHaveBeenCalled();
      expect(component.notes[0].update).toBeFalse();
      expect(component.notes[0].description).toBe(originalNote);
    })
  }))

  it('changed content in the note', () => {
    const quillEditor = fixture.debugElement.query(By.css("#editor"));
    const editorSpy = spyOn(component, 'contentChanged').withArgs({html: "<p>HelloWorld!!!</p>"}).and.callThrough();
    quillEditor.triggerEventHandler('onContentChanged', {html: "<p>HelloWorld!!!</p>"});
    expect(component.newNote).toBe("<p>HelloWorld!!!</p>");
  })

  it('cancels Create functionality', () => {
    component.currentTitle = "TestTitle";
    let input = fixture.debugElement.query(By.css('#editor'));
    let el = input.nativeElement;
    el.value = "<p>HelloWorld!!!</p>";
    el.dispatchEvent(new Event('input'));
    input.triggerEventHandler('onContentChanged', {html: "<p>HelloWorld!!!</p>"});
    fixture.detectChanges();

    expect(component.newNote).toBeDefined();
    const cancelButton = fixture.debugElement.query(By.css("#cancelCreate"));
    const editorSpy = spyOn(component, 'clearEditor').and.callThrough();
    cancelButton.triggerEventHandler('click', null);
    expect(component.clearEditor).toHaveBeenCalled();
    expect(component.newNote).toBe("");
  })

});
