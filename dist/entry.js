"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
var nimble_1 = require("nimble");
var target = document.getElementById('frame');
var socialFooterEl = document.getElementsByClassName('social-footer')[0];
var secondMod = 1000;
var minuteMod = secondMod * 60;
var hourMod = minuteMod * 60;
var affect = nimble_1.makeRenderLoop(target, {
    time: Date.now(),
    timerStart: 0,
    timerEnd: 0,
    minutes: 0,
    seconds: 0,
    hours: 0,
    selectedSound: 'beep'
}, function (state, affect, changes) {
    var isEditing = !state.timerStart;
    return nimble_1.h('div.app', [
        nimble_1.h("div.page" + (isEditing ? '.editing' : ''), {}, makeTimer(state, affect)),
        isEditing ? makeFooter(state, affect) : null,
        makeSocialFooter(),
    ]);
});
var alarmSounds = {
    beep: new Audio('./res/beep.mp3'),
    siren: new Audio('./res/siren.mp3'),
    bell: new Audio('./res/bell.mp3')
};
Object.keys(alarmSounds).forEach(function (key) {
    var sound = alarmSounds[key];
    sound.pause();
    sound.addEventListener('ended', function () {
        sound.currentTime = 0;
        sound.play();
    }, false);
});
function stopAllSounds() {
    Object.keys(alarmSounds).forEach(function (key) {
        var sound = alarmSounds[key];
        sound.pause();
        sound.currentTime = 0;
    });
}
function makeFooter(state, affect) {
    return nimble_1.h('div.footer', [
        nimble_1.h('br'),
        nimble_1.h('div.row', [
            nimble_1.h('strong', 'Alarm Sound'),
        ]),
        nimble_1.h('div.row', Object.keys(alarmSounds).map(function (key) {
            var isSelected = key === state.selectedSound;
            return nimble_1.h("button", {
                onclick: function () {
                    affect.set('selectedSound', key);
                }
            }, [isSelected ? nimble_1.h('img', { src: './res/checkbox-checked.svg' }) : nimble_1.h('img', { src: './res/checkbox.svg' }), ' ' + key]);
        }))
    ]);
}
function makeSocialFooter() {
    return nimble_1.h('div', {
        key: 'social-footer',
        style: {
            width: '100%'
        },
        oncreate: function (el) {
            var visibleFooter = socialFooterEl.cloneNode(true);
            visibleFooter.classList.remove('hidden');
            el.appendChild(visibleFooter);
        },
        onupdate: function (el) {
            if (!el.children.length) {
                // const visibleFooter = socialFooterEl.cloneNode(true) as HTMLElement;
                // visibleFooter.classList.remove('hidden');
                // el.appendChild(visibleFooter);
            }
        }
    });
}
function makeTimer(state, affect) {
    if (state.timerStart) {
        var hasEnded = state.timerEnd < state.time;
        var t = state.timerEnd - state.time;
        var seconds = Math.max(Math.floor((t / 1000) % 60), 0);
        var minutes = Math.max(Math.floor((t / 1000 / 60) % 60), 0);
        var hours = Math.max(Math.floor((t / (1000 * 60 * 60)) % 24), 0);
        if (hasEnded) {
            alarmSounds[state.selectedSound].play();
        }
        var shouldShowHours = (state.timerEnd - state.timerStart) > hourMod;
        return [
            nimble_1.h("div.row" + (hasEnded ? '.flash' : ''), (shouldShowHours ?
                [leftPad(hours, 2), ':']
                : []).concat([
                leftPad(minutes, 2),
                ':',
                leftPad(seconds, 2)
            ])),
            nimble_1.h('div.row', {
                style: hasEnded ? {
                    opacity: 0.5,
                    'max-height': '300px',
                    'margin-top': '-8vw'
                } : {
                    opacity: 0,
                    'max-height': 0
                }
            }, [
                nimble_1.h('button', {
                    onclick: function () {
                        stopAllSounds();
                        affect.set('timerStart', Date.now());
                        affect.set('timerEnd', moment_1.default().add(state.hours, 'hours').add(state.minutes, 'minutes').add(state.seconds, 'seconds'));
                    }
                }, nimble_1.h('img', { src: './res/reset.svg' })),
                nimble_1.h('button', {
                    onclick: function () {
                        stopAllSounds();
                        affect.set('timerStart', 0);
                        affect.set('timerEnd', 0);
                        affect.set('hours', 0);
                        affect.set('minutes', 0);
                        affect.set('seconds', 0);
                    }
                }, nimble_1.h('img', { src: './res/cancel.svg' }))
            ])
        ];
    }
    else {
        var showStartButton = (state.hours + state.minutes + state.seconds) > 0;
        return [
            nimble_1.h('div.row', [
                nimble_1.h('input', {
                    placeholder: 'H',
                    max: 59,
                    min: 0,
                    type: 'number',
                    oninput: function (ev) {
                        var val = Math.max(0, Math.min(ev.target.value, 59));
                        ev.target.value = val;
                        affect.set('hours', val);
                    },
                    onchange: function (ev) {
                        // const el: any = ev.target;
                        // el.nextSibling.nextSibling.focus();
                    }
                }),
                nimble_1.h('div', ':'),
                nimble_1.h('input', {
                    placeholder: 'M',
                    max: 59,
                    min: 0,
                    type: 'number',
                    oninput: function (ev) {
                        var val = Math.max(0, Math.min(ev.target.value, 59));
                        ev.target.value = val;
                        affect.set('minutes', val);
                    },
                    onchange: function (ev) {
                        // const el: any = ev.target;
                        // el.nextSibling.nextSibling.focus();
                    }
                }),
                nimble_1.h('div', ':'),
                nimble_1.h('input', {
                    placeholder: 'S',
                    max: 59,
                    min: 0,
                    type: 'number',
                    oninput: function (ev) {
                        var val = Math.max(0, Math.min(ev.target.value, 59));
                        ev.target.value = val;
                        affect.set('seconds', val);
                    },
                    onchange: function (ev) {
                        // if (showStartButton) {
                        //     const startButton: any = document.querySelector('button.start');
                        //     startButton.click();
                        // }
                    }
                })
            ]),
            nimble_1.h('div.row', {
                style: {
                    'max-height': showStartButton ? '25%' : '0',
                    'overflow': 'hidden'
                }
            }, [
                nimble_1.h('button.start', {
                    onclick: function () {
                        affect.set('timerStart', Date.now());
                        affect.set('timerEnd', moment_1.default().add(state.hours, 'hours').add(state.minutes, 'minutes').add(state.seconds, 'seconds'));
                    },
                    style: {
                        visibility: showStartButton ? 'visible' : 'hidden'
                    }
                }, 'START')
            ])
        ];
    }
}
function leftPad(number, length) {
    return ('0'.repeat(length) + String(Number(number))).slice(-length);
}
function setTime() {
    affect.set('time', Date.now());
    setTimeout(setTime, 1000);
}
setTime();
