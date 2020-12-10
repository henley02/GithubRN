import React from 'react';
import { Alert, Text, StyleSheet, View, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SortableListView from 'react-native-sortable-listview-newer';
import BackPressComponent from '../../components/BackPressComponent/BackPressComponent';
import actions from './../../redux/actions/index';
import LanguageDao, { FLAG_LANGUAGE } from '../../public/js/expand/LanguageDao';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import ViewUtil from '../../public/js/ViewUtil';
import GlobalStyles from '../../public/js/GlobalStyles';
import BackButton from '../../components/BackButton/BackButton';
import ArrayUtil from '../../public/js/ArrayUtil';

class SortKeyPage extends React.Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({
            backPress: (e) => this.onBackPress(e),
        });
        this.LanguageDao = new LanguageDao(this.params.flag);
        this.state = {
            checkedArray: SortKeyPage._keys(this.props),
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const checkedArray = SortKeyPage._keys(nextProps, prevState);
        if (prevState.checkedArray !== checkedArray) {
            return {
                checkedArray: checkedArray,
            };
        }
        return null;
    }

    componentDidMount() {
        this.backPress.componentDidMount();

        if (SortKeyPage._keys(this.props).length === 0) {
            let { onLoadLanguage } = this.props;
            onLoadLanguage(this.params.flag);
        }
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    /**
     * 获取标签
     * @param props
     * @param state
     * @returns {*}
     * @private
     */
    static _keys(props, state) {
        if (state && state.checkedArray && state.checkedArray.length) {
            return state.checkedArray;
        }
        const flag = SortKeyPage._flag(props);
        let dataArray = props.language[flag] || [];
        let keys = [];
        for (let i = 0; i < dataArray.length; i++) {
            let data = dataArray[i];
            if (data.checked) {
                keys.push(data);
            }
        }
        return keys;
    }

    static _flag(props) {
        const { flag } = props.navigation.state.params;
        return flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
    }

    onBackPress(e) {
        this.onBack();
        return true;
    }

    onBack() {
        if (!ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
            Alert.alert('提示', '要保存修改吗？', [
                {
                    text: '否',
                    onPress: () => {
                        this.props.navigation.goBack();
                    },
                },
                {
                    text: '是',
                    onPress: () => {
                        this.onSave(true);
                    },
                },
            ]);
        } else {
            this.props.navigation.goBack();
        }
    }

    onSave(hasChecked) {
        if (!hasChecked) {
            if (ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
                this.props.navigation.goBack();
                return;
            }
        }
        this.LanguageDao.save(this.getSortResult());
        const { onLoadLanguage } = this.props;
        onLoadLanguage(this.params.flag);
        this.props.navigation.goBack();
    }

    getSortResult() {
        const flag = SortKeyPage._flag(this.props);
        // 从原始数据中复制一份数据出来，以便对这份数据进行排序
        let sortResultArray = ArrayUtil.clone(this.props.language[flag]);
        // 获取排序之前的排练数据
        const originalCheckedArray = SortKeyPage._keys(this.props);
        // 遍历排序之前的数据，用排序后的数据checkedArray进行替换
        for (let i = 0; i < originalCheckedArray.length; i++) {
            let item = originalCheckedArray[i];
            // 找到要替换的元素所在位置
            let index = this.props.language[flag].indexOf(item);
            //进行替换
            sortResultArray.splice(index, 1, this.state.checkedArray[i]);
        }
        return sortResultArray;
    }

    render() {
        let { theme } = this.props;
        let title = this.params.flag === FLAG_LANGUAGE.flag_language ? '语言排序' : '标签排序';
        let navigationBar = (
            <NavigationBar title={title} style={theme.style.navBar} leftButton={<BackButton goBack={() => this.onBack()} />} rightButton={ViewUtil.getRightButton('保存', () => this.onSave())} />
        );
        return (
            <View style={GlobalStyles.root_container}>
                {navigationBar}
                <SortableListView
                    data={this.state.checkedArray}
                    order={Object.keys(this.state.checkedArray)}
                    onRowMoved={(e) => {
                        this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0]);
                        this.forceUpdate();
                    }}
                    renderRow={(row) => <SortCell data={row} {...this.params} theme={theme} />}
                />
            </View>
        );
    }
}

class SortCell extends React.Component {
    render() {
        const { data, sortHandlers, theme } = this.props;
        return (
            <TouchableHighlight underlayColor={'#eee'} style={data.checked ? styles.item : styles.hidden} {...sortHandlers}>
                <View style={{ marginLeft: 10, flexDirection: 'row' }}>
                    <MaterialCommunityIcons name={'sort'} size={16} style={{ marginRight: 10, color: theme.themeColor }} />
                    <Text>{data.name}</Text>
                </View>
            </TouchableHighlight>
        );
    }
}

const mapStateToProps = (state) => ({
    language: state.language,
    theme: state.theme.theme,
});

const mapDispatchToProps = (dispatch) => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SortKeyPage);

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#f8f8f8',
        borderWidth: 1,
        borderColor: '#eee',
        height: 50,
        justifyContent: 'center',
    },
    hidden: {
        height: 0,
    },
});
