import { Component, Inject, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {

  notes: Note[] = [];
  newNote = '';
  changedNote = '';
  originalNote = '';
  currentNote: number = 0;
  currentTitle = '';

  dragPosition = {x: 270, y: -205};
  
  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    // this.dataService.notes.subscribe(
    //   (res) => {
    //     this.notes = res;
    //   }, (err) => {
    //     console.log("Error: ", err);
    //   }
    // );
    this.notes = [];
  }

  changeTitle(event: any, id: number) {
    for(let note of this.notes) {
      if(note.id == id) {
        note.title = event.target.value
      }
    }
  }

  contentChanged(quillEvent: any) {
    this.newNote = quillEvent.html;
  }

  updateNote(quillEvent: any, noteId: number) {
    this.changedNote = quillEvent.html;
    this.currentNote = noteId;
  }

  finishUpdateNote() {
    for(let note of this.notes) {
      if(note.id == this.currentNote) {
        note.description = this.changedNote;
        note.update = false;
        this.dataService.updateNotes(this.notes);
      }
    }
  }

  deleteNote(id: number) {
    if(id) {
      this.notes = this.notes.filter(note => note.id != id);
      this.dataService.updateNotes(this.notes);
    } else {
      console.log("Id not found !!!")
    }
  }

  create() {
    if(this.newNote && this.currentTitle) {
      this.notes.push({
        id: Math.floor(Date.now() / 1000),
        title: this.currentTitle,
        description: this.newNote,
        update: false
      })
      this.clearEditor();
    }
  }

  clearEditor() {
    this.newNote = '';
    this.currentTitle = '';
    var content = document.getElementsByClassName("ql-editor");
    content[0].innerHTML = "";
  }

  cancelEdit(id: number) {
    for(let note of this.notes) {
      if(note.id == id) {
        note.description = this.originalNote;
        note.update = false;
        this.originalNote = '';
      }
    }
  }

}

export interface Note {
  id: number,
  title: string,
  description: string,
  update: boolean
}
