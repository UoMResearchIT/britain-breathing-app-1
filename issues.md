# Unsolved Issues

## 1. Saving data locally to be sent when there's a connection 

Date: 04/02/2019

Symptom: Data that should be saved locally isn't (Galaxy Note 9). Works on Pixel.

Cause:

How found: When I added the "Save Locally" feature to Britain Breathing and tested on the Galaxy Note 9. Same feature works fine on a Pixel.

Attempted Fixes: 

Fix: 

Fixed in file(s): 

Caused by me: 

Time taken to resolve bug: 

Lessons: 

## Solved Issues

## 1. Duplicate Username not detected

Date: 20/02/2019

Cause 

How found: Using duplicate usernames doesn't bring up an error

Attempted Fixes -

- checking to see what variables changed when the duplicate username is used, got the app to look for that static variable. It worked, but it worked on every username regardless of whether it was a duplicate or not.
- See if there's an error in the data that is sent - ie is the data corrpupted by a stray comma/piece of punctuation.

Fix: change the alert/error message in register.ts, as it wasn't showing up in any other instance

Fixed in file(s): register/register.ts (l. 262 -268)

Caused by me: No

Time taken to resolve bug: Too long, but once realiused could change the error message it was a simple fix.

Lessons: think of simplest soloution first
