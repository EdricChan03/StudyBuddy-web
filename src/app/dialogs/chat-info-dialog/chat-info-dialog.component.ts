import { Component, OnInit, Inject } from '@angular/core';
import { Chat } from '../../interfaces';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-chat-info-dialog',
  templateUrl: './chat-info-dialog.component.html'
})
export class ChatInfoDialogComponent implements OnInit {

  chatDoc$: Observable<Chat>;
  constructor(@Inject(MAT_DIALOG_DATA) public chatDoc: AngularFirestoreDocument<Chat>) {
    this.chatDoc$ = chatDoc.valueChanges();
  }

  ngOnInit() {
  }

}
