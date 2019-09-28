import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { QUESTIONS } from '../mock-question';

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
  date = 'Adarsh';
  index: number = 1;
  labelPosition = ""
  questions = QUESTIONS;
  activedStep = 0;
  fields = []
  // steps = []


  t: StepType[] = []
  model = {};

  // I don't know why but if i start this stps vaiable from empty then it does not render anything
  steps: StepType[] = [
    {
      label: 'Personal data',
      fields: [
        {
          key: 'color',
          type: 'radio',
          templateOptions: {
            label: 'Outfit color',
            required: true,
            options: [{
              key: 'google',
              value: 'Google',
            }, {
              key: 'facebook',
              value: 'Facebook',
            }, {
              key: 'twitter',
              value: 'Twitter',
            }],
          }
        },
      ],
    }
  ];
  ngOnInit(): void {
    let newForm:StepType[] = []
    this.questions.forEach((question,index) => {
      let formField=this.createFormField(question,index)
      if(formField!=null && index<3){
        console.log(`My index is ${index} ${formField}`)
        newForm.push(formField)
      }
      
    });
    this.steps=newForm
    console.log(this.steps)
  }

  createFormField(question,key): StepType {
    let form: StepType;
    let formField:FormlyFieldConfig;
    switch (question.type) {
      case "radio":
      formField={
        key: `${key}`,
        type:'radio',
        templateOptions:{
          label:question.question,
          required:true,
          options: question.options.map((option)=>{
              let keyValuePair={
                key:option,
                value:option
              }
              return keyValuePair;
          })
        }
      }
      console.log(`\n\n ${formField} \n\n`)
        form = {
          label: '',
          fields: [formField]
        }
        break;
        // case "input":
        // form ={
        //   label:'',
        //   fields:[
        //     {
        //       key: `${key}`,
        //       type: 'input',
        //       templateOptions: {
        //         label: 'Email address',
        //         placeholder: 'Enter email',
        //         required: true,
        //       }
        //     }
        //   ]
        // }
        // break;
        default : form=null
        break;
    }
    return form
  }


  form = new FormArray(this.steps.map(() => new FormGroup({})));
  options = this.steps.map(() => <FormlyFormOptions>{});

  prevStep(step) {
    this.activedStep = step - 1;
  }

  nextStep(step) {
    this.activedStep = step + 1;
  }

  submit() {
    alert(JSON.stringify(this.model));
    let answered = []
    for (let i = 0; i < this.questions.length; i++) {
      let qa = { ...this.questions[i], answer: this.model[`${i}`] }
      answered.push(qa)
    }
    console.log("------ANSWER ARRAY ----------", answered)
  }
}
