import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'order-form',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderFormComponent {
  orderForm: FormGroup;
  orderSubmitted = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.orderForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[^\.]*$/)]],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]]
    });
  }

  get name() { return this.orderForm.get('name'); }
  get address() { return this.orderForm.get('address'); }
  get phone() { return this.orderForm.get('phone'); }

  onSubmit() {
    //  this.orderSubmitted = true;
    if (this.orderForm.invalid) {
      this.markFormGroupTouched(this.orderForm);
      return;
    }

    // https://reqres.in/api/users 

    this.http.post('https://httpbin.org/post', this.orderForm.value).subscribe(response => {
      console.log(response);
      this.orderSubmitted = true;
      this.orderForm.reset();
    });

    // this.http.post('https://reqres.in/api/users', this.orderForm.value).subscribe(response => {
    //   console.log(response);
    //   this.orderSubmitted = true;
    //   this.orderForm.reset();
    // });
    //  this.orderForm.reset();
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onNameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\./g, '');
    this.orderForm.get('name')?.setValue(input.value, { emitEvent: false });
  }

  closePopup() {
    this.orderSubmitted = false;
  }
}