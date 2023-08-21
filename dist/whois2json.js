#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const tools_1 = require("./tools");
const minimist_1 = __importDefault(require("minimist"));
const argv = (0, minimist_1.default)(process.argv.splice(2));
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let domain = argv._[0] ? argv._[0] : "test.com";
            // console.log(`whois2json ${domain}`)
            let got = yield (0, tools_1.rawWhois)(domain);
            if (argv.raw) // to output raw whois to console
                if (typeof got === 'object' && 'parsedHostname' in got)
                    console.log(got.parsedHostname, chalk_1.default.bold(got.raw));
            if (got) {
                if (argv.raw)
                    console.log(got);
                let res = (0, tools_1.parseWhois)(got);
                console.log(res);
            }
            else {
                console.log(got);
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
start();
