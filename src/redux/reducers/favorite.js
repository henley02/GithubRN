import { FAVORITE_LOAD_DATA, FAVORITE_LOAD_FAIL, FAVORITE_LOAD_SUCCESS } from '../actions/action-types';

/**
 * favorite:{
 *     popular: {
 *         projectModels: [],
 *         isLoading: false
 *     },
 *     trending: {
 *         projectModels: [],
 *         isLoading: false
 *     }
 * }
 * @type {{}}
 */
const defaultState = {};

export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case FAVORITE_LOAD_DATA:
            return {
                ...state,
                [action.storeName]: { ...state[action.storeName], isLoading: true },
            };
        case FAVORITE_LOAD_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels: action.projectModels,
                    isLoading: false,
                },
            };
        case FAVORITE_LOAD_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                },
            };
        default:
            return state;
    }
}
