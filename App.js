import React from 'react'
const websocket = require('socket.io-client');

import { 
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  ScrollView,
  Button,
  KeyboardAvoidingView,
  Keyboard,
  TouchableHighlight
} from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    
    console.log('try to connect to websocket')

    // if you use emulator change address to http://localhost:3000
    this.socket = websocket.connect('http://192.168.249.81:3000')

    this.state = {
      message: null,
      messages: [],
      userId: null
    }
  }

  sendHandler = () => {
    const data = {
      text: this.state.message,
      userId: this.state.userId
    }
    this.socket.emit('send', data)
    this.setState({message: null})
  }

  componentDidMount() {
    this.socket.on('send', (message) => {
      this.setState({messages: [...this.state.messages, message ]})
    })

    this.socket.on('send-id', (id) => {
      this.setState({userId: id})
    })
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" onPress={Keyboard.dismiss}>
        <View style={styles.header}><Text style={styles.title}>Let's chat!</Text></View>

          <ScrollView 
            contentContainerStyle={styles.messages}
            ref={ref => this.scrollView = ref}
            onContentSizeChange={(contentWidth, contentHeight)=> {
              this.scrollView.scrollToEnd({animated: true});
            }}>
            {
              this.state.messages.map((message, id) => 
                <TouchableHighlight key={id} style={message.userId === this.state.userId ? styles.ownMessage : styles.messageWrapper}>
                  <Text style={message.userId === this.state.userId ? styles.myMessage : styles.message}>{message.text}</Text>
                </TouchableHighlight>
              )
            }
          </ScrollView>
        

        <View style={styles.footer}>
          <TextInput 
            style={styles.input} 
            onChangeText={(message) => this.setState({message})} value={this.state.message}
            placeholder="Write your message"
            />
          <Button style={styles.button} title="Send" onPress={this.sendHandler}/>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    justifyContent: 'flex-start'
  },
  text: {
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold'
  },
  footer: {
    flex: 0,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    paddingVertical: 10
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    fontSize: 18
  },
  messages: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 30,
    paddingTop: 20,
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  message: {
    fontSize: 18,
  },
  messageWrapper: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
    backgroundColor: '#EAEAEA',
    borderColor: 'transparent'
  },
  ownMessage: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
    backgroundColor: '#0E84FA',
    borderColor: 'transparent',
    alignSelf: 'flex-end'
  },
  myMessage: {
    fontSize: 18,
    color: '#fff'
  },
  button: {
    borderWidth: 1,
    borderColor: '#ccc'
  },
  header: {
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#F0F0F0'
  },
  title: {
    textAlign: 'center',
    fontSize: 20
  }
});
