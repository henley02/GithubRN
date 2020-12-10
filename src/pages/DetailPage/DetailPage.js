import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import BackPressComponent from '../../components/BackPressComponent/BackPressComponent';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BackButton from '../../components/BackButton/BackButton';
import ShareButton from '../../components/ShareButton/ShareButton';
import FavoriteDao from '../../public/js/expand/FavoriteDao';
import FavoriteUtil from '../../public/js/favoriteUtil';
import GlobalStyles from '../../public/js/GlobalStyles';
import { connect } from 'react-redux';
const TRENDING_URL = 'https://github.com/';

class DetailPage extends React.Component {
    constructor(props) {
        super(props);
        const { projectModel, flag, callback } = this.props.navigation.state.params;
        this.favoriteDao = new FavoriteDao(flag);
        this.state = {
            title: projectModel.full_name || projectModel.fullName,
            url: projectModel.html_url || TRENDING_URL + projectModel.fullName,
            canGoBack: false,
            isFavorite: projectModel.isFavorite,
            projectModel: projectModel,
            flag,
            callback,
        };
        this.backPress = new BackPressComponent({
            backPress: () => this.onBackPress(),
        });
    }

    componentDidMount() {
        this.backPress.componentDidMount();
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    onBackPress() {
        this.onBack();
        return true;
    }

    shareClick = () => {
        console.log(123);
    };

    onFavoriteButtonClick = () => {
        const { projectModel, isFavorite, flag, callback } = this.state;
        let nextIsFavorite = !isFavorite;
        callback(!isFavorite);
        this.setState({
            isFavorite: nextIsFavorite,
        });
        FavoriteUtil.onFavorite(this.favoriteDao, projectModel, !isFavorite, flag);
    };

    renderRightButton = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        this.onFavoriteButtonClick();
                    }}
                >
                    <FontAwesome name={this.state.isFavorite ? 'star' : 'star-o'} size={20} style={{ color: 'white', marginRight: 10 }} />
                </TouchableOpacity>
                <ShareButton shareClick={() => this.shareClick()} />
            </View>
        );
    };

    onNavigationStateChange = (navState) => {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url,
        });
    };

    onBack = () => {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            this.props.navigation.goBack();
        }
    };

    render() {
        const { title, url } = this.state;
        const { theme } = this.props;
        const titleLayoutStyle = title.length > 20 ? { paddingRight: 40 } : null;
        let navigationBar = (
            <NavigationBar
                title={title}
                titleLayoutStyle={titleLayoutStyle}
                style={[styles.navBar, theme.style.navBar]}
                leftButton={<BackButton goBack={() => this.onBack()} />}
                rightButton={this.renderRightButton()}
            />
        );
        return (
            <View style={GlobalStyles.root_container}>
                {navigationBar}
                <WebView source={{ uri: url }} ref={(webView) => (this.webView = webView)} startInLoadingState={true} onNavigationStateChange={(e) => this.onNavigationStateChange(e)} />
            </View>
        );
    }
}
const mapStateToProps = (state) => ({
    theme: state.theme.theme,
});

export default connect(mapStateToProps)(DetailPage);

const styles = StyleSheet.create({});
