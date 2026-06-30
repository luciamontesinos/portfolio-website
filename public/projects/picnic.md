Picnic was done as the second exploration of my PhD project. Picnic is an interactive musical installation that turns everyday objects inside a picnic basket into an opportunity for engaging in music making.

Picnic is the result of a Research-through-Design exploration of everyday objects and AI as design material. In this context, the familiarity of everyday objects as interfaces, and the creative potential of inherently imperfect AI set the perfect design space to explore musicking further.

To interact with Picnic, you strike the objects in the basket. Through a microphone, the system picks up the sound of the object being struck, and a real-time machine learning model classifier tries to detect which object was struck. After hitting each object, a percussive sample is triggered, along with a fragment of a bird call. These sounds build up as loops, creating a rhythmic soundscape as more hits are added. There is, however, a critical twist: the model is intentionally underfitted, resulting often in misclassifications. This introduces unpredictability which turns the music making into a playful co-creative experience.

Picnic is done using [Max/MSP](https://cycling74.com/products/max) and uses the libraries [SPTools](https://rodrigoconstanzo.com/sp-tools/) (now [Data Knot](https://rodrigoconstanzo.com/data-knot/)) and [FluCoMa](https://www.flucoma.org/) for training and running the model. 

I have written three papers about Picnic, with one of them still in a peer-review process. Until I can share them, here is a bit about them:
- The first paper, ["Machine Learning as Design Material for Music-Making"](https://doi.org/10.1145/3800645.3812932) introduces Picnic and discusses, after its evaluation: i) how Picnic facilitates musicking and the challenges and opportunities that the design brings; ii) the role of ML as design material in creative domains, with the potential of facilitating new modes of AI-based interactions; and iii) reflections on how to design with AI for fostering critical engagement.

- The second paper, still under peer review, discusses Picnic from a more-than-human perspective, exploring the design process around including bird calls. During the process I experienced an attunement to bird calls, which led me to want to design with them. In this paper, we discuss how the bird calls became boundary objects, and we raise design considerations for other designers wanting to work with more-than-human sounds.

- The third paper, ["Picnic: Playful Music-Making with Everyday Objects and Machine Learning"](https://doi.org/10.1145/3802974.3808034) is a demo paper, which focuses on describing Picnic as an interactive installation. In this paper, we detail the different interaction opportunities, and we iterated slightly on the concept, allowing participants to record their own sounds, among other refinements. Picnic was showcased in Singapore at DIS 26 (Designing Interactive Systems) and in London at NIME 26 (New Interfaces for Musical Expression).

## Media
![Picnic4](/images/picnic4.png)
![Picnic3](/images/picnic2.jpg)
![Picnic2](/images/picnic.mp4)
![Picnic1](/images/picnic0.jpeg)
