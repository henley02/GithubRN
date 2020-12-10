import { SEARCH_CANCEL, SEARCH_FAIL, SEARCH_LOAD_MORE_FAIL, SEARCH_LOAD_MORE_SUCCESS, SEARCH_REFRESH, SEARCH_REFRESH_SUCCESS } from '../actions/action-types';

const defaultState = {
    showText: '搜索',
    items: [],
    isLoading: false,
    projectModels: [], // 要显示的数据
    hideLoadingMore: true, //默认隐藏加载更多
    showBottomButton: false,
};

/**
 * @param state
 * @param action
 */
export default function onAction(state = defaultState, action) {
    console.log(action.type);
    switch (action.type) {
        case SEARCH_REFRESH: // 搜索数据
            return {
                ...state,
                isLoading: true,
                hideLoadingMore: true,
                showBottomButton: false,
                showText: '取消',
            };
        case SEARCH_REFRESH_SUCCESS: // 获取数据成功
            return {
                ...state,
                isLoading: false,
                hideLoadingMore: false,
                showBottomButton: action.showBottomButton,
                items: action.items,
                projectModels: action.projectModels,
                pageIndex: action.pageIndex,
                showText: '搜索',
            };

        case SEARCH_FAIL: // 下拉刷新失败
            return {
                ...state,
                isLoading: false,
                showText: '搜索',
            };
        case SEARCH_CANCEL:
            return {
                ...state,
                isLoading: false,
                showText: '搜索',
            };
        case SEARCH_LOAD_MORE_SUCCESS: // 上拉加载更多成功
            return {
                ...state,
                projectModels: action.projectModels,
                hideLoadingMore: false,
                pageIndex: action.pageIndex,
            };
        case SEARCH_LOAD_MORE_FAIL:
            return {
                ...state,
                hideLoadingMore: true,
                pageIndex: action.pageIndex,
            };
        default:
            return state;
    }
}
