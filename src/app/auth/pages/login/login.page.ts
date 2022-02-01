import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { AuthService } from 'src/app/core/services/auth.service';
import { AuthProvider } from 'src/app/core/services/auth.types';
import { OverlayService } from 'src/app/core/services/overlay.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  authForm: FormGroup;
  authProviders = AuthProvider;
  configs = {
    isSignIn: true,
    action: 'Entrar',
    actionChange: 'Criar uma conta'
  };

  private nameControl = new FormControl('', [Validators.required, Validators.minLength(3)]);

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private overlayService: OverlayService
  ) {}

  //chamado assim que a instancia do login page for criada
  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.authForm = this.fb.group({
      //Validator fara a validacao conforme indicação, neste caso required por ser obrigatorio e email pelo tipo do campo
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email(): FormControl {
    return <FormControl>this.authForm.get('email');
  }

  get password(): FormControl {
    return <FormControl>this.authForm.get('password');
  }

  get name(): FormControl {
    return <FormControl>this.authForm.get('name');
  }

  changeAuthAction(): void {
    this.configs.isSignIn = !this.configs.isSignIn;
    const { isSignIn } = this.configs;
    this.configs.action = isSignIn ? 'Entrar' : 'Criar uma conta';
    this.configs.actionChange = isSignIn ? 'Criar uma conta' : 'Já tenho uma conta';
    !isSignIn ? this.authForm.addControl('name', this.nameControl) : this.authForm.removeControl('name');
  }

  async onSubmit(provider: AuthProvider): Promise<void> {
    const loading = await this.overlayService.loading();
    try {
      const credentials = await this.authService.authenticate({
        isSignIn: this.configs.isSignIn,
        user: this.authForm.value,
        provider
      });
      this.navCtrl.navigateForward(this.route.snapshot.queryParamMap.get('redirect') || '/admin/dados');
    } catch (e) {
      if (e.code = "auth/wrong-password") {
        console.log('Erro de autenticação: password ', e);
      await this.overlayService.alert({
        header: 'Atenção!',
        message: 'Senha incorreta',
        buttons: ['Ok']
      });
    }
      else if (e.code = "auth / user - not - found"){
        console.log('Erro de autenticação: user ', e);
        await this.overlayService.alert({
          header: 'Atenção!',
          message: 'Usuário incorreto',
          buttons: ['Ok']
        });
    }
    else{
        await this.overlayService.alert({
          header: 'Atenção!',
          message: e.message,
          buttons: ['Ok']
        });
    }
    } finally {
      loading.dismiss();
    }
  }
}
