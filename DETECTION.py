import cv2
import numpy as np
import pandas as pd
import random
import os
import pickle
import sklearn.model_selection
import matplotlib.pyplot as plt
import math
import uuid

print('Imported \n\n')

config_file = './CNN_Training_Files/ssd_mobilenet_v3_large_coco_2020_01_14.pbtxt'
frozen_model = './CNN_Training_Files/frozen_inference_graph.pb'
#pre trained neural network
model = cv2.dnn_DetectionModel(frozen_model, config_file)

classLabels= [] #model training stuff, not necessary
file_name = './CNN_Training_Files/labels.txt'
with open(file_name, 'rt') as fpt:
    classLabels = fpt.read().rstrip('\n').split('\n')

# print(len(classLabels))
# img = cv2.imread('test_image4.png')


model.setInputSize(320,320) #model training stuff, not necessary
model.setInputScale(1.0/127.5)
model.setInputMean((127.5,127.5,127.5))
model.setInputSwapRB(True)

print('Trained \n\n')

def isInSameLane(pa, pb, pc):
    #pa is bottom
    #pb is box
    #pc is top
    #a is from bottom to box
    #b is from box to top
    #c is from bottom to top
    # print(pa, ' ', pb, ' ', pc)
    #returns true if angle between vertical and box in consideration is between 0.2 radians
    #aka between purple and red lines
    a = math.sqrt(((pb[0] - pa[0]) ** 2) + ((pb[1] - pa[1]) ** 2))
    b = math.sqrt(((pc[0] - pb[0]) ** 2) + ((pc[1] - pb[1]) ** 2))
    c = math.sqrt(((pa[0] - pc[0]) ** 2) + ((pa[1] - pc[1]) ** 2))
    # print(a, ' ', b, ' ', c)
    theta = math.acos(((a**2) + (c**2) - (b**2))/(2*a*c))
    return theta < 0.2

#VIDEO CAPTURE

cap = cv2.VideoCapture('./Sample_Videos/obj_detection.mp4') #VIDEO TO TRAIN, LOTS OF OPTIONS



if (cap.isOpened()==False):
    print('Error opening video :(')

box_areas = [] #used later to determine largest (ideally car in front in same lane) box

while(cap.isOpened()):
    ret, frame = cap.read() #frame is the current image
    if ret == True:
        ClassIndex, confidence, bbox = model.detect(frame, confThreshold = 0.55) #Neural network implementation to detect things
        if(not ClassIndex==()):
            bottom = (frame.shape[1]//2, int(frame.shape[0] - (0.1*frame.shape[0]))) #bottom of all lines (red and purple)
            top = (frame.shape[1]//2, 0) #top of purple line
            bigbox = [0,0,0,0] #initialization
            for box in bbox: #figuring out largest (ideally car in front in same lane) bpx
                # ind += 1
                if(box[2]*box[3]>bigbox[2]*bigbox[3]):
                    bigbox = box
                    
            for ClassInd, conf, boxes in zip(ClassIndex.flatten(), confidence.flatten(), bbox): #going through stuffs in image, not too sure
                cv2.rectangle(frame, boxes, (255,0,0), 2)
                cv2.putText(frame, classLabels[ClassInd - 1], (bigbox[0]+10, bigbox[1]+40), cv2.FONT_HERSHEY_PLAIN, fontScale=2, color=(0,255,0), thickness=3)
                
                # boxx = ((bigbox[0]+bigbox[2]//2), (bigbox[1]+bigbox[3]//2)) #red lines top point, passed as c
                # area = bigbox[2]*bigbox[3]
                # math.sqrt(((bottom[0] - boxx[0]) ** 2) + (bottom[1] - boxx[1]) ** 2)<100 or or area/frame.shape[0]*frame.shape[1]>0.7
                # if(isInSameLane(bottom, boxx, top) ): #is in same lane or is
                #     #so big that it takes up greater than 0.5% of screen, object shows as green
                #     box_areas.append(area) #data collection
                #     cv2.rectangle(frame, bigbox, (0,255,0), 2) #da box
                #     cv2.line(frame, bottom, boxx, (0,0,255), 3) #da red line
                cv2.rectangle(frame, bigbox, (255,0,0), 2) #dont remember, was supposed to be to display rest of the objects
                # if len(box_areas)>1:
                #     cv2.putText(frame, 'Slope: ' + str((box_areas[-1]-box_areas[-2])/2), (frame.shape[1]-200, 40), cv2.FONT_HERSHEY_PLAIN, fontScale=1, color=(186, 17, 48), thickness=2)
                
                # cv2.line(frame, bottom, top ,(143, 0, 140), 3) #purple line

        cv2.imshow('Frame',frame) #showing image
        if cv2.waitKey(25) & (0xFF == ord('q')):
            break
    else:
        break


cap.release()
cv2.destroyAllWindows()


#areas collected over time and plotted
x = np.linspace(1,len(box_areas), len(box_areas))
avg_y = [box_areas[0]]
for i in range(0, len(box_areas)-11, 10):
    avg_y.append(box_areas[i])
avg_y.append(box_areas[-1])
avg_x = np.linspace(1, len(box_areas), len(avg_y))

plt.plot(x, box_areas, 'k*')
plt.plot(avg_x, avg_y,'r', linewidth=4)
plt.title('area of surrounding box of car in front over time + trendline')
plt.show()

#first derivative of areas (change in areas)
slopes = []
for i in range(0, len(box_areas)-1):
    slope = (box_areas[i+1]-box_areas[i])/2
    if(0<slope<5000):
        slopes.append((box_areas[i+1]-box_areas[i])/2)
slopes.append((box_areas[-1]-box_areas[-2])/2)

plt.plot(slopes)
plt.show()

#avg derivatives
avg_ders = []
for i in range(0, len(avg_y)-1):
    avg_ders.append((avg_y[i+1]-avg_y[i])/2)
avg_ders.append((avg_y[-1]-avg_y[-2])/2)
plt.plot(avg_ders)
# plt.title('average slopes, taken every 10 values')
# plt.show()

#second derivative of areas (change in slopes of areas)
deri2 = []
for i in range(0, len(slopes)-1):
    deri = (slopes[i+1]-slopes[i])/2
    # if(0<slope<5000):
    deri2.append((slopes[i+1]-slopes[i])/2)
deri2.append((slopes[-1]-slopes[-2])/2)

# plt.plot(deri2)
# plt.show()

print(len(box_areas),len(slopes), len(deri2))

def writeDriveDetectionData():
    with open("./drives/new_detection"  + '.csv', 'w+') as f:
        f.write('area\n')
        f.write('\n'.join(str(i) for i in box_areas))

writeDriveDetectionData()