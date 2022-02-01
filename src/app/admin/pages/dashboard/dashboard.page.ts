import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { OverlayService } from 'src/app/core/services/overlay.service';
import { Dados } from '../../models/dados.model';
import { DadosService } from '../../services/dados.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage {
  dados$: any;

  constructor(
    private navCtrl: NavController,
    private overlayService: OverlayService,
    private dadosService: DadosService
  ) { }

  async ionViewDidEnter(): Promise<void> {
    const loading = await this.overlayService.loading();
    this.dados$ = this.dadosService.getAll();
    this.dados$.pipe(take(1)).subscribe(dados => loading.dismiss());
  }

  onUpdate(dados: Dados): void {
    //this.navCtrl.navigateBack(`/admin/dados/edit/${dado.id}`);
    this.navCtrl.navigateBack(['admin', 'dados', 'edit', dados.id]);
  }
}
