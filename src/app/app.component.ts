import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormControl, ValidationErrors } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { QUESTIONS } from '../mock-question';
import { QuestionService} from './question.service';
// import {Contact} from './models/contact.model';
import { from } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
export interface StepType {
  label: string;
  fields: FormlyFieldConfig[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {


  title = 'multistep-form';
  index: number = 1;
  labelPosition = ""
  questions = QUESTIONS;
  activedStep = 0;
  fields = []
  t: StepType[] = []
  model = {};
  regExEmailValid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  steps: StepType[] = [];

  regform :  FormGroup;
//   contactModel:Contact
// formFields:Array<FormlyFieldConfig>

constructor(private qs:QuestionService){
   this.regform=new FormGroup({})
//  this.contactModel=new Contact();

}
  ngOnInit(): void {
    let newForm: StepType[] = []
    this.questions.forEach((question, index) => {
      let formField = this.createFormField(question, index)
      if (formField != null) {
        newForm.push(formField)
      }
    });
    newForm.push(this.lastStepForm())
    this.steps = newForm
    console.log(this.steps)
  }

  createFormField(question, key): StepType {
    let form: StepType;
    let formField: FormlyFieldConfig;
    switch (question.type) {
      case "radio":
        formField = {
          key: `${key}`,
          type: 'radio',
          templateOptions: {
            label: question.question,
            required: true,
            options: question.options.map((option) => {
              let keyValuePair = {
                key: option,
                value: option
              }
              return keyValuePair;
            })
          }
        }
        form = {
          label: '',
          fields: [formField]
        }
        break;
      case "input":
        form = {
          label: '',
          fields: [
            {
              key: `${key}`,
              type: 'input',
              templateOptions: {
                label: 'Any technology preference?',
                placeholder: 'java script/flatter/Angular/java ',
                required: true,
              }
            }
          ]
        }
        break;
      default: form = null
        break;
    }
    return form
  }

  lastStepForm(): StepType {
    let form: StepType;
    let formField: FormlyFieldConfig;
    form = {
      label: '',
      fields: [
        {
          key: `email`,
          type: 'input',
          templateOptions: {
            label: 'Email address',
            placeholder: 'Enter email',
            required: true,
          },
          validators: {
            email: {
              expression: (email) => {
                if (email.value != null && typeof email.value == "string") {
                  return this.regExEmailValid.test(String(email.value).toLowerCase())
                } else {
                  return false
                }
              },
              message: (error, field: FormlyFieldConfig) => `"${field.formControl.value}" is not a valid Email Address`,
            },
          }
        },
        {
          key: `contact_number`,
          type: 'input',
          templateOptions: {
            type: 'number',
            label: 'Contact Number',
            placeholder: 'Enter Contact Number',
            required: true,
            minLength: 10,
            maxLength: 10
          }
        },
        {
          key: `company_name`,
          type: 'input',
          templateOptions: {
            label: 'Company Name',
            placeholder: 'Enter Company name',
            required: true,
          },
          validators: {
            company_name: {
              expression: (company_name) => {
                if (company_name.value != null && typeof company_name.value == "string") {
                  return company_name.value.length > 0
                } else {
                  return false
                }
              },
              message: (error, field: FormlyFieldConfig) => `Please Enter Company Name`,
            },
          }
        }
      ]
    }
    return form;
  }


  form = new FormArray(this.steps.map(() => new FormGroup({})));
  options = this.steps.map(() => <FormlyFormOptions>{});

  prevStep(step) {
    this.activedStep = step - 1;
  }

  nextStep(step, stepper) {
    if (this.model[this.activedStep] == null) {
      alert("Please enter the data")
    }
    else {
      this.activedStep = step + 1;
      stepper.next();
    }
  }

  submit() {
    let isEmailValid = this.regExEmailValid.test(String(this.model['email']).toLowerCase())
    if (this.model['company_name'] && this.model['contact_number'] && isEmailValid) {
      this.submitForm();
    } else {
      console.log("EVERTHING IS NOT VALID")
    }
  }

  submitForm() {
    let answered = []
    for (let i = 0; i < this.questions.length; i++) {
      let qa = { ...this.questions[i], answer: this.model[`${i}`] }
      answered.push(qa)
    }
    let details={
      "email":this.model['email'],
      "company_name":this.model['company_name'],
      "contact_number":this.model['contact_number']
    }
    this.qs.submit(answered,details);
  }
}
