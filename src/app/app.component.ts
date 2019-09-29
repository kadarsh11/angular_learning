import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
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
  // steps = []


  t: StepType[] = []
  model = {};


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
        //   validators: {
        //     email: ctrl => ctrl.value && ctrl.value
        // }
        },
        {
          key: `Contact`,
          type: 'input',
          templateOptions: {
            label: 'Contact Number',
            placeholder: 'Enter email',
            required: true,
          }
        },
        {
          key: `company`,
          type: 'input',
          templateOptions: {
            label: 'Company Name ',
            placeholder: 'Company Name ',
            required: true,
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
    // if (this.model[this.activedStep] == null) {
    //   alert("Phoolan kah rahi hai data daal")
    // }
    // else {
    // }
    this.activedStep = step + 1;
    stepper.next();
  }

  submit() {
   
    //     let payload;
    console.log(JSON.stringify(this.model));
          let answered = [];
          for (let i = 0; i < this.questions.length; i++) {
            let qa = { ...this.questions[i], answer: this.model[`${i}`] }
            answered.push(qa)
          }
          console.log("------ANSWER ARRAY ----------", answered)
          this.qs.submit(answered);
      }
      }
      
