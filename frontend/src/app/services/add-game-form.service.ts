import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddGameFormService {

  private isOpen = false;
  private selectedGameId: number | null = null;
  private selectedGameName: string | null = null;
  private gameAddedSubject = new Subject<void>();

  openForm(gameId: number | null, gameName: string): void {
    this.isOpen = true;
    this.selectedGameId = gameId;
    this.selectedGameName = gameName;
  }

  closeForm(): void {
    this.isOpen = false;
    this.selectedGameId = null;
    this.selectedGameName = null;
  }

  getIsOpen(): boolean {
    return this.isOpen;
  }

  getSelectedGameId(): number | null {
    return this.selectedGameId;
  }

  getSelectedGameName(): string | null {
    return this.selectedGameName;
  }

  gameAdded(): void {
    this.gameAddedSubject.next();
  }
  
  getGameAddedObservable(): Observable<void> {
    return this.gameAddedSubject.asObservable();
  }
}
