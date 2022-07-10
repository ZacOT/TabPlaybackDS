(function () {

    //Guard variable to ensure content_script.js is not injected into the same page
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    //Function to set or reset playback device by Device ID
    function setPlaybackDevice(type, e, id) {
        //Select by Inputting Selected Device ID
        if (type == "select") {
            document.querySelectorAll('audio, video')
            .forEach(e => { e.setSinkId(id); });
            console.log("| TPDS | " + e + " has been set as the playback device");
        }
        //Reset by Inputting Empty Device ID
        else if(type == "reset"){
            document.querySelectorAll('audio, video')
            .forEach(e => { e.setSinkId(id); });
            console.log("| TPDS | Playback device has been reseted");
        }
    }

    //Function to Select or Reset Playback Device
    function selectPlaybackDevice(type) {

        //Get Permissions for Audio Devices
        navigator.mediaDevices.getUserMedia({ audio: true });
        getDevices = navigator.mediaDevices.enumerateDevices();

        //Check if selectAudioOutput() function is supported by browser
        if (!navigator.mediaDevices.selectAudioOutput) {
            browser.runtime.sendMessage({
                type: "error-nosupport-sao",
                message: "selectAudioOutput() is not supported on your browser!"
            });
            console.log("| TPDS | selectAudioOutput() is not supported.");
            return;
        }
        //If supported check if select or reset button was called
        else {
            //Select
            if (type == "select"){
            navigator.mediaDevices.selectAudioOutput()
                .then(device => {
                    console.log('| TPDS | Selected device: ' + device.label);
                    //Call Set Device Function
                    setPlaybackDevice(type, device.label, device.deviceId);
                }).catch(error => {
                    if (error.name == 'InvalidStateError') {
                        console.log("| TPDS | Transient Error.");
                        //Transient Error: Firefox requires user to click on a tab's webpage first
                        //Send a message to popup page to warn user 
                        browser.runtime.sendMessage({
                            type: "error-transient-click",
                            message: "Transient Error Occured! Please click on webpage first before selecting device."
                        });
                    }
                })
            }
            //Reset
            else if (type == "reset"){
                //Call Reset Device Function
                setPlaybackDevice(type, "", "");
            }
        }
    }

    //Obtain message and call appropriate function
    browser.runtime.onMessage.addListener((message) => {
        if (message.command == "tpdsselect") {
            selectPlaybackDevice("select");
        }
        else if (message.command == "tpdsreset") {
            selectPlaybackDevice("reset");
        }
    });

    browser.tabs.sendMessage(tabs[0].id, {
        command: "tpdsselect"
    });

})();