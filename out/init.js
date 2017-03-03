"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
var opn = require("opn");
var inquirer = require("inquirer");
var adjNoun = require("adj-noun");
var singleLineLog = require("single-line-log");
var node_1 = require("./node");
adjNoun.seed(Math.floor(Math.random() * 1000));
init();
function init() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log(chalk.cyan("****************************"));
            console.log(chalk.cyan("**                        **"));
            console.log(chalk.cyan("**    Gossip Lab Setup    **"));
            console.log(chalk.cyan("**                        **"));
            console.log(chalk.cyan("****************************"));
            console.log();
            promptUser();
            return [2 /*return*/];
        });
    });
}
function promptUser() {
    return __awaiter(this, void 0, void 0, function () {
        var numNodes, _a, _b, numPeers, _c, _d, basePort, nodeCollection, port, node, proceed, _i, nodeCollection_1, node, _e, nodeCollection_2, node;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = parseInt;
                    return [4 /*yield*/, question('How many nodes would you like to start?', 'input', validateNodes)];
                case 1:
                    numNodes = _a.apply(void 0, [_f.sent(),
                        10]);
                    _c = parseInt;
                    return [4 /*yield*/, question('How many peer nodes should each node be connected to directly?', 'input', validatPeers)];
                case 2:
                    numPeers = _c.apply(void 0, [_f.sent(),
                        10]);
                    if (!(numPeers >= numNodes)) return [3 /*break*/, 5];
                    return [4 /*yield*/, log(format("There are only " + numNodes + " nodes! You can't connect each node to " + numPeers + " other nodes!", chalk.red))];
                case 3:
                    _f.sent();
                    return [4 /*yield*/, log(format("Let's try this again...", chalk.white))];
                case 4:
                    _f.sent();
                    console.log();
                    return [2 /*return*/, promptUser()];
                case 5:
                    console.log();
                    return [4 /*yield*/, log(format("Awesome! Here's the plan:", chalk.magenta))];
                case 6:
                    _f.sent();
                    console.log();
                    return [4 /*yield*/, log(format("I'm going to start a node at each of the following addresses.", chalk.cyan))];
                case 7:
                    _f.sent();
                    console.log();
                    basePort = 3000;
                    nodeCollection = [];
                    port = basePort;
                    _f.label = 8;
                case 8:
                    if (!(port < basePort + numNodes)) return [3 /*break*/, 11];
                    node = node_1.createNode(port, adjNoun().join('-'));
                    nodeCollection.push(node);
                    return [4 /*yield*/, log(format("http://localhost:" + node.port, chalk.underline).concat(format(' node name: ', chalk.italic.dim.magenta), format(node.name, chalk.italic.magenta)), 30)];
                case 9:
                    _f.sent();
                    _f.label = 10;
                case 10:
                    port++;
                    return [3 /*break*/, 8];
                case 11:
                    console.log();
                    return [4 /*yield*/, log(format("Then I'll open a new browser window for each node.", chalk.cyan))];
                case 12:
                    _f.sent();
                    return [4 /*yield*/, log(format("After that you'll be able to send messages from different", chalk.cyan))];
                case 13:
                    _f.sent();
                    return [4 /*yield*/, log(format("nodes and watch them propogate across the network.", chalk.cyan))];
                case 14:
                    _f.sent();
                    console.log();
                    return [4 /*yield*/, question('Sound good?', 'confirm')];
                case 15:
                    proceed = _f.sent();
                    if (proceed !== true) {
                        return [2 /*return*/, process.exit()];
                    }
                    console.log();
                    _i = 0, nodeCollection_1 = nodeCollection;
                    _f.label = 16;
                case 16:
                    if (!(_i < nodeCollection_1.length)) return [3 /*break*/, 20];
                    node = nodeCollection_1[_i];
                    singleLineLog.stdout(chalk.white.dim("- Starting " + node.name + " at ") +
                        chalk.white.underline.dim(" http://localhost:" + node.port));
                    return [4 /*yield*/, sleep(500)];
                case 17:
                    _f.sent();
                    return [4 /*yield*/, node.start()];
                case 18:
                    _f.sent();
                    singleLineLog.stdout(chalk.magenta("\u2713") + chalk.magenta.dim(" Started ") + chalk.italic.magenta(node.name + " ") +
                        chalk.magenta.dim("at ") +
                        chalk.white.underline("http://localhost:" + node.port + "\n"));
                    console.log();
                    _f.label = 19;
                case 19:
                    _i++;
                    return [3 /*break*/, 16];
                case 20:
                    console.log();
                    singleLineLog.stdout(chalk.cyan.dim('Opening pages...'));
                    return [4 /*yield*/, sleep(1000)];
                case 21:
                    _f.sent();
                    return [4 /*yield*/, log(format('All nodes are up and running!', chalk.green))];
                case 22:
                    _f.sent();
                    return [4 /*yield*/, log(format('(ctrl-c anytime to quit)', chalk.green.dim))];
                case 23:
                    _f.sent();
                    for (_e = 0, nodeCollection_2 = nodeCollection; _e < nodeCollection_2.length; _e++) {
                        node = nodeCollection_2[_e];
                        opn("http://localhost:" + node.port);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function format(str, formatter) {
    return str.split('').map(function (v) { return formatter(v); });
}
function sleep(milliseconds) {
    if (milliseconds === void 0) { milliseconds = 100; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (r) { return setTimeout(r, milliseconds); })];
        });
    });
}
function validateNodes(value) {
    if (/\d+/g.test(value) && parseInt(value, 10) > 1) {
        return true;
    }
    else {
        return 'Value must be an integer greater than one.';
    }
}
function validatPeers(value) {
    if (/\d+/g.test(value) && parseInt(value, 10) > 0) {
        return true;
    }
    else {
        return 'Value must be an integer greater than zero.';
    }
}
function question(message, type, validate) {
    return __awaiter(this, void 0, void 0, function () {
        var value;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, log(format(message, chalk.green.italic), 50)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, inquirer.prompt({
                            name: 'value', validate: validate, message: ':', type: type
                        })];
                case 2:
                    value = (_a.sent()).value;
                    return [2 /*return*/, value];
            }
        });
    });
}
function log(letters, delay) {
    if (delay === void 0) { delay = 50; }
    return __awaiter(this, void 0, void 0, function () {
        var word, _i, letters_1, letter;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    word = '';
                    _i = 0, letters_1 = letters;
                    _a.label = 1;
                case 1:
                    if (!(_i < letters_1.length)) return [3 /*break*/, 4];
                    letter = letters_1[_i];
                    word += letter;
                    singleLineLog.stdout(word);
                    return [4 /*yield*/, sleep(delay)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    singleLineLog.stdout.clear();
                    console.log();
                    return [2 /*return*/];
            }
        });
    });
}
