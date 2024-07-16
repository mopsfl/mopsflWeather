import { languageStrings } from "..";
import Strings from "./Strings";
import * as lodash from "lodash"

export default {
    TimeAgo(dString = null) {
        var d1 = new Date(dString);
        var d2 = new Date();
        var t2 = d2.getTime();
        var t1 = d1.getTime();
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();

        var time_obj: any = {};
        time_obj.year = d2.getFullYear() - d1.getFullYear();
        time_obj.month = (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
        time_obj.week = Math.floor((t2 - t1) / (24 * 3600 * 1000 * 7));
        time_obj.day = Math.floor((t2 - t1) / (24 * 3600 * 1000));
        time_obj.hour = Math.floor((t2 - t1) / (3600 * 1000));
        time_obj.minute = Math.floor((t2 - t1) / (60 * 1000));
        time_obj.second = Math.floor((t2 - t1) / 1000);


        for (const obj_key in time_obj) {
            if (time_obj[obj_key] == 0) {
                delete time_obj[obj_key];
            }
        }
        var ago_text = 'just now';

        if (typeof Object.keys(time_obj)[0] != 'undefined') {
            var time_key = Object.keys(time_obj)[0];
            var time_val = time_obj[Object.keys(time_obj)[0]];
            time_key += (time_val > 1) ? 's' : '';
            ago_text = time_val + ' ' + time_key + ' ago';
        }

        return ago_text;
    },

    TimeUntil(timestamp: number, timezone = 0, toUnix?: boolean) {
        const difference = (toUnix ? timestamp * 1000 : timestamp) - new Date().getTime() + timezone,
            absDifference = Math.abs(difference),
            hours = Math.floor(absDifference / (1000 * 60 * 60)),
            minutes = Math.floor((absDifference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds = Math.floor((absDifference % (1000 * 60)) / 1000);

        if (difference > 0) {
            if (hours > 0) {
                return Strings.ToString(languageStrings.WEATHER_INFO_TIMEIN_HOURS, hours);
            } else if (minutes > 0) {
                return Strings.ToString(languageStrings.WEATHER_INFO_TIMEIN_MINUTES, minutes);
            } else {
                return Strings.ToString(languageStrings.WEATHER_INFO_TIMEIN_SECONDS, seconds);
            }
        } else if (difference < 0) {
            if (hours > 0) {
                return Strings.ToString(languageStrings.WEATHER_INFO_TIMEAGO_HOURS, hours);
            } else if (minutes > 0) {
                return Strings.ToString(languageStrings.WEATHER_INFO_TIMEAGO_MINUTES, minutes);
            } else {
                return Strings.ToString(languageStrings.WEATHER_INFO_TIMEAGO_SECONDS, seconds);
            }
        }
    },

    GetHourString(timestamp: string, timezone = 0) {
        const adjustedDate = new Date(new Date(timestamp).getTime() + timezone * 1000);
        const hours = ('0' + adjustedDate.getUTCHours()).slice(-2);
        const minutes = ('0' + adjustedDate.getUTCMinutes()).slice(-2);

        return `${hours}:${minutes}`;
    },

    UnixTimestampToDateString(unixTimestamp: number, timezone = 0, full?: boolean) {
        const date = new Date((unixTimestamp + timezone) * 1000);
        const year = date.getUTCFullYear();
        const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
        const day = ('0' + date.getUTCDate()).slice(-2);
        const hours = ('0' + date.getUTCHours()).slice(-2);
        const minutes = ('0' + date.getUTCMinutes()).slice(-2);
        const seconds = ('0' + date.getUTCSeconds()).slice(-2);

        return full ? `${year}-${month}-${day} ${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`;
    },

    GetCurrentTimeWithTimezone(timezone = 0, type = 0) {
        const date = new Date((new Date().getTime() + (timezone * 1000)));
        const year = date.getUTCFullYear();
        const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
        const day = ('0' + date.getUTCDate()).slice(-2);
        const hours = ('0' + date.getUTCHours()).slice(-2);
        const minutes = ('0' + date.getUTCMinutes()).slice(-2);
        const seconds = ('0' + date.getUTCSeconds()).slice(-2);

        switch (type) {
            case 0:
                return `${hours}:${minutes}`
            case 1:
                return `${hours}:${minutes}:${seconds}`
            case 2:
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
            default:
                return `${hours}:${minutes}`
                break;
        }
    }
}