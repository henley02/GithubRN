import React, { createRef } from 'react';
import { FlatList, Platform, RefreshControl, StyleSheet, TouchableOpacity, View, Text, ActivityIndicator, TextInput } from 'react-native';
import Toast from 'react-native-easy-toast';
import { connect } from 'react-redux';
import actions from '../../redux/actions';
import GlobalStyles, { isIphoneX } from '../../public/js/GlobalStyles';
import LanguageDao, { FLAG_LANGUAGE } from '../../public/js/expand/LanguageDao';
import BackPressComponent from '../../components/BackPressComponent/BackPressComponent';
import FavoriteDao from '../../public/js/expand/FavoriteDao';
import { FLAG_STORAGE } from '../../public/fetch';
import { SCREEN_HEIGHT } from '../../public/js/GlobalStyles';
import PopularItem from '../../components/popularItem/popularItem';
import FavoriteUtil from '../../public/js/favoriteUtil';
import NavigationUtil from '../../public/js/NavigationUtil';
import BackButton from '../../components/BackButton/BackButton';
import Util from '../../public/js/util';

const pageSize = 10;

class SearchPage extends React.Component {
    constructor(props) {
        super(props);
        this.params = props.navigation.state.params;
        this.backPress = new BackPressComponent({ backPress: (e) => this.onBackPress(e) });
        this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.isKeyChange = false;
        this.toastRef = createRef();
        this.textInputRef = createRef();
        this.inputKey = '';
        this.searchToken = '';
    }

