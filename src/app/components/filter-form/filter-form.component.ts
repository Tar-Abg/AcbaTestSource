import { CommonServiceService } from './../../services/common-service.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.css']
})
export class FilterFormComponent implements OnInit, OnDestroy {
  onFilterChangedSubject: Subscription;
  filterForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(6)]),
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  constructor(private comanService: CommonServiceService) { }

  ngOnInit() {
    this.onFilterChangedSubject = this.comanService.onFilterChanged$().subscribe(status => {
      if (!status) {
        this.filterForm.reset();
      }
    })
  }

  onSubmit() {
    if (this.filterForm.valid) {
      let name = this.filterForm.controls.name.value;
      let username = this.filterForm.controls.username.value;
      this.comanService.filterUsers(name, username);
    } else {
      this.filterForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.onFilterChangedSubject.unsubscribe();
  }
}
