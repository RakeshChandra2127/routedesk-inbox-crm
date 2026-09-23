import { Injectable, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { IMessage, ITicket, IPresencePayload, ITypingPayload, ISLAAlertPayload } from '../models';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: Socket;
  private authService = inject(AuthService);

  connect() {
    const token = this.authService.getToken();
    if (!token) return;
    this.socket = io(environment.wsUrl, { auth: { token } });
  }

  disconnect() {
    if (this.socket) this.socket.disconnect();
  }

  joinTicket(ticketId: string) { this.socket?.emit('ticket:join', { ticketId }); }
  leaveTicket(ticketId: string) { this.socket?.emit('ticket:leave', { ticketId }); }

  emitTypingStart(ticketId: string) { this.socket?.emit('typing:start', { ticketId }); }
  emitTypingStop(ticketId: string) { this.socket?.emit('typing:stop', { ticketId }); }
  emitMessageRead(ticketId: string) { this.socket?.emit('message:read', { ticketId }); }

  onNewMessage(): Observable<IMessage> { return this.onEvent<IMessage>('message:new'); }
  onTicketCreated(): Observable<ITicket> { return this.onEvent<ITicket>('ticket:created'); }
  onTicketUpdated(): Observable<ITicket> { return this.onEvent<ITicket>('ticket:updated'); }
  onPresenceUpdate(): Observable<IPresencePayload> { return this.onEvent<IPresencePayload>('presence:update'); }
  onTypingStart(): Observable<ITypingPayload> { return this.onEvent<ITypingPayload>('typing:start'); }
  onTypingStop(): Observable<ITypingPayload> { return this.onEvent<ITypingPayload>('typing:stop'); }
  onSLAWarning(): Observable<ISLAAlertPayload> { return this.onEvent<ISLAAlertPayload>('sla:warning'); }
  onSLABreached(): Observable<ISLAAlertPayload> { return this.onEvent<ISLAAlertPayload>('sla:breached'); }

  private onEvent<T>(event: string): Observable<T> {
    return new Observable((observer) => {
      this.socket?.on(event, (data: T) => observer.next(data));
      return () => this.socket?.off(event);
    });
  }
}
