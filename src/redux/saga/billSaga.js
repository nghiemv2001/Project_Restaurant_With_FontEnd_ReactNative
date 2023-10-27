import { call, put } from "redux-saga/effects";
import getBills from "../../actions/getBills";

export default function* (action){
    const bills = yield call(getBills)
    yield put({type:'GET_BILLS_SUCCESS', payload:bills})
}