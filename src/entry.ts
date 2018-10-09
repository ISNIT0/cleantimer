import moment from 'moment';
import { h, makeRenderLoop } from 'nimble';

const target = <HTMLElement>document.getElementById('frame');
const socialFooterEl = <HTMLElement>document.getElementsByClassName('social-footer')[0];

const secondMod = 1000;
const minuteMod = secondMod * 60;
const hourMod = minuteMod * 60;

const affect = makeRenderLoop(target, {
    time: Date.now(),
    timerStart: 0,
    timerEnd: 0,
    minutes: 0,
    seconds: 0,
    hours: 0,
    selectedSound: 'beep'
},
    function (state, affect, changes) {
        const isEditing = !state.timerStart;
        return h('div.app', [
            h(`div.page${isEditing ? '.editing' : ''}`, {}, makeTimer(state, affect)),
            isEditing ? makeFooter(state, affect) : null,
            makeSocialFooter(),
        ])
    }
);


const alarmSounds: any = {
    beep: new Audio('./res/beep.mp3'),
    siren: new Audio('./res/siren.mp3'),
    bell: new Audio('./res/bell.mp3')
};

Object.keys(alarmSounds).forEach(key => {
    const sound = alarmSounds[key];
    sound.pause();
    sound.addEventListener('ended', function () {
        sound.currentTime = 0;
        sound.play();
    }, false);
});

function stopAllSounds() {
    Object.keys(alarmSounds).forEach(key => {
        const sound = alarmSounds[key];
        sound.pause();
        sound.currentTime = 0;
    });
}

function makeFooter(state: any, affect: Affect) {
    return h('div.footer', [
        h('br'),
        h('div.row', [
            h('strong', 'Alarm Sound'),
        ]),
        h('div.row', Object.keys(alarmSounds).map(key => {
            const isSelected = key === state.selectedSound;
            return h(`button`, {
                onclick() {
                    affect.set('selectedSound', key);
                }
            }, [isSelected ? h('img', { src: './res/checkbox-checked.svg' }) : h('img', { src: './res/checkbox.svg' }), ' ' + key])
        }))
    ]);
}


function makeSocialFooter() {
    return h('div', {
        key: 'social-footer',
        style: {
            width: '100%',
            'margin-bottom': '5vw'
        }
    }, [
            h('a.button', {
                href: 'https://twitter.com/intent/tweet?url=https%3A%2F%2Fcleantimer.io%2F&text=Loving%20this%20simple%2C%20good%20looking%20timer%20app!%20via%20%40JReeve0',
            }, 'Tweet'),
            h('a.button', {
                href: 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcleantimer.io%2F',
            }, 'Facebook')
        ]);
}

function makeTimer(state: any, affect: Affect) {
    if (state.timerStart) {
        const hasEnded = state.timerEnd < state.time;
        const t = state.timerEnd - state.time;
        const seconds = Math.max(Math.floor((t / 1000) % 60), 0);
        const minutes = Math.max(Math.floor((t / 1000 / 60) % 60), 0);
        const hours = Math.max(Math.floor((t / (1000 * 60 * 60)) % 24), 0);

        if (hasEnded) {
            alarmSounds[state.selectedSound].play();
        }

        const shouldShowHours = (state.timerEnd - state.timerStart) > hourMod;
        return [
            h(`div.row${hasEnded ? '.flash' : ''}`, [
                ...(shouldShowHours ?
                    [leftPad(hours, 2), ':']
                    : []
                ),
                leftPad(minutes, 2),
                ':',
                leftPad(seconds, 2)
            ]),
            h('div.row', {
                style: hasEnded ? {
                    opacity: 0.5,
                    'max-height': '300px',
                    'margin-top': '-8vw'
                } : {
                        opacity: 0,
                        'max-height': 0
                    }
            }, [
                    h('button', {
                        onclick() {
                            stopAllSounds();
                            affect.set('timerStart', Date.now());
                            affect.set('timerEnd', moment().add(state.hours, 'hours').add(state.minutes, 'minutes').add(state.seconds, 'seconds'));
                        }
                    }, h('img', { src: './res/reset.svg' })),
                    h('button', {
                        onclick() {
                            stopAllSounds();
                            affect.set('timerStart', 0);
                            affect.set('timerEnd', 0);
                            affect.set('hours', 0);
                            affect.set('minutes', 0);
                            affect.set('seconds', 0);
                        }
                    }, h('img', { src: './res/cancel.svg' }))
                ])
        ];
    } else {
        const showStartButton = (state.hours + state.minutes + state.seconds) > 0;
        return [
            h('div.row', [
                h('input', {
                    placeholder: 'H',
                    max: 59,
                    min: 0,
                    type: 'number',
                    oninput(ev: any) {
                        const val = Math.max(0, Math.min(ev.target.value, 59));
                        ev.target.value = val;
                        affect.set('hours', val);
                    },
                    onchange(ev: any) {
                        // const el: any = ev.target;
                        // el.nextSibling.nextSibling.focus();
                    }
                }),
                h('div', ':'),
                h('input', {
                    placeholder: 'M',
                    max: 59,
                    min: 0,
                    type: 'number',
                    oninput(ev: any) {
                        const val = Math.max(0, Math.min(ev.target.value, 59));
                        ev.target.value = val;
                        affect.set('minutes', val);
                    },
                    onchange(ev: any) {
                        // const el: any = ev.target;
                        // el.nextSibling.nextSibling.focus();
                    }
                }),
                h('div', ':'),
                h('input', {
                    placeholder: 'S',
                    max: 59,
                    min: 0,
                    type: 'number',
                    oninput(ev: any) {
                        const val = Math.max(0, Math.min(ev.target.value, 59));
                        ev.target.value = val;
                        affect.set('seconds', val);
                    },
                    onchange(ev: any) {
                        // if (showStartButton) {
                        //     const startButton: any = document.querySelector('button.start');
                        //     startButton.click();
                        // }
                    }
                })
            ]),
            h('div.row', {
                style: {
                    'max-height': showStartButton ? '25%' : '0',
                    'overflow': 'hidden'
                }
            }, [
                    h('button.start', {
                        onclick() {
                            affect.set('timerStart', Date.now());
                            affect.set('timerEnd', moment().add(state.hours, 'hours').add(state.minutes, 'minutes').add(state.seconds, 'seconds'));
                        },
                        style: {
                            visibility: showStartButton ? 'visible' : 'hidden'
                        }
                    }, 'START')
                ])
        ];
    }
}


function leftPad(number: Number, length: Number) {
    return ((<any>'0').repeat(length) + String(Number(number))).slice(-length);
}

function setTime() {
    affect.set('time', Date.now());

    setTimeout(setTime, 1000);
}

setTime();