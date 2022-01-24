class Chatroom {
    constructor(room, username){
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub;
    }

    // adding new chat documents
    async addChat(message){
        // format a chat object
        const now = new Date();
        const chat = {
            message,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        }
        // save the chat object
        const response = await this.chats.add(chat);
        return response;
    }

    // setting up a real-time listener to get new chats
    getChats(callback){
        this.unsub = this.chats
            .where('room', '==', this.room)
            .orderBy('created_at')
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if(change.type === 'added'){
                        // update the ui
                        callback(change.doc.data());
                    }
                });
            });
    }  
    
    // updating the username
    updateName(username){
        this.username = username;
        localStorage.setItem('username', username);
    }

    // updating the room
    updateRoom(room){
        this.room = room;
        if(this.unsub){
            this.unsub();
        }
    }
}