    componentDidMount() {
        this.backPress.componentDidMount();
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    onBackPress() {
        const { onSearchCancel, onLoadLanguage } = this.props;
        onSearchCancel();
        this.textInputRef.current.blur();
        this.props.navigation.goBack();
        if (this.isKeyChange) {
            onLoadLanguage(FLAG_LANGUAGE.flag_key);
        }
        return true;
    }

    loadData(loadMore) {
        const { onSearch, onLoadMoreSearch, search, keys } = this.props;
        if (loadMore) {
            onLoadMoreSearch(++search.pageIndex, pageSize, search.items, this.favoriteDao, (callBack) => {
                this.toastRef.current.show('没有更多了');
            });
        } else {
            onSearch(this.inputKey, pageSize, (this.searchToken = new Date().getTime()), this.favoriteDao, keys, (message) => {
                this.toastRef.current.show(message);
            });
        }
    }

    genIndicator() {
        const { hideLoadingMore } = this.props.search;
        return hideLoadingMore ? null : (
            <View style={styles.indicatorContainer}>
                <ActivityIndicator style={styles.indicator} />
                <Text>正在加载更多</Text>
            </View>
        );
    }

    saveKey() {
        const { keys } = this.props;
        let key = this.inputKey;
        console.log(key);
        console.log(keys);
        if (Util.checkKeyIsExist(keys, key)) {
            this.toastRef.current.show(`${key}已经存在`);
        } else {
            key = {
                path: key,
                name: key,
                checked: true,
            };
            keys.unshift(key);
            this.languageDao.save(keys);
            this.toastRef.current.show(`${key.name}保存成功`);
            this.isKeyChange = true;
        }
    }

    onSelect = (item, callback) => {
        NavigationUtil.goPage('DetailPage', {
            projectModel: item,
            flag: FLAG_STORAGE.flag_popular,
            callback,
        });
    };

    onRightButtonClick() {
        this.textInputRef.current.blur();
        const { onSearchCancel, search } = this.props;
        if (search.showText === '搜索') {
            this.loadData();
        } else {
            onSearchCancel(this.searchToken);
        }
    }

    renderNavBar() {
        const { showText } = this.props.search;
        const { theme } = this.props;
        const placeholder = '请输入';
        return (
            <View style={[styles.navBarWrapper, { backgroundColor: theme.themeColor }]}>
                <BackButton goBack={() => this.onBackPress()} />
                <TextInput ref={this.textInputRef} style={styles.textInput} placeholder={placeholder} onChangeText={(val) => (this.inputKey = val)} />
                <TouchableOpacity onPress={() => this.onRightButtonClick()}>
                    <View style={{ marginRight: 10 }}>
                        <Text style={styles.title}>{showText}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const { isLoading, projectModels, hideLoadingMore, showBottomButton } = this.props.search;
        const { theme } = this.props;
        let statusBar = null;
        if (Platform.OS === 'ios') {
            statusBar = <View style={[styles.statusBar, { backgroundColor: theme.themeColor }]} />;
        }

        let listView =
            !isLoading && this.inputKey ? (
                <FlatList
                    data={projectModels}
                    renderItem={(data) => (
                        <PopularItem
                            theme={theme}
                            projectModel={data.item}
                            onSelect={(callback) => this.onSelect(data.item, callback)}
                            onFavorite={(item, isFavorite) => {
                                FavoriteUtil.onFavorite(this.favoriteDao, data.item, isFavorite, FLAG_STORAGE.flag_popular);
                            }}
                        />
                    )}
                    keyExtractor={(item) => '' + item.id}
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            titleColor={theme.themeColor}
                            colors={[theme.themeColor]}
                            refreshing={isLoading}
                            onRefresh={() => this.loadData()}
                            tintColor={theme.themeColor}
                        />
                    }
                    contentInset={{ bottom: 45 }}
                    ListFooterComponent={() => this.genIndicator()}
                    onEndReached={() => {
                        setTimeout(() => {
                            if (this.canLoadMore) {
                                this.loadData(true);
                                this.canLoadMore = false;
                            }
                        }, 100);
                    }}
                    onEndReachedThreshold={0.5}
                    onMomentumScrollBegin={() => {
                        this.canLoadMore = true;
                    }}
                />
            ) : null;
        console.log(isLoading);
        let bottomButton =
            showBottomButton && this.inputKey ? (
                <TouchableOpacity style={[styles.bottomButton, { backgroundColor: theme.themeColor }]} onPress={() => this.saveKey()}>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={styles.title}>朕收下了</Text>
                    </View>
                </TouchableOpacity>
            ) : null;
        let indicatorView = isLoading ? <ActivityIndicator style={styles.centering} size={'large'} animating={isLoading} /> : null;
        let resultView = (
            <View style={{ flex: 1 }}>
                {indicatorView}
                {listView}
            </View>
        );
        return (
            <View style={GlobalStyles.root_container}>
                {statusBar}
                {this.renderNavBar()}
                {resultView}
                {bottomButton}
                <Toast ref={this.toastRef} position={'center'} />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    search: state.search,
    theme: state.theme.theme,
    keys: state.language.keys,
});

const mapDispatchToProps = (dispatch) => ({
    onSearch: (inputKey, pageSize, token, favoriteDao, popularKeys, callBack) => dispatch(actions.onSearch(inputKey, pageSize, token, favoriteDao, popularKeys, callBack)),
    onSearchCancel: (token) => dispatch(actions.onSearchCancel(token)),
    onLoadMoreSearch: (pageIndex, pageSize, dataArray, favoriteDao, callBack) => dispatch(actions.onLoadMoreSearch(pageIndex, pageSize, dataArray, favoriteDao, callBack)),
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);

const styles = StyleSheet.create({
    statusBar: {
        height: 20,
    },
    indicatorContainer: {
        alignItems: 'center',
    },
    indicator: {
        color: 'red',
        margin: 10,
    },
    centering: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomButton: {
        position: 'absolute',
        left: 10,
        right: 10,
        top: SCREEN_HEIGHT - 45 - (isIphoneX() ? 34 : 0),
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        opacity: 0.9,
    },
    textInput: {
        flex: 1,
        borderWidth: Platform.OS === 'ios' ? 1 : 0,
        height: Platform.OS === 'ios' ? 26 : 36,
        borderColor: 'white',
        alignSelf: 'center',
        paddingLeft: 5,
        marginRight: 10,
        marginLeft: 5,
        borderRadius: 3,
        opacity: 0.7,
        color: 'white',
    },
    navBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: Platform.OS ? GlobalStyles.nav_bar_height_ios : GlobalStyles.nav_bar_height_android,
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        color: '#fff',
    },
});
