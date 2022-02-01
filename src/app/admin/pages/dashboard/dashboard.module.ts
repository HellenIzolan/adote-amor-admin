import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from '../../components/components.module';
import { BrMaskerModule } from 'br-mask';

import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';

@NgModule({
  imports: [SharedModule, ComponentsModule, BrMaskerModule, DashboardPageRoutingModule],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
