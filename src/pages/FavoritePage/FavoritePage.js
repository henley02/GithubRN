import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import actions from '../../redux/actions';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { FLAG_STORAGE } from '../../public/fetch';
import { createAppContainer } from 'react-navigation';
import FavoriteDao from '../../public/js/expand/FavoriteDao';
import PopularItem from '../../components/popularItem/popularItem';
import TrendingItem from '../../components/trendingItem/trendingItem';
import NavigationUtil from '../../public/js/NavigationUtil';
import FavoriteUtil from '../../public/js/favoriteUtil';
import Toast from 'react-native-easy-toast';
import EventBus from 'react-native-event-bus';
import { bottom_tab_select, favorite_changed_popular, favorite_changed_trending } from '../../config/EventTypes';
import GlobalStyles from '../../public/js/GlobalStyles';

class FavoritePage extends React.Component {
    constructor(props) {
        super(props);
        this.tabNames = ['最热', '趋势'];
    }

    render() {
        const { theme } = this.props;
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content',
        };
        let navigationBar = <NavigationBar title={'收藏'} statusBar={statusBar} style={theme.style.navBar} />;
        const TabNavigator = createAppContainer(
            createMaterialTopTabNavigator(
                {
                    Popular: {
                        screen: (props) => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} theme={theme} />,
                        navigationOptions: {
                            title: '最热',
                        },
                    },
                    Trending: {
                        screen: (props) => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending} theme={theme} />,
                        navigationOptions: {
                            title: '趋势',
                        },
                    },
                },
                {
                    tabBarOptions: {
                        tabStyle: styles.tabStyle,
                        upperCaseLabel: false,
                        style: {
                            backgroundColor: theme.themeColor,
                        },
                        indicatorStyle: styles.indicatorStyle,
                        labelStyle: styles.labelStyle,
                    },
                }
            )
        );
        return (
            <View style={GlobalStyles.root_container}>
                {navigationBar}
                <TabNavigator />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    theme: state.theme.theme,
});

export default connect(mapStateToProps)(FavoritePage);

class FavoriteTab extends React.Component {
    constructor(props) {
        super(props);
        this.flag = props.flag;
        this.favoriteDao = new FavoriteDao(this.flag);
    }

    componentDidMount() {
        this.loadData();
        EventBus.getInstance().addListener(
            bottom_tab_select,
            (this.listener = (data) => {
                if (data.to === 2) {
                    this.loadData(false);
                }
            })
        );
    }

    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.listener);
    }

    _store() {
        const { favorite } = this.props;
        let store = favorite[this.flag];
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [],
            };
        }
        return store;
    }

    loadData(isShowLoading) {
        const { onLoadFavoriteData } = this.props;
        onLoadFavoriteData(this.flag, isShowLoading);
    }

    onFavorite = (item, isFavorite) => {
        FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.flag);
        if (this.flag === FLAG_STORAGE.flag_popular) {
            EventBus.getInstance().fireEvent(favorite_changed_popular);
        } else {
            EventBus.getInstance().fireEvent(favorite_changed_trending);
        }
    };

    renderItem = (data) => {
        const item = data.item;
        const Component = this.flag === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
        const { theme } = this.props;
        return (
            <Component
                projectModel={item}
                theme={theme}
                onSelect={(callback) => {
                    NavigationUtil.goPage('DetailPage', {
                        projectModel: item,
                        flag: this.flag,
                        callback,
                    });
                }}
                onFavorite={(item, isFavorite) => {
                    this.onFavorite(data.item, isFavorite);
                }}
            />
        );
    };

    render() {
        let store = this._store();
        return (
            <View>
                <FlatList
                    data={store.projectModels}
                    keyExtractor={(item) => '' + item.id || item.fullName}
                    renderItem={(data) => this.renderItem(data)}
                    refreshControl={<RefreshControl refreshing={store.isLoading} title={'Loading'} titleColor={'red'} colors={['red']} onRefresh={() => this.loadData(true)} tintColor={'red'} />}
                />
                <Toast ref={this.toastRef} position={'center'} />
            </View>
        );
    }
}

const mapStateToPropsFavoriteTab = (state) => ({
    favorite: state.favorite,
});

const mapDispatchToPropsFavoriteTab = (dispatch) => ({
    onLoadFavoriteData: (flag, isShowLoading) => dispatch(actions.onLoadFavoriteData(flag, isShowLoading)),
});

const FavoriteTabPage = connect(mapStateToPropsFavoriteTab, mapDispatchToPropsFavoriteTab)(FavoriteTab);

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
});
