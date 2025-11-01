<script>
  const chatbotBody = document.getElementById('chatbotBody');
  const userInput = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  const fileInput = document.getElementById('fileInput');
  const voiceBtn = document.getElementById('voiceBtn');

  // Add message to chat
  function addMessage(content, isUser = false) {
    const msg = document.createElement('div');
    msg.classList.add(isUser ? 'user-message' : 'bot-message');
    msg.innerHTML = content;
    chatbotBody.appendChild(msg);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
    return msg;
  }

  // Typing effect for AI
  function typeMessage(message, element, callback) {
    let index = 0;
    const typingInterval = setInterval(() => {
      element.innerHTML = message.substring(0, index++) + "▋";
      chatbotBody.scrollTop = chatbotBody.scrollHeight;
      if (index > message.length) {
        clearInterval(typingInterval);
        element.innerHTML = message;
        if (callback) callback();
      }
    }, 30);
  }

  // Fake AI reply generator
  function getAIReply(userMsg) {
    const replies = [
      "That's interesting! Tell me more.",
      "Hmm, I’ll think about that 🤔",
      "I’m not sure, but it sounds cool!",
      "Nice one! What else can I do for you?",
      "NikshithAI always has your back 💙"
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  // Send message
  sendBtn.onclick = () => {
    const msg = userInput.value.trim();
    if (!msg) return;
    addMessage(msg, true);
    userInput.value = '';

    const botMsg = addMessage("...", false);
    const reply = getAIReply(msg);

    setTimeout(() => {
      typeMessage(reply, botMsg, () => speak(reply)); // Voice after typing sync
    }, 500);
  };

  // Press Enter to send
  userInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendBtn.click();
  });

  // File upload
  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (file) {
      addMessage(`📎 <b>${file.name}</b> uploaded successfully.`, true);
      setTimeout(() => addMessage("I’ll process that soon!"));
    }
  };

  // Voice input
  voiceBtn.onclick = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();
    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      userInput.value = voiceText;
      sendBtn.click();
    };
    recognition.onerror = () => addMessage("⚠️ Voice recognition failed. Try again.");
  };

  // Female voice output
  function speak(text) {
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice =
      voices.find(v => v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Google UK English Female")) || voices[0];

    const speech = new SpeechSynthesisUtterance(text);
    speech.voice = femaleVoice;
    speech.lang = 'en-US';
    speech.pitch = 1.2;
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  }

  // Intro greeting when the page loads
  window.onload = () => {
    setTimeout(() => {
      const greeting = "Hey Nikshith! 👋 I’m your smart AI assistant. How can I help you today?";
      const greetMsg = addMessage("...", false);
      typeMessage(greeting, greetMsg, () => speak(greeting));
    }, 600);
  };
</script>
