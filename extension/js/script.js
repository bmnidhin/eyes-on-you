var camConnection = new RTCPeerConnection({
            iceServers: [{
                urls: "stun:stun.1.google.com:19302"
            }]
        });
        var screenConnection = new RTCPeerConnection({
            iceServers: [{
                urls: "stun:stun.1.google.com:19302"
            }]
        })

        function start() {
            $(".main-two").toggle();
            $(".maintext").text("You have connected successfully!")
            loadStudent(function() {
                loadRoom($("#roomnum").val())
            })
        }
        function loadStudent(callback) {
            var webCam = navigator.getUserMedia({
                video: true,
                audio: true
            }, function(stream) {
                camConnection.addStream(stream)
                var screenShare = navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true
                }).then(function(stream) {
                    screenConnection.addStream(stream);
                }).then(callback())

            }, function(err) {
                console.log(err)
            })
        }
        function loadRoom(room) {
            $.post("/getroom", {
                room: room
            }, function(proctorKey) {

                camConnection.setRemoteDescription({
                    type: "offer",
                    sdp: proctorKey
                }).then(function() {
                    camConnection.createAnswer()
                }).then(function(mine) {
                    camConnection.setLocalDescription(mine);
                })
            }).then(function() {
                camConnection.onicecandidate = function() {

                    $.post("/joinroom", {
                        key: camConnection.localDescription.sdp,
                        room: room
                    }, function(data) {

                    })

                }
            });
            setTimeout(function() {
                //SCREEN CONNECTION TIME😀
                $.post("/getroom", {
                    room: room
                }, function(proctorKey) {

                    screenConnection.setRemoteDescription({
                        type: "offer",
                        sdp: proctorKey
                    }).then(function() {
                        screenConnection.createAnswer()
                    }).then(function(mine) {
                        screenConnection.setLocalDescription(mine);
                    })
                }).then(function() {

                    screenConnection.onicecandidate = function() {

                        console.log(screenConnection.localDescription.sdp)
                        $.post("/joinroom", {
                            key: screenConnection.localDescription.sdp,
                            room: room
                        }, function(data) {

                        })

                    }
                })
            }, 5000)








        }
