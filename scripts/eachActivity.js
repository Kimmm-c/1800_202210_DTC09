function showDetails() {
    // create a URL object
    let params = new URL(window.location.href);
    let id = params.searchParams.get("id");               //parse "id"
    let hikeName = params.searchParams.get("activity");   //parse "collection"

    let message = "Hike Name is: " + hikeName;           //build message to display
    message += " &nbsp | Document id is:  " + id;    
    document.getElementById("HikeName").innerHTML = hikeName;  
    document.getElementById("details-go-here").innerHTML = message; 
}


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