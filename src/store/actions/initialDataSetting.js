import { INITIALDATA } from '../types/chart';

export const fetchChartData = (type = INITIALDATA, data = [], isLoading = false, error = false) => {
  return {
    type,
    data,
    isLoading,
    error
  };
};