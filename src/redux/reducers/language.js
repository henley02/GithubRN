import { LANGUAGE_LOAD_SUCCESS } from '../actions/action-types';
import { FLAG_LANGUAGE } from '../../public/js/expand/LanguageDao';

const defaultState = {
    languages: [],
    keys: '',
};

export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case LANGUAGE_LOAD_SUCCESS:
            if (FLAG_LANGUAGE.flag_key === action.flag) {
                return {
                    ...state,
                    keys: action.languages,
                };
            } else {
                return {
                    ...state,
                    languages: action.languages,
                };
            }
        default:
            return state;
    }
}
