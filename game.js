(function gameSetup() {
    'use strict';


    var shipElem = document.getElementById('ship');

    shipElem.style.top = `${window.innerHeight/2}px`;
    shipElem.style.left = `${window.innerWidth/2}px`;
    // Create your "ship" object and any other variables you might need...
    var ship = {
      angle: 0,
      velocity: 0,


      move: function(coordinate) {
        shipElem.style.transform = `rotate(${this.angle}deg)`

        var top = parseInt(shipElem.style.top, 10) - coordinate.top;
        var left = parseInt(shipElem.style.left, 10) + coordinate.left;

        if (top > window.innerHeight) {
          top = 0;
        }
        if (top < 0) {
          top = window.innerHeight;
        }
        if (left > window.innerWidth) {
          left = 0;
        }
        if (left < 0) {
          left = window.innerWidth;
        }

        shipElem.style.top = `${top}px`;
        shipElem.style.left = `${left}px`;
      }
    };

    var allAsteroids = [];
    shipElem.addEventListener('asteroidDetected', function (event) {

      allAsteroids.push(event.detail);
        // You can detect when a new asteroid appears with this event.
        // The new asteroid's HTML element will be in:  event.detail

        // What might you need/want to do in here?

    });

    /**
     * Use this function to handle when a key is pressed. Which key? Use the
     * event.keyCode property to know:
     *
     * 37 = left
     * 38 = up
     * 39 = right
     * 40 = down
     *
     * @ param  { Event} event   The "keydown" event object with a bunch of data in it
     * @ return {void}          In other words, no need to return anything
     */
    function handleKeys(event) {
        console.log(event.keyCode);
        switch (event.keyCode) {
          case 37:
            ship.angle -= 10;
            break;
          case 39:
            ship.angle += 10;
            break;
          case 38:
            if (ship.velocity >= 7) {
              ship.velocity = 7;
            } else {
              ship.velocity += 1;
            }
            break;
          case 40:
            if (ship.velocity >= 0) {
              ship.velocity -= 1;
            } else {
              ship.velocity = 0;
            }
            break;
      }
    }
    document.querySelector('body').addEventListener('keydown', handleKeys);

    /**
     * This is the primary "game loop"... in traditional game development, things
     * happen in a loop like this. This function will execute every 20 milliseconds
     * in order to do various things. For example, this is when all game entities
     * (ships, etc) should be moved, and also when things like hit detection happen.
     *
     * @ return {void}
     */

    function gameLoop() {
        // This function for getting ship movement is given to you (at the bottom).
        // N O T E: you will need to change these arguments to match your ship object!
        // What does this function return? What will be in the `move` variable?
        // Read the documentation!
        var coordinate = getShipMovement(ship.velocity, ship.angle);

        // Move the ship here!
          ship.move(coordinate);

        // Time to check for any collisions (see below)...
        checkForCollisions();
    }

    /**
     * This function checks for any collisions between asteroids and the ship.
     * If a collision is detected, the crash method should be called with the
     * asteroid that was hit:
     *    crash(someAsteroidElement);
     *
     * You can get the bounding box of an element using:
     *    someElement.getBoundingClientRect();
     *
     * A bounding box is an object with top, left, width, and height properties
     * that you can use to detect whether one box is on top of another.
     *
     * @ return void
     */



    function checkForCollisions() {
      var shipBox = shipElem.getBoundingClientRect();
      allAsteroids.forEach(function(asteroid) {
        var box = asteroid.getBoundingClientRect();

        if (shipBox.right > box.left &&
            shipBox.left < box.right &&
            shipBox.top < box.bottom &&
            shipBox.bottom > box.top) {

          ship.velocity = 0;
          crash(asteroid);
        }
      });
    }


    /**
     * This event handler will execute when a crash occurs
     *
     * return {void}
     */
    document.querySelector('main').addEventListener('crash', function () {
        allAsteroids.forEach(function(asteroid) {
          asteroid.style.display = "none";
        })
        var node = document.createElement("H1");
        var textnode = document.createTextNode("Game Over");
        node.appendChild(textnode);
        var gameOver = document.querySelector("main").appendChild(node);
        gameOver.style.color = "white";
        gameOver.style.opacity = "0.6";
        gameOver.style.fontSize = "10vw";
        gameOver.style.textAlign = "center";
        gameOver.style.marginTop = "30vh";
        gameOver.style.zIndex = "10";

        console.log('A crash occurred!');

        // What might you need/want to do in here?

    });



    /** ************************************************************************
     *             These functions and code are given to you.
     *
     *                   !!! DO NOT EDIT BELOW HERE !!!
     ** ************************************************************************/

     var loopHandle = setInterval(gameLoop, 20);

     /**
      * Executes the code required when a crash has occurred. You should call
      * this function when a collision has been detected with the asteroid that
      * was hit as the only argument.
      *
      * @ param  {HTMLElement} asteroidHit The HTML element of the hit asteroid
      * @return {void}
      */

    function crash(asteroidHit) {
        document.querySelector('body').removeEventListener('keydown', handleKeys);
        asteroidHit.classList.add('hit');
        document.querySelector('#ship').classList.add('crash');

        var event = new CustomEvent('crash', { detail: asteroidHit });
        document.querySelector('main').dispatchEvent(event);
    }

    /**
     * Get the change in ship position (movement) given the current velocity
     * and angle the ship is pointing.
     *
     * @param  { Number} velocity The current speed of the ship (no units)
     * @param  { Number} angle    The angle the ship is pointing (no units)
     * @return {Object}          The amount to move the ship by with regard to left and top position (object with two properties)
     */

    //  Are you sure the math is right?
    function getShipMovement(velocity, angle) {
        return {
            left: (velocity * Math.sin(angle * Math.PI / 180)),
            top: (velocity * Math.cos(angle * Math.PI / 180))
        };
    }

})();
