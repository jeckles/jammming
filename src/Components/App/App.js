import './App.css';
import React from 'react';
import { SearchBar } from '../SearchBar/SearchBar'
import { SearchResults } from '../SearchResults/SearchResults'
import { Playlist } from '../Playlist/Playlist'
import Spotify from '../../util/Spotify'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: []
   }

   this.addTrack = this.addTrack.bind(this)
   this.removeTrack = this.removeTrack.bind(this)
   this.updatePlaylistName = this.updatePlaylistName.bind(this)
   this.savePlaylist = this.savePlaylist.bind(this)
   this.search = this.search.bind(this)
  }

  savePlaylist() {
    let trackURIs = []
    for (let i = 0; i < this.state.playlistTracks.length; i++) {
      trackURIs.push("spotify:track:" + this.state.playlistTracks[i].id.toString())
    }
    console.log('made it here, trackURIs below')
    console.log(trackURIs)
    Spotify.savePlaylist(this.state.playlistName, trackURIs)
    this.setState({ playlistName: 'New Playlist', playlistTracks: [] })
  }

  addTrack(track) {
    let trackIds = this.state.playlistTracks.length > 0 ? this.state.playlistTracks.map((track) => track.id) : [] 
    if (!(trackIds.includes(track.id))) {
      let temp = this.state.playlistTracks
      temp.push(track)
      this.setState({ playlistTracks: temp })
    }
  }

  removeTrack(track) {
    console.log(`removing track: ${track.id}`)
    var filtered = this.state.playlistTracks.filter(function (trck) { return trck.id !== track.id })
    this.setState({ playlistTracks: filtered })
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name })
  }

  componentDidUpdate(prevState) {
    console.log('-----------------update occurred-----------------')
    console.log(this.state)
    console.log('--------------------------------------------------')
  }

  search(term) {
    Spotify.search(term).then((results) => { this.setState({ searchResults: results }) }).catch(function(e) {console.log(e)})
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
