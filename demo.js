const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Create a new client instance
const client = new Client();
const activeChats = {};

// Event: QR code generated
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

// Event: Client is ready
client.on('ready', () => {
  console.log('Client is ready!');
});

// Event: Client authenticated
client.on('authenticated', (session) => {
  console.log('Client authenticated');
});

// Event: Authentication failure
client.on('auth_failure', (error) => {
  console.error('Authentication failed:', error);
});

// Event: Client disconnected
client.on('disconnected', (reason) => {
  console.log('Client disconnected:', reason);
});

// Event: Incoming message
client.on('message', handleIncomingMessage);

// Event: Message acknowledgement status
client.on('message_ack', handleAcknowledgeStatus);

// Handle incoming messages
async function handleIncomingMessage(msg) {
  const chatId = msg.from;

  if (!activeChats[chatId]) {
    activeChats[chatId] = { mode: 'bot' };
    await sendInitialOptions(msg);
  } else {
    const command = msg.body.trim().toLowerCase();

    if (command === 'bot') {
      activeChats[chatId].mode = 'bot';
      await sendInitialOptions(msg);
    } else if (activeChats[chatId].mode === 'bot') {
      switch (command) {
        case '1':
          await sendEnvatoInfo(msg);
          break;
        case '2':
          await sendAdobeInfo(msg);
          break;
        case '3':
          await sendOtherInfo(msg);
          break;
        case 'chat':
          activeChats[chatId].mode = 'human';
          await sendChatStartedMessage(msg);
          break;
        default:
          await sendInvalidCommandMessage(msg);
          break;
      }
    } else if (activeChats[chatId].mode === 'human') {
      // Forward the message to a human operator or perform any desired action
      await forwardToHumanOperator(msg);
    }
  }
}

// Handle message acknowledgement status
async function handleAcknowledgeStatus(message, ack) {
  console.log(`Message acknowledged: ${message.id}, Ack: ${ack}`);
  // Handle acknowledgement status here
}

// Send initial options to the user
async function sendInitialOptions(msg) {
  const welcomeMessage =
    'Welcome to My Company. Please choose from the options below:\n' +
    '1. Send Information about Envato\n' +
    '2. Send Information about Adobe\n' +
    '3. Send Information about Other Products\n' +
    'To chat with a human operator, send "chat".';

  await sendMessage(msg.from, welcomeMessage);
}

// Send a message indicating the chat has started with a human operator
async function sendChatStartedMessage(msg) {
  const chatStartedMessage =
    'You are now chatting with a human operator. To return to bot mode, send "bot".';

  await sendMessage(msg.from, chatStartedMessage);
}

// Forward the message to a human operator
async function forwardToHumanOperator(msg) {
  // Implement the logic to forward the message to a human operator
  // You can use a messaging system, API, or any other method to handle the conversation with the operator
  // For this example, let's simply log the forwarded message
  console.log('Forwarded message from user:', msg.body);
}

// Send information about Envato
async function sendEnvatoInfo(msg) {
  const envatoInfo = 'Here is some information about Envato...';
  await sendMessage(msg.from, envatoInfo);
}

// Send information about Adobe
async function sendAdobeInfo(msg) {
  const adobeInfo = 'Here is some information about Adobe...';
  await sendMessage(msg.from, adobeInfo);
}

// Send information about other products
async function sendOtherInfo(msg) {
  const otherInfo = 'Here is some other information...';
  await sendMessage(msg.from, otherInfo);
}

// Send an invalid command message
async function sendInvalidCommandMessage(msg) {
  const invalidCommandMessage = 'Invalid command. Please choose a valid option.';
  await sendMessage(msg.from, invalidCommandMessage);
}

// Send a message to a chat
async function sendMessage(to, text) {
  try {
    await client.sendMessage(to, text);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
}

// Initialize the client
async function initialize() {
  try {
    await client.initialize();
  } catch (error) {
    console.error('Initialization failed:', error);
  }
}

// Start the initialization process
initialize();
