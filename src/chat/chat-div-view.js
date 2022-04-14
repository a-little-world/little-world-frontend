import React, {Component} from 'react';
import 'react-chat-elements/dist/main.css';
import 'react-toastify/dist/ReactToastify.css';
import ReactHtmlParser from 'react-html-parser'; 
import './App.css';
import {ToastContainer, toast} from 'react-toastify';
import {
    MessageBox,
    ChatItem,
    ChatList,
    SystemMessage,
    MessageList,
    Input,
    Button,
    Avatar,
    Navbar,
    SideBar,
    Dropdown,
    Popup,
} from 'react-chat-elements';
import throttle from 'lodash.throttle';
import {FaSearch, FaComments, FaWindowClose, FaEdit, FaPaperclip, FaSquare, FaTimesCircle} from 'react-icons/fa';
import {MdMenu} from 'react-icons/md';
import ReconnectingWebSocket from 'reconnecting-websocket';
import {
    uploadFile,
    sendOutgoingFileMessage,
    createNewDialogModelFromIncomingMessageBox,
    getSubtitleTextFromMessageBox,
    fetchSelfInfo,
    handleIncomingWebsocketMessage,
    sendOutgoingTextMessage,
    filterMessagesForDialog,
    fetchDialogs,
    fetchMessages,
    fetchUsersList,
    sendIsTypingMessage,
    markMessagesForDialogAsRead,
    sendMessageReadMessage
} from "./chat.lib"

import {
    format,
} from 'timeago.js';

import loremIpsum from 'lorem-ipsum';
import $ from 'jquery'; 

