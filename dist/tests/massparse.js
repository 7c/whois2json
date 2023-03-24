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
const whoisserver_world_1 = require("whoisserver-world");
const tools_1 = require("../tools");
const mybase_1 = require("mybase");
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (let tld of ['com', 'net', 'org']) {
                let tldData = (0, whoisserver_world_1.tldDetails)(tld);
                for (let t of Object.keys(tldData.sampleDomains))
                    for (let domain of tldData.sampleDomains[t]) {
                        console.log(chalk_1.default.inverse(domain));
                        let data = yield (0, tools_1.rawWhois)(domain);
                        let got = (0, tools_1.parseWhois)(data);
                        console.log(got);
                        yield (0, mybase_1.wait)(1);
                    }
            }
        }
        catch (err) {
            console.log(chalk_1.default.red(err));
        }
    });
}
start();
