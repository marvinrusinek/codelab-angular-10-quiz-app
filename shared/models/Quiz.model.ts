<<<<<<< HEAD
import { QuizQuestion } from '@codelab-quiz/shared/models/QuizQuestion.model';

export interface Quiz {
  quizId: string;
  milestone: string;
  summary: string;
  image: string;
  questions: QuizQuestion[];
  status: 'started' | 'continue' | 'completed' | '';
}
=======
import { QuizQuestion } from '@codelab-quiz/shared/models/QuizQuestion.model';

export interface Quiz {
  quizId: string;
  milestone: string;
  summary: string;
  image: string;
  questions: QuizQuestion[];
  status: 'started' | 'continue' | 'completed' | '';
}
>>>>>>> 04dcb5efb6b2836cacafa7226bfba6be16e79305
