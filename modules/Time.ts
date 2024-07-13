import { languageStrings } from "..";
import Strings from "./Strings";

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

    TimeUntil(timestamp: number, toUnix?: boolean) {
        const difference = (toUnix ? timestamp * 1000 : timestamp) - new Date().getTime()

        const absDifference = Math.abs(difference),
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
    }
}