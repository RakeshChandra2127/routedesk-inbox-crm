import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { TicketService } from '../../services/ticket.service';
import { MessageService } from '../../services/message.service';
import { SocketService } from '../../services/socket.service';
import { ITicket, IMessage } from '../../models';
import { SlaTimerComponent } from '../../shared/components/sla-timer/sla-timer.component';
import { ChannelIconComponent } from '../../shared/components/channel-icon/channel-icon.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatInputModule, MatChipsModule, SlaTimerComponent, ChannelIconComponent],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  private ticketService = inject(TicketService);
  private messageService = inject(MessageService);
  private socketService = inject(SocketService);

  tickets: ITicket[] = [];
  filteredTickets: ITicket[] = [];
  messages: IMessage[] = [];
  selectedTicket: ITicket | null = null;
  
  searchQuery = '';
  newMessage = '';
  isContactTyping = false;
  typingTimeout: any;

  constructor() {
    this.socketService.onNewMessage().pipe(takeUntilDestroyed()).subscribe(msg => {
      if (this.selectedTicket && msg.ticketId === this.selectedTicket.id) {
        this.messages.push(msg);
        setTimeout(() => this.scrollToBottom(), 100);
      }
      const t = this.tickets.find(x => x.id === msg.ticketId);
      if (t) {
        t.lastMessagePreview = msg.content;
        if (!this.selectedTicket || this.selectedTicket.id !== msg.ticketId) t.unreadCount++;
      }
    });

    this.socketService.onTicketCreated().pipe(takeUntilDestroyed()).subscribe(t => {
      this.tickets.unshift(t);
      this.applyFilters();
    });

    this.socketService.onTypingStart().pipe(takeUntilDestroyed()).subscribe(payload => {
      if (this.selectedTicket?.id === payload.ticketId) this.isContactTyping = true;
    });

    this.socketService.onTypingStop().pipe(takeUntilDestroyed()).subscribe(payload => {
      if (this.selectedTicket?.id === payload.ticketId) this.isContactTyping = false;
    });
  }

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    // Mock data for immediate visual rendering if API is not fully up
    this.tickets = [
      { id: '1', contactId: 'c1', contactName: 'Alice Smith', channel: 'whatsapp', subject: 'Login issue', status: 'open', priority: 'high', lastMessagePreview: 'I cannot login to my account.', unreadCount: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), firstResponseDue: new Date(Date.now() + 600000).toISOString(), slaStatus: 'ok' },
      { id: '2', contactId: 'c2', contactName: 'Bob Johnson', channel: 'email', subject: 'Billing question', status: 'open', priority: 'medium', lastMessagePreview: 'Can you send the invoice?', unreadCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), firstResponseDue: new Date(Date.now() + 120000).toISOString(), slaStatus: 'warning' }
    ];
    this.applyFilters();
  }

  applyFilters() {
    this.filteredTickets = this.tickets.filter(t => t.contactName.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  selectTicket(ticket: ITicket) {
    if (this.selectedTicket) this.socketService.leaveTicket(this.selectedTicket.id);
    this.selectedTicket = ticket;
    ticket.unreadCount = 0;
    this.socketService.joinTicket(ticket.id);
    
    // Mock messages
    this.messages = [
      { id: 'm1', ticketId: ticket.id, senderId: 'c1', senderType: 'contact', content: ticket.lastMessagePreview, createdAt: new Date().toISOString(), deliveryStatus: 'read' }
    ];
    setTimeout(() => this.scrollToBottom(), 100);
  }

  onType() {
    if (this.selectedTicket) {
      this.socketService.emitTypingStart(this.selectedTicket.id);
      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(() => {
        if (this.selectedTicket) this.socketService.emitTypingStop(this.selectedTicket.id);
      }, 2000);
    }
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedTicket) return;
    const msg: IMessage = {
      id: Math.random().toString(),
      ticketId: this.selectedTicket.id,
      senderId: 'agent1',
      senderType: 'agent',
      content: this.newMessage,
      createdAt: new Date().toISOString(),
      deliveryStatus: 'sent'
    };
    this.messages.push(msg);
    this.newMessage = '';
    setTimeout(() => this.scrollToBottom(), 100);
  }

  scrollToBottom() {
    const el = document.getElementById('message-area');
    if (el) el.scrollTop = el.scrollHeight;
  }
}
