//Function for Popup Page Button Clicked Listener
function listenForClicks() {
    //Listen for Clicks
    document.addEventListener("click", (e) => {

        //Functions to send message to content.script
        //Select Command
        function tpdsselect(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "tpdsselect"
            });
        }

        //Reset Command
        function tpdsreset(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "tpdsreset"
            });
        }

        //Check which button is clicked and send appropriate command
        //Select Button
        if (e.target.classList.contains("selectpd")) {
            browser.tabs.query({ active: true, currentWindow: true })
                .then(tpdsselect)
                .catch(reportError);
        }
        //Reset Button
        else if (e.target.classList.contains("resetpd")) {
            browser.tabs.query({ active: true, currentWindow: true })
                .then(tpdsreset)
                .catch(reportError);
        }
    });

}
browser.runtime.onMessage.addListener((message) => {

    document.querySelector('#error-wrapper').classList.remove('hidden');
    errorp = document.getElementById("error-p");

    if (message.type == "error-transient-click"){
        errorp.innerHTML = message.message;
    }
    if (message.type == "error-nosupport-sao"){
        errorp.innerHTML = message.message;
    }
});

browser.tabs.executeScript({ file: "/content_script.js" })
    .then(listenForClicks);
