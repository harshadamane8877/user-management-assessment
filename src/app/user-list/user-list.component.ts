import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { COLOR_PALLETE } from '../interface/common-ui.interface';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, distinctUntilChanged, filter } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { TableActions, UserInfo } from '../interface/userlist';
import { UserListAction, UserListState } from '../store';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  @Select(UserListState.getUserList) userList$: Observable<UserInfo[]>;

  userDetailsForm: FormGroup;
  subs = new Subscription();
  BUTTON_COLOR = COLOR_PALLETE;
  userList: UserInfo[] = [];
  tableAction: Record<number, TableActions> = {};
  private TIME_OUT = 1500;

  constructor(private fb: FormBuilder, private store: Store) {}

  get userFormData() {
    return this.userDetailsForm.controls['userList'];
  }

  ngOnInit(): void {
    this.store.dispatch(new UserListAction.fetchUserList());

    this.subs.add(
      this.userList$
        .pipe(
          filter((userList) => !!userList.length),
          distinctUntilChanged()
        )
        .subscribe((userList) => {
          this.userList = userList;
          this.userDetailsForm = this.fb.group({
            userList: this.fb.array([]),
          });
          const userFormArray = new FormArray([]);
          userList.forEach((user) => {
            userFormArray.push(this.createUser(user));
          });

          this.userDetailsForm.setControl('userList', userFormArray);
          console.log(
            'New/Updated user entries:',
            this.userDetailsForm.controls['userList']
          );
        })
    );
  }

  saveUserInfo(index: number) {
    const userControl =
      this.userDetailsForm.controls['userList']['controls'][index];

    if (userControl.status === 'VALID') {
      const userId = this.userList[index].id;
      const updateUserInfo = userControl.value;

      this.tableAction[userId].save = true;
      console.log('save user', userControl);
      setTimeout(() => {
        this.subs.add(
          this.store
            .dispatch(
              new UserListAction.UpdateUserDetails({
                ...updateUserInfo,
                id: userId,
              })
            )
            .subscribe(() => {
              this.tableAction[userId].save = false;
              console.log('updated user');
            })
        );
      }, this.TIME_OUT);
    }
  }

  deleteUser(index: number) {
    const userId = this.userList[index].id;
    this.tableAction[userId].delete = true;

    setTimeout(() => {
      this.subs.add(
        this.store
          .dispatch(new UserListAction.DeleteUserDetails(userId))
          .subscribe(() => {
            delete this.tableAction[userId];
            console.log('deleted user');
          })
      );
    }, this.TIME_OUT);
  }

  createUser(user: UserInfo): FormGroup {
    return this.fb.group({
      firstName: [user.firstName, Validators.required],
      email: [
        user.email,
        [Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')],
      ],
      phone: [user.phone, [Validators.required]],
      birthDate: [
        user.birthDate,
        [
          Validators.pattern(
            /^(?:19|20)\d\d-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/
          ),
        ],
      ],
      university: [user.university, Validators.required],
      gender: [user.gender, Validators.required],
    });
  }

  toggleExpansionPanel(index: number) {
    const userId = this.userList[index].id;

    if (this.tableAction[userId]) {
      const updatedValues = {
        firstName: this.userList[index].firstName,
        email: this.userList[index].email,
        phone: this.userList[index].phone,
        birthDate: this.userList[index].birthDate,
        university: this.userList[index].university,
        gender: this.userList[index].gender,
      };
      (this.userDetailsForm.get('userList') as FormArray)
        .at(index)
        .patchValue(updatedValues);
      delete this.tableAction[userId];
    } else {
      this.tableAction[userId] = {
        save: false,
        delete: false,
        expanded: true,
      };
    }

    console.log('Table Action:', this.tableAction);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
