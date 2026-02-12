import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  pinVisible = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), this.pinNumericValidator]],
    });
  }

  private pinNumericValidator(control: AbstractControl): ValidationErrors | null {
    const v = control.value;
    if (v == null || v === '') return null;
    return /^\d{4}$/.test(String(v).trim()) ? null : { pinFormat: true };
  }

  get email() {
    return this.loginForm.get('email');
  }
  get pin() {
    return this.loginForm.get('pin');
  }

  onPinInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 4);
    this.loginForm.patchValue({ pin: digits }, { emitEvent: true });
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;
    this.router.navigate(['/dashboard']);
  }
}
