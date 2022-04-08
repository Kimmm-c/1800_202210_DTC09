function populateSong() {
    // populates the song container by parsing the current url's params 
    // and pulling the specific data using the activity ID as the unique ID
    let params = new URL(window.location.href);
    let activityId = params.searchParams.get("id");               
    let activity = params.searchParams.get("activity");
    let activityIdRef = db.collection('meditation').doc(activityId)
    activityIdRef.get().then(data => {
        document.getElementById('activity-name').innerHTML = data.data().songName
        document.getElementById("description").innerHTML = data.data().description
        document.getElementById('song-url').src = data.data().url
    })
}


populateSong()