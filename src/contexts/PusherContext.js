import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
} from '@pusher/pusher-websocket-react-native';
import { useAuth } from './AuthContext';
const PusherContext = createContext();

export const usePusher = () => useContext(PusherContext);

export const PusherProvider = ({ children }) => {
  const pusher = Pusher.getInstance();
  const [data, setData] = useState(null);
  const [dataConv, setDataConv] = useState(null);
  const {user} = useAuth();
  const [dataGroup, setDataGroup] = useState(null);
  const [dataForGroup, setDataForGroup] = useState(null);

  const connectPusher = async () => {
    await pusher.init({
      apiKey: "7d3cf02011bb653450a0",
      cluster: "mt1"
    });
    await pusher.connect();
    await pusher.subscribe({
      channelName: "pharmaceuticals",
      onEvent: (event: PusherEvent) => {
        console.log(`Event received - Context: ${event}`);
        let newMessage = JSON.parse(event.data)
        if (newMessage.isGroup == 0) {
          if (user.id == newMessage.receiver_id || user.id == newMessage.sender_id) {
            if (user.id != newMessage.sender_id) {
              setDataConv(newMessage)
              setData(newMessage)
            }else {
              setData(newMessage)
            }
          }
        }else {
          setDataGroup(newMessage)
        }
      }
    });
  };

  useEffect(() => {
    connectPusher();
  }, []);



  const pusherContextValue = {
    data,
    dataConv,
    dataForGroup
  };

  return (
    <PusherContext.Provider value={pusherContextValue}>
      {children}
    </PusherContext.Provider>
  );
};
