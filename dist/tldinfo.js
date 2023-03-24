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
const minimist_1 = __importDefault(require("minimist"));
const whoisserver_world_1 = require("whoisserver-world");
const argv = (0, minimist_1.default)(process.argv.splice(2));
const TLDS = (0, whoisserver_world_1.tlds)();
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let tld = argv._[0] ? argv._[0] : "com";
            if (TLDS.hasOwnProperty(tld.toLowerCase())) {
                let parsed = (0, whoisserver_world_1.parseDomain)(`testwerwerw.${tld}`);
                console.log(parsed.tldData);
            }
            else {
                console.log(chalk_1.default.red(`TLD ${chalk_1.default.inverse(tld)} does not exist`));
            }
            process.exit(1);
        }
        catch (err) {
            console.log(err, chalk_1.default.red(err));
        }
    });
}
start();
