import { createAction, props } from "@ngrx/store";
import { User } from "../models/User.model";

export const setUser = createAction(
  '[Auth] setUser',
  props<{user: User}>()
  );

  export const unSetUser = createAction(
  '[Auth] unSetUser'
  );
