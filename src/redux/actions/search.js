import { SEARCH_CANCEL, SEARCH_FAIL, SEARCH_LOAD_MORE_FAIL, SEARCH_LOAD_MORE_SUCCESS, SEARCH_REFRESH, SEARCH_REFRESH_SUCCESS } from './action-types';
import { _projectModels, handleData, doCallBack } from './actionUtil';
import ArrayUtil from '../../public/js/ArrayUtil';
import Util from '../../public/js/util';

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
let CANCEL_TOKENS = [];

/**
 * 发起搜索
 * @param inputKey 搜索key
 * @param pageSize
 * @param token 与该搜索关联的唯一token
 * @param favoriteDao
 * @param popularKeys
 * @param callBack
 */
export function onSearch(inputKey, pageSize, token, favoriteDao, popularKeys, callBack) {
    return async (dispatch) => {
        dispatch({ type: SEARCH_REFRESH });
        fetch(genFetchUrl(inputKey))
            .then((response) => {
                return hasCancel(token) ? null : response.json();
            })
            .then((responseData) => {
                console.log(responseData);
                if (hasCancel(token, true)) {
                    console.log('user cancel');
                    return;
                }
                if (!responseData || !responseData.items || responseData.items.length === 0) {
                    dispatch({ type: SEARCH_FAIL, message: `没找到关于${inputKey}的项目` });
                    doCallBack(callBack, `没找到关于${inputKey}的项目`);
                    return;
                }
                let items = responseData.items;
                handleData(SEARCH_REFRESH_SUCCESS, dispatch, '', items, pageSize, favoriteDao, {
                    inputKey,
                    showBottomButton: !Util.checkKeyIsExist(popularKeys, inputKey),
                });
            })
            .catch((e) => {
                console.log(e);
                dispatch({ type: SEARCH_FAIL, error: e });
            });
    };
}

/**
 * 取消任务搜索
 * @param token
 */
export function onSearchCancel(token) {
    return (dispatch) => {
        CANCEL_TOKENS.push(token);
        dispatch({
            type: SEARCH_CANCEL,
        });
    };
}

/**
 * 加载更多
 * @param pageIndex
 * @param pageSize
 * @param dataArray
 * @param favoriteDao
 * @param callBack
 */
export function onLoadMoreSearch(pageIndex, pageSize, dataArray = [], favoriteDao, callBack) {
    return (dispatch) => {
        setTimeout(() => {
            if ((pageIndex - 1) * pageSize >= dataArray.length) {
                if (typeof callBack === 'function') {
                    callBack('no more');
                }
                dispatch({
                    type: SEARCH_LOAD_MORE_FAIL,
                    error: 'no more',
                    pageIndex: --pageIndex,
                });
            } else {
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
                _projectModels(dataArray.slice(0, max), favoriteDao, (data) => {
                    dispatch({
                        type: SEARCH_LOAD_MORE_SUCCESS,
                        pageIndex,
                        projectModels: data,
                    });
                });
            }
        }, 500);
    };
}

function genFetchUrl(key) {
    return API_URL + key + QUERY_STR;
}

/**
 *
 * @param token
 * @param isRemove
 * @returns {boolean}
 */
function hasCancel(token, isRemove) {
    if (CANCEL_TOKENS.includes(token)) {
        isRemove && ArrayUtil.remove(CANCEL_TOKENS, token);
        return true;
    }
    return false;
}
