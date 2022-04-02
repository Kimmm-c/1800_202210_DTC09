function populateSong() {
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