import firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore"
const config = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID
};

firebase.initializeApp(config);

export const auth = firebase.auth;
export const db = firebase.firestore()
//export const db = firebase.database();

export async function createChat(myinfo, userinfo) {
  const user_ids = myinfo.id > userinfo.id ? [myinfo.id, userinfo.id] : [userinfo.id, myinfo.id];
  const user_names = myinfo.id > userinfo.id ? [`${myinfo.first_name} ${myinfo.last_name}`, `${userinfo.first_name} ${userinfo.last_name}`] : [`${userinfo.first_name} ${userinfo.last_name}`, `${myinfo.first_name} ${myinfo.last_name}`];
  const user_photos = myinfo.id > userinfo.id ? [myinfo.photo, userinfo.photo] : [userinfo.photo, myinfo.photo];
  const room_name = myinfo.id > userinfo.id ? `room-${myinfo.id}-${userinfo.id}` : `room-${userinfo.id}-${myinfo.id}`;
  try {
    const checkResponse = await db.collection('rooms')
                        .where('room_name', '==', room_name)
                        .get();
    if (!checkResponse.empty) {
      return checkResponse.docs[0].id;
    }
    const createInfo = {
      user_ids,
      user_names,
      user_photos,
      messages: [],
      room_name,
      createdAt: db.FieldValue.serverTimestamp(),
    }
    const response = await db.collection('rooms').add(createInfo);
    return response.id
  } catch (err) {
    console.log("ERROR ADDING", err)
  }
}

export async function sendMessage(room_id, user_id, message) {
  console.log("ROOM_ID", room_id)
  console.log("ROOM_ID", user_id)
  console.log("ROOM_ID", message)
  try {
    const roomRef = db.collection('rooms').doc(room_id);
    let roomInfo = await roomRef.get();
    let messages = roomInfo.data().messages;
    messages.unshift({
      user_id,
      message,
      createdAt: new Date(),
    })
    roomRef.update({ messages: messages })
  } catch (err) {
    console.log("ERROR SENDING MESSAGE: ", err)
  }
}