// This is a Flappy Bird game made with React and Styled Components
import './App.css';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
// import the bluebird image from the asset folder
import bluebird from './assets/sprites/bluebird.png';
import backgroundday from './assets/sprites/backgroundday.png';
import TopP from './assets/sprites/TopPipe.png';


// Constants
// Bird_Size is the size of the bird
const Bird_SizeH = 24;
const Bird_SizeW = 34;
// Game_Width is the width of the game box
const Game_Width = 500;
const Game_Height = 500;
// Gravity is the speed at which the bird falls
const Gravity = 6;
// Jump_Height is the height at which the bird jumps
const Jump_Height = 100;
// Obstacle_Width is the width of the obstacle
const Obstacle_Width = 52;
// Obstacle_gap is the gap between the top and bottom obstacles
const Obstacle_gap = 200;

function App() {
  // States 
  // birdPosition is the position of the bird
  const [birdPosition, setBirdPosition] = useState(250);
  // gameHasStarted is a boolean that determines if the game has started
  const [gameHasStarted, setGameHasStarted] = useState(false);
  // obstacleHeight is the height of the top obstacle
  const [obstacleHeight, setObstacleHeight] = useState(100);
  // obstacleLeft is the position of the obstacle
  const [obstacleLeft, setObstacleLeft] = useState(Game_Width - Obstacle_Width);
  // score is the score of the player
  const [score, setScore] = useState(0);
  // bottomObstacleHeight is the height of the bottom obstacle
  const bottomObstacleHeight = Game_Height - Obstacle_gap - obstacleHeight;




  // Use useEffect to update the birdPosition every 24ms (to simulate gravity)
  // if the game has started and the bird is not at the bottom of the screen
  useEffect(() => {
    let timeId;
    if (gameHasStarted && birdPosition < Game_Height - Bird_SizeW) {
      timeId = setInterval(() => {
        setBirdPosition((birdPosition) => birdPosition + Gravity);
      }, 24);
    } return () => { clearInterval(timeId); };
  }, [gameHasStarted, birdPosition]);

  // Use useEffect to move the obstacle to the left every 24ms (to simulate movement)
  // If the obstacle has reached the left edge of the screen, reset its position and
  // height, and increment the score
  useEffect(() => {
    let obstacleId;
    if (gameHasStarted && obstacleLeft >= -Obstacle_Width) {
      obstacleId = setInterval(() => {
        setObstacleLeft((obstacleLeft) => obstacleLeft - 10);
      }, 24);
      return () => { clearInterval(obstacleId); };
    } else {
      setObstacleLeft(Game_Width - Obstacle_Width);
      setObstacleHeight(Math.floor(Math.random() * (Game_Height - Obstacle_gap))
      );
      setScore((score) => score + 1);


    }
  }, [gameHasStarted, obstacleLeft]
  );


  // Use useEffect to check for collisions between the bird and the obstacles
  useEffect(() => {
    // Calculate whether the bird has collided with the top or bottom of the obstacle
    const hasCollidedTop = birdPosition >= 0 && birdPosition < obstacleHeight;
    const hasCollidedBottom = birdPosition <= 500 && birdPosition >= 500 - bottomObstacleHeight;

    // If the obstacle is on the screen and the bird has collided with it,
    // stop the game, reset the obstacle and score, and start over
    if (obstacleLeft >= 0 && obstacleLeft <= Obstacle_Width && (hasCollidedTop || hasCollidedBottom)) {
      setGameHasStarted(false);
      // This is a bug that I haven't been able to fix yet, the score should reset to 0 and stay in the screen
      setScore((score) => score - 1);
      setObstacleLeft(Game_Width - Obstacle_Width);
      setObstacleHeight(Math.floor(Math.random() * (Game_Height - Obstacle_gap))
      );

    }
  });

  // Function to handle clicks on the game screen
  const handleClick = () => {
    // Calculate the new position of the bird after a jump
    let newBirdPosition = birdPosition - Jump_Height;

    // If the game hasn't started yet, start it
    if (!gameHasStarted) {
      setGameHasStarted(true);
      setScore(0);
    }
    // If the bird is at the top of the screen, prevent it from jumping higher
    if (newBirdPosition < 0) {
      newBirdPosition = 0;
    }
    // Update the bird's position with the new position
    setBirdPosition(newBirdPosition);
  };

  return (
    <Div onClick={handleClick}>
      <GameBox height={Game_Height} width={Game_Width} >

        <BotPipe
          top="0"
          width={Obstacle_Width}
          height={obstacleHeight}
          left={obstacleLeft}
        />

        <TopPipe
          top={Game_Height - (obstacleHeight + bottomObstacleHeight)}
          width={Obstacle_Width}
          height={bottomObstacleHeight}
          left={obstacleLeft}
        />
        <Bird sizeH={Bird_SizeH} sizeW={Bird_SizeW} top={birdPosition} />
        <span>{score}</span>
      </GameBox>

    </Div>
  );
}


export default App;


// Styled Components

const Bird = styled.div`
  position: absolute;
  background: url(${bluebird});
  height: ${props => props.sizeH}px;
  width: ${props => props.sizeW}px;
  top: ${props => props.top}px;
  margin-left: 25px;
  
`;

const Div = styled.div`
display: flex;
width: 100%;
justify-content: center;
& span {
  top: 20px;
  position: absolute;
  left: 48%;
  color: black;
  font-size: 24px;
  margin-left: 10px;
}
`;

const GameBox = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background: url(${backgroundday});
  overflow: hidden;
`;

const TopPipe = styled.div`
  position: relative;
  top: ${props => props.top}px;
  background : url(${TopP});
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
`;

const BotPipe = styled.div`
  position: relative;
  top: ${props => props.top}px;
  background : url(${TopP});
  rotate: 180deg;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
`;