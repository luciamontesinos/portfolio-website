[Demo](/models/picnic/index.html)

Picnic is the second artefact of my PhD, exploring rhythmic music-making. It is an interactive music installation that invites people to make music by striking everyday objects found in a picnic basket: plates, bowls, cups, cutlery, and the wicker basket. A microphone captures the sound of each hit, and a real-time machine learning model classifies, based on the sound, which object was hit. Based on the detected class, the system then triggers a percussive sample along with a segment of a bird call and, in the background, a subtle melodic layer. The hits are saved in a loop and as more hits are added, a rhythm builds up. The machine learning model is intentionally underfitted, which causes frequent misclassifications that, in turn, affect the musical outcome.

Picnic is done using [Max/MSP](https://cycling74.com/products/max) and uses the libraries [SPTools](https://rodrigoconstanzo.com/sp-tools/) (now [Data Knot](https://rodrigoconstanzo.com/data-knot/)) and [FluCoMa](https://www.flucoma.org/) for training and running the model. 

## Research
Picnic facilitates participatory music-making by supporting participants in building rhythms while providing a playful and ambiguous experience. Through looping and quantisation, participants can make increasingly complex rhythms without having to sustain a pattern themselves. The familiarity of the picnic setting and everyday objects sets expectations that are broken once the interaction becomes about banging on them to make music, creating a playful incongruity. At the same time, the interaction is ambiguous: the objects carry no prescribed way of being played, and the underfitted machine learning model makes the outcome of each hit uncertain, turning music-making into a negotiation between the participants’ intent and what the system interprets. 

Picnic was evaluated with twenty-three participants in a lab setting and showcased as a demo in two conference venues.


I have written three papers about Picnic, with one of them still in a peer-review process:
- The first paper, ["Machine Learning as Design Material for Music-Making"](https://doi.org/10.1145/3800645.3812932) introduces Picnic and discusses, after its evaluation: i) how Picnic facilitates musicking and the challenges and opportunities that the design brings; ii) the role of ML as design material in creative domains, with the potential of facilitating new modes of AI-based interactions; and iii) reflections on how to design with AI for fostering critical engagement. It was awarded with Best Paper at ACM DIS 2026.

- The second paper, still under peer review, discusses Picnic from a more-than-human perspective, exploring the design process around including bird calls. During the process I experienced an attunement to bird calls, which led me to want to design with them. In this paper, we discuss how the bird calls became boundary objects, and we raise design considerations for other designers wanting to work with more-than-human sounds.

- The third paper, ["Picnic: Playful Music-Making with Everyday Objects and Machine Learning"](https://doi.org/10.1145/3802974.3808034) is a demo paper, which focuses on describing Picnic as an interactive installation. In this paper, we detail the different interaction opportunities, and we iterated slightly on the concept, allowing participants to record their own sounds, among other refinements. Picnic was showcased in Singapore at DIS 26 (Designing Interactive Systems) and in London at NIME 26 (New Interfaces for Musical Expression).

## Media
![Picnic4](/images/picnic4.png)
![Picnic3](/images/picnic2.jpg)
![Picnic2](/images/picnic.mp4)
![Picnic1](/images/picnic0.jpeg)
