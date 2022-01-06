import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Note } from './note/note.component';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  tempNotes = new BehaviorSubject([
    {
      id: parseInt(Math.random().toString().slice(2,11)),
      description: "<p>Hello World !!!</p>",
      update: false
    },
    {
      id: parseInt(Math.random().toString().slice(2,11)),
      description: "<p><strong>asd</strong></p><p><em>dfg</em></p><p><u>fgh</u></p><ol><li>yut</li></ol><ul><li>wet</li></ul>",
      update: false
    },
    {
      id: parseInt(Math.random().toString().slice(2,11)),
      description: "<p><strong><u>fwregnjsgegjknw4erjkgnbjknrg</u></strong></p><ol><li><u>asd</u></li><li><u>qw</u></li><li><u>g</u></li><li><strong>fdb</strong></li><li><u>rth</u></li><li><u>rey</u></li><li>ert</li><li><strong>wer</strong></li></ol>",
      update: false
    }
  ])
  notes = this.tempNotes.asObservable();

  constructor() { }

  updateNotes(notes: Note[]) {
    this.tempNotes.next(notes);
  }
}
