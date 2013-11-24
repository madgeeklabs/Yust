from evdev import uinput, ecodes as e
import sys
global key_to_press
key_to_press = sys.argv[1] 
key_to_press = key_to_press.upper() 

with uinput.UInput() as ui:
     key_to_press = 'KEY_' + key_to_press
     ui.write(e.EV_KEY, e.__dict__['ecodes'][key_to_press] , 1)
     ui.write(e.EV_KEY, e.__dict__['ecodes'][key_to_press], 0)
     ui.syn()
