import React, { useState } from 'react'
import { db, auth } from '../firebase'
import { collection, addDoc, serverTimestamp} from "firebase/firestore";

function SendMessage() {
    const [msg, setMsg] = useState('')
    const messagesRef = collection(db, "messages");
  const { user } = auth;
       const sendMsg = async (e) => {
        const { uid } = user?.uid
        
        await addDoc(messagesRef, {
            text: msg,
            createdAt: serverTimestamp(),
            uid: uid,
           
        })
        setMsg('');
      };

console.log(user?.currentUser.uid)

    return (
          <div> 
               <input placeholder='Message...' 
                 type="text" value={msg} 
                 onChange={(e) => setMsg(e.target.value)}
              />
              <button onClick={sendMsg}>Send</button>
        </div>
    )
}

export default SendMessage