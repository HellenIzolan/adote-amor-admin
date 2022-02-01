import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage'; 
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { take, map, finalize } from 'rxjs/operators';

import { ConteudosService } from '../../services/conteudos.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
//import { PhotoService } from '../../services/photo.service';

@Component({
  selector: 'app-conteudos-save',
  templateUrl: './conteudos-save.page.html',
  styleUrls: ['./conteudos-save.page.scss']
})
export class ConteudosSavePage implements OnInit {
  conteudoForm: FormGroup;
  pageTitle = '...';
  conteudoId: string = undefined;

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  downloadURL: Observable<string>;
  uploadState: Observable<string>;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private overlayService: OverlayService,
    private route: ActivatedRoute,
    private conteudosService: ConteudosService,
    private afStorage: AngularFireStorage
    //public photoService: PhotoService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.init();
    //this.photoService.loadSaved();
  }

  init(): void {
    const conteudoId = this.route.snapshot.paramMap.get('id');
    if (!conteudoId) {
      this.pageTitle = 'Criar Conteúdo';
      return;
    }
    this.conteudoId = conteudoId;
    this.pageTitle = 'Editar Conteúdo';
    this.conteudosService
      .get(conteudoId)
      .pipe(take(1))
      .subscribe(({ titulo, descricao, data, imagem }) => {
        this.conteudoForm.get('titulo').setValue(titulo);
        this.conteudoForm.get('descricao').setValue(descricao);
        this.conteudoForm.get('data').setValue(data);
        this.conteudoForm.get('imagem').setValue(imagem);
      });
  }

  private createForm(): void {
    this.conteudoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.minLength(10)]],
      data: ['', [Validators.required]],
      imagem: ['', [Validators.required]]
    });
  }

  get titulo(): FormControl {
    return <FormControl>this.conteudoForm.get('titulo');
  }

  get descricao(): FormControl {
    return <FormControl>this.conteudoForm.get('descricao');
  }

  get data(): FormControl {
    return <FormControl>this.conteudoForm.get('data');
  }

  get imagem(): FormControl {
    return <FormControl>this.conteudoForm.get('imagem');
  }

  async onSubmit(): Promise<void> {
    const loading = await this.overlayService.loading({
      message: 'Salvando...'
    });
    try {
      const conteudo = !this.conteudoId
        ? await this.conteudosService.create(this.conteudoForm.value)
        : await this.conteudosService.update({
            id: this.conteudoId,
            ...this.conteudoForm.value
          });
      this.navCtrl.navigateBack('/admin/conteudos');
    } catch (error) {
      await this.overlayService.alert({
        message: error.message
      });
    } finally {
      loading.dismiss();
    }
  }

  //function para realizar upload de imagens
  upload = (event) => {
    const randomId = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref('/conteudos/' + randomId);
    this.task = this.ref.put(event.target.files[0]);
    this.task.snapshotChanges().pipe(
      finalize(() => {
          this.downloadURL = this.ref.getDownloadURL();
          this.downloadURL.subscribe( url => { 
            this.conteudoForm.get('imagem').setValue(url)})
          })
    )
    .subscribe();
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
  }

  /*addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }*/
}
