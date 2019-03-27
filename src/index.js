import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Login from "./login";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      userID: "",
      userName: "",
      isLogin: false,
      dataAll: [],
      highestScore: "",
      player: "",

      endTime: 0,
      duration: 0,
      startTime: 0
    };
  }
  componentDidMount() {
    this.getScore();
  }

  handlePost = async () => {
    let data = new URLSearchParams();
    data.append("player", "VA");
    data.append("score", "12");
    const url = `http://ftw-highscores.herokuapp.com/tictactoe-dev`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data.toString(),
      json: true
    });
    let json = await response.json();
    console.log(json);
  };

  getScore = async () => {
    const url = `http://ftw-highscores.herokuapp.com/tictactoe-dev`;
    let resp = await fetch(url);
    let result = await resp.json();
    let data = result.items;
    this.setState({
      dataAll: data
    });
    console.log(this.state.dataAll);
  };
  handleClick = i => {
    debugger;
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (this.state.stepNumber === 0) {
      this.setState({ startTime: Date(Date.now()) });
    }
    if (this.calculateWinner(squares) || squares[i]) {
      this.setState({ endTime: Date(Date.now()) });
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
    console.log("squares", squares);
  };

  jumpTo = step => {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  };
  calculateWinner = squares => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  render() {
    console.log(this.state.stepNumber);
    console.log(this.state.startTime);
    console.log(this.state.endTime);
    console.log(this.state.duration);
    const responseFacebook = response => {
      console.log(response);
      if (response) {
        this.setState({ userName: response.name });
        this.setState({ userID: response.id });
        this.setState({ isLogin: true });
      }
    };

    var maxCallback2 = (max, cur) => Math.max(max, cur);

    const myScores = this.state.dataAll.filter(d => d.player === "VA");
    const max = myScores.map(el => el.score).reduce(maxCallback2, -Infinity);
    console.log(max);
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li className="likey" key={move}>
          <button className="movebtn" onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div>
        <h1 className="h1">TIC TAC TOE - TIC TAC TOE - TIC TAC TOE</h1>
        <h5 className="text-white">UserName :{this.state.userName}</h5>
        <h5 className="text-white">userID:{this.state.userID}</h5>
        <h5 className="text-white">time start:{this.state.startTime}</h5>
        <h5 className="text-white">time end:{this.state.endTime}</h5>
        <h5 className="text-white">time elapse:{this.state.duration}</h5>
        <div className="board">
          <div className="game">
            <div className="game-board">
              <Board
                squares={current.squares}
                onClick={i => this.handleClick(i)}
              />
            </div>
            <div className="game-info">
              <h1>{status}</h1>
              <ol className="move">{moves}</ol>
            </div>
          </div>
        </div>
        <Login
          responseFacebook={responseFacebook}
          isLogin={this.state.isLogin}
        />
        <button onClick={() => this.handlePost()}>submit</button>
        <h3>Display Score:{max}</h3>
        <h3>Player:{this.state.userName}</h3>
      </div>
    );
  }
}

const Square = ({ onClick, value }) => (
  <button className="square" onClick={onClick}>
    {value}
  </button>
);

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
