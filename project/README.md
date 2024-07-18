# VARIETY OF PROJECTS

#### Video Demo:  https://youtu.be/fWfSn0LPnak

## Description:

## Introduction
This is my final cs50x project, which consists of many "smaller" projects that I personally find very interesting.
The index of these projects is my website portfolio, where you will find links to all my smaller projects, among
which a "Stock Predictor", a "Neural Network" built from scratch, a "Solar System Reacreation", a "Minesweeper", a "Pokedex
and finally, cs50x problem set 9 "Finance", which I liked to include due to the meaning that this course has to me.



## INDEX OF THE PROJECT (the main application, see it by running it with flask run in the project/ folder):

### Overview
To showcase all the "smaller" projects that I've done, I created a flask web application, and made it my personal portfolio. In this totally responsive website you can find the homepage, where I talk about myself and my passions, together with some pictures and the contact information; the projects section, where you will be able to see all the projects that I've done, and eventually try them or see the GitHub repository; and finally the contact section, where I handle all the possibilities when submitting a form. Plus, this section hides a small easter egg, that implies the name "imbored"... I'll let you figure that out!
The most challenging part of this portfolio was the design choice, which I did together with the help of ChatGPT and Copilot, but gave my personal touch in every part.



## Projects details (from hardest to easier)

### Project 1: Neural Network (find it in project/static/MyProjects or see the repo through my website)

#### Overview
This Neural Network (NN) built from scratch in Python only using numpy is my first project of this collection, and initially
it was my only one, but after realising that for my level it would not fulfill my expectations for the final project, I decided
to do more. This NN uses layers of "neurons", where the input layer is a 28*28 matrix: each neuron takes a pixel of
the same resolution's picture containing a handwritten number from 0 to 9. The goal for this NN is to train itself
until indentifying most of the handwritten numbers.
Basically, each epoch (epoch: iteration for training), the NN adjusts its parameters towards a more accurate decision using
back-propagation, a technique where we give the expected result to the NN and it behaves according to that.
I achieved a precision of aproximately 80% of correct answers after only 200 epochs.
This project was done with the help of several articles and videos online, among which "3blue1brown" videos about Neural Networks,
but mostly the article "Neural Network from scratch in Python" from Mr. Omar Aflak.

#### Details
- Classes for layers: 
    - activation_layer.py -> to define the activation layer 
    - activations.py -> to manage how neurons of layers were activated and with which sensitivity
    - fc_layer -> to define the fully connected layer in the middle, the only hidden layer of this NN
    - layer -> parent class for layers
- Class for parameters:
    - losses.py: to calculate and adjust the loss value of each epoch, basically the most important adjustment for the NN
- Main classes:
    - network.py -> puts together the whole NN and connects the three layers (input, hidden and output layer)
    - recognise.py -> it gives the input to the input layer, and calls all the other classes to finally make a functional NN



### Project 2: Stock Predictor (find it in project/static/MyProjects or see the repo through my website)

#### Overview
This project was coded in Java and was again a very interesting project to make due to the difference in complexity from Python to Java, even if it turned out to be shorter and arguably easier than the previous. For this project I used again Neural Networks(NN), but this time I used a Java library called "deeplearning4j", which made things easier. I created first a "Fetcher", which would fetch real time data of the stock market from the "alpha vantage" API (for some reason yahoo wasn't working). Using the fetcher, and after training the NN created very easily using the library (with the help of chatGPT due to the "to me unknown" syntax), I moved on to adjust some parameters and finally, in the main file, set up the whole software. I decided to make this Stock Predictor give me its predictions for the following 20 days from execution of a given stock symbol's price. The user can input the symbol, and with all the error handling, it makes sure that no error will happen. finally it inputs, together with the date of the predicted price, the price that the stock will have in that given day.

#### Details
- Class fetcher.java: it fetcher the real time data from alpha vantage API
- Class processor.java: processes and standardises the API data to make it easier to use in the future
- Class predictor.java: sets up the neural network
- Class main.java: puts everything together and outputs a predicition



### Project 3: Finance (find it in project/static/MyProjects or see the repo through my website)

#### Overview
Not much to say about this one, I only implemented a wallet.html file where the user can manage its wallet and add up to a 1.000.000$ with all the error handling needed.



### Project 4: Solar System (find it in project/static/MyProjects or use it through my website)

#### Overview
This project was done with three.js, a famous Javascript library used to create 3D animations. I basically crated an empty scene, where I slowly added all the planets of the Solas System with their textures. Unfortunately, the distances between them have been reduced and scaled, because as you probably know, they are further than we think and they would just disappear, but the movement and rotation speeds are accurate to the scale. this project is still unfinished, as I would like in the future to add a user interface to make the experience more fun, giving the user the opportunity to "travel" to different planets and see the POV, or to modify the different velocities.

#### Details
- Not many details, just a classic html, css and js project!



### Project 5: Pokedex (find it in project/static/MyProjects or use it through my website):

#### Overview
This project is my first one involving APIs (specifically pokeAPI), which for me was a big revolution. Even if it is a very common project, I spent several hours trying to improve it, and even making completely different designs. At the end, I decided to implement a clean design where the user can see all the existent pokemons, select them to see their stats, or simply searching one specific pokemon. Easy but rewarding project

#### Details
- Not many details, another classic html, css and js project.



### Project 6: Minesweeper (find it in project/static/MyProjects or play it through my website):

#### Overview
Last but not least, another easy project, a classic Minesweeper! My first minigame coded through html, css and js, and one of the most rewarding ones, not only for the project per se, but for the fact that I finally learned how to play this game! Not much to say about this one, it has the flags to mark where you think the bombs are, and pretty much it.

#### Details
- Not many details, yet again... you know what I'm going to say!

## Conclusion
This project was the end of an amazing journey in cs50x, a project that not only gave me knowledge, but made me feel part of a community and made me have a purpose for months, making me even more passionate about computer science.
Thank you David, and thanks to everyone of the staff and the participants, I'm very glad to have been and still be part of this journey!

