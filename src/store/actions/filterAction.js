import { INITIALDATA } from "../types/filter";

export const initFilter = (
  type = INITIALDATA,
  data = [],
  isLoading = false,
  error = false
) => {
  return {
    type,
    data,
    isLoading,
    error,
  };
};
