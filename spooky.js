angular.module('SpookyApp', []).
    controller('SpookyController', function($scope, $location, $anchorScroll, $q) {
        var moving = null,
            self   = this;

        $scope.marioStyle = {
            "left":            "5%",
            "bottom":          "13%",
            "width":           "6%"
        };

        $scope.yesBlockStyle = {
            "width":           "12%",
            "left":            "30%"
        };

        $scope.noBlockStyle = {
            "width":           "12%",
            "left":            "70%"
        };

        $scope.viewerIsStillYourFriend = true;

        $scope.moveLeft = function() {
            moving = setInterval(function() {
                $scope.$apply(function() {
                    $scope.marioStyle.left = parseInt($scope.marioStyle.left) - 1 + '%';
                });
            }, 30);
        };

        $scope.moveRight = function() {
            moving = setInterval(function() {
                $scope.$apply(function() {
                    $scope.marioStyle.left = parseInt($scope.marioStyle.left) + 1 + '%';
                });
            }, 30);
        };

        $scope.jump = function() {
            var y         = 0,
                maxHeight = 20;

            var up = $q(function(then) {
                var upInterval = setInterval(function () {
                    $scope.$apply(function () {
                        $scope.marioStyle.bottom = parseInt($scope.marioStyle.bottom) + 1 + '%';
                        y++;
                    });

                    if (y >= maxHeight) {
                        clearInterval(upInterval);
                        self.checkRsvpHit();
                        then();
                    }
                }, 10);
            });

            var down = function() {
                var downInterval = setInterval(function() {
                    $scope.$apply(function () {
                        $scope.marioStyle.bottom = parseInt($scope.marioStyle.bottom) - 1 + '%';
                        y--;
                    });

                    if (y <= 0) {
                        clearInterval(downInterval);
                    }
                }, 10);
            };

            up.then(down);
        };

        $scope.stopMoving = function() {
            clearInterval(moving);
            moving = null;
        };

        this.checkRsvpHit = function() {
            var marioLeft  = parseInt($scope.marioStyle.left),
                marioRight = parseInt($scope.marioStyle.left) + parseInt($scope.marioStyle.width),
                yesLeft    = parseInt($scope.yesBlockStyle.left),
                yesRight   = parseInt($scope.yesBlockStyle.left) + parseInt($scope.yesBlockStyle.width),
                noLeft     = parseInt($scope.noBlockStyle.left),
                noRight    = parseInt($scope.noBlockStyle.left) + parseInt($scope.noBlockStyle.width);

            if (marioLeft <= yesRight && yesLeft <= marioRight) {
                self.rsvp('yes');
            }

            if (marioLeft <= noRight && noLeft <= marioRight) {
                self.rsvp('no');
            }
        };

        this.rsvp = function(choice) {
            $scope.viewerIsStillYourFriend = false;
            $location.hash(choice+'-div');
            $anchorScroll();
        };

        // I know, I know, this is cheating
        var rightButton = document.getElementById('right-button');
        rightButton.addEventListener("touchstart", $scope.moveRight, false);
        rightButton.addEventListener("touchend", $scope.stopMoving, false);
        var leftButton = document.getElementById('left-button');
        leftButton.addEventListener("touchstart", $scope.moveLeft, false);
        leftButton.addEventListener("touchend", $scope.stopMoving, false);
    });
