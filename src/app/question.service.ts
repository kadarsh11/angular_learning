import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  submit(answered) {
    let t =Object.assign({}, answered)
    const obj = {
      answered:t
    };
    console.log(obj);
    this.http.post(`${this.uri}/add`, obj)
        .subscribe(res => console.log('Done'));
  }
}