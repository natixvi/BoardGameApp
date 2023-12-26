import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-account',
  standalone: true,
  imports: [],
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {

  editProfileForm = this.formBuilder.group({
    nickName: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]]
  }, {updateOn: 'submit'})

  changePassForm = this.formBuilder.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmNewPassword:  ['', [Validators.required, Validators.minLength(8)]]
  }, {validators: checkPasswordsValidator({ passwordControlName: 'newPassword',
  confirmPasswordControlName: 'confirmNewPassword' }), updateOn: 'submit'}  as AbstractControlOptions )

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private messageService: MessageService){}
  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(){
    this.userService.getUserInfo().subscribe({
      next: (result) => {
        this.editProfileForm.controls['nickName'].setValue(result.nickName),
        this.editProfileForm.controls['email'].setValue(result.email)
      },
      error: (e) =>{
        if(e instanceof NotFoundError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
          this.router.navigate(['notfound']);
        }
        else{
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Server connection error'})
        }
        
      }
    })
  }

  editProfile(){
    if (this.editProfileForm.invalid){
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Incorrect data!'});
      return;
    }
    const editProfileData = {
      nickName: this.editProfileForm.get('nickName')?.value,
      email: this.editProfileForm.get('email')?.value
    } as EditUserData
    this.userService.editUserData(editProfileData).subscribe({
      next: () =>{
        this.messageService.add({severity: 'success', summary: "Success", detail: "User data has been changed."})
      },
      error: (e) => {
        console.error(e);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User editing failed.' });
      }

    })
  }
  changePassword(){
    if (this.changePassForm.invalid){
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Incorrect data!'});
      return;
    }
    const changePasswordData = {
      oldPassword: this.changePassForm.get('oldPassword')?.value,
      newPassword: this.changePassForm.get('newPassword')?.value,
      confirmNewPassword: this.changePassForm.get('confirmNewPassword')?.value
    } as ChangeUserPasswordData

    this.userService.changeUserPassword(changePasswordData).subscribe({
      next: () =>{
        this.messageService.add({severity: 'success', summary: "Success", detail: "User password has been changed."})
        this.changePassForm.reset();
      },
      error: (e) => {
        console.error(e);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User changing password failed.' });
      }
    });
   
  }
}
