import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { RjhxaFormService } from 'src/app/services/rjhxa-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditYears: number[] = [];
  creditMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder, private rjhxaFormService: RjhxaFormService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // Months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("Start Month: " + startMonth);

    this.rjhxaFormService.getCreditMonths(startMonth).subscribe(
      data => {
        console.log("Credit Card Months: " + JSON.stringify(data));
        this.creditMonths = data;
      }
    );

    // Years
    this.rjhxaFormService.getCreditYears().subscribe(
      data => {
        console.log("Credit Card Years: " + JSON.stringify(data));
        this.creditYears = data;
      }
    );

    // Populate Countries
    this.rjhxaFormService.getCountries().subscribe(
      data => {
        console.log("Countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  onSubmit() {
    console.log("Handling the submit button");

    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup.get('customer').value);

    console.log(this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log(this.checkoutFormGroup.get('shippingAddress').value.state.name);
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.firstLast'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  copyAddress(event) {

    if(event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
              .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      // Bug fix
      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // Bug fix
      this.billingAddressStates = [];
    }
  }

  handleYearsAndMonths() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;

    if(currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.rjhxaFormService.getCreditMonths(startMonth).subscribe(
      data => {
        console.log("Credit Card Months: " + JSON.stringify(data));
        this.creditMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.rjhxaFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        formGroup.get('state').setValue(data[0]);
      }
    );

  }
}