function getCookie2(name) { // I know this is all hella redundant, but im coding fast ok!
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie2('csrftoken');

const TYPING_TIMEOUT = 5000;
const chatItemSortingFunction = (a, b) => b.date - a.date;

/* How the view should be rendered
                            <div class="chat-bottom">
                                <div class="chat-start">
                                    <div class="outgoing">
                                        <div class="outgoingtext">Lorem ipsum</div>
                                    </div>
                                    <div class="ingoing">
                                        <div class="ingoingtext">Lorem ipsum</div>
                                        <div class="ctime">15:35</div>
                                    </div>
                                    <div class="outgoing">
                                        <div class="outgoingtext">Lorem ipsum</div>
                                    </div>
                                    <div class="ingoing">
                                        <div class="ingoingtext">Lorem ipsum</div>
                                        <div class="ctime">15:35</div>
                                    </div>
                                    <div class="outgoing">
                                        <div class="outgoingtext">Lorem ipsum</div>
                                    </div>
                                    <div class="ingoing">
                                        <div class="ingoingtext">Lorem ipsum</div>
                                        <div class="ctime">15:35</div>
                                    </div>
                                </div>
                                <textarea placeholder="Lorem ipsum...."></textarea>
                            </div>
                        </div>
*/

function getCookie() {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


export class MessageItemTim extends Component {

    constructor(props) {
        super(props);

    }

    render() {

        var _div_class1 = ''
        var _div_class2 = ''

        var ingoing = false

        if(this.props.cur_dialog !== null){
            ingoing = this.props.title != this.props.cur_dialog.alt
        }


        if (!ingoing) {
            _div_class1 = 'outgoing'
            _div_class2 = 'outgoingtext'
        } else { // The other user...
            _div_class1 = 'ingoing'
            _div_class2 = 'ingoingtext'
        }
      

        return (
        <div className={_div_class1}>
            <div className={_div_class2}>
                { ReactHtmlParser (this.props.text) }
            </div>
            {ingoing &&
            <div className="ctime">
                { ReactHtmlParser ('15:35')}
            </div>}
        </div>
        );
    }
}

export class MessageListTim extends Component {

    constructor(props) {
        super(props);

    }

    handleKeyPress = (e) => {
        if (e.charCode !== 13) {
            console.log('key pressed');

            this.props.parent.isTyping();
        }
        if (e.shiftKey && e.charCode === 13) {
            return true;
        }
        if (e.charCode === 13) {
            if (this.props.parent.state.socket.readyState === 1) {
                this.props.parent.performSendingMessage()
                e.preventDefault();

            }
            return false;
        }
    }

    render() {
        return (

            <div className="chat-bottom"> 
            <div className="chat-start"> 
                {this.props.dataSource.map((x, i) => (
                    <MessageItemTim
                        key={i}
                        cur_dialog={this.props.cur_dialog}
                        {...x}
                    />
                )) }
            </div>
            <textarea
            ref={this.props.parent.setTextInputRef}
            placeholder="Lorem ipsum...."
                        defaultValue=""
                        onKeyPress={this.handleKeyPress}
            />
            </div> 
        );
    }
}

export class App extends Component {

    constructor(props) {
        super(props);
        this.other_user_display_name = props.other_user_display_name;
        // Refs
        this.textInput = null;
        this.setTextInputRef = element => {
            this.textInput = element;
        };
        this.clearTextInput = () => {
            if (this.textInput) this.textInput.value = ""
        };

        this.searchInput = null;
        this.setSearchInputRef = element => {
            this.searchInput = element;
        };

        this.fileInput = null;
        this.setFileInputRef = element => {
            this.fileInput = element;
        };

        this.clearSearchInput = () => {
            if (this.searchInput) this.searchInput.clear();
        };


        this.state = {
            socketConnectionState: 0,
            showNewChatPopup: false,
            newChatChosen: null,
            usersDataLoading: false,
            availableUsers: [],
            messageList: [],
            dialogList: [],
            filteredDialogList: [],
            typingPKs: [],
            onlinePKs: [],
            selfInfo: null,
            selectedDialog: null,
            socket: new ReconnectingWebSocket('wss://' + window.location.host + '/chat_ws')
        };
        //some js magic
        this.performSendingMessage = this.performSendingMessage.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.replaceMessageId = this.replaceMessageId.bind(this);
        this.addPKToTyping = this.addPKToTyping.bind(this);
        this.changePKOnlineStatus = this.changePKOnlineStatus.bind(this);
        this.setMessageIdAsRead = this.setMessageIdAsRead.bind(this);
        this.newUnreadCount = this.newUnreadCount.bind(this);
        this.triggerFileRefClick = this.triggerFileRefClick.bind(this);
        this.handleFileInputChange = this.handleFileInputChange.bind(this);


        this.isTyping = throttle(() => {
            sendIsTypingMessage(this.state.socket)
        }, TYPING_TIMEOUT)

        this.localSearch = throttle(() => {
            let val = this.searchInput.input.value;
            console.log("localSearch with '" + val + "'")
            if (!val || 0 === val.length) {
                this.setState(prevState => ({filteredDialogList: prevState.dialogList}));
            } else {
                this.setState(prevState => ({
                    filteredDialogList: prevState.dialogList.filter(function (el) {
                        return el.title.toLowerCase().includes(val.toLowerCase())
                    })
                }))
            }
        }, 100)
    }

    componentDidMount() {
        fetchMessages().then((r) => {
            if (r.tag === 0) {
                console.log("Fetched messages:")
                console.log(r.fields[0])
                this.setState({messageList: r.fields[0]})
            } else {
                console.log("Messages error:")
                toast.error(r.fields[0])
            }
        })

        fetchDialogs().then((r) => {
            if (r.tag === 0) {
                console.log("Fetched dialogs:")
                console.log(r.fields[0])
                this.setState({dialogList: r.fields[0], filteredDialogList: r.fields[0]})
                // get the current user display_name: TODO:
                //TODO: also handle failure
                console.log(r.fields);
                var _res = r.fields[0].filter(w => this.other_user_display_name == w.title); // Find's the right dialog, selects it TODO: name should be set dynamicly here, TODO maybe also this should use .title
                console.log(_res);
                this.selectDialog(_res[0])

            } else {
                console.log("Dialogs error:")
                toast.error(r.fields[0])
            }
        })
        fetchSelfInfo().then((r) => {
            if (r.tag === 0) {
                console.log("Fetched selfInfo:")
                console.log(r.fields[0])
                this.setState({selfInfo: r.fields[0]})
            } else {
                console.log("SelfInfo error:")
                toast.error(r.fields[0])
            }
        })
        this.setState({socketConnectionState: this.state.socket.readyState});
        const that = this;
        let socket = this.state.socket;
        let toastOptions = {
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            draggable: false,
        };

        socket.onopen = function (e) {
            toast.success("Connected!", toastOptions)
            that.setState({socketConnectionState: socket.readyState});
        }
        socket.onmessage = function (e) {
            that.setState({socketConnectionState: socket.readyState});

            let errMsg = handleIncomingWebsocketMessage(socket, e.data, {
                addMessage: that.addMessage,
                replaceMessageId: that.replaceMessageId,
                addPKToTyping: that.addPKToTyping,
                changePKOnlineStatus: that.changePKOnlineStatus,
                setMessageIdAsRead: that.setMessageIdAsRead,
                newUnreadCount: that.newUnreadCount
            });
            if (errMsg) {
                toast.error(errMsg)
            }
        };
        socket.onclose = function (e) {
            toast.info("Disconnected...", toastOptions)
            that.setState({socketConnectionState: socket.readyState});
            console.log("websocket closed")
        }
    }

    selectDialog(item) {
        console.log(item)
        console.log("Selecting dialog " + item.id)
        this.setState({selectedDialog: item})
        this.setState(prevState => ({
            dialogList: prevState.dialogList.map(el => (el.id === item.id ?
                {...el, statusColorType: 'encircle'} : {...el, statusColorType: undefined}))
        }))
        this.setState(prevState => ({filteredDialogList: prevState.dialogList}));
        markMessagesForDialogAsRead(this.state.socket, item, this.state.messageList, this.setMessageIdAsRead);
    }

    getSocketState() {
        if (this.state.socket.readyState === 0) {
            return "Connecting..."
        } else if (this.state.socket.readyState === 1) {
            return "Connected"
        } else if (this.state.socket.readyState === 2) {
            return "Disconnecting..."
        } else if (this.state.socket.readyState === 3) {
            return "Disconnected"
        }
    }

    addPKToTyping(pk) {
        console.log("Adding " + pk + " to typing pk-s")
        let l = this.state.typingPKs;
        l.push(pk);
        this.setState({typingPKs: l})
        const that = this;
        setTimeout(() => {
            // We can't use 'l' here because it might have been changed in the meantime
            console.log("Will remove " + pk + " from typing pk-s")
            let ll = that.state.typingPKs;
            const index = ll.indexOf(pk);
            if (index > -1) {
                ll.splice(index, 1);
            }
            that.setState({typingPKs: ll})
        }, TYPING_TIMEOUT);
    }

    changePKOnlineStatus(pk, onoff) {
        console.log("Setting " + pk + " to " + onoff ? "online" : "offline" + " status")
        let onlines = this.state.onlinePKs;
        if (onoff) {
            onlines.push(pk)
        } else {
            const index = onlines.indexOf(pk);
            if (index > -1) {
                onlines.splice(index, 1);
            }
        }
        this.setState({onlinePKs: onlines})
        this.setState(prevState => ({
            dialogList: prevState.dialogList.map(function (el) {
                if (el.id === pk) {
                    if (onoff) {
                        return {...el, statusColor: 'lightgreen'};
                    } else {
                        return {...el, statusColor: ''};
                    }
                } else {
                    return el;
                }
            })
        }))
        this.setState(prevState => ({filteredDialogList: prevState.dialogList}));
    }

    addMessage(msg) {
        console.log("Calling addMessage for ")

        if (!msg.data.out && msg.data.message_id > 0 && this.state.selectedDialog && this.state.selectedDialog.id === msg.data.dialog_id) {
            sendMessageReadMessage(this.state.socket, msg.data.dialog_id, msg.data.message_id)
            msg.status = 'read'
        }
        let list = this.state.messageList;
        list.push(msg);
        console.log(msg);
        this.setState({
            messageList: list,
        });
        let doesntNeedLastMessageSet = false;
        if (!msg.data.out) {
            let dialogs = this.state.dialogList;
            let hasDialogAlready = dialogs.some((e) => e.id === msg.data.dialog_id);
            if (!hasDialogAlready) {
                let d = createNewDialogModelFromIncomingMessageBox(msg)
                dialogs.push(d);
                doesntNeedLastMessageSet = true;
                this.setState({
                    dialogList: dialogs,
                });
            }
        }
        if (!doesntNeedLastMessageSet) {
            this.setState(prevState => ({
                dialogList: prevState.dialogList.map(function (el) {
                    if (el.id === msg.data.dialog_id) {
                        console.log("Setting dialog " + msg.data.dialog_id + " last message");
                        return {...el, subtitle: getSubtitleTextFromMessageBox(msg)};
                    } else {
                        return el;
                    }
                })
            }));
        }

        this.setState(prevState => ({filteredDialogList: prevState.dialogList}));
    }

    replaceMessageId(old_id, new_id) {
        console.log("Replacing random id  " + old_id + " with db_id " + new_id)
        this.setState(prevState => ({
            messageList: prevState.messageList.map(function (el) {
                if (el.data.message_id.Equals(old_id)) {
                    let new_status = ''
                    if (el.data.out) {
                        new_status = 'sent'
                    } else {
                        if (prevState.selectedDialog && prevState.selectedDialog.id === el.data.dialog_id) {
                            sendMessageReadMessage(prevState.socket, el.data.dialog_id, new_id)
                            new_status = 'read'
                        } else {
                            new_status = 'received'
                        }
                    }
                    return {
                        ...el,
                        data: {...el.data, dialog_id: el.data.dialog_id, message_id: new_id, out: el.data.out},
                        status: new_status
                    }
                } else {
                    return el
                }
            })
        }))
    }

    newUnreadCount(dialog_id, count) {
        console.log("Got new unread count " + count + " for dialog " + dialog_id)
        this.setState(prevState => ({
            dialogList: prevState.dialogList.map(function (el) {
                if (el.id === dialog_id) {
                    console.log("Setting new unread count " + count + " for dialog " + dialog_id)
                    return {...el, unread: count};
                } else {
                    return el;
                }
            })
        }));
        this.setState(prevState => ({
            selectedDialog: prevState.selectedDialog && prevState.selectedDialog.id === dialog_id ? {
                ...prevState.selectedDialog,
                unread: count
            } : prevState.selectedDialog
        }));
        this.setState(prevState => ({filteredDialogList: prevState.dialogList}));

    }

    setMessageIdAsRead(msg_id) {
        console.log("Setting msg_id " + msg_id + " as read")
        this.setState(prevState => ({
            messageList: prevState.messageList.map(function (el) {
                if (el.data.message_id.Equals(msg_id)) {
                    return {...el, status: 'read'}
                } else {
                    return el
                }
            })
        }))
    }

    performSendingMessage() {
        if (this.state.selectedDialog) {
            console.log(this.textInput);
            console.log(this.textInput.value);
            let text = this.textInput.value;
            let user_pk = this.state.selectedDialog.id;
            this.clearTextInput();
            let msgBox = sendOutgoingTextMessage(this.state.socket, text, user_pk, this.state.selfInfo);
            console.log("sendOutgoingTextMessage result:")
            console.log(msgBox)
            if (msgBox) {
                this.addMessage(msgBox);
            }
        }
    }

    handleFileInputChange(e) {
        console.log("Upload starting...");
        console.log(e.target.files);

        //TODO: set 'file uploading' state to true, show some indication of file upload in progress
        uploadFile(e.target.files, getCookie()).then((r) => {
            if (r.tag === 0) {
                console.log("Uploaded file :")
                console.log(r.fields[0])
                let user_pk = this.state.selectedDialog.id;
                let uploadResp = r.fields[0];
                let msgBox = sendOutgoingFileMessage(this.state.socket, user_pk, uploadResp, this.state.selfInfo);
                console.log("sendOutgoingFileMessage result:");
                console.log(msgBox);
                if (msgBox) {
                    this.addMessage(msgBox);
                }
            } else {
                console.log("File upload error")
                toast.error(r.fields[0])
            }
        })

    }

    triggerFileRefClick() {
        this.fileInput.click()
    }
    // What we need to do is:
    // 1 - check who is the *other* call user
    // 2 - select that dialog
    // 3 - get the messages, render them
    // 4 - implement message sending

    // TODO: we need to build react component with dataSource= for this to work, otherwise message fetching cant work async

    render() {
        return (
                <MessageListTim
                dataSource={filterMessagesForDialog(this.state.selectedDialog, this.state.messageList)}
                parent={this}
                cur_dialog={this.state.selectedDialog}
                />
        );
    }
}

/*
                user_id={this.state.selectedDialog.user_id}
                other_user_id={this.state.selectedDialog.other_user_id}
*/
//{filterMessagesForDialog(this.state.selectedDialog, this.state.messageList)}

export default App;
