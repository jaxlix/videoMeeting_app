import { api } from '@/api/api';
import { post, postJson, get } from '@/http/http';
import store from '../store/store';
// import adapter from 'webrtc-adapter';
var kurentoUtils = require('kurento-utils');


var socket = new WebSocket(api.meetingWsUrl);
var iceservers={
    "iceServers":[
        {
          urls:"stun:106.12.14.136:3478"
        },
        {
           urls:["turn:106.12.14.136:3478"],
           username:"kurento",
           credential: "kurento"
        }
       ]
}
if(socket.readyState == 0){
    console.log('开始创建 meeting websocket连接')
}
socket.onopen = function(){
    console.log('meeting websocket连接创建成功')
    meetingApi.connected = true;
    store.commit('setMeetingWsConnected', true);
    // meetingApi.register();
}
socket.onclose = function () {
    console.error('meeting websocket连接关闭')
    meetingApi.connected = false;
}

socket.onmessage = function (msg) {
    var parsedMessage = JSON.parse(msg.data);
	console.info('Received message: ' + msg.data);

	switch (parsedMessage.id) {
	case 'existingParticipants':
        store.commit('onExistingParticipants', parsedMessage.data);
        break;
    case 'userInvitedResult':
        store.commit('onUserInvitedResult', parsedMessage);
        break;
	case 'newParticipantArrived':
        store.commit('onNewParticipant', parsedMessage.name);
		break;
	case 'participantLeft':
        meetingApi.dispose(parsedMessage.name);
        store.commit('onParticipantLeft', parsedMessage.name);
		break;
	case 'receiveVideoAnswer':
		meetingApi.receiveVideoResponse(parsedMessage);
		break;
	case 'iceCandidate':
		meetingApi.iceCandidate(parsedMessage);
        break;
    case 'roomModeChanged':
        store.commit('onRoomModeChanged', parsedMessage.mode);
        break;
    case 'participantKickOut':
        meetingApi.dispose(parsedMessage.name);
        store.commit("onParticipantKickOut", parsedMessage.name)
        break;
    case 'enableUserAudio':
        store.commit("onEnableUserAudio", parsedMessage);
        break;
    case 'usersAdded':
        store.commit("onUsersAdded", parsedMessage);
        break;
	default:
		console.error('Unrecognized message', parsedMessage);
    }
    
}

