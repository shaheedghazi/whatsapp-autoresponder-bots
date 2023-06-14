const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();
const activeChats = {};

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('authenticated', (session) => {
  console.log('Client authenticated');
});

client.on('auth_failure', (error) => {
  console.error('Authentication failed:', error);
});

client.on('disconnected', (reason) => {
  console.log('Client disconnected:', reason);
});

client.on('message', handleIncomingMessage);
client.on('message_ack', handleAcknowledgeStatus);

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

async function handleAcknowledgeStatus(message, ack) {
  console.log(`Message acknowledged: ${message.id}, Ack: ${ack}`);
  // Handle acknowledgement status here
}

async function sendInitialOptions(msg) {
  const welcomeMessage =
    'Welcome to My Company. Please choose from below options:\n' +
    '1. Send Information about envato\n' +
    '2. Send Information about adobe\n' +
    '3. Information about other products\n' +
    'To chat with a human operator, send "chat".';
  await sendMessage(msg.from, welcomeMessage);
}

async function sendChatStartedMessage(msg) {
  const chatStartedMessage =
    'You are now chatting with a human operator. To return to bot mode, send "bot".';
  await sendMessage(msg.from, chatStartedMessage);
}

async function forwardToHumanOperator(msg) {
  // Implement the logic to forward the message to a human operator
  // You can use a messaging system, API, or any other method to handle the conversation with the operator
  // For this example, let's simply log the forwarded message
  console.log('Forwarded message from user:', msg.body);
}

async function sendEnvatoInfo(msg) {
  const envatoInfo = 'Here is some information about Envato...';
  await sendMessage(msg.from, envatoInfo);
}

async function sendAdobeInfo(msg) {
  const adobeInfo = 'Here is some information about Adobe...';
  await sendMessage(msg.from, adobeInfo);
}

async function sendOtherInfo(msg) {
  const otherInfo = 'Here is some other information...';
  await sendMessage(msg.from, otherInfo);
}

async function sendInvalidCommandMessage(msg) {
  const invalidCommandMessage = 'Invalid command. Please choose a valid option.';
  await sendMessage(msg.from, invalidCommandMessage);
}

async function sendMessage(to, text) {
  try {
    await client.sendMessage(to, text);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
}

async function initialize() {
  try {
    await client.initialize();
  } catch (error) {
    console.error('Initialization failed:', error);
  }
}

initialize();
