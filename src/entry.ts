import moment from 'moment';
import { h, makeRenderLoop } from 'nimble';

const target = <HTMLElement>document.getElementById('frame');

const secondMod = 1000;
const minuteMod = secondMod * 60;
const hourMod = minuteMod * 60;

const affect = makeRenderLoop(target, {
    time: Date.now(),
    timerStart: 0,
    timerEnd: 0,
    minutes: 0,
    seconds: 0,
    hours: 0
},
    function (state, affect, changes) {
        const isEditing = !state.timerStart;
        return h('div.app', [
            h(`div.page${isEditing ? '.editing' : ''}`, {}, makeTimer(state, affect)),
            isEditing ? h('div.footer', [
                h('button.selected', 'TONE 1'),
                h('button.selected', 'TONE 2'),
                h('button.selected', 'TONE 3'),
                h('button.selected', 'TONE 4')
            ]) : null
        ])
    }
);




function makeTimer(state: any, affect: Affect) {
    if (state.timerStart) {
        const hasEnded = state.timerEnd < state.time;
        const t = state.timerEnd - state.time;
        const seconds = Math.max(Math.floor((t / 1000) % 60), 0);
        const minutes = Math.max(Math.floor((t / 1000 / 60) % 60), 0);
        const hours = Math.max(Math.floor((t / (1000 * 60 * 60)) % 24), 0);

        if (hasEnded) {
            //alarm.play();
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
                    'max-height': '300px'
                } : {
                        opacity: 0,
                        'max-height': 0
                    }
            }, [
                    h('button', {
                        onclick() {
                            affect.set('timerStart', Date.now());
                            affect.set('timerEnd', moment().add(state.hours, 'hours').add(state.minutes, 'minutes').add(state.seconds, 'seconds'));
                        }
                    }, h('img', { src: './res/reset.svg' })),
                    h('button', {
                        onclick() {
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
                    }
                })
            ]),
            h('div.row', [
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