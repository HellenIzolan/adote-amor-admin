import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage'; 
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { take, map, finalize } from 'rxjs/operators';

import { AdocoesService } from '../../services/adocoes.service';
import { OverlayService } from 'src/app/core/services/overlay.service';

@Component({
  selector: 'app-adocoes-save',
  templateUrl: './adocoes-save.page.html',
  styleUrls: ['./adocoes-save.page.scss']
})
export class AdocoesSavePage implements OnInit {
  adocaoForm: FormGroup;
  pageTitle = '...';
  adocaoId: string = undefined;

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  downloadURL: Observable<string>;
  uploadState: Observable<string>;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private overlayService: OverlayService,
    private route: ActivatedRoute,
    private adocoesService: AdocoesService,
    private afStorage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.init();
  }

  init(): void {
    const adocaoId = this.route.snapshot.paramMap.get('id');
    if (!adocaoId) {
      this.pageTitle = 'Criar Animal';
      return;
    }
    this.adocaoId = adocaoId;
    this.pageTitle = 'Editar Animal';
    this.adocoesService
      .get(adocaoId)
      .pipe(take(1))
      .subscribe(({ nome, sobre, imagem, ativo }) => {
        this.adocaoForm.get('nome').setValue(nome);
        this.adocaoForm.get('sobre').setValue(sobre);
        this.adocaoForm.get('imagem').setValue(imagem);
        this.adocaoForm.get('ativo').setValue(ativo);
      });
  }

  private createForm(): void {
    this.adocaoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      sobre: ['', [Validators.required, Validators.minLength(3)]],
      imagem: ['', [Validators.required, Validators.minLength(3)]],
      ativo: [false]
    });
  }

  get nome(): FormControl {
    return <FormControl>this.adocaoForm.get('nome');
  }

  get sobre(): FormControl {
    return <FormControl>this.adocaoForm.get('sobre');
  }

  get imagem(): FormControl {
    return <FormControl>this.adocaoForm.get('imagem');
  }

  async onSubmit(): Promise<void> {
    const loading = await this.overlayService.loading({
      message: 'Salvando...'
    });
    try {
      const adocao = !this.adocaoId
        ? await this.adocoesService.create(this.adocaoForm.value)
        : await this.adocoesService.update({
            id: this.adocaoId,
            ...this.adocaoForm.value
          });
      this.navCtrl.navigateBack('/admin/adocoes');
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
    this.ref = this.afStorage.ref('/adocoes/' + randomId);
    this.task = this.ref.put(event.target.files[0]);
    this.task.snapshotChanges().pipe(
      finalize(() => {
          this.downloadURL = this.ref.getDownloadURL();
          this.downloadURL.subscribe( url => { 
            this.adocaoForm.get('imagem').setValue(url)})
          })
    )
    .subscribe();
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
  }
}
