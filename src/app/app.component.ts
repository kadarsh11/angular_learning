import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
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
  questions = [
    {
      step: 1,
      question: "The International Literacy Day is observed on",
      option: ["Sep 8", "Nov 28", "May 2"]
    },
    {
      step: 1,
      question: "The language of Lakshadweep. a Union Territory of India, is",
      option: ["Tamil", "Hindi", "Malayalam"]
    },
    {
      step: 3,
      question: "Which day is observed as the World Standards  Day?",
      option: ["June 26", "Nov 15", "Dec 2"]
    },
  ];
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
    let allSteps = []
    // BELOW given loop is to find a array of different step
    for (let i = 0; i < this.questions.length; i++) {
      if (!allSteps.includes(this.questions[i].step)) {
        allSteps.push(this.questions[i].step)
      }
    }

    console.log("Array of unique step", allSteps)

    // After getting all unique step we divide question per page 
    // For Example:
    //   this.questions contain to qunique step [1,3]
    //   So your first page will contain all the question of step 1
    //   and your second page will contain all the question of step 3 
    for (let i = 0; i < allSteps.length; i++) {
      let pageForm = []
      for (let j = 0; j < this.questions.length; j++) {
        if (allSteps[i] == this.questions[j].step) {
          let options = [];
          for (let k = 0; k < this.questions[j].option.length; k++) {
            options.push({
              key: this.questions[j].option[k],
              value: this.questions[j].option[k]
            });
          }
          let field = {
            key: `${j}`,
            type: 'radio',
            templateOptions: {
              label: this.questions[j].question,
              options: options,
              required: true
            }
          }
          pageForm.push(field)
        }
      }
      let o: StepType = {
        label: `${i + 1}`,
        fields: pageForm
      }
      this.t.push(o)
    }
    this.steps = this.t
    console.log("GOT THE NEW ARRAY for the forms on each page--------", this.steps)
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
