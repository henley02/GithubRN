import React, { createRef } from 'react';
import { ActivityIndicator, DeviceEventEmitter, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { connect } from 'react-redux';
import { createAppContainer } from 'react-navigation';
import Toast from 'react-native-easy-toast';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import actions from '../../redux/actions/index';
import TrendingDialog, { TimeSpans } from '../../components/trendingDialog/trendingDialog';
import TrendingItem from '../../components/trendingItem/trendingItem';
import NavigationUtil from '../../public/js/NavigationUtil';
import FavoriteUtil from '../../public/js/favoriteUtil';
import { FLAG_STORAGE } from '../../public/fetch';
import FavoriteDao from '../../public/js/expand/FavoriteDao';
import EventBus from 'react-native-event-bus';
import { bottom_tab_select, favorite_changed_trending } from '../../config/EventTypes';
import GlobalStyles from '../../public/js/GlobalStyles';
import { FLAG_LANGUAGE } from '../../public/js/expand/LanguageDao';
import ArrayUtil from '../../public/js/ArrayUtil';

const URL = 'https://github.com/trending';
const pageSize = 10;
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);

class TrendingPage extends React.Component {
    constructor(props) {
        super(props);
        const { onLoadLanguage } = props;
        onLoadLanguage(FLAG_LANGUAGE.flag_language);
        this.state = {
            timeSpan: TimeSpans[0],
        };
        this.dialogRef = createRef();
        this.preLanguages = [];
    }

    _genTabs() {
        let tabs = {};
        const { languages, theme } = this.props;
        this.preLanguages = languages;
        languages.forEach((item, index) => {
            if (item.checked) {
                tabs[`tab${index}`] = {
                    screen: (props) => <TrendingTabPage {...props} tabLabel={item.name} timeSpan={this.state.timeSpan} theme={theme} />,
                    navigationOptions: {
                        title: item.name,
                    },
                };
            }
        });
        return tabs;
    }

    renderTitleView = () => {
        return (
            <TouchableOpacity activeOpacity={1} style={styles.titleView} onPress={() => this.dialogRef.current.show()}>
                <Text style={styles.titleViewText}>趋势 {this.state.timeSpan.showText}</Text>
                <MaterialIcons name={'arrow-drop-down'} size={22} color={'white'} />
            </TouchableOpacity>
        );
    };

    onSelectTimeSpan = (tab) => {
        this.dialogRef.current.close();
        this.setState({
            timeSpan: tab,
        });
        DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
    };

    _tabNav = () => {
        const { theme } = this.props;
        if (theme !== this.theme || !this.tabNav || !ArrayUtil.isEqual(this.preLanguages, this.props.languages)) {
            this.theme = theme;
            this.tabNav = createAppContainer(
                createMaterialTopTabNavigator(this._genTabs(), {
                    tabBarOptions: {
                        tabStyle: styles.tabStyle,
                        upperCaseLabel: false,
                        scrollEnabled: true,
                        style: {
                            backgroundColor: theme.themeColor,
                        },
                        indicatorStyle: styles.indicatorStyle,
                        labelStyle: styles.labelStyle,
                    },
                    lazy: true,
                })
            );
        }
        return this.tabNav;
    };

    render() {
        const { languages, theme } = this.props;
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content',
        };

        let navigationBar = <NavigationBar statusBar={statusBar} titleView={this.renderTitleView()} style={theme.style.navBar} />;
        const Tabs = languages.length > 0 ? this._tabNav() : null;
        return (
            <View style={GlobalStyles.root_container}>
                {navigationBar}
                {Tabs && <Tabs />}
                <TrendingDialog ref={this.dialogRef} onSelect={(tab) => this.onSelectTimeSpan(tab)} />
            </View>
        );
    }
}

const mapTrendingStateToProps = (state) => ({
    languages: state.language.languages,
    theme: state.theme.theme,
});

const mapTrendingDispatchToProps = (dispatch) => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
});

