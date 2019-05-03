import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from "./Components/Navigation/Navigation.js";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition.js";
import Signin from "./Components/Signin/Signin.js";
import Register from "./Components/Register/Register.js";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm.js";
import Rank from "./Components/Rank/Rank.js";
import Logo from "./Components/Logo/Logo.js";

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 500
      }
    }
  }
}

const initialState = {
  input: "",
  imageURL: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser =(data)=> {
    this.setState({ user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    } });
  }

  calculateFaceLocation =(data)=> {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage"),
    width = Number(image.width),
    height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox =(box)=> {
    this.setState({ box: box });
    var image = document.getElementById("inputImage");
    image.scrollIntoView({ block: 'center',  behavior: 'smooth' });
  }

  onInputChange =(event)=> {
    this.setState({ input: event.target.value });
  }

  onSubmit =(event)=> {
    this.setState({ imageURL: this.state.input });
      fetch('https://fast-stream-79897.herokuapp.com/imageurl', {
        method: 'post',
        mode: "no-cors",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })  
      })
      .then(response => response.json())
      .then(response => {
        if(response) {
          fetch('https://fast-stream-79897.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, {entries: count}))
            })
            .catch(console.log);
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log('error submiting'));
  }

  onRouteChange =(route)=> {
    if (route === "signout") {
      this.setState(initialState)
    } else if (route === "home") {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route });
  }

  render() {
    const { isSignedIn, imageURL, route, box } = this.state;
    let mainPage;
    if (route === "home") {
      mainPage = (<div>
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
          <FaceRecognition box={box} imageURL={imageURL}/>
          </div>);
    } else if (route === "signin" || route === "signout") {
      mainPage = <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>;
    } else if (route === "register"){
      mainPage = <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
    }

    return (
      <div className="App">
        <Particles className="particles" 
          params={particlesOptions}
        /> 
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {mainPage}
      </div>
    );
  }
}

export default App;
