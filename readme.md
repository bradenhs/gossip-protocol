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

## Part I Questions

*1. This lab uses a vector clock algorithm to create unique message IDs based on a sequence number. Could we replace the sequence number with a timestamp?*

Yes. It would work the same. We'd simply propogate all messages that have a timestampt later than the requesting node's.

*2. What are the advantages and disadvantages of such an approach?*

You wouldn't have to maintain an internal counter. It would be rare but two messages could technically have
the same timestamp so that might mess things up - one node could think it has the latest but actually not
because two messages had identical timestamps. There are ways around it but you'd have to account for it.

*3. Are the chat messages in order? Why or why not? If not, what could you do to fix this?*

It depends. They could be in order but are not gaurenteed to be that way. For instance, if one node sends a message
after another node but the other node's message hasn't had enough time to get through the network yet node close to the
one with the second message will get it out of order.

*4. How did you avoid looping (sending messages back to someone who already has it)? Why was the unique ID helpful?*

I simply made them send out a request to one of their neighbors stating where they were at (i.e. the current
state of their messages). If their current state was behind their peer their peer would update them on the latest
but no more. It was a pull based approach instead of a push based approach.

*5. Why would a UUID be better than a long random number for creating the origin ID?*

Because long random numbers have a much greater chance of creating collisions in the ids.

*6. The propagation algorithm sleeps for n seconds between each iteration. What are the trade-offs between a low and high value for n.*

Low values means messages propogate slower but there is less stress on nodes since they aren't doing as much
work gossiping.

## Part II Questions

*1. Did new messages eventually end up on all the nodes that were connected?*

Yes since when a new node enters the network it tells its peers about itself and they establish connections
meaning that the entire graph of connected nodes is two-way. Since there are no one way streets there
are no dead ends meaning all the messages propogate across the entire network eventually.

*2. Were the messages displayed in the same order on each node? Why or why not?*

No. The messages are displayed in the order they are received and nodes in one part of the network
will recieve the message before nodes in another part meaning that if a message is started in that part
before the other message has a chance to propogate across the entire network they will be out of order.

*3. Why does disconnecting a node from the network temporarily not result in gaps in the messages seen at that node?*

Because when it comes online it just asks its neighbors what the latest is and they give it everything it missed since
it was last online.

*4. Describe, in a paragraph or two, how you could use the basic scheme implemented here to add failure detection to the system using a reachability table.*

As far as I understand a reachability table represents which nodes are connected to which nodes. Basically, a 1 indicates
that there is a connection and a 0 indicates that there is not a connection. A reachability table would allow me to
verify the failure of a specific node. If the node that is a peer of a connected node can't connect to it it could
look up in the reachability table what other nodes may access the failed one and check with them that they can't
access it also. If it was failed it's peer could adds more peers to itself to maintain the performance of the system.

*5. Describe how you would use the system built in this lab to disseminate Foursquare checkin data so that a group of people could know where the others are based on their Foursquare checkins.*

Basically I could pass around the checkin data instead of the messages and since the checkins happen at certain locations
I could show those coordinates on some sort of a map when they become active.
