import { createReducer, on } from '@ngrx/store';
import { User } from '../models/User.model';
import { setUser, unSetUser } from './auth.actions';

export interface State {
  user: any;
}

export const initialState: State = {
  user: null
};

export const authReducer = createReducer(
  initialState,
  on(setUser, (state, { user }) => ({ ...state, user: { ...user } })),
  on(unSetUser, (state) => ({ ...state, user: null })),
);
