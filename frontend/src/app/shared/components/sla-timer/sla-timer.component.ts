import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-sla-timer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sla-badge" [ngClass]="statusClass">
      <span class="material-icons" style="font-size: 14px;">timer</span>
      <span *ngIf="remaining > 0">{{ formatTime(remaining) }}</span>
      <span *ngIf="remaining <= 0">BREACHED</span>
    </div>
  `,
  styles: [`
    .sla-badge { display: flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    .status-ok { background: rgba(16, 185, 129, 0.2); color: #10b981; }
    .status-warning { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
    .status-breached { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
  `]
})
export class SlaTimerComponent implements OnInit, OnDestroy {
  @Input() dueDate!: string;
  remaining: number = 0;
  statusClass: string = 'status-ok';
  private sub!: Subscription;

  ngOnInit() {
    this.updateTime();
    this.sub = interval(1000).subscribe(() => this.updateTime());
  }

  ngOnDestroy() { if (this.sub) this.sub.unsubscribe(); }

  updateTime() {
    const diff = new Date(this.dueDate).getTime() - new Date().getTime();
    this.remaining = Math.max(0, Math.floor(diff / 1000));
    if (this.remaining > 300) this.statusClass = 'status-ok';
    else if (this.remaining > 0) this.statusClass = 'status-warning';
    else this.statusClass = 'status-breached';
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}
