var accessToken

var redirectURI = 'http://localhost:3000/'

var clientID = 'd757e2f361954795841143f4cccf324b'

var Spotify = {
    getAccessToken () {
        if (accessToken) {
            return accessToken
        }

        var accessTokenFromUrl = window.location.href.match(/access_token=([^&]*)/)
        var expirationFromUrl = window.location.href.match(/expires_in=([^&]*)/)

        if (accessTokenFromUrl && expirationFromUrl) {
            accessToken = accessTokenFromUrl[1]
            const expiresIn = Number(expirationFromUrl[1])
            window.setTimeout(() => accessToken = '', expiresIn * 1000)
            window.history.pushState('Access Token', null, '/')

            return accessToken
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken()

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
        {headers: {
            Authorization: `Bearer ${accessToken}`
        }}).then((response) => {
            return response.json()
        }).then((responseJSON) => {
            if (!responseJSON.tracks) {
                return []
            }
            return responseJSON.tracks.items.map( track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }))
        })
    },

    savePlaylist(playlistName, trackURIs) {
        if (playlistName && trackURIs) {
            var headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
            var userId

            console.log("access token below")
            console.log(accessToken)

            fetch('https://api.spotify.com/v1/me', 
            { headers: headers }).then((response) => { 
                return response.json()
            }).then((responseJSON) => {
                return responseJSON.id
            }).then((userID) => {
                userId = userID
                return `https://api.spotify.com/v1/users/${userID}/playlists`
            }).then((url) => {
               return fetch(url, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({name: playlistName})
                })
            }).then((response) => {
                return response.json()
            }).then((responseJSON) => {
                return responseJSON.id
            }).then((playlistID) => {
                return `https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`
            }).then((url) => {
                return fetch(url, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackURIs})
                })
            })
        }
        return
    }
}

export default Spotify