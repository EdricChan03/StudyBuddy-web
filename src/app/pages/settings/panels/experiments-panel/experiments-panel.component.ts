import { Component } from '@angular/core';
import { AngularFireRemoteConfig } from '@angular/fire/remote-config';
// import { FormGroup } from '@angular/forms';
import { MatPseudoCheckboxState } from '@angular/material/core';
// import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Experiment } from '../../../../core/experiments/models/experiment';
// import { SharedService } from '../../../../shared.service';
import { SettingsPanelsService } from '../../settings-panels.service';
import { SettingsStorageService } from '../../settings-storage.service';

@Component({
  selector: 'app-experiments-panel',
  templateUrl: './experiments-panel.component.html'
})
export class ExperimentsPanelComponent {
  /* experimentsFormlyConfig: {
    form: FormGroup,
    model: any,
    fields: FormlyFieldConfig[],
    options: FormlyFormOptions
  } = {
      form: new FormGroup({}),
      model: {},
      fields: [],
      options: {}
    }; */

  experiments: Experiment[] = [];
  experimentVals: {[key: string]: boolean | string | number } = {};
  constructor(
    panelsService: SettingsPanelsService,
    settingsStorage: SettingsStorageService,
    remoteConfig: AngularFireRemoteConfig
    // public shared: SharedService
  ) {
    panelsService.getSettingPanelById('experiments').actions = [
      {
        title: 'Reset',
        color: 'warn',
        onClickListener: () => {
          this.experimentVals = {};
          console.log('Reset was clicked!');
        }
      },
      {
        title: 'Save',
        color: 'primary',
        onClickListener: () => {
          console.log('Experiment values:', this.experimentVals);
          settingsStorage.setSetting('experimentSettings', JSON.stringify(this.experimentVals));
          console.log('Save was clicked!');
        }
      }
    ];

    remoteConfig.getString('available_experiments').then(value => {
      console.log('Currently available experiments:', JSON.parse(value));

      const parsedVal = JSON.parse(value) as Experiment[];
      this.experiments = parsedVal;
      const keys = parsedVal.map(experiment => experiment.key);
      keys.forEach(key => {
        let defaultValue = null;
        const experiment = parsedVal.find(exp => exp.key === key);
        if ('defaultValue' in experiment) {
          defaultValue = experiment.defaultValue;
        }
        this.experimentVals[key] = defaultValue;
      });

      this.experimentVals = settingsStorage.getSetting<{ [key: string]: boolean | string | number }>('experimentSettings', {});
    });

  }

  getCheckboxState(boolVal: any): MatPseudoCheckboxState {
    return (typeof boolVal === 'boolean' && boolVal) ? 'checked' : 'unchecked';
  }
}
