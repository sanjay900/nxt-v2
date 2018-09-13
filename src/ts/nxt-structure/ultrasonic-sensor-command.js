export var UltrasonicSensorCommand;
(function (UltrasonicSensorCommand) {
    UltrasonicSensorCommand[UltrasonicSensorCommand["OFF"] = 0] = "OFF";
    /**
     * In this mode the ultrasonic sensor will only make a new measurement every time the command byte is send to the sensor. The sensor will measure distances for up to 8 objects and save the
     distances within the “Read measurement byte 0 – 7”.
     * @type {number}
     */
    UltrasonicSensorCommand[UltrasonicSensorCommand["SINGLE_SHOT"] = 1] = "SINGLE_SHOT";
    /**
     * This is the default mode, where the sensor continuously makes new measurement with the specified interval.
     * @type {number}
     */
    UltrasonicSensorCommand[UltrasonicSensorCommand["CONTINUOUS_MEASUREMENT"] = 2] = "CONTINUOUS_MEASUREMENT";
    /**
     * Within this mode the sensor will measure whether any other ultrasonic sensors are within the vicinity. With this information a program can evaluate when it is best to make a new
     measurement which will not conflict with other ultrasonic sensors.
     * @type {number}
     */
    UltrasonicSensorCommand[UltrasonicSensorCommand["EVENT_CAPTURE"] = 3] = "EVENT_CAPTURE";
    UltrasonicSensorCommand[UltrasonicSensorCommand["REQUEST_WARM_RESET"] = 4] = "REQUEST_WARM_RESET";
})(UltrasonicSensorCommand || (UltrasonicSensorCommand = {}));
