import { Parser } from 'json2csv';
import fs from "fs";

export default class StoreUserDetails {   
    storeUser(profile) {
        let fields = ['google_id','given_name', 'family_name', 'email','pic_url'];
        const opts = { fields };
        let returnMessage = ""
        const deep = {
            "google_id": profile.id,
            "given_name": profile.given_name,
            "family_name": profile.family_name,
            "email": profile.email,
            "pic_url": profile.picture
        }
        try {
            let isFilePresent = fs.statSync("./data/userData.csv")
            if (isFilePresent) {
                console.log("file present, appending new row.")
                const parser = new Parser({ header: false });
                const csv = "\r\n" + parser.parse(deep);
                // console.log(csv)
                fs.appendFileSync("./data/userData.csv", csv)
                returnMessage = "data appended"
            }
        } catch (error) {
            console.log("file not exist, creating new file.")
            const parser = new Parser(opts);
            const csv = parser.parse(deep);
            // console.log(csv)
            fs.writeFileSync("./data/userData.csv", csv)
            returnMessage = "New file created and data added."
        }

        return returnMessage
    }
}