export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingPage);

class TrendingTab extends React.Component {
    constructor(props) {
        super(props);
        const { tabLabel, timeSpan } = props;
        this.storeName = tabLabel;
        this.timeSpan = timeSpan;
        this.toastRef = createRef();
        this.isFavoriteChanged = false;
    }

    componentDidMount() {
        this.loadData();
        this.timeSpanListtener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (data) => {
            this.timeSpan = data;
            this.loadData();
        });
        EventBus.getInstance().addListener(
            favorite_changed_trending,
            (this.favoriteChangeListener = () => {
                this.isFavoriteChanged = true;
            })
        );
        EventBus.getInstance().addListener(
            bottom_tab_select,
            (this.bottomTabSelectListener = (data) => {
                if (data.to === 1 && this.isFavoriteChanged) {
                    this.loadData(null, true);
                }
            })
        );
    }

    componentWillUnmount() {
        this.timeSpanListtener && this.timeSpanListtener.remove();
        EventBus.getInstance().removeListener(this.favoriteChangeListener);
        EventBus.getInstance().removeListener(this.bottomTabSelectListener);
    }

    _store() {
        const { trending } = this.props;
        let store = trending[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [],
                hideLoadingMore: true,
            };
        }
        return store;
    }

    loadData(loadMore, refreshFavorite) {
        const { onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite } = this.props;
        const store = this._store();
        const url = this.genFetchUrl(this.storeName);
        if (loadMore) {
            onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, (callback) => {
                this.toastRef.current.show('没有更多了');
            });
        } else if (refreshFavorite) {
            onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
        } else {
            onRefreshTrending(this.storeName, url, pageSize, favoriteDao);
        }
    }

    genFetchUrl(storeName) {
        if (storeName === 'All') {
            return `${URL}`;
        }
        return `${URL}/${storeName}?${this.timeSpan.searchText}`;
    }

    onSelect = (item, callback) => {
        NavigationUtil.goPage('DetailPage', {
            projectModel: item,
            flag: FLAG_STORAGE.flag_trending,
            callback,
        });
    };

    genIndicator() {
        return this._store().hideLoadingMore ? null : (
            <View style={styles.indicatorContainer}>
                <ActivityIndicator style={styles.indicator} />
                <Text>正在加载更多</Text>
            </View>
        );
    }

    render() {
        let store = this._store();
        const { theme } = this.props;
        return (
            <View>
                <FlatList
                    data={store.projectModels}
                    keyExtractor={(item) => '' + item.id || item.fullName}
                    renderItem={(data) => (
                        <TrendingItem
                            projectModel={data.item}
                            theme={theme}
                            onSelect={(callback) => this.onSelect(data.item, callback)}
                            onFavorite={(item, isFavorite) => {
                                FavoriteUtil.onFavorite(favoriteDao, data.item, isFavorite, FLAG_STORAGE.flag_trending);
                            }}
                        />
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={store.isLoading}
                            title={'Loading'}
                            titleColor={theme.themeColor}
                            colors={[theme.themeColor]}
                            onRefresh={() => this.loadData()}
                            tintColor={theme.themeColor}
                        />
                    }
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
                <Toast ref={this.toastRef} position={'center'} />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    trending: state.trending,
});

const mapDispatchToProps = (dispatch) => ({
    onRefreshTrending: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
    onLoadMoreTrending: (storeName, pageIndex, pageSize, items, favoriteDao, callback) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, favoriteDao, callback)),
    onFlushTrendingFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
});

const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab);

const styles = StyleSheet.create({
    tabStyle: {
        minWidth: 30,
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white',
    },
    labelStyle: {
        fontSize: 13,
        marginTop: 6,
        marginBottom: 6,
    },
    indicatorContainer: {
        alignItems: 'center',
    },
    indicator: {
        color: 'red',
        margin: 10,
    },
    titleView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleViewText: {
        color: 'white',
        fontSize: 18,
        marginRight: 10,
    },
});
