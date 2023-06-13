const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();
const activeChats = {};

client.on('qr', (qr) => {
  console.log('QR code for instance 2:');
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
        case 'a':
          await sendOptionAInfo(msg);
          break;
        case 'b':
          await sendOptionBInfo(msg);
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

async function sendInitialOptions(msg) {
  const welcomeMessage =
    'Welcome to Bot Instance 2. Please choose from the options:\n' +
    'Type "a" for Option A\n' +
    'Type "b" for Option B\n' +
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

async function sendOptionAInfo(msg) {
  const optionAInfo = 'Here is some information about Option A...';
  await sendMessage(msg.from, optionAInfo);
}

async function sendOptionBInfo(msg) {
  const optionBInfo = 'Here is some information about Option B...';
  await sendMessage(msg.from, optionBInfo);
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
