# Multiple Bots with WhatsApp Web.js

This repository contains an example project that demonstrates how to create and run multiple WhatsApp bot instances using the WhatsApp Web.js library. Each bot instance operates independently and can be customized to perform different tasks or interact with different users.

## Table of Contents

-   [Getting Started](https://chat.openai.com/c/fe5517fc-6958-4354-b9a0-2cd403473bd4#getting-started)
-   [Installation](https://chat.openai.com/c/fe5517fc-6958-4354-b9a0-2cd403473bd4#installation)
-   [Usage](https://chat.openai.com/c/fe5517fc-6958-4354-b9a0-2cd403473bd4#usage)
-   [Configuration](https://chat.openai.com/c/fe5517fc-6958-4354-b9a0-2cd403473bd4#configuration)
-   [Creating Bot Instances](https://chat.openai.com/c/fe5517fc-6958-4354-b9a0-2cd403473bd4#creating-bot-instances)
-   [Handling User Commands](https://chat.openai.com/c/fe5517fc-6958-4354-b9a0-2cd403473bd4#handling-user-commands)
-   [Forwarding Messages to Human Operators](https://chat.openai.com/c/fe5517fc-6958-4354-b9a0-2cd403473bd4#forwarding-messages-to-human-operators)
-   [Contributing](https://chat.openai.com/c/fe5517fc-6958-4354-b9a0-2cd403473bd4#contributing)
-   [License](https://chat.openai.com/c/fe5517fc-6958-4354-b9a0-2cd403473bd4#license)

## Getting Started

To get started with running multiple WhatsApp bots, follow the installation and usage instructions below.

## Installation

Here's a step-by-step guide to setting up your WhatsApp bot on a freshly installed Windows 10 system:

1.  **Install Node.js**: Download and install the latest version of Node.js from the official website ([https://nodejs.org](https://nodejs.org/)). Choose the LTS (Long Term Support) version for stability.
    
2.  **Open a terminal**: After Node.js is successfully installed, open a new terminal or command prompt window. This will be used to execute commands and navigate through the file system.
    
3.  **Create a project folder**: Choose a location on your computer where you want to create the project folder for your WhatsApp bot. For example, you can create a folder named `whatsbot` on your desktop. In the terminal, navigate to the desired location using the `cd` command:
    
    `cd C:\Users\YourUsername\Desktop` 
    
    Replace `YourUsername` with your actual Windows username.
    
4.  **Initialize the project**: Once inside the desired location, run the following command to initialize a new Node.js project:
    
    
    `npm init -y` 
    
    This command creates a new `package.json` file, which will track the dependencies and configuration for your project.
    
5.  **Install dependencies**: Next, install the required dependencies for your WhatsApp bot. In the terminal, run the following command:
    
    
    `npm install whatsapp-web.js qrcode-terminal` 
    
    This command installs the `whatsapp-web.js` package, which allows interaction with the WhatsApp Web platform, and the `qrcode-terminal` package, which generates QR codes for authentication.
    
6.  **Create the bot files**: Create two JavaScript files within the `whatsbot` folder. In the terminal, run the following commands:
    
    
    `echo > bot-instance1.js
    echo > bot-instance2.js` 
    
    These commands create empty files named `bot-instance1.js` and `bot-instance2.js` in the `whatsbot` folder.
    
7.  **Edit the bot files**: Open `bot-instance1.js` and `bot-instance2.js` in a code editor of your choice and add the respective bot code for each instance. Customize the code according to your requirements.
    
8.  **Run the bot instances**: Open two separate terminals or command prompt windows. In each terminal, navigate to the `whatsbot` folder using the `cd` command. Run the following commands in each terminal to start the bot instances:
    
    Terminal 1:
    
    
        `node bot-instance1.js` 
        
     Terminal 2:
                
        `node bot-instance2.js` 
        
      The bot instances will start running and display QR codes for authentication.
        
    9.  **Scan QR codes**: Using the WhatsApp application on your phone, scan the QR codes displayed in each terminal to authenticate your bot instances.
        
    
Congratulations! You have set up and started running multiple instances of your WhatsApp bot on a freshly installed Windows 10 system. Each instance will operate independently with its own session and phone number.
    
## Content of bot-instance1.js
    
Here's the code for the first instance (`bot-instance1.js`):
    
    const { Client } = require('whatsapp-web.js');
    const qrcode = require('qrcode-terminal');
    
    const client = new Client();
    const activeChats = {};
    
    client.on('qr', (qr) => {
      console.log('QR code for instance 1:');
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
    
    async function sendInitialOptions(msg) {
      const welcomeMessage =
        'Welcome to AtSite Solutions. Please choose from below options:\n' +
        '1. envato\n' +
        '2. adobe\n' +
        '3. other\n' +
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

Save this code as `bot-instance1.js` and run it using the command `node bot-instance1.js` from the `whatsbot` folder. This will run the first instance of your WhatsApp bot.

you can have both `bot-instance1.js` and `bot-instance2.js` in the same folder. The folder structure would look like this:

    whatsbot/
      - bot-instance1.js
      - bot-instance2.js
      - session-instance1.json
      - session-instance2.json
      - ...


You can keep all the instance-specific files (such as session files) in the same folder alongside the bot scripts. When you run each instance, make sure you are executing the respective script in separate terminals or command prompts.

Running multiple instances from the same folder allows you to keep all the relevant files and scripts organized in one place.

The `session-instance1.json` file will be automatically created when the bot successfully authenticates and establishes a session with the WhatsApp servers. This file will store the session data, including the authentication details and the necessary information to maintain the connection.

When you run the bot script for the first time, it will generate the QR code for authentication. After scanning the QR code with your WhatsApp account, the bot will authenticate and create the `session-instance1.json` file in the same folder. On subsequent runs, the bot will use this session file to restore the session and connect to the WhatsApp servers without requiring re-authentication.

Make sure that the folder where the bot script is located has write permissions so that the session file can be created and updated as needed.

## Editing and Adding More Options in Bot

Here's a detailed explanation of how you can add new menu options and modify the responses in the bot instances:
To add new menu options or modify existing ones, you need to edit the `sendInitialOptions` function in each bot file (`bot-instance1.js`, `bot-instance2.js`, etc.). This function is responsible for sending the initial menu options to the user.

Here's an example code snippet to illustrate how you can add new options:


    async function sendInitialOptions(msg) {
      const welcomeMessage =
        'Welcome to AtSite Solutions. Please choose from below options:\n' +
        '1. envato\n' +
        '2. adobe\n' +
        '3. other\n' +
        '4. new option\n' + // Add a new option here
        'To chat with a human operator, send "chat".';
      await sendMessage(msg.from, welcomeMessage);
    }



In the above code, a new option labeled as "new option" is added to the menu. You can add as many options as you like following a similar pattern.

To define the corresponding actions for each option, you need to modify the switch statement in the `handleIncomingMessage` function. Look for the `switch (command)` section and add new cases for your options.

Here's an example code snippet to illustrate how you can define actions for new options:

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
      case '4': // Handle the new option
        await sendNewOptionInfo(msg);
        break;
      case 'chat':
        activeChats[chatId].mode = 'human';
        await sendChatStartedMessage(msg);
        break;
      default:
        await sendInvalidCommandMessage(msg);
        break;
    }



In the above code, a new case `'4'` is added to handle the new option. You need to define the corresponding `sendNewOptionInfo` function to send the desired response or perform the necessary action for the new option.

Here's an example code snippet for the `sendNewOptionInfo` function:

    async function sendNewOptionInfo(msg) {
      const newOptionInfo = 'Here is some information about the new option...';
      await sendMessage(msg.from, newOptionInfo);
    }


In the above code, the `sendNewOptionInfo` function sends a response containing information about the new option. You can customize the response as per your requirements.

Remember to update the other functions, such as `sendEnvatoInfo`, `sendAdobeInfo`, `sendOtherInfo`, `sendChatStartedMessage`, `forwardToHumanOperator`, and `sendInvalidCommandMessage` as needed.

By following these steps, you can add new menu options and modify the responses in each bot instance according to your requirements.

## Configuration

You can configure various aspects of the bot instances by modifying the code in the individual bot files (`bot-instance1.js`, `bot-instance2.js`, etc.). Some of the configuration options include:

-   Customizing welcome messages and response templates.
-   Adding additional menu options or commands.
-   Defining actions for each menu option or command.
-   Configuring forwarding of messages to human operators or external systems.

Feel free to explore the code and modify it to suit your specific use case.

## Creating Bot Instances

To create additional bot instances, follow these steps:

1.  Create a new JavaScript file (e.g., `bot-instance3.js`) in the `whatsbot` folder.
    
2.  Customize the new bot instance by adding the desired code and functionality.
    
3.  Run the new bot instance by executing the following command in a terminal:
    
    Copy code
    
    `node bot-instance3.js` 
    
    The new bot instance will start running independently.
    
## Contributing

Contributions to this project are welcome! If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.


