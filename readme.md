## Getting Started

**First things first**

`git clone https://github.com/bradenhs/gossip-protocol.git`

After you've cloned the repo run

`npm install`

This ensures you have all the necessary dependencies to run the project.

After that it's simple! Just one more command:

`npm start`

And just like that you're gossip-protocolling.

## The code

Look in the `src` directory for the code. The `node.ts` file contains the main part of the algorithm.

## Answers to the Questions

*1. This lab uses a vector clock algorithm to create unique message IDs based on a sequence number. Could we replace the sequence number with a timestamp?*

Answer

*2. What are the advantages and disadvantages of such an approach?*

Answer

*3. Are the chat messages in order? Why or why not? If not, what could you do to fix this?*

Answer

*4. How did you avoid looping (sending messages back to someone who already has it)? Why was the unique ID helpful?*

Answer

*5. Why would a UUID be better than a long random number for creating the origin ID?*

Answer

*6. The propagation algorithm sleeps for n seconds between each iteration. What are the trade-offs between a low and high value for n.*

Answer
