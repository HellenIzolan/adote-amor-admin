import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage'; 
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { take, map, finalize } from 'rxjs/operators';

import { DadosService } from '../../services/dados.service';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-dados-save',
  templateUrl: './dados-save.page.html',
  styleUrls: ['./dados-save.page.scss'],
})
export class DadosSavePage implements OnInit {
  dadosForm: FormGroup;
  pageTitle = '...';
  dadosId: string = undefined;
  usuario: string;

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  uploadState: Observable<string>;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private overlayService: OverlayService,
    private route: ActivatedRoute,
    private dadosService: DadosService,
    private afStorage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.init();
    this.authService.authState$.subscribe(user => {
      if (user) {
        // /collection/document/collection/document
        this.usuario = user.uid;
        this.dadosForm.get('id').setValue(this.usuario);
        console.log(this.usuario)
      }
    });

  }
  
  init(): void {   
    const dadosId = this.route.snapshot.paramMap.get('id');
    if (!dadosId) {
      this.pageTitle = 'Inserir Dados';
      return;
    }
    this.dadosId = dadosId;
    this.pageTitle = 'Editar Dados';
    this.dadosService
      .get(dadosId)
      .pipe(take(1))
      .subscribe(
        ({
          id,
          razao_social,
          fantasia,
          cnpj,
          email_principal,
          rua,
          numero,
          complemento,
          bairro,
          cep,
          cidade,
          estado,
          url_site,
          sobre,
          logo
        }) => {
          this.dadosForm.get('razao_social').setValue(razao_social);
          this.dadosForm.get('fantasia').setValue(fantasia);
          this.dadosForm.get('cnpj').setValue(cnpj);
          this.dadosForm.get('email_principal').setValue(email_principal);
          this.dadosForm.get('rua').setValue(rua);
          this.dadosForm.get('numero').setValue(numero);
          this.dadosForm.get('complemento').setValue(complemento);
          this.dadosForm.get('bairro').setValue(bairro);
          this.dadosForm.get('cep').setValue(cep);
          this.dadosForm.get('cidade').setValue(cidade);
          this.dadosForm.get('estado').setValue(estado);
          this.dadosForm.get('url_site').setValue(url_site);
          this.dadosForm.get('sobre').setValue(sobre);
          this.dadosForm.get('logo').setValue(logo);
        }
      );
  }

  private createForm(): void {
    this.dadosForm = this.fb.group({
      id: [''],
      razao_social: ['', [Validators.required, Validators.minLength(3)]],
      fantasia: ['', [Validators.required, Validators.minLength(3)]],
      cnpj: ['', [Validators.required, Validators.minLength(18)]],
      email_principal: ['', [Validators.required, Validators.email]],
      rua: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cep: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      cidade: ['', [Validators.required, Validators.minLength(3)]],
      estado: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      url_site: ['', [Validators.required, Validators.minLength(2)]],
      sobre: ['', [Validators.required, Validators.minLength(50)]],
      logo: ['']
    });
  }

  get razao_social(): FormControl {
    return <FormControl>this.dadosForm.get('razao_social');
  }

  get fantasia(): FormControl {
    return <FormControl>this.dadosForm.get('fantasia');
  }

  get cnpj(): FormControl {
    return <FormControl>this.dadosForm.get('cnpj');
  }

  get email_principal(): FormControl {
    return <FormControl>this.dadosForm.get('email_principal');
  }

  get rua(): FormControl {
    return <FormControl>this.dadosForm.get('rua');
  }

  get numero(): FormControl {
    return <FormControl>this.dadosForm.get('numero');
  }

  get complemento(): FormControl {
    return <FormControl>this.dadosForm.get('complemento');
  }

  get bairro(): FormControl {
    return <FormControl>this.dadosForm.get('bairro');
  }

  get cep(): FormControl {
    return <FormControl>this.dadosForm.get('cep');
  }

  get cidade(): FormControl {
    return <FormControl>this.dadosForm.get('cidade');
  }

  get estado(): FormControl {
    return <FormControl>this.dadosForm.get('estado');
  }

  get url_site(): FormControl{
    return <FormControl>this.dadosForm.get('url_site');
  }

  get sobre(): FormControl{
    return <FormControl>this.dadosForm.get('sobre');
  }

  get logo(): FormControl{
    return <FormControl>this.dadosForm.get('logo');
  }

  async onSubmit(): Promise<void> {
    const loading = await this.overlayService.loading({
      message: 'Salvando...'
    });
    try {
      const dados = !this.dadosId
        ? await this.dadosService.create(this.dadosForm.value)
        : await this.dadosService.update({
          id: this.dadosId,
          ...this.dadosForm.value
        });
      this.navCtrl.navigateBack('/admin/dados');
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
    // create a random id
    const randomId = Math.random().toString(36).substring(2);
    // create a reference to the storage bucket location
    this.ref = this.afStorage.ref('/dados/' + randomId);
    // the put method creates an AngularFireUploadTask
    // and kicks off the upload
    this.task = this.ref.put(event.target.files[0]);
    // AngularFireUploadTask provides observable
    // to get uploadProgress value
    /*this.uploadProgress = this.task.snapshotChanges()
      .pipe(map(s => (s.bytesTransferred / s.totalBytes) * 100));
    
    // observe upload progress
    this.uploadProgress = this.task.percentageChanges();
    // get notified when the download URL is available
    */
    this.task.snapshotChanges().pipe(
    finalize(() => {
        this.downloadURL = this.ref.getDownloadURL();
        this.downloadURL.subscribe( url => { 
          this.dadosForm.get('logo').setValue(url)})
        })
    )
    .subscribe();
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
  }
}
