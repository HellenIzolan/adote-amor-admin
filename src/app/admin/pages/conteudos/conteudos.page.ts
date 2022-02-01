import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { OverlayService } from 'src/app/core/services/overlay.service';
import { Conteudo } from '../../models/conteudo.model';
import { ConteudosService } from '../../services/conteudos.service';

@Component({
  selector: 'app-conteudos',
  templateUrl: './conteudos.page.html',
  styleUrls: ['./conteudos.page.scss']
})
export class ConteudosPage {
  conteudos$: Observable<Conteudo[]>;

  constructor(
    private navCtrl: NavController,
    private overlayService: OverlayService,
    private conteudosService: ConteudosService
  ) {}

  async ionViewDidEnter(): Promise<void> {
    const loading = await this.overlayService.loading();
    this.conteudos$ = this.conteudosService.getAll();
    this.conteudos$.pipe(take(1)).subscribe(conteudos => loading.dismiss());
  }

  onUpdate(conteudo: Conteudo): void {
    this.navCtrl.navigateBack(['admin', 'conteudos', 'edit', conteudo.id]);
  }

  async onDelete(conteudo: Conteudo): Promise<void> {
    await this.overlayService.alert({
      header: 'Atenção!',
      message: `Excluir conteúdo "${conteudo.titulo}"?`,
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            await this.conteudosService.delete(conteudo);
            await this.overlayService.alert({
              message: `Conteúdo "${conteudo.titulo}" deletado!`,
              buttons: ['Ok']
            });
          }
        },
        'Não'
      ]
    });
  }
}
