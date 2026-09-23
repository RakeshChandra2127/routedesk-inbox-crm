import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-channel-icon',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <mat-icon [style.color]="getColor()">
      @switch(channel) {
        @case('whatsapp') { chat }
        @case('email') { email }
        @case('web') { public }
        @default { chat }
      }
    </mat-icon>
  `
})
export class ChannelIconComponent {
  @Input() channel!: string;
  getColor() {
    if (this.channel === 'whatsapp') return '#25D366';
    if (this.channel === 'email') return '#3b82f6';
    if (this.channel === 'web') return '#8b5cf6';
    return '#94a3b8';
  }
}
