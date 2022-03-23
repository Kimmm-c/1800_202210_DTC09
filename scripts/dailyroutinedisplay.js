function displayCards() {
    let taskcardTemplate = document.getElementById("TasksCardsTemplate");
    let TasksCardsGroup = document.getElementById("TasksCardsGroups")

    db.collection("MockSchedule").get()
        .then(alltasks => {
            alltasks.forEach(doc => { //iterate thru each doc
                var status = doc.data().done;   // get value of the "done" key
                var task = doc.data().task;   // get value of the "task" key
                var rating = doc.data().rating; // get value of the "rating" key
                var activity = doc.data().type; // get value of the "Type" key
                var icon = doc.data().icon;   // get value of the "icon" key
              
                let newtaskcard = taskcardTemplate.content.cloneNode(true);
                //update title and text and image
                newtaskcard.querySelector('.card-task').innerHTML = task;
                newtaskcard.querySelector('.icon-goes-here').innerHTML = icon;
                newtaskcard.querySelector('.activity-type').innerHTML = activity;
                newtaskcard.querySelector('.activity-status').innerHTML = status;
                newtaskcard.querySelector('.activity-mood').innerHTML = rating;
                
                TasksCardsGroup.appendChild(newtaskcard)
            })
        })
}

displayCards();