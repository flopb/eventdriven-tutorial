const userid = id()

document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById("remoteAlertButton")) {
        document.getElementById("remoteAlertButton").addEventListener("click", function () {
            remoteAlert(document.getElementById("alertText").value)
        })
    }

    if (document.getElementById("public_textarea")) {
        document.getElementById("public_textarea").addEventListener("keyup", function () {
            sync_public_textarea()
        })


        socket.on('my_response', function (msg, cb) {
            if (msg.data.call_function == "updateTextareaPublic") {
                updateTextareaPublic(msg.data.content)
            }
            if (msg.data.call_function == "showAlert") {
                if(msg.data.sender_id != userid) {
                    let result = confirm(msg.data.content)
                    sendMessage("returnResult", result)
                }
            }
            if (msg.data.call_function == "returnResult") {
                if(msg.data.sender_id != userid) {
                    console.log(msg.data.content)
                    alert("Remote user clicked " + (msg.data.content==true?"OK":"Cancel"))
                }
            }
        });
    }
}, false);

function sync_public_textarea() {
    let area_content = document.getElementById("public_textarea").value
    sendMessage("updateTextareaPublic", area_content)
}

function updateTextareaPublic(content = "") {
    document.getElementById("public_textarea").value = content
}

function remoteAlert(alertText) {
    sendMessage("showAlert", alertText)
}

function sendMessage(call_function, content) {
    socket.emit('my_broadcast_event', {
        data: {
            "call_function": call_function,
            "content": content,
            "sender_id": userid
        }
    });
}

function id() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};