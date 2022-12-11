// This is a Flappy Bird game made with React and Styled Components
import './App.css';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
// import the bluebird image from the asset folder
import bluebird from './assets/sprites/bluebird.png';

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
const Obstacle_Width = 40;
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


  useEffect(() => {
    let timeId;
    if (gameHasStarted && birdPosition < Game_Height - Bird_SizeW) {
      timeId = setInterval(() => {
        setBirdPosition((birdPosition) => birdPosition + Gravity);
      }, 24);
    } return () => { clearInterval(timeId); };
  }, [gameHasStarted, birdPosition]);

  useEffect(() => {
    let obstacleId;
    if (gameHasStarted && obstacleLeft >= -Obstacle_Width) {
      obstacleId = setInterval(() => {
        setObstacleLeft((obstacleLeft) => obstacleLeft - 5);
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

  useEffect(() => {
    const hasCollidedTop = birdPosition >= 0 && birdPosition < obstacleHeight;
    const hasCollidedBottom = birdPosition <= 500 && birdPosition >= 500 - bottomObstacleHeight;

    if (obstacleLeft >= 0 && obstacleLeft <= Obstacle_Width && (hasCollidedTop || hasCollidedBottom)) {
      setGameHasStarted(false);
      setObstacleLeft(Game_Width - Obstacle_Width);
      setObstacleHeight(Math.floor(Math.random() * (Game_Height - Obstacle_gap))
      );
      setScore(0);
    }
  });

  const handleClick = () => {
    let newBirdPosition = birdPosition - Jump_Height;
    if (!gameHasStarted) {
      setGameHasStarted(true);
    }
    else if (newBirdPosition < 0) {
      setBirdPosition(0);
    }
    setBirdPosition(newBirdPosition);
  };

  return (
    <Div onClick={handleClick}>
      <GameBox height={Game_Height} width={Game_Width} >
        <Obstacle
          top="0"
          width={Obstacle_Width}
          height={obstacleHeight}
          left={obstacleLeft}
        />
        <Obstacle
          top={Game_Height - (obstacleHeight + bottomObstacleHeight)}
          width={Obstacle_Width}
          height={bottomObstacleHeight}
          left={obstacleLeft}
        />
        <Bird sizeH={Bird_SizeH} sizeW={Bird_SizeW} top={birdPosition} />
      </GameBox>
      <span>{score}</span>
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
 
`;

const Div = styled.div`
display: flex;
width: 100%;
justify-content: center;
& span {
  color: black;
  font-size: 24px;
  margin-left: 10px;
`;

const GameBox = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: skyblue;
  overflow: hidden;
`;

const Obstacle = styled.div`
  position: relative;
  top: ${props => props.top}px;
  background-color: Green;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
`;