**Vora (EcoVoice Quest)**
It is a front-end, voice-controlled web application designed to help users practice and improve their verbal communication skills. 
It uses the browser's built-in Web Speech API to listen to user input and provide real-time feedback.

The application features three main interactive modules:

Explorer Mode: Places users in pressure scenarios like an Interview, Presentation, or Debate, challenging them to speak confidently.
Challenge Mode: A rapid-fire game where users must answer as many questions as possible within a 60-second time limit.
Communication Trainer: A practice area where users explain specific topics and receive a detailed report on their clarity, completeness, vocabulary, and confidence level.
How to Run It
Because the application relies on the browser's microphone API, it requires a secure context to run properly.
This means you should run it through a local web server rather than just double-clicking the index.html file.

Open your terminal or command prompt and navigate to your vora project directory.
Start a local development server. You can use any of the following depending on what you have installed on your system:
If you have Node.js installed: Run npx serve or npx http-server
If you have Python installed: Run python -m http.server 8000 (or python3 -m http.server 8000)
If you use VS Code: Install the Live Server extension, right-click on index.html and select "Open with Live Server".

Open a web browser and go to the local URL provided by your server (usually http://localhost:8000, http://localhost:3000, or http://127.0.0.1:5500).
Note: Google Chrome is highly recommended, as it has the best support for the Web Speech API used in this project.
When the website loads, click on any game mode and Allow the microphone permission prompt when asked by the browser.
