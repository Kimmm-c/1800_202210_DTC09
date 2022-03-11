
function read_display_Quote() {

    db.collection("moodtracker").doc("Monday")                                                      //name of the collection and documents should matach excatly with what you have in Firestore
        .onSnapshot(MondayDoc => {                                                               //arrow notation
            console.log("current document data: " + MondayDoc.data());                          //.data() returns data object
            document.getElementById("question-goes-here").innerHTML = MondayDoc.data().Question1;      //using javascript to display the data on the right place

            //Here are other ways to access key:value data fields
            //$('#quote-goes-here').text(c.data().quote);                                       //using jquery object dot notation
            //$("#quote-goes-here").text(c.data()["quote"]);                                    //using json object indexing
        })
}
read_display_Quote()        //calling the function

