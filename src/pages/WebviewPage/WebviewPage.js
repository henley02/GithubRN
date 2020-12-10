import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import BackButton from '../../components/BackButton/BackButton';
import GlobalStyles from '../../public/js/GlobalStyles';
import BackPressComponent from '../../components/BackPressComponent/BackPressComponent';

class WebviewPage extends React.Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        console.log(this.params);
        const { title, url } = this.params;
        this.state = {
            title,
            url,
            canGoBack: false,
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

    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url,
        });
    }

    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            this.props.navigation.goBack();
        }
    }

    render() {
        const { theme } = this.props;
        let navigationBar = <NavigationBar title={this.state.title} style={theme.style.navBar} leftButton={<BackButton goBack={() => this.onBack()} />} />;
        return (
            <View style={GlobalStyles.root_container}>
                {navigationBar}
                <WebView ref={(webView) => (this.webView = webView)} source={{ uri: this.state.url }} startInLoadingState={true} onNavigationStateChange={(e) => this.onNavigationStateChange(e)} />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    theme: state.theme.theme,
});

export default connect(mapStateToProps)(WebviewPage);
