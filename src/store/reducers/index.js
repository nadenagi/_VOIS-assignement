import { combineReducers } from "redux";
import { dataFetchedReducer } from "./dataFetchedReducer";
import { dropdownReducer } from "./drobdownSelectedReducer";

export default combineReducers({
  filters: dropdownReducer,
  dataFetched: dataFetchedReducer,
});
