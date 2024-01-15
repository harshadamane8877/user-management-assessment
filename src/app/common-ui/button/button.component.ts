import { Component, EventEmitter, Input, Output } from '@angular/core';
import { COLOR_PALLETE } from 'src/app/interface/common-ui.interface';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() title: string;
  @Input() disabled: boolean = false;
  @Input() spinner: boolean = false;
  @Input() debounceTime: number = 500;
  @Input() color: COLOR_PALLETE = COLOR_PALLETE.PRIMARY;
  @Output() onClick: EventEmitter<void> = new EventEmitter();
  SPINNER_COLOR = COLOR_PALLETE.BASIC;

  onButtonClicked($event: Event) {
    $event.preventDefault();
    if (!this.disabled) {
      this.onClick.emit();
    }
  }
}
