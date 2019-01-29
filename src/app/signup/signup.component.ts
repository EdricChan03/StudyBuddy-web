import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styles: []
})
export class SignupComponent implements OnInit {

  constructor(
    private shared: SharedService,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    shared.title = 'Login';
    this.loginForm = fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required]
    });
    this.signUpForm = fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required],
      'confirmPassword': ['', Validators.required]
    }, { validator: this.matchingPasswords('password', 'confirmPassword') });
  }
  loginForm: FormGroup;
  signUpForm: FormGroup;
  showLoginFormPassword = false;
  showSignUpFormPassword = false;
  showSignUpFormConfirmPassword = false;
  // See https://stackoverflow.com/a/34582914
  matchingPasswords = (passwordKey: string, confirmPasswordKey: string) => {
    return (group: FormGroup): void => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ 'mismatchedPasswords': true });
      }
    };
  }
  ngOnInit() {
    this.auth.getAuthState().subscribe(result => {
      if (result && JSON.parse(localStorage.getItem('loggedIn'))) {
        console.log('User is already logged in. Redirecting...');
        const snackBarRef = this.shared.openSnackBar(
          {
            msg: 'You\'re already logged in! Redirecting in 2 seconds...',
            action: 'Log out',
            additionalOpts:
            {
              duration: 5000
            }
          }
        );
        snackBarRef.onAction().subscribe(() => {
          this.auth.logOut().then(() => {
            this.shared.openSnackBar({
              msg: 'Successfully logged out'
            });
            this.router.navigate(['/login']);
            localStorage.setItem('loggedIn', 'false');
          });
        });
        setTimeout(() => {
          this.router.navigate(['dashboard']);
        }, 2000);
      }
    });
  }
  toggleLoginFormPassword() {
    this.showLoginFormPassword = !this.showLoginFormPassword;
  }
  toggleSignUpFormPassword() {
    this.showSignUpFormPassword = !this.showSignUpFormPassword;
  }
  toggleSignUpFormConfirmPassword() {
    this.showSignUpFormConfirmPassword = !this.showSignUpFormConfirmPassword;
  }
  signUpWithGoogle() {
    this.auth.logInWithGoogle().then((result) => {
      this.shared.openSnackBar({ msg: `Signed in as ${result.user.email}` });
      localStorage.setItem('loggedIn', 'true');
    }).catch((error) => {
      this.handleError(error.message);
    });
  }
  loginWithEmailAndPassword() {
    this.auth.logInWithEmailAndPassword(this.loginForm.get('email').value, this.loginForm.get('password').value).then((result) => {
      this.shared.openSnackBar({ msg: `Signed in as ${result.user.email}` });
    }).catch((error) => {
      this.handleError(error.message);
    });
  }
  signUpWithEmailAndPassword() {
    this.auth.signUpWithEmailAndPassword(this.signUpForm.get('email').value, this.loginForm.get('password').value).then((result) => {
      this.shared.openSnackBar({ msg: `Successfully created account as ${result.user.email}` });
    }).catch((error) => {
      this.handleError(error.message);
    });
  }
  private handleError(errorMsg: string) {
    this.shared.openSnackBar({ msg: `Error: ${errorMsg}` });
  }

}