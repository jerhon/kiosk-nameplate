import { Injectable } from '@angular/core';
import * as surveyQuestions from './survey-questions.json';
import { stringify } from 'querystring';

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
}

export interface Answer {
  text: string;
}

export interface VoteStorage {
  [answerIndex: number]: number;
}

export interface Vote {
  answer: string;
  votes: number;
}

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  constructor() { }

  // TODO: make a request as the application loads to get this from a JSON file in a public GIST
  questions: Question[] = surveyQuestions.questions;

  getRandomQuestionId(lastQuestionId: string): string {
    let questionId: string;

    do {  
      const id = Math.floor(Math.random() * this.questions.length);
      questionId = this.questions[id].id;
    } while (questionId == lastQuestionId)
    
    return questionId;
  }

  getQuestion(questionId: string) {
    return this.questions.find((q) => q.id == questionId);
  }

  // Maybe use indexed DB instead, as you get more space for questions.

  incrementVote(questionId: string, answerIndex: number) {
    let votes = this.getVoteStorage(questionId);

    votes[answerIndex] = (votes[answerIndex] | 0) + 1;
    
    this.storeVotes(questionId, votes);
  }

  private storeVotes(questionId: string, votes: VoteStorage) {
    localStorage.setItem('q.' + questionId, JSON.stringify(votes));
  }

  private getVoteStorage(questionId: string) : VoteStorage {
    let value = localStorage.getItem('q.' + questionId);
    let answerCount : VoteStorage = {};
    if (value) {
      answerCount = JSON.parse(value);
    }
    return answerCount;
  }

  getVotes(questionId: string): Vote[] {
    let question = this.getQuestion(questionId);
    let votes = this.getVoteStorage(questionId);

    return question.answers.map((ans,idx) => ({answer: ans.text, votes: (votes[idx] | 0)}));
  }


}
