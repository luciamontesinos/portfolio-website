This is the end result of my master thesis, done in collaboration with two other MSc students. Kinetip is a gesture-based interactive game platform designed to motivate patients to be physically active during their hospitalization time. [Click here to try it out](https://kinetip.dk/)

Lack of physical activity post-surgery is widely acknowledged as both a significant barrier to successful recovery and contributor to post-operative complications. After the introducition of single-patient hospital rooms, the healthcare staff at Herlev Hospital noticed a decline in the physical activity of the patients. 

Following a mixed-methods user-centered design research process, we developed a digital game platform: Kinetip. This system is designed to support a variety of games through gesture-based control; encouraging users to move their hands and arms while playing and interacting with the hospital terminal device. 

We currently have implemented a word puzzle game, as it combined cognitive and physically-engaging activities. This game draws inspiration from [Wordle](https://www.nytimes.com/games/wordle/index.html). In this game, users aim to guess a random word within a fixed number of attempts. While adhering to the rules and dynamics inherent to Wordle, the goal was to leverage the existing engagement afforded by the game to enable a context requiring users to move their bodies. Through Kinetip, instead of entering the letters through the key- board, users articulate their guesses by employing their arms and hands to draw each letter of the word. By gamifying the experience of physical activity and leveraging established drivers of behaviour change through gesture-based interaction, we made being physically active while hospitalised a more enjoyable activity.

Kinetip was done in p5.js, using a hand tracking model to detect the hand gestures, and optical character recognition model to to detect the characters drawn. We used Mediapipe to detect the landmarks of the hand, and created a personalised set of gestures to interact with the system: index finger to paint, fist to click, open palm to move, thumbs up/down to confirm or cancel, and non-dominant hand to erase.


## Publications:
Two years after submitting the thesis, we decided to make it into a short paper: "Reimagining Recovery: A Patient-Centred In-Hospital Intervention to Motivate Early Mobilisation Post-Surgery", thanks to the guidance of Assistant Professor Kevin Doherty. The paper was published as an Extended Abstract for CHI 2025 and you can read it [here](https://dl.acm.org/doi/pdf/10.1145/3706599.3720093).

However, if you are feeling like reading the whole thesis, you can find it [here](https://pub-5ceae6c59ca74b43a15bb310c05194ab.r2.dev/images/MasterThesis.pdf).

## Media 
![kinetip](/images/kinetip.png)
![kinetip_interface](/images/kinetip2.png)
![kinetip_demo](/images/kinetip.mp4)
![kinetip_cover](/images/masterthesis.jpeg)