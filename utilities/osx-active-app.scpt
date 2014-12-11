tell application "System Events"
    set frontApp to name of first application process whose frontmost is true
end tell
tell application frontApp
    if the (count of windows) is not 0 then
        set window_name to name of front window
    end if
end tell
