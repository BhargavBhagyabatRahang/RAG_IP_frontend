const chatBox=document.getElementById("chatBox");

function addMessage(message,sender)
{
    const msgDiv=document.createElement("div");
    msgDiv.className = sender === "user" ? "user-msg" : "bot-msg" ;

    const bubble=document.createElement("div");
    bubble.className = "bubble " + (sender === "user" ? "user-bubble" : "bot-bubble" )
    bubble.innerText = message;

    msgDiv.appendChild(bubble);
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function typeWriterEffect(text, element)
{
    let index = 0;
    element.textContent = "";

    const interval = setInterval(() => {
        if (index < text.length)
        {
            element.textContent += text.charAt(index);
            index++;
            chatBox.scrollTop = chatBox.scrollHeight;
        }
        else
        {
            clearInterval(interval);
        }
    }, 20);
}

function sendMessage()
{
    const input = document.getElementById("userInput");
    const message = input.value.trim();

    if (!message) return ;

    addMessage(message,"user");
    input.value="";

    const typingDiv=document.createElement("div");
    typingDiv.className="bot-msg typing";
    typingDiv.innerText="Loading the reply, please wait ...."

    chatBox.appendChild(typingDiv);
    chatBox.scrollTop=chatBox.scrollHeight;

    fetch("/send/",
        { 
            method: "POST",
            headers:{
                          "Content-Type":"application/json"
                    },
            body: JSON.stringify({
                session_id: sessionId,
                      message: message
                 })
        })
    .then(response=>response.json())
    .then(data => {
        
        chatBox.removeChild(typingDiv);

        const msgDiv = document.createElement("div");
        msgDiv.className="bot-msg";

        const bubble = document.createElement("div");
        bubble.className="bubble bot-bubble";

        typeWriterEffect(data.answer,bubble);

        msgDiv.appendChild(bubble);     
        chatBox.appendChild(msgDiv);   
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => {

        chatBox.removeChild(typingDiv);
        addMessage("Error connecting to AI.","bot");

    });
}