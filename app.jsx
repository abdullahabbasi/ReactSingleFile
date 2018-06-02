let Players = [{name: 'Abdullah Abbasi', score: 50},{name:'ABD', score: 23}];
function Header (props) {
	return (<div className="header">
						<Stats players= {props.players} />
					</div>);
}

Header.propTypes =  {
	title: PropTypes.string.isRequired,
}

class AddPlayer extends React.Component {
	constructor (props) {
		super(props);
		this.state = {name: ''};
	}
	onChange (e) {
		console.log(e);
		this.setState({name: e.target.value});
	}
	onSubmit (e) {
		e.preventDefault();
		console.log('submit clicked', this);
		this.props.addPlayer(this.state.name);
		this.setState({name: ''} );
	}
	render () {
		return (<div>
					<form onSubmit={this.onSubmit.bind(this)}>
						<input type="text" value={this.state.name} onChange={this.onChange.bind(this)}/>
						<input type="submit" value="Add Player" />
					</form>
			</div>);
	}
}

function Stats (props) {
	console.log('props stats ', props)
	const totalCount = props.players.length;
	const totalScore = props.players.reduce(function(total, player) { return total += player.score}, 0);
	console.log(totalScore);
	// const totalScore = 43;
	return (<div>
			<div style={{display: 'flex'}}>
				<div style={{flex: 1}}>Players</div>
				<div style={{flex: 1}}>{totalCount}</div>
			</div>
			<div style={{display: 'flex'}}>
				<div style={{flex: 1}}>Score</div>
				<div style={{flex: 1}}>{totalScore}</div>
			</div>
		</div>);
}
Stats.propTypes = {

}

function Player (props) {
	return (			<div className="player">
									<a onClick={props.removePlayer}>Remove Player</a>
									<div className="player-name">{props.name}</div>
									<Counter score={props.score} onChangeScore={props.onChangeScore}/>
								</div>);
}

Player.propTypes =  {
	name: PropTypes.string.isRequired,
	score: PropTypes.number.isRequired,
	onChangeScore: PropTypes.func.isRequired
}

function Counter (props) {
	return (<div className="counter-section">
					 <button className="counter increment" onClick={ (event) => props.onChangeScore(1) }> + </button>
					 <span className="score"> {props.score} </span>
					 <button className="counter decrement" onClick={ (e) => props.onChangeScore(-1) }> - </button>
				 </div>);
}

Counter.propTypes = {
	score: PropTypes.number.isRequired,
	onChangeScore: PropTypes.func.isRequired
}

class Timer extends React.Component {
	constructor (props) {
		super(props);
		this.state = {time: 0, running: false};
	}
	startTick () {
		console.log('startTick', this.state);
		this.setState({running: true});
		let self = this;
		this.intervalHandler = setInterval(function() {
				self.state.time++;
				let newTime = self.state.time;
				console.log('triggered');
				self.setState( {time: newTime})}, 1000);
	}
	stopTick () {
		if (this.state.running) {
			clearInterval(this.intervalHandler);
			this.setState({running: false});
		}

		console.log('stopTick');
	}
	resetTick () {
		console.log('reset');
	}
	render() {
		var displayBtn  = this.state.running ? <button onClick={this.stopTick.bind(this)}>Stop</button> : <button onClick={this.startTick.bind(this)}>Start</button>
		return (<div>
			<div>{this.state.time}</div>
			{displayBtn}
			<button onClick={this.resetTick}>Reset</button>

			</div>);
	}
}
class Application extends React.Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
		players: PropTypes.arrayOf(PropTypes.shape({name: PropTypes.string.isRequired, score: PropTypes.number.isRequired})).isRequired

	}
	constructor (props) {
		super(props);
		this.state = {players: props.players}
	}
	onChangeScore(index, delta) {
		console.log('delta ',delta, index, this.state);
		this.state.players[index].score += delta;
		this.setState(this.state);
	}

	addPlayer(name) {
		this.state.players.push({'name': name, 'score': 0});
		this.setState(this.state);
	}
	render() {
		console.log(this.state.players);
		return (<div className="application">
							<Header title={this.props.title} players={this.state.players} />
							<Timer />
							<div className="players">
							{	this.state.players.map(
									function (value, index) {
										return ( <Player name={value.name}
										key={index} score={value.score}
										removePlayer = { () => {this.state.players.splice(index, 1); this.setState(this.state); }}
										onChangeScore={ (delta) => this.onChangeScore(index, delta)}/>);}.bind(this))}
							</div>
							<AddPlayer addPlayer={this.addPlayer.bind(this)}/>
						</div>);
	}
}

ReactDOM.render(<Application title="My Dashboard" players={Players}/>, document.getElementById('root'));
