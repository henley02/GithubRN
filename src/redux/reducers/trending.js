import { TRENDING_LOAD_MORE_FAIL, TRENDING_LOAD_MORE_SUCCESS, TRENDING_PUSH_FAVORITE, TRENDING_REFRESH, TRENDING_REFRESH_FAIL, TRENDING_REFRESH_SUCCESS } from '../actions/action-types';

const defaultState = {};

/**
 * trending:{
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
        case TRENDING_REFRESH_SUCCESS: // 下拉刷新成功
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels: action.projectModels, // 此次要展示的数据
                    items: action.items, //  原始数据
                    isLoading: false,
                    hideLoadingMore: true,
                    pageIndex: action.pageIndex,
                },
            };
        case TRENDING_REFRESH: //  下拉刷新
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true,
                    hideLoadingMore: true,
                },
            };

        case TRENDING_REFRESH_FAIL: // 下拉刷新失败
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                },
            };
        case TRENDING_LOAD_MORE_SUCCESS: // 上拉加载更多成功
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels: action.projectModels,
                    hideLoadingMore: false,
                    pageIndex: action.pageIndex,
                },
            };
        case TRENDING_LOAD_MORE_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    hideLoadingMore: true,
                    pageIndex: action.pageIndex,
                },
            };
        case TRENDING_PUSH_FAVORITE:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels: action.projectModels,
                },
            };
        default:
            return state;
    }
}
