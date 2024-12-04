const getAboutButton = (context) => new Button({
    label: 'About',
    context,
    elementClasses: 'button-wrapper',
    action: () => {
        PausedSubject.togglePause();
        new LongInformation({
            context,
            content: [
                {
                    type: 'h1',
                    value: 'About'
                },
                {
                    type: 'h3',
                    value: 'Author'
                },
                {
                    type: 'p',
                    value: 'Marek Gudalewicz'
                },
                {
                    type: 'h3',
                    value: 'Game purpose'
                },
                {
                    type: 'p',
                    value: 'Except for learning the rxjs library, and practicing vanilla JS (wich is a bit tricky for writing extendable applications) game is written to allow learn and practice keyboard layout. Game allows to adjust quite number of options in settings section, and this makes it worthy for both: adults and children',
                },
                {
                    type: 'h3',
                    value: 'Toolbar content',
                },
                {
                    type: 'list',
                    value: [
                        'Score: current score. Hitting one letter adds 10',
                        'Missed: how many letters reached bottom of the screen before they were hit on the keyboard (this may be adjusted, turned off)',
                        'Errors: see how many letters that were not on screen were hit (this may be adjusted, turned off)',
                        'Time left: see how much time is left before game ends (this may be adjusted, turned off)',
                        'Time: see how much time passed from the start of the game. This counter is paused when pause, about or settings are open',
                        'Reaction time: see average time that passes between a character appears on the screen, and you press it. The lower the value, the better your reflex',
                        'Pause: pauses the game. About and game settings do the same',
                        'About: open this window',
                        'Settings: open a window with game adjustments (see below)',
                        'Clear: removes all letters on the screen. Helpfull for begginers. May be used for cheeting, but cheeter will not learn, so overusage of this button makes no sense',
                        'End game: button ends game, pauses it, and saves score in the top 10 score list, if score is good enough. May be used when there is not game time limit, and user would like to end game with score save',
                        'Top 10: opens a top 10 score list'
                    ]
                },
                {
                    type: 'h3',
                    value: 'Settings'
                },
                {
                    type: 'h5',
                    value: 'In characters section'
                },
                {
                    type: 'p',
                    value: 'User may select many of following:'
                },
                {
                    type: 'list',
                    value: [
                        'Upper case letters',
                        'Lower case letters',
                        'Digits',
                        'Polish special letters like "Ą", "ć", "ź", "ó"'
                    ]
                },
                {
                    type: 'h5',
                    value: 'In parameters section'
                },
                {
                    type: 'p',
                    value: 'User may adjust'
                },
                {
                    type: 'list',
                    value: [
                        'Speed that characters will fall down',
                        'Speed that characters will appear',
                        'Maximum number of missed letters, after wich game will end',
                        'Maximum number of wrong characters that were typed, before game ends'
                    ]
                },
                {
                    type: 'h5',
                    value: 'In "End game with timeout" section'
                },
                {
                    type: 'p',
                    value: 'User may select if game should end after a timeout, and then this interval may be tuned'
                },

                {
                    type: 'h5',
                    value: 'In "Other" section'
                },
                {
                    type: 'p',
                    value: 'Following options are available'
                },
                {
                    type: 'list',
                    value: [
                        'Player name: needed for the top 10 score list',
                        '"Reset on miss" will indicate if all letters should disappear from screen after player misses one of them. May be helpflul for begginers',
                        '"End game on threshold broken": unchecking this option will make game continue, even when maximum number of missed characters, or maximum number of not correct latters threshold is broken'
                    ]
                }


            ]
        })
    }
})
