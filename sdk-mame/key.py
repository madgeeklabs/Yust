from pykeyboard import PyKeyboard
from evdev import  ecodes as e
import sys

global key_to_press
global key_state

key_to_press = sys.argv[1] 
key_state = sys.argv[2] 
key_to_press = key_to_press 
#key_to_press = 'KEY_' + key_to_press




k = PyKeyboard()
key_to_press = key_to_press.upper()

if 1 == int(key_state):
    k.press_key(key_to_press)
elif 0 == int(key_state):
    k.release_key(key_to_press)

"""
for letter in "abcdefghijklmnopqrstuvwxyz1234567890":
    key_to_press = 'KEY_' + letter.upper()
    print letter, e.__dict__['ecodes'][key_to_press]
    k.press_key(e.__dict__['ecodes'][key_to_press])
    k.release_key(e.__dict__['ecodes'][key_to_press])
""" 
    
