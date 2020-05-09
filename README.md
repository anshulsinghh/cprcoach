# CPR Coach - A CPR training tool built on Activ5
This was a joint project between Zane Calini, Anshul Singh, Alec Valdez, and Julius Velasquez. We made this project for UC San Diego's SD Hacks 2019, and we won the Best Use of Activ5 Award.
https://devpost.com/software/cpr-coach

## Inspiration
Every year, about 600,000 cases of cardiac arrest happen in the U.S., of which 395,000 cases occur outside of a hospital setting. Research has indicated that the amount of time between cardiac arrest and CPR commencing is directly correlated to survival rates. The problem: less than 3% of the U.S. population receives CPR training every year. We built this app with the purpose of helping people learn and practice effective CPR techniques. 

## What it does
CPR Coach is a training tool that teaches people how to perform CPR. It does this by providing feedback on the beats per minute of CPR compressions and on the force of individual CPR compressions. The user gets active feedback while performing the compressions, and can change their frequency and force of their individual compressions. At the end of a training session, the user can view the statistics about their average frequency of compressions and their average force exerted per compression in pounds.

## How we built it
We built this app using the Activ5 strength training device. The device detects the strength of a user when they compress the device. At its core, it provides data about the pounds of force being exerted in compressing the device - and it provides this data at an average of 10HZ. We harnessed this data using the Activ5 JavaScript SDK, and we developed our own processing scripts to handle data being provided by the Activ5. We used the individual force data bits that were being sent by the Activ5 to find when the user performed a compression, and to use this data to provide analytics to the user about their CPR  performance.

## Challenges we ran into
Getting access to the Activ5's raw data was particularly hard, as none of our team members had experience in handling TypeScript and AngularJS code. We got around this by finding where the data was being handled, and then funneling the data into our own scripts through Socket.IO web-sockets. 

Another challenge we ran into was designing the core algorithms that detect when the user compresses the Activ5. Since we only have the force of compression, we had to analyze the patterns between individual readings to determine when the user compressed the Activ5. 

Another big challenge was coding the user interface. We spent a lot of time trying to connect the Socket.IO websockets of the back-end to our localhost front-end user interface. We also spent a lot of time creating the beating heart on the user interface, which provides visual feedback whenever the user compresses the Activ5.

## Accomplishments that we're proud of
Our app provides very accurate analytics when a user performs CPR. It is an excellent training tool to help people learn CPR, and it helps people fine tune their frequency and strength of individual compressions. Our user interface is also something that we're proud of, as it provides a simplistic and yet effective way of learning CPR. We did not want to over-complicate the amount of data provided to the user, and we wanted to encourage the user to fine-tune their frequency and strength of their compressions. Our user interface does this effectively, and helps the user learn CPR through multiple visual stimuli.

## What we learned
We learned a lot about algorithm time complexity, AngularJS, HTML and CSS development, and overall integration. This app taught us a lot about distributing individual tasks to teams as well, and we learned how to manage our time very effectively through this project. Learning to be patient with one another, and to work as a collective unit was another huge experience for us.

## What's next for CPR Coach
We would love to integrate our code more with the current SDK. Although we can effectively get data from the Activ5, we do not have a very direct approach of interacting the SDK since we utilized a web-socket solution. We would like to clean up the overall integration of our project, and provide a more clean experience for the user. As of now, our project is more of a proof-of-concept than it is a fully-fledged product. We have a lot more room to develop, and we're excited to develop this project more.

## Installation/Running Instructions
- Clone our GitHub Repository onto your local desktop
- Cd into the CPR Connector folder and run `npm install` to retrieve all necessary packages
- Cd into the CPR Processor folder and run `npm install` to retrieve all necessary packages
- Run `node index.js` in the CPR Processor folder to set up the recieving end of all Activ5 data, and to set up our user interface on `http://localhost:3030/`
- Run `npm start` in the CPR Connector folder to start all communications with the Activ5, this is essentially running the Example javascript SDK app
- Connect to the Activ5 using the website on `http://localhost:4200/`, and then navigate back to `http://localhost:3030/`. Everything should then be running.

The reason that we almost have 2 projects running here is because CPR Connector is essentially a modified version of the Activ5 SDK JavaScript Example. It is tweaked in that it connects to a websocket that CPR Processor opens (this data pipe is on port 4300). CPR Processor recieves all data from the CPR Connector, and then has multiple scripts which control its use and its display. We essentially modified the Activ5 SDK JavaScript Example in such a way that it would connect to the Activ5 and simply forward our CPR Processor project any pressure readings from the Activ5.

A video demoing the project and its features can be found on: https://www.youtube.com/watch?v=P_IaSZYo0xc
