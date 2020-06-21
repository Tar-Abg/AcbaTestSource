import { map } from 'rxjs/operators';
import { User } from './../models/user';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpServiceService } from '../../services/http-service.service';
import { CommonServiceService } from '../../services/common-service.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  private onUsersChangedSubject: Subscription;
  private onFilterChangedSubject: Subscription;
  public users;
  public filtred: boolean;
  public touchedUserId: number;
  public allPendings = [];
  public errorMessage: boolean;
  public deleteSubmited: boolean;
  public checkedUser: boolean;

  constructor(private httpService: HttpServiceService, private commonservice: CommonServiceService, private router: Router) { }

  ngOnInit() {
    this.httpService.getAllUsers().subscribe(users => {
      this.commonservice.users = JSON.parse(JSON.stringify(users));
      this.users = users;
      this.users = this.users.map(user => {
        user.isChecked = false;
        return user;
      },
        (err) => console.log(err));
    })
    this.onUsersChangedSubject = this.commonservice.onUsersChanged$().subscribe(users => {
      this.users = users;
    })
    this.onFilterChangedSubject = this.commonservice.onFilterChanged$().subscribe(status => {
      this.filtred = status;
    })
  }

  saveUser(user: User) {
    if (this.checkInputs(user)) {
      if (user.id) {
        this.pushToPendingList(user.id);
        this.httpService.changeUser(user.id, user).subscribe(data => {
          this.touchedUserId = null;
          this.popFromPendingList(user.id);
          this.commonservice.uptadeUsersOnService(user, "update");
        },
          (err) => console.log(err));
      } else {
        this.pushToPendingList(user.id);
        this.httpService.postUser(user).subscribe(data => {
          this.users[this.users.indexOf(user)].id = data['id'];
          this.popFromPendingList(user.id);
          this.commonservice.users.unshift(data);
        },
          (err) => console.log(err)
        );
      }
    }
  }

  deleteUser(user: User) {
    this.pushToPendingList(user.id);
    this.httpService.deleteUser(user.id).subscribe(data => {
      this.users.splice(this.users.indexOf(user), 1);
      this.commonservice.uptadeUsersOnService(user, "delete");
      this.popFromPendingList(user.id);
    }, (err) => console.log(err)
    );
  }

  addUser() {
    let newUser: User = new User();
    this.users.unshift(newUser);
    this.touchedUserId = null;
  }

  pushToPendingList(id) {
    if (!this.allPendings.includes(id)) {
      this.allPendings.push(id);
    }
  }

  popFromPendingList(id) {
    this.allPendings.splice(this.allPendings.indexOf(this.allPendings[id]), 1);
  }

  checkInputs(user: User) {
    if (user.name && user.username && user.phone && user.email && user.address.city) {
      return true;
    } else {
      return false;
    }
  }

  navigateToUser(id) {
    this.router.navigate([`user/${id}`]);
  }

  deleteCheckedUsers() {
    const checkedUsersIds = this.checkIfUserchecked();
    if (checkedUsersIds.length) {
      this.deleteSubmited = true;
      this.httpService.deleteUsers(checkedUsersIds).subscribe(value => {
        console.log(value)
      },
        err => {
          console.log(err)
        },
        () => {
          this.deleteUsersFromLocal(checkedUsersIds);
          this.deleteSubmited = false;
          this.checkedUser = false;
        })
    }
  }

  deleteUsersFromLocal(checkedUsersIds) {
    this.users = this.users.filter(user => {
      if (!checkedUsersIds.includes(user.id)) {
        return user;
      }
    });
    this.commonservice.users = this.commonservice.users.filter(user => {
      if (!checkedUsersIds.includes(user.id)) {
        return user;
      }
    });
  }

  checkIfUserchecked() {
    let checkedUsersIds = [];
    this.users.map(user => {
      if (user.isChecked) {
        checkedUsersIds.push(user.id);
      }
    });
    return checkedUsersIds;
  }

  markChecked(user: User, event) {
    this.users[this.users.indexOf(user)].isChecked = event.target.checked;
    let checkedUser = this.users.find(curentUser => curentUser.isChecked === true);
    if (checkedUser) {
      this.checkedUser = true;
    } else {
      this.checkedUser = false;
    }
  }

  cancelFilter() {
    this.users = JSON.parse(JSON.stringify(this.commonservice.users));
    this.commonservice.changeFilterStatus(false);
  }

  markAsTuched(user: User) {
    this.touchedUserId = user.id;
  }

  ngOnDestroy() {
    this.onUsersChangedSubject.unsubscribe();
    this.onFilterChangedSubject.unsubscribe();
  }
}
