In the summer of 2023, I was part of Schibsted’s Futures Lab in Oslo. The lab's goal is to explore, through hands-on experimentation, how emerging technologies will shape the future, particularly within Shcibsted's markets of media and marketplaces. During my time there, we explored how Conversational User Interface could look like. 

For context, OpenAI had already released Whisper, and there were already some text-based interfaces, like [Pi] (https://pi.ai/) which offered to read the responses aloud, with different voices to choose from. As these chatbots were getting more popular, we saw it as the perfect opportunity to explore how Conversational User Interfaces could look like in practice.


We started by looking at our own office dynamics. When working on a project, there are countless iterations: some days you move forward, other days you branch out and explore. By the time the weekly status meeting rolls around, so much gets left unsaid because documenting every little detail feels overwhelming. But what if you could just talk about your day the way you would with friends and family?

We developed a Conversational User Interface (CUI) and embodied it in an old Ericofon 700. As inspiration for the project, we explored representations of CUIs in science fiction, and liked how they were linked to a physical form. Captivated by the aesthetics of this phone, we stripped the original components and put a Raspberry Pi inside, along an audio board and a ultrasonic sensor to detect when the phone was being lifted. 

For the software, we used OpenAI's Whisper, ChatGPT, Google's Text-to-Speech, and Notion APIs, to create an AI assistant capable of engaging in conversations and document our work. The primary task of the assistant was to summarize our weekly work. To achieve this, we crafted a prompt to encourage follow-up questions and clarifications. We created a workflow that then would update the tasks database in Notion based on our answers, and a page that would combine all of the team member's summaries, and use them to guide the meetings.

To interact, you simply pick the phone, and a voice on the other side of the line asks you: "how was your day?" You then engage in an informal conversation, sharing your day at work and process. The voice asks you for clarifications, or digs deeper into interesting details. When you hang up, a summary is be generated and everything is logged into Notion.

This project was incredibly enjoyable to work in as it combined research, design, code, and maker skills.

## Media
![Ericophone in action](/images/ericophone0.gif)
![Ericophone front view](/images/ericophone1.jpg)
![Ericophone side view](/images/ericophone2.jpeg)
![Ericophone close-up](/images/ericophone3.jpeg)
[Ericophone demo video](/images/ericophone.mp4)