const meetingApi = {
    connected: false,
    dispose: function(name) {
        var rtcPeer = this.peerMap.get(name);
        if(rtcPeer) {
            rtcPeer.dispose();
            meetingApi.peerMap.delete(name);
        }
    },
    iceCandidate: function(message) {
        var rtcPeer = this.peerMap.get(message.name);
        rtcPeer.addIceCandidate(message.candidate, function (error) {
            if (error) {
              console.error("Error adding candidate: " + error);
              return;
            }
        });
    },
    receiveVideoResponse: function(result) {
        var rtcPeer = this.peerMap.get(result.name);
        rtcPeer.processAnswer (result.sdpAnswer, function (error) {
            if (error) return console.error (error);
            meetingApi.enableAudio(result.name, rtcPeer.customEnableAudio);
            let video = document.getElementById('video-' + result.name);
            if(video) {
                video.load();
            }

            // setTimeout(()=>meetingApi.enableAudio(result.name, rtcPeer.customEnableAudio), 100);
        });

    },
    peerMap: new Map(),
    sendMessage: function(message) {
        var jsonMessage = JSON.stringify(message);
        socket.send(jsonMessage);
    },
    register: function (uniqueNo, roomId) {
        var message = {
            id : 'joinRoom',
            name : uniqueNo,
            room : roomId,
        }
        this.sendMessage(message);
        this.current = uniqueNo;
    },
    hangUpUser: function (uniqueNo) {
        var message = {
            id : 'hangUp',
            name : uniqueNo,
        }
        this.sendMessage(message);
    },
    changeRoomMode: function (mode) {
        var message = {
            id : 'changeRoomMode',
            mode: mode
        }
        this.sendMessage(message);
    },
    kickOutUser: function (name) {
        var message = {
            id : 'kickOut',
            name: name
        }
        this.sendMessage(message);
    },
    toggleAudio: function(name, enable) {
        var message = {
            id : 'audioEnable',
            name: name,
            enable: enable
        }
        this.sendMessage(message);
    },
    enableAudio: function(name, enable) {
        var rtcPeer = meetingApi.peerMap.get(name);
        if(rtcPeer) {
            if(meetingApi.current == name) {
                rtcPeer.getLocalStream().getAudioTracks()[0].enabled = enable;
            } else {
                rtcPeer.getRemoteStream().getAudioTracks()[0].enabled = enable;
            }
        }
    },
    createRoom: function(presidentId, callback) {
        debugger
        let params = new URLSearchParams()
        params.append('presidentId', presidentId);
        post(api.meetingServiceUrl + "room/new", params).then(res => {
            console.log(res)
            callback(res);
        }).catch(err => {
            console.log(err)
        })
    },
    getRoomUsers: function(roomId, callback) {
        get(api.meetingServiceUrl + "room/" + roomId + "/getUsers").then(res => {
            console.log(res)
            callback(res);
        }).catch(err => {
            console.log(err)
        })
    },
    startMeeting: function(roomId, callback) {
        get(api.meetingServiceUrl + "room/" + roomId + "/start").then(res => {
            console.log(res)
            callback(res);
        }).catch(err => {
            console.log(err)
        })
    },
    endMeeting: function(roomId, callback) {
        get(api.meetingServiceUrl + "room/" + roomId + "/end").then(res => {
            console.log(res)
            callback(res);
        }).catch(err => {
            console.log(err)
        })
    },
    getRoomInfo: function(roomId, callback) {
        get(api.meetingServiceUrl + "room/" + roomId).then(res => {
            console.log(res)
            callback(res);
        }).catch(err => {
            console.log(err)
        })
    },
    notifyUserJoin: function(roomId, user, callback) {
        get(api.meetingServiceUrl + "room/" + roomId + "/notify/" + user).then(res => {
            console.log(res)
            callback(res);
        }).catch(err => {
            console.log(err)
        })
    },
    addRoomUsers: function(roomId,data, callback) {
        postJson(api.meetingServiceUrl + "room/" + roomId + "/addUsers", data).then(res => {
            console.log(res)
            callback(res);
        }).catch(err => {
            console.log(err)
        })
    },

    sendOnly: function(video, enableAudio) {
        // if(meetingApi.peerMap.get(meetingApi.current)) {
        //     return;
        // }
        var constraints = {
            audio : true,
            video : {
                mandatory : {
                    maxWidth : 1280,
                    maxFrameRate : 30,
                    minFrameRate : 15
                }
            }
        };
        var options = {
            localVideo: video,
            mediaConstraints: constraints,
            configuration: iceservers,
            onicecandidate: function(candidate){
                console.log("Local candidate" + JSON.stringify(candidate));
                var message = {
                  id: 'onIceCandidate',
                  candidate: candidate,
                  name: meetingApi.current,
                };
                meetingApi.sendMessage(message);
            }
        }

        var rtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options,
            function (error) {
              if(error) {
                  return console.error(error);
              }
              this.generateOffer (function(error, offerSdp){
                if (error) return console.error ("sdp offer error")
                console.log('Invoking SDP offer callback function');
                var msg =  { id : "receiveVideoFrom",
                        sender : meetingApi.current,
                        sdpOffer : offerSdp
                    };
                meetingApi.sendMessage(msg);
            });
        });
        rtcPeer.customEnableAudio = enableAudio;
        meetingApi.peerMap.set(meetingApi.current, rtcPeer);
    },
    receiveOnly: function(video, name, enableAudio) {
        // if(meetingApi.peerMap.get(name)) {
        //     meetingApi.peerMap.get(name).audioEnabled = enableAudio;
        //     return;
        // }
        var constraints = {
            audio : true,
            video : {
                mandatory : {
                    maxWidth : 1280,
                    maxFrameRate : 30,
                    minFrameRate : 15
                },

            }
        };
        var options = {
            remoteVideo: video,
            configuration: iceservers,
            mediaConstraints: constraints,
            onicecandidate: function(candidate){
                console.log("Local candidate" + JSON.stringify(candidate));
                var message = {
                  id: 'onIceCandidate',
                  candidate: candidate,
                  name: name,
                };
                meetingApi.sendMessage(message);
            }
        };
        var rtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options,
                function (error) {
                if(error) {
                    return console.error(error);
                }
                this.generateOffer (function(error, offerSdp){
                    if (error) return console.error ("sdp offer error")
                    console.log('Invoking SDP offer callback function');
                    var msg =  { 
                            id : "receiveVideoFrom",
                            sender : name,
                            sdpOffer : offerSdp
                        };
                    meetingApi.sendMessage(msg);
                });
        });
        rtcPeer.customEnableAudio = enableAudio;
        meetingApi.peerMap.set(name, rtcPeer);
    }
}

export default meetingApi