import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpServiceService } from '../../services/http-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../models/user'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public pending: boolean;
  private userId: number;
  public errMessage: string;
  userForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    website: new FormControl('', [Validators.required]),
    address: new FormGroup({
      street: new FormControl('', [Validators.required]),
      suite: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      zipcode: new FormControl('', [Validators.required]),
    }),
    company: new FormGroup({
      compName: new FormControl('', [Validators.required]),
      catchPhrase: new FormControl('', [Validators.required]),
    }),
  });

  constructor(private activeRoute: ActivatedRoute, private httpService: HttpServiceService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      this.userId = params.id;
      this.httpService.getUserByid(params.id).subscribe(user => {
        this.setFormValues(user);
        if(this.errMessage) {
          this.errMessage = '';
        }
      },
        (err) => {
          this.errMessage = err.message;
        })
    }
    );
  }
  onSubmit() {
    if (this.userForm.valid || this.userForm.pristine) {
      this.pending = true;
      this.httpService.changeUser(this.userId, this.userForm.value).subscribe(data => {
        this.pending = false;
      },
        (err) => console.log(err))
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  setFormValues(user: User) {
    this.userForm.controls.name.setValue(user['name']);
    this.userForm.controls.username.setValue(user['username']);
    this.userForm.controls.phone.setValue(user['phone']);
    this.userForm.controls.email.setValue(user['email']);
    this.userForm.controls.website.setValue(user['website']);
    this.userForm.get(['address', 'city']).setValue(user['address'].city);
    this.userForm.get(['address', 'street']).setValue(user['address'].street);
    this.userForm.get(['address', 'zipcode']).setValue(user['address'].zipcode);
    this.userForm.get(['address', 'suite']).setValue(user['address'].suite);
    this.userForm.get(['company', 'compName']).setValue(user['company'].name);
    this.userForm.get(['company', 'catchPhrase']).setValue(user['company'].catchPhrase);
  }
}
