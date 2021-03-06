import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountPanelComponent } from './account-panel/account-panel.component';
import { DefaultPanelComponent } from './default-panel/default-panel.component';
import { ExperimentsPanelComponent } from './experiments-panel/experiments-panel.component';

const routes: Routes = [
  // Custom settings panels
  {
    path: 'account',
    component: AccountPanelComponent
  },
  {
    path: 'experiments',
    component: ExperimentsPanelComponent
  },
  // All other settings panels
  {
    path: ':id',
    component: DefaultPanelComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsPanelsRoutingModule { }
