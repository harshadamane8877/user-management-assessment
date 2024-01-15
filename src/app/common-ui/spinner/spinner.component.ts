import { Component, Input } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { COLOR_PALLETE } from 'src/app/interface/common-ui.interface';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  @Input() diameter = 20;
  @Input() mode: ProgressSpinnerMode = 'indeterminate';
  @Input() color: COLOR_PALLETE = COLOR_PALLETE.BASIC;
  @Input() value = 45;
  @Input() strokeWidth: number = 3;
}
