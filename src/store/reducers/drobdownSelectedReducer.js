import { initFilter } from "../actions/filterAction";
import { INITIALDATA,UPDATEDDATA } from '../types/filter';

export const initialState = {
  data: [],
  isLoading: false,
  error: false
};

export const dropdownReducer = (state = initialState, action = initFilter) => {
  switch (action.type) {
    case INITIALDATA:
      return {
        data: action.data,
        isLoading: action.isLoading,
        error: action.error,
      };
    
    case UPDATEDDATA:{console.log(action)
      return {
        data: action.data,
        isLoading: action.isLoading,
        error: action.error,
      };}
    
    default:
      return state;
  }
};
