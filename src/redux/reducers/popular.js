import { POPULAR_LOAD_MORE_FAIL, POPULAR_LOAD_MORE_SUCCESS, POPULAR_PUSH_FAVORITE, POPULAR_REFRESH, POPULAR_REFRESH_FAIL, POPULAR_REFRESH_SUCCESS } from '../actions/action-types';

const defaultState = {};

/**
 * popular:{
 *     java: {
 *         items:[],
 *         isLoading:false
 *     },
 *     ios: {
 *         items:[],
 *         isLoading:false
 *     }
 * }
 * @param state
 * @param action
 */
export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case POPULAR_REFRESH_SUCCESS: // 下拉刷新成功
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels: action.projectModels, // 此次要展示的数据
                    items: action.items, //  原始数据
                    isLoading: false,
                    hideLoadingMore: false,
                    pageIndex: action.pageIndex,
                },
            };
        case POPULAR_REFRESH: //  下拉刷新
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true,
                    hideLoadingMore: true,
                },
            };

        case POPULAR_REFRESH_FAIL: // 下拉刷新失败
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                },
            };
        case POPULAR_LOAD_MORE_SUCCESS: // 上拉加载更多成功
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels: action.projectModels,
                    hideLoadingMore: false,
                    pageIndex: action.pageIndex,
                },
            };
        case POPULAR_PUSH_FAVORITE:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels: action.projectModels,
                },
            };
        case POPULAR_LOAD_MORE_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    hideLoadingMore: true,
                    pageIndex: action.pageIndex,
                },
            };
        default:
            return state;
    }
}
