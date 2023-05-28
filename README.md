# DeezClicks

DeezClicks is a simple, light-weight, node.js CLI autoclicker app.

## Installation

```node
npm i -g deezclicks //install globally
```

or

```node
npm i deezclicks //install locally
```

## Usage
As of v1.0.1, DeezClicks has 2 features
- Customize CPS value
- Stop autoclicker with hotkey

DeezClicks will continue to click infinitely at the desired CPS value until stopped with `stop` or `^S`


To manually restart your server, use `q`, `ESC`, or `^C`

## Plans
- Update UI

### Dependencies
- **blessed**: ^0.1.81
- **blessed-contrib**: ^4.11.0
- **chalk**: ^4.1.2
- **keypress**: ^0.2.1
- **robotjs**: ^0.6.0
