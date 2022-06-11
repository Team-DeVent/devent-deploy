import winston from 'winston';
import dayjs from 'dayjs';
import util from 'util';
const MESSAGE = Symbol.for('message');

const colorset = {
    "INFO": "\x1b[34m[ %s ]\x1b[0m",
    "ERROR": "\x1b[31m[ %s ]\x1b[0m",
    "WARN": "\x1b[33m[ %s ]\x1b[0m"

}

export async function init () {
    winston.configure({
        level: 'info',

        format: winston.format.combine(
            winston.format(function(info, opts) {
                let prefix = util.format("[ %s ]", dayjs().format('YYYY.MM.DD HH:mm:ss A'));
                let level = util.format(colorset[info.level.toUpperCase()], info.level.toUpperCase());

                info.message = util.format('\x1b[36m%s\x1b[0m %s %s ', prefix, level, info.message);

                return info;
            })(),
            winston.format(function(info) {
                info[MESSAGE] = info.message;
                return info;
            })()
        ),
        transports: [
            new (winston.transports.Console)({
                level: 'debug',
                colorize: true,
                prettyPrint: true
            })
        ]
    });
}

