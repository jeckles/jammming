import React from 'react'
import './TrackList.css'
import { Track } from '../Track/Track'

export class TrackList extends React.Component {
    render() {
        return (
            <div className="TrackList">
                {(this.props.tracks.length > 0) && this.props.tracks.map((track) => <li key={track.id}><Track track={track} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval}/></li>)}
            </div>
        )
    }
}