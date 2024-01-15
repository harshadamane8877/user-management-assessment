import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [ButtonComponent, SpinnerComponent],
  imports: [CommonModule, AngularMaterialModule],
  exports: [ButtonComponent],
})
export class CommonUiModule {}
