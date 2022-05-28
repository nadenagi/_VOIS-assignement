import { fetchChartData } from "../actions/initialDataSetting";
import { BEFOREINITIALDATA,INITIALDATA } from '../types/chart';

export const initialState = {
  data: [],
  isLoading: false,
  error: false
};

export const dataFetchedReducer = (state = initialState, action = fetchChartData) => {
  switch (action.type) {
    case INITIALDATA:
      return {
        data: action.data,
        isLoading: action.isLoading,
        error: action.error,
      };

    default:
      return state;
  }
};
