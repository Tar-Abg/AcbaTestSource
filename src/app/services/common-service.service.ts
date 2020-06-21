import { map } from 'rxjs/operators';
import { User } from './../components/models/user';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {
  public users = null;
  onUsersChangedSubject: Subject<User> = new Subject();
  onFilterChangedSubject: Subject<any> = new Subject();

  onUsersChanged$(): Observable<any> {
    return this.onUsersChangedSubject.asObservable();
  }
  onFilterChanged$(): Observable<any> {
    return this.onFilterChangedSubject.asObservable();
  }

  changeUsers(users) {
    this.onUsersChangedSubject.next(users);
  }

  changeFilterStatus(status) {
    this.onFilterChangedSubject.next(status);
  }

  filterUsers(name, username) {
    let users = this.users.filter(user =>
      user.name === name && user.username === username
    );
    this.changeUsers(users);
    this.changeFilterStatus(true);
  }

  uptadeUsersOnService(user, action) {
    if (action === "update") {
      this.users = this.users.map(userItem => {
        if (userItem.id === user.id) {
          return userItem = user;
        } else return userItem;
      })
    } else {
      this.users.map(userItem => {
        if (userItem.id === user.id) {
          this.users.splice(this.users.indexOf(userItem), 1);
        }
      })
    }
  }
}
