#!/usr/bin/env node
const blessed = require('blessed');
const chalk = require('chalk');
const robot = require('robotjs');
const keypress = require('keypress');

class deezClicks {
    constructor() {
        this.cps = 0;
        this.autoClickInterval = null;
        this.isAutoClicking = false;

        this.screen = blessed.screen({
            smartCSR: true
        });
        this.log = blessed.log({
            parent: this.screen,
            top: 'center',
            left: 'center',
            width: '100%',
            height: '70%',
            border: {
                type: 'line'
            },
            style: {
                fg: 'cyan',
                bg: 'black',
                border: {
                    fg: 'cyan'
                }
            },
            label: chalk.cyan('-+-+-+-+-+- deezClicks -+-+-+-+-+-'),
            scrollable: true,
            scrollbar: {
                ch: ' ',
                inverse: true,
            },
            content: `
    Start by setting CPS with 'cps <value>' then type 'start'

    Type help to list commands
            `
        });
        this.inputBox = blessed.textbox({
            parent: this.screen,
            bottom: 0,
            left: 0,
            height: 3,
            width: '100%',
            height: 'shrink',
            inputOnFocus: true,
            keys: true,
            mouse: true,
            title: chalk.green('CPS:'),
            border: {
                type: 'line',
                fg: 'cyan'
            },
            style: {
                fg: 'green',
                bg: 'black'
            }
        });
    }

    setupUI() {
        this.screen.key(['escape', 'q', 'C-c'], (ch, key) => {
            return process.exit(0);
        });

        // Handle screen resize
        this.screen.on('resize', () => {
            this.log.emit('attach');
        });

        // Handle keypress events
        process.stdin.on('keypress', (ch, key) => {
            if (key && key.name === 's' && key.ctrl) {
                this.stopAutoClick();
                this.log.log(chalk.yellow('deezClicks stopped by hotkey'));
                this.screen.render();
            }
        });

        // Listen for keyboard events
        process.stdin.setRawMode(true);
        process.stdin.resume();


        this.inputBox.key('enter', () => {
            const command = this.inputBox.getValue().trim().toLowerCase();

            // Version command
            if (command === 'ver' || command === 'version') {
                this.log.log(chalk.green('Version: 1.0.1 :D'));
            }

            // Help command
            else if (command === 'help') {
                this.log.log('');
                this.log.log(chalk.yellow('=+=+=+=+=+= Help =+=+=+=+=+='));
                this.log.log('');
                this.log.log(chalk.yellow('cps <value>: '), chalk.green('enter clicks-per-second value (1-250)'));
                this.log.log(chalk.yellow('start: '), chalk.green('start deezClicks from CPS value'));
                this.log.log(chalk.yellow('stop: '), chalk.green('stop deezClicks from command'));
                this.log.log(chalk.yellow('^S:'), chalk.green('stop deezClicks from hotkey'));
                this.log.log(chalk.yellow('clear, clr: '), chalk.green('clear the log'));
                this.log.log(chalk.yellow('ver, version: '), chalk.green('log deezClicks version'));
                this.log.log(chalk.yellow('^C, ESC, Q: '), chalk.green('quit deezClicks'));
            }

            else if (command === 'q') {
                return process.exit(0);
            }

            else if (command === 'clr' || command === 'clear') {
                this.log.setContent('');
            }

            else if (command.startsWith('cps ')) {
                const cpsValue = parseInt(command.split(' ')[1]);
                if (isNaN(cpsValue) || cpsValue < 1 || cpsValue > 250) {
                    this.log.log(chalk.red('Invalid CPS value. Please enter a number between 1 and 250.'));
                } else {
                    this.cps = cpsValue;
                    this.log.log(chalk.yellow(`CPS set to: ${this.cps}`));
                }
            }

            else if (command === 'start') {
                if (this.isAutoClicking) {
                    this.stopAutoClick();
                }
                this.startAutoClick();
                this.log.log(chalk.yellow(`deezClicks clicking at: `), chalk.green(`${this.cps} CPS`));
            }

            else if (command === 'stop') {
                this.stopAutoClick();
                this.log.log(chalk.yellow('deezClicks stopped'));
            }

            else {
                this.log.log(chalk.red(`Unrecognized command: ${command}`));
            }

            this.inputBox.clearValue();
            this.inputBox.focus();
            this.screen.render();
        });

        this.screen.append(this.log);
        this.screen.append(this.inputBox);
        this.inputBox.focus();
        this.screen.render();
    }

    startAutoClick() {
        if (!this.isAutoClicking) {
            this.isAutoClicking = true;
            this.autoClickInterval = setInterval(() => {
                robot.mouseClick();
            }, 1000 / this.cps);
        }
    }

    stopAutoClick() {
        if (this.isAutoClicking) {
            clearInterval(this.autoClickInterval);
            this.isAutoClicking = false;
        }
    }
}

const app = new deezClicks();
app.setupUI();
