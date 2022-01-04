import { Component, Inject, OnInit } from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { EditorComponent } from '../editor/editor.component';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {

  notes: Note[] = [];
  newNote = '';
  changedNote = '';
  currentNote: number = 0;
  
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

  openQuill() {
    const dialogRef = this.dialog.open(EditorComponent, {
      width: '450px',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(
      (res) => {
        console.log(res);
        this.notes.push({
          id: Math.floor(Date.now() / 1000),
          description: res,
          update: false
        })
      }, (err) => {
        console.log(err);
      }
    );
  }

  contentChanged(quillEvent: any) {
    console.log(quillEvent);
    this.newNote = quillEvent.html;
  }

  updateNote(quillEvent: any, noteId: number) {
    this.changedNote = quillEvent.html;
    console.log(noteId)
    this.currentNote = noteId;
  }

  finishUpdateNote() {
    for(let note of this.notes) {
      if(note.id == this.currentNote) {
        note.description = this.changedNote;
        note.update = false;
      }
    }
  }

  deleteNote(id: number) {
    if(id) {
      this.notes = this.notes.filter(note => note.id != id);
    } else {
      console.log("Id not found !!!")
    }
  }

  create() {
    this.notes.push({
      id: Math.floor(Date.now() / 1000),
      description: this.newNote,
      update: false
    })
    this.clearEditor();
  }

  clearEditor() {
    this.newNote = '';
    var content = document.getElementsByClassName("ql-editor");
    content[0].innerHTML = "";
  }

}

interface Note {
  id: number,
  description: string,
  update: boolean
}
