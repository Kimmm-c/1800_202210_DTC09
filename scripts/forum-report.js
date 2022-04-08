var options = document.querySelectorAll('input[name="one_option_radio"]');      //retrieve all the radio options as an array
threadID = localStorage.getItem("threadID");       //retrieve thread ID stored in local storage
console.log(threadID);

//If any of the radio button is checked, fire the function change_textbox_status to enable/disable the textarea
for (i = 0; i < options.length; i++) {
    options[i].addEventListener("change", change_textbox_status);
}

//If the option 'other' is selected, enable the textare. Otherwise disable it.
function change_textbox_status() {
    if (this.id == 'other') {
        $('textarea').attr('disabled', false);
    } else {
        $('textarea').val('');
        $('textarea').attr('disabled', true);
    }
}

//Add the report details to the database under sub-sollection reports and display an update message to the user
function submit_report_form(report_reason) {
    firebase.auth().onAuthStateChanged((user) => {
        userID = user.uid;
        db.collection(`thread/${threadID}/reports`).add({
            userid: userID,
            report_reason: report_reason,
            submit_time: firebase.firestore.FieldValue.serverTimestamp()
        })
        $(".report_thread").html(`<div id='report_update_message'>You have successfully submitted your report. We always take your concern seriously. Please allow us 2-3 business days for response.</div>`)
    })
}

//use preventDefault to stop the page from refreshing automatically
function setup() {
    document.getElementById('submit_thread_report').addEventListener('click', (e) => {
        e.preventDefault();
        report_reason = document.querySelector("input[name='one_option_radio']:checked").id;
        if (report_reason != 'other') {
            submit_report_form(report_reason);
        } else {
            report_reason = $('textarea').val();
            submit_report_form(report_reason);
        }
    }
    );
    $('#cancel_thread_report').click((e) => {
        e.preventDefault();
        window.location.href = "./index.html";
    })
}

$(document).ready(setup);