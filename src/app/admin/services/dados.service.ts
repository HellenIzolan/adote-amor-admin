import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Firestore } from 'src/app/core/classes/firestore.class';
import { Dados } from '../models/dados.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { firestore } from 'firebase';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DadosService{
  usuario: string;
  constructor(private authService: AuthService, public db: AngularFirestore) {
    this.init();
  }

  private init(): void {
    this.authService.authState$.subscribe(user => {
      if (user) {
        this.usuario = user.uid;
        console.log(this.usuario);
        return;
      }
    });
  }

  getAll() {
    return this.db.collection('/ongs', ref => ref.where('id', '==', this.usuario)).valueChanges();
  }

  get(id: string): Observable<Dados> {
    return this.db.collection('/ongs/').doc<Dados>(id).valueChanges();
  }

  private setItem(item: Dados, operation: 'set' | 'update'): Promise<Dados> {
    return this.db.collection('/ongs/')
      .doc<Dados>(item.id)
      [operation](item)
      .then(() => item);
    }

  create(item: Dados): Promise<Dados> {
    return this.db.collection("ongs").doc(this.usuario).set(item).then(() => item);
  }

  update(item: Dados): Promise<Dados> {
    return this.setItem(item, 'update');
  }

}
