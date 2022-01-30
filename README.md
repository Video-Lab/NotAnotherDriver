
# Not Another Driver
"_Not Another Driver_" - Submission for TAMUHack 2022. <br>
# Our Devpost
Not published yet: to be updated ASAP!
# Getting started
## Cloning the repo to run code
Clone this repo in the IDE of your choice using the origin link `https://github.com/Video-Lab/NotAnotherDriver.git`
## Running the Computer Vision File
Run the `MAIN_FILE.py` file
### Resolving uninstalled modules
You may get a module not found error while trying to run the file, this is because you don't have the required Python libraries installed. <br>
Some common ones include:
`pip install opencv-python`
`pip install -U scikit-learn`
`pip install uuid`
### Use other sample videos
Some sample videos to test different situations are located in the `./Sample_Videos/_` folder. For this, just change the name of the video file on line 54 to the desired file (followed by .mp4!)
### Error with opencv window
For some reason, the exit button on the opencv window (the video itself) is unresponsive, so to quit the video just input `CTRL+C` into your terminal.
### End of video
After the video ends, the opencv window will quit and a matplotlib graph will display, which contains the change in area of the car in front over time. The higher the slope in an interval is, the more suddenly the driver braked.
