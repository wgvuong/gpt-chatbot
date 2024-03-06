import openai from './config/open-ai.js';
import readlineSync from 'readline-sync';
import colors from 'colors';

async function main() {
    console.log(colors.bold.green('Welcome to the Chatbot Program!'));
    console.log(colors.bold.green('You can start chatting with the bot.'));

    const chatHistory = []; // store conversation history

    while (true) {
        const userInput = readlineSync.question(colors.yellow('You: '));
        try {
        // construct messages by iterating over the history
        const messages = chatHistory.map(([role, content]) => ({
            role,
            content,
        }));

        // add latest user input
        messages.push({ role: 'user', content: userInput });

        // call the API with user input & history
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
        });

        // get completion text/content
        const completionText = completion.data.choices[0].message.content;

        if (userInput.toLowerCase() === 'exit') {
            console.log(colors.green('Bot: ') + completionText);
            return;
        }

        console.log(colors.green('Bot: ') + completionText);

        // update history with user input and assistant response
        chatHistory.push(['user', userInput]);
        chatHistory.push(['assistant', completionText]);
        } catch (error) {
        console.error(colors.red(error));
        }
    }
}

main();