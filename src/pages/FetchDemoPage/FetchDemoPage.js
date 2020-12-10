import React from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import fetchData from './../../public/fetch/index';
import NavigationBar from '../../components/NavigationBar/NavigationBar';

export default class FetchDemoPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputText: '',
        };
    }

    _submit = async () => {
        const { inputText } = this.state;
        try {
            let res = await fetchData(`https://api.github.com/search/repositoriesa?q=${inputText}`);
            console.log(res);
        } catch (e) {
            console.log('///');
            console.log(e);
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar />
                <View style={styles.textInputContainer}>
                    <TextInput onChangeText={(val) => this.setState({ inputText: val })} style={styles.textInput} />
                    <Button title={'submit'} onPress={() => this._submit()} style={styles.button} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textInputContainer: {
        flexDirection: 'row',
    },
    textInput: {
        borderWidth: 1,
        flex: 1,
        height: 30,
    },
    button: {
        width: 20,
        height: 30,
        backgroundColor: 'red',
    },
});
